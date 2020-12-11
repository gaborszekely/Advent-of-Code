// https://adventofcode.com/2020/day/11

const { getInput, Grid } = require('../../utils');

const input = getInput(__dirname);

const moveSeats = (seats, countNeighbors, occupiedLimit) => {
    const clone = seats.clone();

    seats.forEach((seat, row, col) => {
        const numOccupied = countNeighbors(seats, row, col);

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
    seats,
    occupiedLimit,
    countNeighbors
) => {
    let previous = seats;

    while (true) {
        const newSeats = moveSeats(previous, occupiedLimit, countNeighbors);

        if (newSeats.serialize() === previous.serialize()) {
            return newSeats.countElements('#');
        }

        previous = newSeats;
    }
};

exports.partOne = () => {
    const calculateNeighbors = (seats, startRow, startCol) => {
        return seats
            .getAllNeighbors(startRow, startCol)
            .reduce(
                (acc, [neighborRow, neighborCol]) =>
                    seats.get(neighborRow, neighborCol) === '#' ? acc + 1 : acc,
                0
            );
    };

    return getOccupiedSeatsAfterSeatChanges(input, 4, calculateNeighbors);
};

exports.partTwo = () => {
    const calculateNeighbors = (seats, startRow, startCol) => {
        const change = delta => i => i + delta;

        const getDirectionTotal = ({ row = 0, col = 0 }) => {
            const [iDeltaFn, jDeltaFn] = [change(row), change(col)];

            let [i, j] = [iDeltaFn(startRow), jDeltaFn(startCol)];

            while (seats.inRange(i, j)) {
                const curr = seats.get(i, j);

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
};
