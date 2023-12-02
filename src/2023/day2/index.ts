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

        let validGame = true;
        forEachCube(row, (num, color) => {
            if (num > totalCubes[color]) {
                validGame = false;
            }
        });

        return validGame ? acc + Number(id) : acc;
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

            forEachCube(row, (num, color) => {
                minRequiredCubes[color] = Math.max(
                    minRequiredCubes[color],
                    num
                );
            });

            return Object.values(minRequiredCubes).reduce(
                (acc, val) => acc * val
            );
        })
        .reduce((acc, val) => acc + val);
}

function forEachCube(row: string, cb: (num: number, color: string) => void) {
    const regex = /(\d+) (\w+)/g;
    let matches: RegExpExecArray | null;

    while ((matches = regex.exec(row))) {
        const [, num, color] = matches;
        cb(Number(num), color);
    }
}
