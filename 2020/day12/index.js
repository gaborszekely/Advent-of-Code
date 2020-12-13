// https://adventofcode.com/2020/day/12

const { getInput, getTestInput } = require('../../utils');

const i = getInput(__dirname);
const _i = getTestInput(__dirname);

const parseInput = ipt =>
    ipt.split('\n').map(row => [row[0], Number(row.slice(1))]);

const rotate = dir => (dir === -1 ? 3 : dir === 4 ? 0 : dir);

const getManhattanDistance = ([x, y]) => Math.abs(x) + Math.abs(y);

exports.partOne = () => {
    const input = parseInput(_i);
    const directions = ['N', 'E', 'S', 'W'];
    let dirI = 1;

    let coords = [0, 0];

    const move = (c, d, amt) => {
        switch (d) {
            case 'N':
                return [c[0] + amt, c[1]];
            case 'S':
                return [c[0] - amt, c[1]];
            case 'E':
                return [c[0], c[1] + amt];
            case 'W':
                return [c[0], c[1] - amt];
            default:
                return c;
        }
    };

    for (const [direction, amount] of input) {
        if (['N', 'S', 'E', 'W'].includes(direction)) {
            coords = move(coords, direction, amount);
        }

        if (direction === 'F') {
            coords = move(coords, directions[dirI], amount);
        }

        if (['R', 'L'].includes(direction)) {
            const numTurns = amount / 90;
            const change = direction === 'R' ? 1 : -1;

            for (let i = 0; i < numTurns; ++i) {
                dirI = rotate(dirI + change);
            }
        }
    }

    return getManhattanDistance(coords);
};

exports.partTwo = () => {
    const input = parseInput(i);

    let wp = [10, 1];
    let coords = [0, 0];

    const rotate = ([cx, cy], [x, y], angle = 90) => {
        var radians = (Math.PI / 180) * angle,
            cos = Math.cos(radians),
            sin = Math.sin(radians),
            nx = cos * (x - cx) + sin * (y - cy) + cx,
            ny = cos * (y - cy) - sin * (x - cx) + cy;
        return [Math.round(nx), Math.round(ny)];
    };

    const moveW = (wp, action, amount) => {
        if (action === 'S') {
            return [wp[0], wp[1] - amount];
        }
        if (action === 'N') {
            return [wp[0], wp[1] + amount];
        }

        if (action === 'E') {
            return [wp[0] + amount, wp[1]];
        }

        if (action === 'W') {
            return [wp[0] - amount, wp[1]];
        }
    };

    for (const [action, amount] of input) {
        switch (action) {
            case 'N':
            case 'S':
            case 'E':
            case 'W':
                wp = moveW(wp, action, amount);
                break;

            case 'F': {
                coords = [
                    coords[0] + wp[0] * amount,
                    coords[1] + wp[1] * amount,
                ];
                break;
            }

            case 'R': {
                const numTurns = amount / 90;

                for (let i = 0; i < numTurns; ++i) {
                    wp = rotate([0, 0], wp);
                }
                break;
            }

            case 'L': {
                const numTurns = amount / 90;

                for (let i = 0; i < numTurns; ++i) {
                    wp = rotate([0, 0], wp, -90);
                }

                break;
            }
        }
    }

    const distance = Math.abs(coords[0] - 0) + Math.abs(coords[1] - 0);

    return distance;
};
