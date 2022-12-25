// https://adventofcode.com/2022/day/24

import { getInput } from '@utils/fs';
import { Coord, Grid } from '@utils/grid';
import { flow, curry } from 'lodash';

const input = getInput(__dirname);
const grid = input.split('\n').map(row => row.split(''));

const DIRECTIONS = ['>', 'v', '<', '^'] as const;
type Direction = typeof DIRECTIONS[number];

const isBlizzard = (val: string): val is Direction =>
    val !== '.' && val !== '#';

const serialize = (i: number, j: number, direction: Direction) =>
    `${i}:${j}:${direction}`;

const deserialize = (serialized: string): [...Coord, Direction] => {
    const [i, j, direction] = serialized.split(':');
    return [Number(i), Number(j), direction as Direction];
};

// Get initial blizzard positions.
const initialBlizzardPositions = new Set<string>();
for (let i = 0; i < grid.length; ++i) {
    for (let j = 0; j < grid[i].length; ++j) {
        const current = grid[i][j];
        if (isBlizzard(current)) {
            initialBlizzardPositions.add(serialize(i, j, current));
        }
    }
}

const inBounds = (i: number, j: number) =>
    i >= 0 &&
    i < grid.length &&
    j >= 0 &&
    j < grid[i].length &&
    grid[i][j] !== '#';

/** Gets the new position for a blizzard. */
const getNewBlizzardPosition = (position: string) => {
    const [i, j, direction] = deserialize(position);
    switch (direction) {
        case '>':
            return serialize(
                i,
                j + 1 < grid[i].length - 1 ? j + 1 : 1,
                direction
            );
        case '<':
            return serialize(
                i,
                j - 1 > 0 ? j - 1 : grid[i].length - 2,
                direction
            );
        case '^':
            return serialize(i - 1 > 0 ? i - 1 : grid.length - 2, j, direction);
        case 'v':
            return serialize(i + 1 < grid.length - 1 ? i + 1 : 1, j, direction);
    }
};

/** Move each blizzard according to it's direction of movement. */
const move = (blizzardPositions: Set<string>) => {
    const newBlizzardPositions = new Set<string>();

    for (const position of blizzardPositions) {
        newBlizzardPositions.add(getNewBlizzardPosition(position));
    }

    return newBlizzardPositions;
};

// Blizzard positions at a given minute.
let blizzardPositions: Set<string>[] = [initialBlizzardPositions];
// Coordinates that have already been visited for a given minute.
let visited: Set<string>;

const initializeVars = () => {
    blizzardPositions = [initialBlizzardPositions];
    visited = new Set<string>('0:1:0');
};

const serializeQueueItem = (i: number, j: number, minutes: number) =>
    `${i}:${j}:${minutes}`;

const isBlizzardNeighbor = (i: number, j: number, minutes: number) =>
    DIRECTIONS.some(direction =>
        blizzardPositions[minutes].has(serialize(i, j, direction))
    );

const canVisit = (i: number, j: number, minutes: number) =>
    inBounds(i, j) &&
    !isBlizzardNeighbor(i, j, minutes) &&
    !visited.has(serializeQueueItem(i, j, minutes));

const traverse = (startCoords: Coord, endCoords: Coord, minutes: number) => {
    const queue: [...Coord, number][] = [[...startCoords, minutes]];

    const enqueue = (i: number, j: number, minutes: number) => {
        visited.add(serializeQueueItem(i, j, minutes));
        queue.unshift([i, j, minutes]);
    };

    while (queue.length) {
        const [i, j, minutes] = queue.pop();
        blizzardPositions[minutes] ||= move(blizzardPositions[minutes - 1]);
        blizzardPositions[minutes + 1] ||= move(blizzardPositions[minutes]);

        if (i === endCoords[0] && j === endCoords[1]) {
            return minutes;
        }

        for (const [nI, nJ] of Grid.getNeighborCoords(i, j)) {
            if (canVisit(nI, nJ, minutes + 1)) {
                enqueue(nI, nJ, minutes + 1);
            }
        }

        if (canVisit(i, j, minutes + 1)) {
            enqueue(i, j, minutes + 1);
        }
    }
};

const START_COORDS: Coord = [0, 1];
const END_COORDS: Coord = [grid.length - 1, grid.at(-1).length - 2];

export function partOne() {
    initializeVars();

    return traverse(START_COORDS, END_COORDS, 0);
}

export function partTwo() {
    const forward = curry(traverse)(START_COORDS)(END_COORDS);
    const backward = curry(traverse)(END_COORDS)(START_COORDS);
    const increment = (res: number) => res + 1;

    initializeVars();

    return flow(forward, increment, backward, increment, forward)(0);
}
