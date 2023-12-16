// https://adventofcode.com/2023/day/16

import { getInput } from '@utils/fs';
import { Grid, Direction, Coord } from '@utils/grid';

const input = getInput(__dirname);

const getNextDirections = (
    r: number,
    c: number,
    grid: Grid<string>,
    direction: Direction
): Direction[] => {
    const current = grid.get(r, c);

    if (current === '.') {
        switch (direction) {
            case 'N':
                return ['N'];
            case 'S':
                return ['S'];
            case 'E':
                return ['E'];
            case 'W':
                return ['W'];
        }
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
            case 'N':
                return ['E', 'W'];
            case 'S':
                return ['E', 'W'];
            case 'E':
                return ['E'];
            case 'W':
                return ['W'];
        }
    }

    if (current === '|') {
        switch (direction) {
            case 'N':
                return ['N'];
            case 'S':
                return ['S'];
            case 'E':
                return ['N', 'S'];
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
    const seen = new Set<string>(
        `${startingCoord[0]}-${startingCoord[1]}-${direction}`
    );
    const total = new Set();

    const queue: Array<readonly [number, number, Direction]> = [
        [...startingCoord, direction],
    ];

    while (queue.length) {
        const [r, c, direction] = queue.pop();
        total.add(Grid.serializeCoords(r, c));
        const nextDirections = getNextDirections(r, c, grid, direction);
        const nextCoords = nextDirections.map(direction => {
            switch (direction) {
                case 'N':
                    return [r - 1, c, 'N'] as const;
                case 'S':
                    return [r + 1, c, 'S'] as const;
                case 'E':
                    return [r, c + 1, 'E'] as const;
                case 'W':
                    return [r, c - 1, 'W'] as const;
            }
        });

        for (const coord of nextCoords) {
            if (grid.inRange(coord[0], coord[1])) {
                const serialized = `${coord[0]}-${coord[1]}-${coord[2]}`;

                if (!seen.has(serialized)) {
                    seen.add(serialized);
                    queue.unshift(coord);
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

    // top row
    for (let i = 0; i < grid.cols; ++i) {
        max = Math.max(max, findEnergizedTiles(grid, [0, i], 'S'));
        if (i === 0) {
            max = Math.max(max, findEnergizedTiles(grid, [0, i], 'E'));
        }
        if (i === grid.cols - 1) {
            max = Math.max(max, findEnergizedTiles(grid, [0, i], 'W'));
        }
    }

    // bottom row
    for (let i = 0; i < grid.cols; ++i) {
        max = Math.max(max, findEnergizedTiles(grid, [grid.rows - 1, i], 'N'));
        if (i === 0) {
            max = Math.max(
                max,
                findEnergizedTiles(grid, [grid.rows - 1, i], 'E')
            );
        }
        if (i === grid.cols - 1) {
            max = Math.max(
                max,
                findEnergizedTiles(grid, [grid.rows - 1, i], 'W')
            );
        }
    }

    // first column
    for (let i = 1; i < grid.rows - 1; ++i) {
        max = Math.max(max, findEnergizedTiles(grid, [i, 0], 'E'));
    }

    // last column
    for (let i = 1; i < grid.rows - 1; ++i) {
        max = Math.max(max, findEnergizedTiles(grid, [i, grid.cols - 1], 'W'));
    }

    return max;
}
