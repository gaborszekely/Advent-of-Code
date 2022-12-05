// https://adventofcode.com/2020/day/24

import { getInput } from '@utils/fs';
import { Grid } from '@utils/grid';

const input = getInput(__dirname);

const parseInput = (rawInput: string) => {
    return rawInput.split('\n').map(row => {
        const result = [];

        for (let i = 0; i < row.length; ++i) {
            const current = row[i];
            const next = row[i + 1];

            if (current === 'e' || current === 'w') {
                result.push(current);
                continue;
            }

            if (next === 's' || next === 'n') {
                result.push(current);
                continue;
            }

            result.push(current + next);
            i++;
        }

        return result;
    });
};

const getNeighborIndex = {
    n: (i: number, j: number) => [i - 2, j - 1],
    s: (i: number, j: number) => [i + 2, j + 1],
    e: (i: number, j: number) => [i, j + 1],
    w: (i: number, j: number) => [i, j - 1],
    ne: (i: number, j: number) => [i - 1, j],
    nw: (i: number, j: number) => [i - 1, j - 1],
    se: (i: number, j: number) => [i + 1, j + 1],
    sw: (i: number, j: number) => [i + 1, j],
};

const getTileColor = (grid: Grid<number>, i: number, j: number) => {
    return grid.inRange(i, j) ? grid.get(i, j) : 0;
};

const flip = (result: Grid<number>, r: number, c: number) => {
    const current = result.get(r, c);
    result.set(r, c, current === 0 ? 1 : 0);
};

const isWhite = (val: number) => val === 0;
const isBlack = (val: number) => val === 1;

const countBlackNeighbors = (r: number, c: number, grid: Grid<number>) => {
    const neighborDirections = ['e', 'w', 'ne', 'nw', 'se', 'sw'] as const;

    return neighborDirections.reduce((acc, direction) => {
        const neighborCoords = getNeighborIndex[direction](r, c);

        const neighbor = getTileColor(
            grid,
            neighborCoords[0],
            neighborCoords[1]
        );

        return isBlack(neighbor) ? acc + 1 : acc;
    }, 0);
};

const populateGrid = (rawInput: string) => {
    const input = parseInput(rawInput);

    const STARTING_SIZE = 101;
    const midpoint = Math.floor(STARTING_SIZE / 2);

    const result = Grid.fromProportions(STARTING_SIZE, STARTING_SIZE, 0);

    for (const row of input) {
        let coords = [midpoint, midpoint];

        for (const direction of row) {
            coords = getNeighborIndex[
                direction as keyof typeof getNeighborIndex
            ](coords[0], coords[1]);
        }

        flip(result, coords[0], coords[1]);
    }

    return result;
};

export function partOne() {
    const grid = populateGrid(input);

    return grid.countElements(1);
}

const getEmptyGrid = (grid: Grid<number>) => {
    return Grid.fromProportions(grid.rows, grid.cols, 0);
};

export function partTwo() {
    let grid = populateGrid(input);

    let clone = getEmptyGrid(grid);

    for (let k = 0; k < 100; ++k) {
        grid.forEach((el, r, c) => {
            const blacks = countBlackNeighbors(r, c, grid);

            if (isWhite(el)) {
                clone.set(r, c, blacks === 2 ? 1 : 0);
            } else {
                clone.set(r, c, blacks === 0 || blacks > 2 ? 0 : 1);
            }
        });

        clone.expandBoundaries(0);
        grid = clone;
        clone = getEmptyGrid(grid);
    }

    return grid.countElements(1);
}
