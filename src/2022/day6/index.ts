// https://adventofcode.com/2022/day/6

import { getInput } from '@utils/fs';

const input = getInput(__dirname);

export function findStartOfMarkerForSize(size: number) {
    const map = new Map<string, number>();
    for (let i = 0; i < input.length; ++i) {
        const current = input[i];

        if (i >= size) {
            // Remove the left bound character from the map, i.e. 'a'
            // if the string is 'abcde' and we are on index 4 (with a
            // sequence size of 4).
            const leftBound = input[i - size];
            map.set(leftBound, map.get(leftBound) - 1);
            if (map.get(leftBound) === 0) {
                map.delete(leftBound);
            }
        }

        // Add the current character.
        map.set(current, (map.get(current) || 0) + 1);

        if (map.size === size) {
            return i + 1;
        }
    }

    return -1;
}

export function partOne() {
    return findStartOfMarkerForSize(4);
}

export function partTwo() {
    return findStartOfMarkerForSize(14);
}
