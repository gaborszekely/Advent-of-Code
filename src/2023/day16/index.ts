// https://adventofcode.com/2023/day/16

import { getInput } from '@utils/fs';
import {
    Grid,
    Direction,
    Coord,
    getNeighborCoordInDirection,
} from '@utils/grid';

const input = getInput(__dirname);

const serialize = ([r, c]: Coord, direction: Direction) =>
    `${r}-${c}-${direction}`;

const getNextDirections = (
    grid: Grid<string>,
    r: number,
    c: number,
    direction: Direction
): Direction[] => {
    const current = grid.get(r, c);

    if (current === '.') {
        return [direction];
    }

    if (current === '/') {
        switch (direction) {
            case 'N':
                return ['E'];
            case 'S':
                return ['W'];
            case 'E':
                return ['N'];
            case 'W':
                return ['S'];
        }
    }

    if (current === '\\') {
        switch (direction) {
            case 'N':
                return ['W'];
            case 'S':
                return ['E'];
            case 'E':
                return ['S'];
            case 'W':
                return ['N'];
        }
    }

    if (current === '-') {
        switch (direction) {
            case 'E':
            case 'W':
                return [direction];
            case 'N':
            case 'S':
                return ['E', 'W'];
        }
    }

    if (current === '|') {
        switch (direction) {
            case 'N':
            case 'S':
                return [direction];
            case 'E':
            case 'W':
                return ['N', 'S'];
        }
    }
};

function findEnergizedTiles(
    grid: Grid<string>,
    startingCoord: Coord,
    direction: Direction
) {
    const seen = new Set<string>(serialize(startingCoord, direction));
    const total = new Set();

    const queue: Array<readonly [Coord, Direction]> = [
        [startingCoord, direction],
    ];

    while (queue.length) {
        const [[r, c], direction] = queue.pop();

        total.add(Grid.serializeCoords(r, c));

        const nextDirections = getNextDirections(grid, r, c, direction);

        for (const direction of nextDirections) {
            const coord = getNeighborCoordInDirection[direction](r, c);

            if (grid.inRange(coord)) {
                const serialized = serialize(coord, direction);

                if (!seen.has(serialized)) {
                    seen.add(serialized);
                    queue.unshift([coord, direction]);
                }
            }
        }
    }

    return total.size;
}

export function partOne() {
    const grid = Grid.fromString(input);

    return findEnergizedTiles(grid, [0, 0], 'E');
}

export function partTwo() {
    const grid = Grid.fromString(input);

    let max = 0;

    // top and bottom rows
    for (let i = 0; i < grid.cols; ++i) {
        max = Math.max(max, findEnergizedTiles(grid, [0, i], 'S'));
        max = Math.max(max, findEnergizedTiles(grid, [grid.rows - 1, i], 'N'));

        // corners
        if (i === 0) {
            max = Math.max(max, findEnergizedTiles(grid, [0, i], 'E'));
            max = Math.max(
                max,
                findEnergizedTiles(grid, [grid.rows - 1, i], 'E')
            );
        }
        if (i === grid.cols - 1) {
            max = Math.max(max, findEnergizedTiles(grid, [0, i], 'W'));
            max = Math.max(
                max,
                findEnergizedTiles(grid, [grid.rows - 1, i], 'W')
            );
        }
    }

    // first and last columns
    for (let i = 1; i < grid.rows - 1; ++i) {
        max = Math.max(max, findEnergizedTiles(grid, [i, 0], 'E'));
        max = Math.max(max, findEnergizedTiles(grid, [i, grid.cols - 1], 'W'));
    }

    return max;
}
