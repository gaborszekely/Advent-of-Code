// https://adventofcode.com/2022/day/4

import { getInput } from '@utils/fs';
import { overlaps, contains } from '@utils/ranges';

const input = getInput(__dirname);

const assignments = input
    .trim()
    .split('\n')
    .map(row => row.split(',').map(range => range.split('-').map(Number)));

export function partOne() {
    return assignments.reduce(
        (acc, [range1, range2]) => (contains(range1, range2) ? acc + 1 : acc),
        0
    );
}

export function partTwo() {
    return assignments.reduce(
        (acc, [range1, range2]) => (overlaps(range1, range2) ? acc + 1 : acc),
        0
    );
}
