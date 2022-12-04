// https://adventofcode.com/2022/day/4

import { getInput } from '@utils';
import { overlaps, fullyOverlaps } from '@utils/ranges';

const input = getInput(__dirname);

const assignments = input
    .trim()
    .split('\n')
    .map(row => row.split(',').map(range => range.split('-').map(Number)));

export function partOne() {
    return assignments.reduce(
        (acc, ranges) => acc + (fullyOverlaps(ranges) ? 1 : 0),
        0
    );
}

export function partTwo() {
    return assignments.reduce(
        (acc, ranges) => acc + (overlaps(ranges) ? 1 : 0),
        0
    );
}
