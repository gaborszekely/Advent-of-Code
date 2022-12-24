// https://adventofcode.com/2022/day/23

import { getInput } from '@utils/fs';
import { Grid } from '@utils/grid';

const { serializeCoords, deserializeCoords } = Grid;

const input = getInput(__dirname);
const grid = Grid.fromSerialized(input);

const getElfCoords = () =>
    new Set(
        grid.findAllIndexes('#').map(coord => serializeCoords(...coord))
    );

const DIRECTIONS = ['N', 'S', 'W', 'E'] as const;
type Direction = typeof DIRECTIONS[number];

const DIRECTION_OFFSETS: { [key in Direction]: [number, number][] } = {
    N: [
        [-1, 0],
        [-1, -1],
        [-1, 1],
    ],
    S: [
        [1, 0],
        [1, -1],
        [1, 1],
    ],
    W: [
        [0, -1],
        [1, -1],
        [-1, -1],
    ],
    E: [
        [0, 1],
        [1, 1],
        [-1, 1],
    ],
};

const move = (elfCoords: Set<string>, i: number) => {
    let conflictingIndexes = new Set<string>();
    let proposedNewIndexes = new Map<string, string>();

    for (const coord of elfCoords) {
        const [x, y] = deserializeCoords(coord);

        // If there are no neighbors in any adjacent direction, do nothing.
        if (
            Grid.getAllNeighborOffsets().every(
                ([nX, nY]) => !elfCoords.has(serializeCoords(x + nX, y + nY))
            )
        ) {
            continue;
        }

        let newDirection: Direction | undefined;

        // Check each general direction
        for (let j = 0; j < 4; ++j) {
            const direction = DIRECTIONS[(i + j) % 4];
            const directionOffsets = DIRECTION_OFFSETS[direction];

            // Check all 3 neighbors in that general direction
            if (
                !directionOffsets.some(([dX, dY]) =>
                    elfCoords.has(serializeCoords(x + dX, y + dY))
                )
            ) {
                newDirection = direction;
                break;
            }
        }

        if (newDirection) {
            const proposedIndex: [number, number] =
                newDirection === 'N'
                    ? [x - 1, y]
                    : newDirection === 'S'
                    ? [x + 1, y]
                    : newDirection === 'E'
                    ? [x, y + 1]
                    : [x, y - 1];
            const serialized = serializeCoords(...proposedIndex);

            if (!conflictingIndexes.has(serialized)) {
                if (proposedNewIndexes.has(serialized)) {
                    proposedNewIndexes.delete(serialized);
                    conflictingIndexes.add(serialized);
                } else {
                    proposedNewIndexes.set(serialized, coord);
                }
            }
        }
    }

    return proposedNewIndexes;
};

export function partOne() {
    const elfCoords = getElfCoords();

    for (let i = 0; i < 10; ++i) {
        const newCoords = move(elfCoords, i);

        for (const [newCoord, previousCoord] of newCoords) {
            elfCoords.add(newCoord);
            elfCoords.delete(previousCoord);
        }
    }

    let [maxX, minX, maxY, minY] = [-Infinity, Infinity, -Infinity, Infinity];

    for (const coord of elfCoords) {
        const [x, y] = deserializeCoords(coord);
        maxX = Math.max(maxX, x);
        minX = Math.min(minX, x);
        maxY = Math.max(maxY, y);
        minY = Math.min(minY, y);
    }

    let total = 0;
    for (let i = minX; i <= maxX; ++i) {
        for (let j = minY; j <= maxY; ++j) {
            if (!elfCoords.has(serializeCoords(i, j))) {
                total++;
            }
        }
    }

    return total;
}

export function partTwo() {
    const elfCoords = getElfCoords();

    for (let i = 0; i < Infinity; ++i) {
        const newCoords = move(elfCoords, i);

        if (!newCoords.size) {
            return i + 1;
        }

        for (const [newIndex, previousIndex] of newCoords) {
            elfCoords.add(newIndex);
            elfCoords.delete(previousIndex);
        }
    }
}
