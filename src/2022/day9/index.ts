// https://adventofcode.com/2022/day/9

import { getInput } from '@utils/fs';

const input = getInput(__dirname);

const entries = input.split('\n').map(row => {
    const [direction, steps] = row.split(' ');

    return [direction, Number(steps)] as const;
});

const serialize = (tailPosition: number[]) => tailPosition.join('-');

const getNewHeadPosition = (
    direction: string,
    [headRow, headCol]: number[]
) => {
    switch (direction) {
        case 'L':
            return [headRow, headCol - 1];
        case 'R':
            return [headRow, headCol + 1];
        case 'U':
            return [headRow - 1, headCol];
        case 'D':
            return [headRow + 1, headCol];
        default:
            throw new Error(`Unexpected direction ${direction}`);
    }
};

const getNewTailPosition = (
    [headRow, headCol]: number[],
    [tailRow, tailCol]: number[]
) => {
    const rowDiff = headRow - tailRow;
    const colDiff = headCol - tailCol;
    const distance = Math.max(Math.abs(rowDiff), Math.abs(colDiff));

    if (distance < 2) {
        return [tailRow, tailCol];
    }

    const newTailRow =
        rowDiff === 0 ? tailRow : rowDiff > 0 ? tailRow + 1 : tailRow - 1;
    const newTailCol =
        colDiff === 0 ? tailCol : colDiff > 0 ? tailCol + 1 : tailCol - 1;

    return [newTailRow, newTailCol];
};

const traverse = (numTails: number) => {
    const positions = Array.from({ length: numTails + 1 }, () => [0, 0]);
    const visited = new Set([serialize([0, 0])]);

    for (const [direction, steps] of entries) {
        for (let i = 0; i < steps; ++i) {
            positions[0] = getNewHeadPosition(direction, positions[0]);

            for (let j = 1; j < positions.length; ++j) {
                positions[j] = getNewTailPosition(
                    positions[j - 1],
                    positions[j]
                );
            }

            const serialized = serialize(positions.at(-1));

            if (!visited.has(serialized)) {
                visited.add(serialized);
            }
        }
    }

    return visited.size;
};

export function partOne() {
    return traverse(/*numTails =*/ 1);
}

export function partTwo() {
    return traverse(/*numTails =*/ 9);
}
