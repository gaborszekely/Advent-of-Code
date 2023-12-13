// https://adventofcode.com/2023/day/13

import { getInput } from '@utils/fs';
import { Grid } from '@utils/grid';

const input = getInput(__dirname);

/**
 * For a given row, calculate how many non-reflecting column cells exist (if zero, the row is a perfect horizontal
 * reflection).
 */
function countRowDiffs(grid: Grid<string>, row: number, col: number) {
    let leftCol = col;
    let rightCol = col + 1;
    let diffs = 0;

    while (leftCol >= 0 && rightCol < grid.cols) {
        if (grid.get(row, leftCol) !== grid.get(row, rightCol)) {
            diffs++;
        }
        leftCol--;
        rightCol++;
    }

    return diffs;
}

/**
 * For a given column, calculate how many non-reflecting row cells exist (if zero, the column is a perfect vertical
 * reflection).
 */
function countColumnDiffs(grid: Grid<string>, row: number, col: number) {
    let leftRow = row;
    let rightRow = row + 1;
    let diffs = 0;

    while (leftRow >= 0 && rightRow < grid.rows) {
        if (grid.get(leftRow, col) !== grid.get(rightRow, col)) {
            diffs++;
        }
        leftRow--;
        rightRow++;
    }

    return diffs;
}

/**
 * Checks whether a vertical reflection exists at a given column (with the number of allowed imperfections specified).
 */
function hasVerticalReflection(
    grid: Grid<string>,
    col: number,
    allowedDiffs: number
) {
    let totalRowDiffs = 0;
    for (let row = 0; row < grid.rows; ++row) {
        totalRowDiffs += countRowDiffs(grid, row, col);
    }

    return totalRowDiffs === allowedDiffs;
}

/**
 * Checks whether a horizontal reflection exists at a given row (with the number of allowed imperfections specified).
 */
function hasHorizontalReflection(
    grid: Grid<string>,
    row: number,
    allowedDiffs: number
) {
    let totaColumnDiffs = 0;
    for (let col = 0; col < grid.cols; ++col) {
        totaColumnDiffs += countColumnDiffs(grid, row, col);
    }

    return totaColumnDiffs === allowedDiffs;
}

function calculateTotal({ allowedDiffs }: { allowedDiffs: number }) {
    let columnsToLeft = 0;
    let rowsAbove = 0;

    const patterns = input
        .split('\n\n')
        .map(pattern => Grid.fromString(pattern));

    patterns.forEach(grid => {
        let hasReflection = false;

        // check vertical reflection
        for (let col = 0; col < grid.cols - 1; ++col) {
            hasReflection = hasVerticalReflection(grid, col, allowedDiffs);

            if (hasReflection) {
                columnsToLeft += col + 1;
                break;
            }
        }

        // check horizontal reflection
        if (!hasReflection) {
            for (let row = 0; row < grid.rows - 1; ++row) {
                hasReflection = hasHorizontalReflection(
                    grid,
                    row,
                    allowedDiffs
                );

                if (hasReflection) {
                    rowsAbove += row + 1;
                    break;
                }
            }
        }
    });

    return columnsToLeft + 100 * rowsAbove;
}

export function partOne() {
    return calculateTotal({ allowedDiffs: 0 });
}

export function partTwo() {
    return calculateTotal({ allowedDiffs: 1 });
}
