// https://adventofcode.com/2020/day/11

import { getInput } from '@utils/fs';
import { Grid } from '@utils/grid';

const input = getInput(__dirname);

interface CountNeighbors {
    (grid: Grid<string>, row: number, col: number): number;
}

const moveSeats = (
    grid: Grid<string>,
    occupiedLimit: number,
    countNeighbors: CountNeighbors
) => {
    const clone = grid.clone();

    grid.forEach((seat, row, col) => {
        const numOccupied = countNeighbors(grid, row, col);

        if (seat === 'L' && numOccupied === 0) {
            clone.set(row, col, '#');
        }

        if (seat === '#' && numOccupied >= occupiedLimit) {
            clone.set(row, col, 'L');
        }
    });

    return clone;
};

const getOccupiedSeatsAfterSeatChanges = (
    grid: Grid<string>,
    occupiedLimit: number,
    countNeighbors: CountNeighbors
) => {
    let previous = grid;

    while (true) {
        const newGrid = moveSeats(previous, occupiedLimit, countNeighbors);

        if (newGrid.serialize() === previous.serialize()) {
            return newGrid.countElements('#');
        }

        previous = newGrid;
    }
};

export function partOne() {
    const calculateNeighbors = (
        grid: Grid<string>,
        startRow: number,
        startCol: number
    ) => {
        return grid
            .getAllNeighbors(startRow, startCol)
            .reduce(
                (acc, [neighborRow, neighborCol]) =>
                    grid.get(neighborRow, neighborCol) === '#' ? acc + 1 : acc,
                0
            );
    };

    return getOccupiedSeatsAfterSeatChanges(input, 4, calculateNeighbors);
}

export function partTwo() {
    const calculateNeighbors = (grid, startRow, startCol) => {
        const change = delta => i => i + delta;

        const getDirectionTotal = ({ row = 0, col = 0 }) => {
            const [iDeltaFn, jDeltaFn] = [change(row), change(col)];

            let [i, j] = [iDeltaFn(startRow), jDeltaFn(startCol)];

            while (grid.inRange(i, j)) {
                const curr = grid.get(i, j);

                if (curr === 'L' || curr === '#') {
                    return curr === '#' ? 1 : 0;
                }

                [i, j] = [iDeltaFn(i), jDeltaFn(j)];
            }

            return 0;
        };

        return Grid.getAllNeighborOffsets().reduce(
            (acc, [dI, dJ]) => acc + getDirectionTotal({ row: dI, col: dJ }),
            0
        );
    };

    return getOccupiedSeatsAfterSeatChanges(input, 5, calculateNeighbors);
}
