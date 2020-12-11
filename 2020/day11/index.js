// https://adventofcode.com/2020/day/11

const { getInput, getTestInput, Grid } = require('../../utils');

const i = getInput(__dirname);
const _i = getTestInput(__dirname);

const parseInput = input => new Grid(input);

const getOccupiedSeatsAfterSeatChanges = (
    startGrid,
    occupiedLimit,
    calculateNeighbors
) => {
    const arrange = grid => {
        const clone = grid.clone();

        grid.forEach((el, row, col) => {
            const numOccupied = calculateNeighbors(grid, row, col);

            if (el === 'L' && numOccupied === 0) {
                clone.set(row, col, '#');
            }

            if (el === '#' && numOccupied >= occupiedLimit) {
                clone.set(row, col, 'L');
            }
        });

        return clone;
    };

    let previousGrid = startGrid;

    while (true) {
        const newGrid = arrange(previousGrid);

        if (newGrid.serialize() === previousGrid.serialize()) {
            return newGrid.countElements('#');
        }

        previousGrid = newGrid;
    }
};

exports.partOne = () => {
    const calculateNeighbors = (grid, startRow, startCol) => {
        return [
            [startRow + 1, startCol],
            [startRow - 1, startCol],
            [startRow + 1, startCol + 1],
            [startRow + 1, startCol - 1],
            [startRow - 1, startCol + 1],
            [startRow - 1, startCol - 1],
            [startRow, startCol + 1],
            [startRow, startCol - 1],
        ]
            .filter(([row, col]) => grid.inRange(row, col))
            .reduce(
                (acc, [row, col]) =>
                    grid.get(row, col) === '#' ? acc + 1 : acc,
                0
            );
    };

    const input = parseInput(i);

    return getOccupiedSeatsAfterSeatChanges(input, 4, calculateNeighbors);
};

exports.partTwo = () => {
    const calculateNeighbors = (grid, startRow, startCol) => {
        const identity = i => i;
        const increment = i => i + 1;
        const decrement = i => i - 1;

        const getDirectionTotal = ({ row = 'stay', col = 'stay' }) => {
            const iDeltaFn =
                row === 'increment'
                    ? increment
                    : row === 'decrement'
                    ? decrement
                    : identity;

            const jDeltaFn =
                col === 'increment'
                    ? increment
                    : col === 'decrement'
                    ? decrement
                    : identity;

            let i = iDeltaFn(startRow);
            let j = jDeltaFn(startCol);

            while (grid.inRange(i, j)) {
                const curr = grid.get(i, j);

                if (curr === 'L' || curr === '#') {
                    return curr === '#' ? 1 : 0;
                }

                i = iDeltaFn(i);
                j = jDeltaFn(j);
            }

            return 0;
        };

        const up = getDirectionTotal({ row: 'increment' });

        const down = getDirectionTotal({ row: 'decrement' });

        const left = getDirectionTotal({ col: 'decrement' });

        const right = getDirectionTotal({ col: 'increment' });

        const downRight = getDirectionTotal({
            row: 'increment',
            col: 'increment',
        });

        const downLeft = getDirectionTotal({
            row: 'increment',
            col: 'decrement',
        });

        const upLeft = getDirectionTotal({
            row: 'decrement',
            col: 'decrement',
        });

        const upRight = getDirectionTotal({
            row: 'decrement',
            col: 'increment',
        });

        return (
            up + down + left + right + upLeft + upRight + downLeft + downRight
        );
    };

    const input = parseInput(i);

    return getOccupiedSeatsAfterSeatChanges(input, 5, calculateNeighbors);
};
