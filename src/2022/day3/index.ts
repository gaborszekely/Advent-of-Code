// https://adventofcode.com/2022/day/3

import {
    batchArray,
    findIntersection,
    getInput,
    sumArray,
} from '../../utils/index';

const input = getInput(__dirname);

const entries = input
    .trim()
    .split('\n')
    .map(row => row.split(''));

function getPriority(char: string) {
    return char.charCodeAt(0) - (char === char.toUpperCase() ? 38 : 96);
}

export function partOne() {
    return sumArray(
        entries.map(row => {
            const midpoint = row.length / 2;
            const firstCompartment = row.slice(0, midpoint);
            const secondCompartment = row.slice(midpoint);
            const intersection = findIntersection(
                firstCompartment,
                secondCompartment
            )[0];

            return getPriority(intersection);
        })
    );
}

export function partTwo() {
    return sumArray(
        batchArray(entries, 3).map(batch => {
            const intersection = findIntersection(...batch)[0];

            return getPriority(intersection);
        })
    );
}
