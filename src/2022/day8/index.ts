// https://adventofcode.com/2022/day/8

import { getInput } from '@utils/fs';
import { Grid } from '@utils/grid';

const input = getInput(__dirname);
const grid = input
    .split('\n')
    .map(row => row.split('').map(cell => Number(cell)));

/*

30373
25512
65332
33549
35390

*/

export function partOne() {
    const rows = grid.length;
    const cols = grid[0].length;

    const maxAbove = Grid.fromProportions(rows, cols, -1);
    const maxBelow = Grid.fromProportions(rows, cols, -1);
    const maxLeft = Grid.fromProportions(rows, cols, -1);
    const maxRight = Grid.fromProportions(rows, cols, -1);

    for (let i = 1; i < grid.length - 1; ++i) {
        for (let j = 1; j < grid[i].length - 1; ++j) {
            maxAbove.set(
                i,
                j,
                Math.max(maxAbove.get(i - 1, j), grid[i - 1][j])
            );
            maxLeft.set(i, j, Math.max(maxLeft.get(i, j - 1), grid[i][j - 1]));
        }
    }

    for (let i = grid.length - 2; i > 0; --i) {
        for (let j = grid[i].length - 2; j > 0; --j) {
            maxBelow.set(
                i,
                j,
                Math.max(maxBelow.get(i + 1, j), grid[i + 1][j])
            );
            maxRight.set(
                i,
                j,
                Math.max(maxRight.get(i, j + 1), grid[i][j + 1])
            );
        }
    }

    let total = 0;

    for (let i = 0; i < grid.length; ++i) {
        for (let j = 0; j < grid[i].length; ++j) {
            const current = grid[i][j];

            if (
                current > maxAbove.get(i, j) ||
                current > maxBelow.get(i, j) ||
                current > maxLeft.get(i, j) ||
                current > maxRight.get(i, j)
            ) {
                total++;
            }
        }
    }

    return total;
}

export function partTwo() {
    let maxScenicScore = 0;

    for (let i = 1; i < grid.length - 1; ++i) {
        for (let j = 1; j < grid[i].length - 1; ++j) {
            maxScenicScore = Math.max(maxScenicScore, getScenicScore(i, j));
        }
    }
    return maxScenicScore;
}

function getScenicScore(i: number, j: number) {
    const current = grid[i][j];
    let scenicScore = 1;

    // go left
    for (let k = j - 1; k >= 0; --k) {
        if (grid[i][k] >= current || k === 0) {
            scenicScore *= j - k;
            break;
        }
    }

    // go right
    for (let k = j + 1; k < grid[i].length; ++k) {
        if (grid[i][k] >= current || k === grid[i].length - 1) {
            scenicScore *= k - j;
            break;
        }
    }

    // go up
    for (let k = i - 1; k >= 0; --k) {
        if (grid[k][j] >= current || k === 0) {
            scenicScore *= i - k;
            break;
        }
    }

    // go down
    for (let k = i + 1; k < grid.length; ++k) {
        if (grid[k][j] >= current || k === grid.length - 1) {
            scenicScore *= k - i;
            break;
        }
    }
    return scenicScore;
}
