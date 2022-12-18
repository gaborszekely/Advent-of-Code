// https://adventofcode.com/2022/day/17

import { getInput } from '@utils/fs';
import { Grid } from '@utils/grid';

const input = getInput(__dirname);

function getJetDirection(i: number) {
    return input[i % input.length] === '>' ? 1 : -1;
}

const rocks = [
    [
        [0, 0],
        [0, 1],
        [0, 2],
        [0, 3],
    ],
    [
        [0, 1],
        [1, 0],
        [1, 1],
        [1, 2],
        [2, 1],
    ],
    [
        [0, 2],
        [1, 2],
        [2, 0],
        [2, 1],
        [2, 2],
    ],
    [
        [0, 0],
        [1, 0],
        [2, 0],
        [3, 0],
    ],
    [
        [0, 0],
        [0, 1],
        [1, 0],
        [1, 1],
    ],
];

let grid: Grid<string>;

function addRockToGrid(rock: number[][], currRow: number, currCol: number) {
    for (const [i, j] of rock) {
        grid.set(currRow + i, currCol + j, '#');
    }

    // Clean up empty rows
    while (true) {
        if (grid.getRow(0).every(v => v === '.')) {
            grid.spliceRows(0);
        } else {
            break;
        }
    }
}

function canMoveDown(rock: number[][], currRow: number, currCol: number) {
    for (const [i, j] of rock) {
        const row = currRow + i + 1;
        const col = currCol + j;

        if (!grid.inRange(row, col) || grid.get(row, col) === '#') {
            return false;
        }
    }
    return true;
}

function moveRock(
    rock: number[][],
    direction: number,
    currRow: number,
    currCol: number
) {
    if (
        rock.every(([i, j]) => {
            const rockRow = i + currRow;
            const rockCol = j + currCol;
            return (
                rockCol + direction >= 0 &&
                rockCol + direction < grid.cols &&
                grid.get(rockRow, rockCol + direction) === '.'
            );
        })
    ) {
        return currCol + direction;
    }

    return currCol;
}

function pruneGrid(grid: Grid<string>) {
    let unreachableDepth = 0;

    for (let i = 0; i < grid.cols; ++i) {
        for (let j = 0; j < grid.rows - 1; ++j) {
            if (grid.get(j, i) === '#') {
                unreachableDepth = Math.max(unreachableDepth, j + 1);
                break;
            }
        }
    }

    const pruned = grid.rows - unreachableDepth - 1;

    if (pruned > 0) {
        grid.spliceRows(unreachableDepth, pruned);
    }

    return pruned;
}

function runTetris(iterations: number) {
    grid = Grid.fromProportions(1, 7, '#');
    let jetIndex = -1;
    let height = 0;

    for (let i = 0; i < iterations; ++i) {
        if (i % 1000000 === 0) {
            console.log(i);
        }
        if (i % 10 === 0) {
            height += pruneGrid(grid);
        }
        let currRow = 0;
        let currCol = 2;

        const rock = rocks[i % rocks.length];
        const rockHeight = rock.at(-1).at(0) + 1;
        grid.unshiftRows(rockHeight + 3, '.');
        while (true) {
            jetIndex++;
            currCol = moveRock(
                rock,
                getJetDirection(jetIndex),
                currRow,
                currCol
            );
            if (canMoveDown(rock, currRow, currCol)) {
                currRow++;
            } else {
                addRockToGrid(rock, currRow, currCol);
                break;
            }
        }
    }
    return grid.rows - 1 + height;
}
export function partOne() {
    return runTetris(2022);
}

export function partTwo() {
    // return runTetris(1000000000000);
}
