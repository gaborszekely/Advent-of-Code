// https://adventofcode.com/2023/day/2

import { getInput } from '@utils/fs';

const input = getInput(__dirname);

export function partOne() {
    const totalCubes: Record<string, number> = {
        red: 12,
        green: 13,
        blue: 14,
    };

    return input.split('\n').reduce((acc, row) => {
        const [, id] = row.match(/Game (\d+):/) || [];

        const regex = /(\d+) (\w+)/g;
        let matches: RegExpExecArray | null;

        while ((matches = regex.exec(row))) {
            const [, num, color] = matches;
            if (Number(num) > totalCubes[color]) {
                return acc;
            }
        }

        return acc + Number(id);
    }, 0);
}

export function partTwo() {
    return input
        .split('\n')
        .map(row => {
            const minRequiredCubes: Record<string, number> = {
                green: 0,
                red: 0,
                blue: 0,
            };

            const regex = /(\d+) (\w+)/g;
            let matches: RegExpExecArray | null;

            while ((matches = regex.exec(row))) {
                const [, num, color] = matches;
                minRequiredCubes[color] = Math.max(
                    minRequiredCubes[color],
                    Number(num)
                );
            }

            return Object.values(minRequiredCubes).reduce(
                (acc, val) => acc * val
            );
        })
        .reduce((acc, val) => acc + val);
}
