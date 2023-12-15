// https://adventofcode.com/2023/day/11

import { getInput } from '@utils/fs';
import { Coord, Grid } from '@utils/grid';
import { sum } from 'lodash';

const input = getInput(__dirname);

function expand(grid: Grid<string>) {
    const emptyRows: number[] = [];
    const emptyCols: number[] = [];

    for (let i = 0; i < grid.rows; ++i) {
        const row = grid.getRow(i);
        if (row.every(val => val === '.')) {
            emptyRows.push(i);
        }
    }

    for (let i = 0; i < grid.cols; ++i) {
        const col = grid.getCol(i);
        if (col.every(val => val === '.')) {
            emptyCols.push(i);
        }
    }

    return [emptyRows, emptyCols];
}

function findTotalDistances({ expansionFactor }: { expansionFactor: number }) {
    const grid = Grid.fromString(input);
    let galaxyCount = 1;

    const startingCoords: Coord[] = [];
    const galaxyLocations: Record<string, Coord> = {};

    grid.forEach((val, r, c) => {
        if (val === '#') {
            grid.set(r, c, galaxyCount.toString());
            galaxyLocations[galaxyCount.toString()] = [r, c];
            startingCoords.push([r, c]);
            galaxyCount++;
        }
    });

    const shortestPaths: Record<string, number> = {};

    for (const coords of startingCoords) {
        const queue: [...Coord, number][] = [[...coords, 0]];
        const seen = new Set<string>([Grid.serializeCoords(...coords)]);
        const startingGalaxy = grid.get(...coords);
        let totalSeen = 0;

        while (queue.length) {
            const [r, c, length] = queue.pop();
            const current = grid.get(r, c);

            if (current !== '.' && current !== startingGalaxy) {
                const key = [startingGalaxy, current].sort().join('-');
                shortestPaths[key] = length;
                totalSeen++;
                if (totalSeen === galaxyCount) {
                    break;
                }
            }

            const neighbors = grid.getNeighborCoords(r, c);

            for (const [nR, nC] of neighbors) {
                const sN = Grid.serializeCoords(nR, nC);
                if (!seen.has(sN)) {
                    seen.add(sN);
                    queue.unshift([nR, nC, length + 1]);
                }
            }
        }
    }

    const [emptyRows, emptyCols] = expand(grid);

    let total = 0;
    for (const [key, value] of Object.entries(shortestPaths)) {
        const [g1, g2] = key.split('-');
        const [g1Row, g1Col] = galaxyLocations[g1];
        const [g2Row, g2Col] = galaxyLocations[g2];
        const [minRow, maxRow] =
            g1Row < g2Row ? [g1Row, g2Row] : [g2Row, g1Row];
        const [minCol, maxCol] =
            g1Col < g2Col ? [g1Col, g2Col] : [g2Col, g1Col];

        const emptyRowsBetweenGalaxies = emptyRows.filter(
            row => row > minRow && row < maxRow
        ).length;
        const emptyColsBetweenGalaxies = emptyCols.filter(
            col => col > minCol && col < maxCol
        ).length;

        const distance =
            value +
            emptyRowsBetweenGalaxies * (expansionFactor - 1) +
            emptyColsBetweenGalaxies * (expansionFactor - 1);

        total += distance;
    }

    return total;
}

export function partOne() {
    return findTotalDistances({ expansionFactor: 2 });
}

export function partTwo() {
    return findTotalDistances({ expansionFactor: 1_000_000 });
}
