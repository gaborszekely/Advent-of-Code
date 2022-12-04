// https://adventofcode.com/2022/day/1

import { getInput } from '../../utils';

const input = getInput(__dirname);

const entries = input
    .trim()
    .split('\n\n')
    .map(byDeer =>
        byDeer.split('\n').reduce((acc, item) => acc + Number(item), 0)
    )
    .sort((a, b) => b - a);

export function partOne() {
    return entries[0];
}

export function partTwo() {
    let result = 0;

    for (let i = 0; i < 3; ++i) {
        result += entries[i];
    }

    return result;
}
