// https://adventofcode.com/2023/day/3

import { getInput } from '@utils/fs';
import { Grid } from '@utils/grid';

const { serializeCoords } = Grid;

const input = getInput(__dirname);
const grid = Grid.fromSerialized(input);

export function partOne() {
    let result = 0;
    const visited = new Set<string>();

    grid.forEach((val, r, c) => {
        if (isSymbol(val)) {
            const neighbors = Grid.getAllNeighborCoords(r, c);

            for (const [nR, nC] of neighbors) {
                if (
                    grid.inRange(nR, nC) &&
                    isNumber(grid.get(nR, nC)) &&
                    !visited.has(serializeCoords(nR, nC))
                ) {
                    result += getNumber(grid, nR, nC, visited);
                }
            }
        }
    });

    return result;
}

export function partTwo() {
    let result = 0;
    const visited = new Set<string>();

    grid.forEach((val, r, c) => {
        if (val === '*') {
            const neighbors = Grid.getAllNeighborCoords(r, c);
            const partNumbers: number[] = [];

            for (const [nR, nC] of neighbors) {
                if (
                    grid.inRange(nR, nC) &&
                    isNumber(grid.get(nR, nC)) &&
                    !visited.has(serializeCoords(nR, nC))
                ) {
                    partNumbers.push(getNumber(grid, nR, nC, visited));
                }
            }

            if (partNumbers.length === 2) {
                result += partNumbers[0] * partNumbers[1];
            }
        }
    });

    return result;
}

function getNumber(
    grid: Grid<string>,
    r: number,
    c: number,
    visited: Set<string>
): number {
    while (grid.inRange(r, c) && isNumber(grid.get(r, c))) {
        c--;
    }

    let num = '';
    for (let i = c + 1; i < grid.getRow(r).length; ++i) {
        if (isNumber(grid.get(r, i))) {
            num += grid.get(r, i);
            visited.add(serializeCoords(r, i));
        } else {
            break;
        }
    }

    return Number(num);
}

function isNumber(val: string) {
    return /[0-9]/.test(val);
}

function isSymbol(val: string) {
    return !isNumber(val) && val !== '.';
}
