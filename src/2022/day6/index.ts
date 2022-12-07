// https://adventofcode.com/2022/day/6

import { getInput } from '@utils/fs';

const input = getInput(__dirname);

export function findStartOfMarkerForSize(size: number) {
    const map = new Map<string, number>();
    for (let i = 0; i < input.length; ++i) {
        const current = input[i];

        if (i >= size) {
            const toRemove = input[i - size];
            map.set(toRemove, map.get(toRemove) - 1);
            if (map.get(toRemove) === 0) {
                map.delete(toRemove);
            }
        }

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
