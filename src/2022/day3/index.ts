// https://adventofcode.com/2022/day/3

import { getInput } from '@utils/fs';
import { sum, intersection, chunk } from 'lodash';

const input = getInput(__dirname);

const rucksacks = input
    .trim()
    .split('\n')
    .map(row => row.split(''));

function getPriority(char: string) {
    return char.charCodeAt(0) - (char === char.toUpperCase() ? 38 : 96);
}

export function partOne() {
    return sum(
        rucksacks.map(rucksack => {
            const midpoint = rucksack.length / 2;
            const firstCompartment = rucksack.slice(0, midpoint);
            const secondCompartment = rucksack.slice(midpoint);
            const misplacedItem = intersection(
                firstCompartment,
                secondCompartment
            )[0];
            return getPriority(misplacedItem);
        })
    );
}

export function partTwo() {
    const groups = chunk(rucksacks, 3);

    return sum(
        groups.map(group => {
            const badge = intersection(...group)[0];
            return getPriority(badge);
        })
    );
}
