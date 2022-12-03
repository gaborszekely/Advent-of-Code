// https://adventofcode.com/2022/day/3

import {
    batchArray,
    findIntersection,
    getInput,
    sumArray,
} from '../../utils/index';

const input = getInput(__dirname);

const rucksacks = input
    .trim()
    .split('\n')
    .map(row => row.split(''));

function getPriority(char: string) {
    return char.charCodeAt(0) - (char === char.toUpperCase() ? 38 : 96);
}

export function partOne() {
    const priorities = rucksacks.map(rucksack => {
        const midpoint = rucksack.length / 2;
        const firstCompartment = rucksack.slice(0, midpoint);
        const secondCompartment = rucksack.slice(midpoint);
        const misplacedItem = findIntersection(
            firstCompartment,
            secondCompartment
        )[0];

        return getPriority(misplacedItem);
    });

    return sumArray(priorities);
}

export function partTwo() {
    const groups = batchArray(rucksacks, 3);
    const priorities = groups.map(group => {
        const badge = findIntersection(...group)[0];

        return getPriority(badge);
    });

    return sumArray(priorities);
}
