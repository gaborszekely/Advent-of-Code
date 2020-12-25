// https://adventofcode.com/2020/day/24

const { getInput, Grid } = require('../../utils');

const input = getInput(__dirname);

const parseInput = rawInput => {
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
    n: (i, j) => [i - 2, j - 1],
    s: (i, j) => [i + 2, j + 1],
    e: (i, j) => [i, j + 1],
    w: (i, j) => [i, j - 1],
    ne: (i, j) => [i - 1, j],
    nw: (i, j) => [i - 1, j - 1],
    se: (i, j) => [i + 1, j + 1],
    sw: (i, j) => [i + 1, j],
};

const getTileColor = (grid, i, j) => {
    return grid.inRange(i, j) ? grid.get(i, j) : 0;
};

const flip = (result, r, c) => {
    const current = result.get(r, c);
    result.set(r, c, current === 0 ? 1 : 0);
};

const isWhite = val => val === 0;
const isBlack = val => val === 1;

const countBlackNeighbors = (r, c, grid) => {
    const neighborDirections = ['e', 'w', 'ne', 'nw', 'se', 'sw'];

    return neighborDirections.reduce((acc, direction) => {
        const neighborCoords = getNeighborIndex[direction](r, c);

        const neighbor = getTileColor(grid, ...neighborCoords);

        return isBlack(neighbor) ? acc + 1 : acc;
    }, 0);
};

const populateGrid = rawInput => {
    const input = parseInput(rawInput);

    const STARTING_SIZE = 101;
    const midpoint = Math.floor(STARTING_SIZE / 2);

    const result = Grid.fromProportions(STARTING_SIZE, STARTING_SIZE, 0);

    for (const row of input) {
        let coords = [midpoint, midpoint];

        for (const direction of row) {
            coords = getNeighborIndex[direction](...coords);
        }

        flip(result, ...coords);
    }

    return result;
};

exports.partOne = () => {
    const grid = populateGrid(input);

    return grid.countElements(1);
};

const getEmptyGrid = grid => {
    return Grid.fromProportions(grid.rows, grid.cols, 0);
};

exports.partTwo = () => {
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
};
