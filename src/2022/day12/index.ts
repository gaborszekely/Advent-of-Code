// https://adventofcode.com/2022/day/12

import { getInput } from '@utils/fs';
import { Grid } from '@utils/grid';

const input = getInput(__dirname);
const grid = Grid.fromSerialized(input);

const { serializeCoords } = Grid;

export function partOne() {
    const [i, j] = grid.findIndex('S');
    const visited = new Set(serializeCoords(i, j));
    const queue = [[i, j, 0]];

    while (queue.length) {
        const [i, j, steps] = queue.pop();
        const current = grid.get(i, j);

        if (current === 'E') {
            return steps;
        }

        const neighbors = grid.getNeighborCoords(i, j);

        for (const [nI, nJ] of neighbors) {
            const neighbor = grid.get(nI, nJ).replace('E', 'z');
            const diff = neighbor.charCodeAt(0) - current.charCodeAt(0);
            const canVisit =
                !visited.has(serializeCoords(nI, nJ)) &&
                (current === 'S' ? neighbor === 'a' : diff <= 1);

            if (canVisit) {
                visited.add(serializeCoords(nI, nJ));
                queue.unshift([nI, nJ, steps + 1]);
            }
        }
    }
}

export function partTwo() {
    const [i, j] = grid.findIndex('E');
    const visited = new Set(serializeCoords(i, j));
    const queue = [[i, j, 0]];

    while (queue.length) {
        const [i, j, steps] = queue.pop();
        const current = grid.get(i, j);

        if (current === 'a' || current === 'S') {
            return steps;
        }

        const neighbors = grid.getNeighborCoords(i, j);

        for (const [nI, nJ] of neighbors) {
            const neighbor = grid.get(nI, nJ).replace('S', 'a');
            const diff = neighbor.charCodeAt(0) - current.charCodeAt(0);
            const canVisit =
                !visited.has(serializeCoords(nI, nJ)) &&
                (current === 'E' ? neighbor === 'z' : diff >= -1);

            if (canVisit) {
                visited.add(serializeCoords(nI, nJ));
                queue.unshift([nI, nJ, steps + 1]);
            }
        }
    }
}
