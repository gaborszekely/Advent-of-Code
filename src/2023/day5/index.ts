// https://adventofcode.com/2023/day/5

import { getInput } from '@utils/fs';
import { chunk } from 'lodash';

const input = getInput(__dirname);

const between = (number: number, min: number, max: number) =>
    number >= min && number < max;

const seeds = (input.match(/seeds\: ([\d\s]+)/) || [])[1]
    .split(' ')
    .map(Number);
const maps = input
    .split('\n')
    .slice(1)
    .join('\n')
    .trim()
    .split('\n\n')
    .map(map =>
        map
            .split('\n')
            .slice(1)
            .map(row => row.split(' ').map(Number))
    );

function findLocation(seed: number) {
    let val = seed;
    for (const map of maps) {
        for (const [
            destinationRangeStart,
            sourceRangeStart,
            rangeLength,
        ] of map) {
            if (
                val >= sourceRangeStart &&
                val < sourceRangeStart + rangeLength
            ) {
                val = destinationRangeStart + (val - sourceRangeStart);
                break;
            }
        }
    }
    return val;
}

export function partOne() {
    let res = Infinity;
    for (const seed of seeds) {
        res = Math.min(res, findLocation(seed));
    }
    return res;
}

export function partTwo() {}
