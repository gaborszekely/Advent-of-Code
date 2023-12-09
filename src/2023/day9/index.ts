// https://adventofcode.com/2023/day/9

import { getInput } from '@utils/fs';

const input = getInput(__dirname);

const nums = input.split('\n').map(row => row.split(' ').map(Number));

function buildSequences(startingSequence: number[]) {
    const sequences = [startingSequence];

    while (true) {
        const currentSequence = sequences.at(-1);
        const newSequence: number[] = [];
        let noChanges = true;
        for (let i = 1; i < currentSequence.length; ++i) {
            const diff = currentSequence[i] - currentSequence[i - 1];
            if (diff !== 0) {
                noChanges = false;
            }
            newSequence.push(diff);
        }

        sequences.push(newSequence);

        if (noChanges) {
            break;
        }
    }

    return sequences;
}

export function partOne() {
    function extrapolateForward(startingSequence: number[]) {
        const sequences = buildSequences(startingSequence);

        for (let i = sequences.length - 2; i >= 0; --i) {
            sequences[i].push(sequences[i].at(-1) + sequences[i + 1].at(-1));
        }

        return sequences[0].at(-1);
    }

    return nums.reduce(
        (acc, sequence) => acc + extrapolateForward(sequence),
        0
    );
}

export function partTwo() {
    function extrapolateBackward(startingSequence: number[]) {
        const sequences = buildSequences(startingSequence);

        for (let i = sequences.length - 2; i >= 0; --i) {
            sequences[i].unshift(sequences[i][0] - sequences[i + 1][0]);
        }

        return sequences[0][0];
    }

    return nums.reduce(
        (acc, sequence) => acc + extrapolateBackward(sequence),
        0
    );
}
