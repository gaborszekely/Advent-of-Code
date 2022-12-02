// https://adventofcode.com/2022/day/1

import { getInput } from '../../utils/index';

const input = getInput(__dirname);

const entries = input
    .trim()
    .split('\n')
    .map(([opponent, , player]) => [opponent, player]);

const WIN_SCORE = 6;
const TIE_SCORE = 3;

const ROCK_SHAPES = ['A', 'X'];
const PAPER_SHAPES = ['B', 'Y'];
const SCISSORS_SHAPES = ['C', 'Z'];

const isRock = (shape: string) => ROCK_SHAPES.includes(shape);
const isPaper = (shape: string) => PAPER_SHAPES.includes(shape);
const isScissors = (shape: string) => SCISSORS_SHAPES.includes(shape);

type Shape = 'ROCK' | 'PAPER' | 'SCISSORS';
type Outcome = 'WIN' | 'LOSE' | 'TIE';

const simpleScoreUpdates: { readonly [key in Shape]: number } = {
    ROCK: 1,
    PAPER: 2,
    SCISSORS: 3,
};

/** The key is a shape, and the value is the shape that the key loses to.  */
const shapeThatLosesTo: { readonly [key in Shape]: Shape } = {
    ROCK: 'SCISSORS',
    PAPER: 'ROCK',
    SCISSORS: 'PAPER',
};

/** The key is a shape, and the value is the shape that beats the key.  */
const shapeThatBeats: { readonly [key in Shape]: Shape } = {
    ROCK: 'PAPER',
    PAPER: 'SCISSORS',
    SCISSORS: 'ROCK',
};

/** The key is the encrypted outcome, and the value is the coresponding Outcome.  */
const inputToOutcome: { readonly [key: string]: Outcome } = {
    X: 'LOSE',
    Y: 'TIE',
    Z: 'WIN',
};

const getShape = (input: string): Shape => {
    if (isRock(input)) {
        return 'ROCK';
    }

    if (isPaper(input)) {
        return 'PAPER';
    }

    if (isScissors(input)) {
        return 'SCISSORS';
    }

    throw new Error(`Unexpected input ${input}`);
};

const getOutcome = (input: string): Outcome => {
    if (input in inputToOutcome) {
        return inputToOutcome[input];
    }

    throw new Error(`Unexpected input ${input}`);
};

export function partOne() {
    const input = entries.map(entry => entry.map(getShape));

    let score = 0;
    for (const [opponent, player] of input) {
        if (player === opponent) {
            score += TIE_SCORE;
        } else if (shapeThatLosesTo[player] === opponent) {
            score += WIN_SCORE;
        }
        score += simpleScoreUpdates[player];
    }

    return score;
}

export function partTwo() {
    const input = entries.map(
        ([opponent, outcome]) =>
            [getShape(opponent), getOutcome(outcome)] as const
    );

    let score = 0;

    for (const [opponent, outcome] of input) {
        let player: Shape;

        if (outcome === 'LOSE') {
            player = shapeThatLosesTo[opponent];
        }

        if (outcome === 'TIE') {
            player = opponent;
            score += TIE_SCORE;
        }

        if (outcome === 'WIN') {
            player = shapeThatBeats[opponent];
            score += WIN_SCORE;
        }

        score += simpleScoreUpdates[player];
    }

    return score;
}
