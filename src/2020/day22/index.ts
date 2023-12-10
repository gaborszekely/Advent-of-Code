// https://adventofcode.com/2020/day/22

import { getInput } from '@utils/fs';

const i = getInput(__dirname);

interface Input {
    player1: number[];
    player2: number[];
}

const parseInput = (input: string): Input => {
    const [player1, player2] = input.split('\n\n');

    return {
        player1: player1.split('\n').slice(1).map(Number),
        player2: player2.split('\n').slice(1).map(Number),
    };
};

const calculateResult = (winner: number[]) => {
    let result = 0;
    let counter = 1;

    for (let i = winner.length - 1; i >= 0; --i) {
        const current = winner[i];

        result += current * counter;
        counter++;
    }

    return result;
};

const combatRound = (input: Input) => {
    while (true) {
        const { player1, player2 } = input;

        if (!player1.length || !player2.length) {
            return player1.length ? player1 : player2;
        }

        const [p1Top, p2Top] = [player1.shift(), player2.shift()];

        const winner = p1Top > p2Top ? player1 : player2;

        winner.push(...[p1Top, p2Top].sort((a, b) => b - a));
    }
};

export function partOne() {
    const input = parseInput(i);
    const winner = combatRound(input);

    return calculateResult(winner);
}

const recursiveCombatRound = (
    input: Input,
    rounds = new Set()
): [number, number[]] => {
    while (true) {
        const { player1, player2 } = input;

        if (!player1.length || !player2.length) {
            if (player1.length) return [1, player1];
            return [2, player2];
        }

        const serialized = player1.join('') + '+' + player2.join('');

        // We've seen this round in this game. Player 1 wins.
        if (rounds.has(serialized)) {
            return [1, player1];
        }

        rounds.add(serialized);

        const [p1Top, p2Top] = [player1.shift(), player2.shift()];

        let winner;

        // Both have enough cards remaining. Recurse into a subgame.
        if (player1.length >= p1Top && player2.length >= p2Top) {
            const newp1Cards = player1.slice(0, p1Top);
            const newp2Cards = player2.slice(0, p2Top);

            const newInput = {
                player1: newp1Cards,
                player2: newp2Cards,
            };

            winner = recursiveCombatRound(newInput, new Set());
        }

        if (winner) {
            if (winner[0] === 1) player1.push(...[p1Top, p2Top]);
            if (winner[0] === 2) player2.push(...[p2Top, p1Top]);
        }

        // Calculate winner as normal.
        else {
            const winner = p1Top > p2Top ? player1 : player2;

            winner.push(...[p1Top, p2Top].sort((a, b) => b - a));
        }
    }
};

export function partTwo() {
    const input = parseInput(i);
    const [, scores] = recursiveCombatRound(input);

    return calculateResult(scores);
}
