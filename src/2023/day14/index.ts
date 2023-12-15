// https://adventofcode.com/2023/day/14

import { getInput } from '@utils/fs';
import { Grid } from '@utils/grid';

const input = getInput(__dirname);

function tiltNorth(grid: Grid<string>) {
    grid.forEach((val, r, c) => {
        if (val === 'O') {
            grid.set(r, c, '.');

            let nextRow = r - 1;
            while (true) {
                if (nextRow === -1) {
                    break;
                }

                if (grid.get(nextRow, c) === '.') {
                    nextRow--;
                } else {
                    break;
                }
            }
            grid.set(nextRow + 1, c, 'O');
        }
    });
}

function tiltSouth(grid: Grid<string>) {
    for (let r = grid.rows - 1; r >= 0; --r) {
        for (let c = 0; c < grid.cols; ++c) {
            const current = grid.get(r, c);

            if (current === 'O') {
                grid.set(r, c, '.');
                let nextRow = r + 1;
                while (true) {
                    if (nextRow === grid.rows) {
                        break;
                    }

                    if (grid.get(nextRow, c) === '.') {
                        nextRow++;
                    } else {
                        break;
                    }
                }
                grid.set(nextRow - 1, c, 'O');
            }
        }
    }
}

function tiltEast(grid: Grid<string>) {
    for (let c = grid.cols - 1; c >= 0; --c) {
        for (let r = 0; r < grid.rows; ++r) {
            const current = grid.get(r, c);

            if (current === 'O') {
                grid.set(r, c, '.');
                let nextCol = c + 1;
                while (true) {
                    if (nextCol === grid.cols) {
                        break;
                    }

                    if (grid.get(r, nextCol) === '.') {
                        nextCol++;
                    } else {
                        break;
                    }
                }
                grid.set(r, nextCol - 1, 'O');
            }
        }
    }
}

function tiltWest(grid: Grid<string>) {
    for (let c = 0; c < grid.cols; ++c) {
        for (let r = 0; r < grid.rows; ++r) {
            const current = grid.get(r, c);

            if (current === 'O') {
                grid.set(r, c, '.');
                let nextCol = c - 1;
                while (true) {
                    if (nextCol === -1) {
                        break;
                    }

                    if (grid.get(r, nextCol) === '.') {
                        nextCol--;
                    } else {
                        break;
                    }
                }
                grid.set(r, nextCol + 1, 'O');
            }
        }
    }
}

function calculateLoad(grid: Grid<string>) {
    let total = 0;

    grid.forEach((val, r, c) => {
        if (val === 'O') {
            total += grid.rows - r;
        }
    });

    return total;
}

export function partOne() {
    const grid = Grid.fromString(input);
    tiltNorth(grid);

    return calculateLoad(grid);
}

function calculateCycleSize() {
    const grid = Grid.fromString(input);
    const map: { [grid: string]: number } = {};

    for (let i = 0; i < Infinity; i++) {
        tiltNorth(grid);
        tiltWest(grid);
        tiltSouth(grid);
        tiltEast(grid);
        const serialized = grid.toString();

        if (serialized in map) {
            const cycleSize = i - map[serialized];
            const cycleStart = map[serialized];

            return [cycleStart, cycleSize];
        }

        map[serialized] = i;
    }
}

export function partTwo() {
    const [cycleStart, cycleSize] = calculateCycleSize();
    const grid = Grid.fromString(input);
    const map: { [i: string]: number } = {};

    for (let i = 1; i <= cycleStart + cycleSize; i++) {
        tiltNorth(grid);
        tiltWest(grid);
        tiltSouth(grid);
        tiltEast(grid);

        if (i >= cycleStart) {
            map[i] = calculateLoad(grid);
        }
    }

    let i = 1000000000;

    while (i >= 0) {
        if (i - cycleSize < cycleStart) {
            return map[i];
        }

        i -= cycleSize;
    }
}
