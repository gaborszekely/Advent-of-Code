// https://adventofcode.com/2022/day/2

import { getInput } from '@utils';

const input = getInput(__dirname);

const entries = input
    .trim()
    .split('\n')
    .map(([opponent, , player]) => [opponent, player]);

const WIN_SCORE = 6;
const TIE_SCORE = 3;

const isRock = (shape: string) => ['A', 'X'].includes(shape);
const isPaper = (shape: string) => ['B', 'Y'].includes(shape);
const isScissors = (shape: string) => ['C', 'Z'].includes(shape);

type Shape = 'ROCK' | 'PAPER' | 'SCISSORS';
type Outcome = 'WIN' | 'LOSE' | 'TIE';

const shapeScore: { readonly [key in Shape]: number } = {
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
    if (isRock(input)) return 'ROCK';
    if (isPaper(input)) return 'PAPER';
    if (isScissors(input)) return 'SCISSORS';
    throw new Error(`Unexpected input ${input}`);
};

const getOutcome = (input: string): Outcome => {
    if (input in inputToOutcome) {
        return inputToOutcome[input];
    }
    throw new Error(`Unexpected input ${input}`);
};

export function partOne() {
    return entries
        .map(entry => entry.map(getShape))
        .reduce((acc, [opponent, player]) => {
            if (opponent === player) {
                acc += TIE_SCORE;
            } else if (opponent === shapeThatLosesTo[player]) {
                acc += WIN_SCORE;
            }

            return acc + shapeScore[player];
        }, 0);
}

export function partTwo() {
    return entries
        .map(
            ([opponent, outcome]) =>
                [getShape(opponent), getOutcome(outcome)] as const
        )
        .reduce((acc, [opponent, outcome]) => {
            let player: Shape;
            if (outcome === 'LOSE') {
                player = shapeThatLosesTo[opponent];
            }
            if (outcome === 'TIE') {
                player = opponent;
                acc += TIE_SCORE;
            }
            if (outcome === 'WIN') {
                player = shapeThatBeats[opponent];
                acc += WIN_SCORE;
            }

            return acc + shapeScore[player];
        }, 0);
}
