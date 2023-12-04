// https://adventofcode.com/2020/day/5

import { getInput } from '@utils/fs';
import { Grid } from '@utils/grid';

const input = getInput(__dirname);

const seatInstructions = input
    .split('\n')
    .map(row => row.match(/^([FB]+)([LR]+)$/).slice(1));

const ROWS = 128;
const COLS = 8;

// PART ONE

const getSeatId = ([row, col]: [number, number]) => row * 8 + col;

const binarySearch = (
    instructions: string,
    i: number,
    j: number,
    firstIdentifier: string
) => {
    for (let instruction of instructions) {
        const midpoint = Math.floor((i + j) / 2);

        if (instruction === firstIdentifier) {
            j = midpoint;
        } else {
            i = midpoint + 1;
        }
    }

    return i;
};

const seatCoords = seatInstructions.map(
    ([rowInstructions, colInstructions]) => {
        const row = binarySearch(rowInstructions, 0, ROWS - 1, 'F');
        const col = binarySearch(colInstructions, 0, COLS - 1, 'L');

        return [row, col];
    }
);

const seatCoordsSet = new Set(
    seatCoords.map(([row, col]) => Grid.serializeCoords(row, col))
);

const descendingSeatIds = seatCoords.map(getSeatId).sort((a, b) => b - a);

exports.partOne = () => descendingSeatIds[0];

// PART TWO

const findMySeatId = () => {
    for (let i = 0; i < ROWS; ++i) {
        for (let j = 0; j < COLS; ++j) {
            const seatId = getSeatId([i, j]);

            const seatIsOpen = !seatCoordsSet.has(Grid.serializeCoords(i, j));

            const neighborsAreOccupied = [seatId + 1, seatId - 1].every(
                neighbor => descendingSeatIds.includes(neighbor)
            );

            if (seatIsOpen && neighborsAreOccupied) {
                return seatId;
            }
        }
    }
};

exports.partTwo = findMySeatId;
