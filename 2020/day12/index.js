// https://adventofcode.com/2020/day/12

const { getInput, getTestInput, Grid } = require('../../utils');

const i = getInput(__dirname);
const _i = getTestInput(__dirname);

const parseInput = ipt =>
    ipt.split('\n').map(row => [row[0], Number(row.slice(1))]);

const move = (coords, direction, amount) => {
    if (direction === 'S') return [coords[0], coords[1] - amount];
    if (direction === 'N') return [coords[0], coords[1] + amount];
    if (direction === 'E') return [coords[0] + amount, coords[1]];
    if (direction === 'W') return [coords[0] - amount, coords[1]];
};

const rotate = dirI => (dirI === -1 ? 3 : dirI === 4 ? 0 : dirI);

const directions = ['N', 'E', 'S', 'W'];

exports.partOne = () => {
    const input = parseInput(i);
    let dirI = 1;

    let coords = [0, 0];

    for (const [direction, amount] of input) {
        if (['N', 'S', 'E', 'W'].includes(direction)) {
            coords = move(coords, direction, amount);
        }

        if (['R', 'L'].includes(direction)) {
            const numTurns = amount / 90;
            const change = direction === 'R' ? 1 : -1;

            for (let i = 0; i < numTurns; ++i) {
                dirI = rotate(dirI + change);
            }
        }

        if (direction === 'F') {
            coords = move(coords, directions[dirI], amount);
        }
    }

    return Grid.getManhattanDistance(coords);
};

exports.partTwo = () => {
    const input = parseInput(i);

    let waypoint = [10, 1];
    let coords = [0, 0];

    const rotateClockwise = coords => [coords[1], -coords[0]];
    const rotateCounterClockwise = coords => [-coords[1], coords[0]];

    for (const [direction, amount] of input) {
        if (['N', 'S', 'E', 'W'].includes(direction)) {
            waypoint = move(waypoint, direction, amount);
        }

        if (['R', 'L'].includes(direction)) {
            const numTurns = amount / 90;
            const rotateFn =
                direction === 'R' ? rotateClockwise : rotateCounterClockwise;

            for (let i = 0; i < numTurns; ++i) {
                waypoint = rotateFn(waypoint);
            }
        }

        if (direction === 'F') {
            coords = [
                coords[0] + waypoint[0] * amount,
                coords[1] + waypoint[1] * amount,
            ];
        }
    }

    return Grid.getManhattanDistance(coords);
};
