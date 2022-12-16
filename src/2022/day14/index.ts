// https://adventofcode.com/2022/day/14

import { getInput } from '@utils/fs';
import { Grid } from '@utils/grid';
import { cloneSet } from '@utils/set';

const { serializeCoords } = Grid;

const input = getInput(__dirname);
const entries = input.split('\n');

const stones = new Set<string>();

let minX = Infinity;
let maxX = -Infinity;
let maxY = -Infinity;

for (const entry of entries) {
    const coords = entry
        .split(' -> ')
        .map(coord => coord.split(',').map(Number));

    for (let i = 1; i < coords.length; ++i) {
        const [x, y] = coords[i];
        const [prevX, prevY] = coords[i - 1];

        minX = Math.min(minX, prevX, x);
        maxX = Math.max(maxX, prevX, x);
        maxY = Math.max(maxY, prevY, y);

        for (let j = Math.min(prevX, x); j <= Math.max(prevX, x); ++j) {
            stones.add(serializeCoords(j, y));
        }

        for (let j = Math.min(prevY, y); j <= Math.max(prevY, y); ++j) {
            stones.add(serializeCoords(x, j));
        }
    }
}

function inBounds(x: number) {
    return x >= minX && x <= maxX;
}

function move(x: number, y: number, blocked: Set<string>) {
    const neighborsBelow = [
        [x, y + 1],
        [x - 1, y + 1],
        [x + 1, y + 1],
    ];

    for (const [nX, nY] of neighborsBelow) {
        if (!blocked.has(serializeCoords(nX, nY))) {
            return [nX, nY];
        }
    }

    return [x, y];
}

const START_X = 500;
const START_Y = 0;
const STARTING_COORDS = [START_X, START_Y];

export function partOne() {
    const blocked = cloneSet(stones);
    let total = 0;

    while (true) {
        let [x, y] = STARTING_COORDS;

        while (true) {
            const prevY = y;
            [x, y] = move(x, y, blocked);

            if (y === prevY) {
                blocked.add(serializeCoords(x, y));
                total++;
                break;
            }

            if (!inBounds(x)) {
                return total;
            }
        }
    }
}

export function partTwo() {
    const blocked = cloneSet(stones);
    const floor = maxY + 2;
    let total = 0;

    while (true) {
        let [x, y] = STARTING_COORDS;

        while (true) {
            const prevY = y;
            [x, y] = move(x, y, blocked);

            if (x === START_X && y === START_Y) {
                return total + 1;
            }

            if (y === prevY || y === floor - 1) {
                blocked.add(serializeCoords(x, y));
                total++;
                break;
            }
        }
    }
}
