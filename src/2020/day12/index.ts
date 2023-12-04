// https://adventofcode.com/2020/day/12

import { getInput, getTestInput } from '@utils/fs';
import { Grid } from '@utils/grid';

const i = getInput(__dirname);
const _i = getTestInput(__dirname);

const parseInput = (ipt: string) =>
    ipt
        .split('\n')
        .map(row => [row[0], Number(row.slice(1))] as [string, number]);

const directions = ['N', 'E', 'S', 'W'] as const;

type Direction = (typeof directions)[number];

const isDirection = (direction: string): direction is Direction =>
    directions.includes(direction as Direction);

const move = (coords: number[], direction: Direction, amount: number) => {
    if (direction === 'S') return [coords[0], coords[1] - amount];
    if (direction === 'N') return [coords[0], coords[1] + amount];
    if (direction === 'E') return [coords[0] + amount, coords[1]];
    if (direction === 'W') return [coords[0] - amount, coords[1]];
};

const rotate = (dirI: number) => (dirI === -1 ? 3 : dirI === 4 ? 0 : dirI);

export function partOne() {
    const input = parseInput(i);
    let dirI = 1;

    let coords = [0, 0];

    for (const [direction, amount] of input) {
        if (isDirection(direction)) {
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
}

export function partTwo() {
    const input = parseInput(i);

    let waypoint = [10, 1];
    let coords = [0, 0];

    const rotateClockwise = (coords: number[]) => [coords[1], -coords[0]];
    const rotateCounterClockwise = (coords: number[]) => [
        -coords[1],
        coords[0],
    ];

    for (const [direction, amount] of input) {
        if (isDirection(direction)) {
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
}
