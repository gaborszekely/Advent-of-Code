// https://adventofcode.com/2023/day/8

import { getInput } from '@utils/fs';
import { lcm } from '@utils/math';

const input = getInput(__dirname);

// Foo

const instructions = input.split('\n').shift().split('') as Array<'L' | 'R'>;
const map = input
    .split('\n')
    .slice(2)
    .reduce(
        (acc, row) => {
            const [, node, L, R] = row.match(/(\w+) = \((\w+), (\w+)\)/);
            acc[node] = { L, R };
            return acc;
        },
        {} as Record<string, { L: string; R: string }>
    );

export function partOne() {
    let currentNode = 'AAA';
    let totalSteps = 0;
    let currentInstructionIndex = 0;

    while (true) {
        if (currentNode === 'ZZZ') {
            return totalSteps;
        }
        totalSteps++;
        const currentInstruction = instructions[currentInstructionIndex];
        currentNode = map[currentNode][currentInstruction];
        currentInstructionIndex =
            (currentInstructionIndex + 1) % instructions.length;
    }
}

export function partTwo() {
    let totalSteps = 0;
    let currentInstructionIndex = 0;

    const nodes = Object.keys(map).filter(val => val.endsWith('A'));
    const cycleLengths = Array(nodes.length).fill(0);

    while (true) {
        totalSteps++;

        const currentInstruction = instructions[currentInstructionIndex];

        for (let i = 0; i < nodes.length; ++i) {
            nodes[i] = map[nodes[i]][currentInstruction];

            if (nodes[i].at(-1) === 'Z') {
                cycleLengths[i] = totalSteps;
            }
        }

        if (cycleLengths.every(cycleLength => cycleLength > 0)) {
            return lcm(cycleLengths);
        }

        currentInstructionIndex =
            (currentInstructionIndex + 1) % instructions.length;
    }
}
