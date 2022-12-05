// https://adventofcode.com/2020/day/8

import { getInput } from '@utils/fs';

const input = getInput(__dirname);

const instructions = input
    .split('\n')
    .map(row => row.split(' '))
    .map(
        ([instruction, change]) =>
            [instruction, Number(change)] as [string, number]
    );

const runProgram = () => {
    const visitedRows = new Set();

    let [row, accumulator] = [0, 0];

    while (!visitedRows.has(row) && row < instructions.length) {
        visitedRows.add(row);

        let [instruction, n] = instructions[row];

        if (instruction === 'acc') {
            accumulator += n;
            row++;
        }

        if (instruction === 'nop') {
            row++;
        }

        if (instruction === 'jmp') {
            row += n;
        }
    }

    return [row, accumulator];
};

export function partOne() {
    return runProgram()[1];
}

export function partTwo() {
    for (let i = 0; i < instructions.length; ++i) {
        const [instruction] = instructions[i];
        if (instruction === 'jmp' || instruction === 'nop') {
            instructions[i][0] = instruction === 'jmp' ? 'nop' : 'jmp';

            const [row, accumulator] = runProgram();

            if (row >= instructions.length) {
                return accumulator;
            }

            instructions[i][0] = instruction;
        }
    }
}
