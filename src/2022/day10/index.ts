// https://adventofcode.com/2022/day/10

import { getInput } from '@utils/fs';

const input = getInput(__dirname);

const entries = input.split('\n').map(row => {
    const [instruction, amount] = row.split(' ');
    return amount
        ? ([instruction, Number(amount)] as const)
        : ([instruction] as const);
});

export function partOne() {
    let total = 1;
    let result = 0;
    let cycles = 0;

    for (const [instruction, amount] of entries) {
        let newCycles = cycles;
        let newTotal = total;

        if (instruction === 'addx') {
            newTotal += amount;
            newCycles += 2;
        }

        if (instruction === 'noop') {
            newCycles += 1;
        }

        const remaining = (newCycles - 20) % 40;
        const prevRemaining = (cycles - 20) % 40;

        if (remaining === 0) {
            result += total * newCycles;
        }

        if (remaining === 1 && prevRemaining !== 0) {
            result += total * (newCycles - 1);
        }

        total = newTotal;
        cycles = newCycles;
    }

    return result;
}

/**
 * Keep track of:
 *   1. Current cycle and which pixel is being drawn.
 *   2. Position of sprite.
 *   3. Whether those overlap; If so, light the current pixel.
 */
export function partTwo() {
    let result = '';
    let spriteMidpoint = 1;
    let currentPixelDrawn = -1;

    const pixelsOverlap = () => {
        const diff = Math.abs((currentPixelDrawn % 40) - spriteMidpoint);
        return diff == 0 || diff === 1;
    };

    for (const [instruction, amount] of entries) {
        const cycles = instruction === 'addx' ? 2 : 1;

        for (let j = 0; j < cycles; ++j) {
            currentPixelDrawn++;
            result += pixelsOverlap() ? '#' : '.';
        }

        if (instruction === 'addx') {
            spriteMidpoint += amount;
        }
    }

    const grid: string[] = [];

    for (let i = 0; i < result.length; i += 40) {
        grid.push(result.slice(i, i + 40));
    }

    console.log(grid);
    return;
}
