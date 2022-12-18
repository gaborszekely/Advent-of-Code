// https://adventofcode.com/2022/day/18

import { DisjointSet } from '@utils/graph';
import { getInput } from '@utils/fs';

const input = getInput(__dirname);

type Coord = [number, number, number];
const serialize = (...coords: Coord) => coords.join(',');
const deserialize = (coords: string) => coords.split(',').map(Number) as Coord;

const getNeighbors = (
    coord: Coord | string,
    { diagonal = false }: { diagonal?: boolean } = {}
) => {
    const [x, y, z] = Array.isArray(coord) ? coord : deserialize(coord);

    const neighbors: Coord[] = [
        [x, y, z + 1],
        [x, y, z - 1],
        [x, y + 1, z],
        [x, y - 1, z],
        [x + 1, y, z],
        [x - 1, y, z],
    ];

    if (diagonal) {
        neighbors.push(
            [x + 1, y, z + 1],
            [x + 1, y, z - 1],
            [x - 1, y, z + 1],
            [x - 1, y, z - 1],
            [x - 1, y - 1, z],
            [x - 1, y + 1, z],
            [x - 1, y - 1, z - 1],
            [x - 1, y - 1, z + 1]
        );
    }

    return neighbors.map(neighbor => serialize(...neighbor));
};

const entries = input.split('\n');
const cubePositions = new Set(entries);
const coords = entries.map(row => deserialize(row));

export function partOne() {
    return coords.reduce((acc, coords) => {
        const neighbors = getNeighbors(coords);

        for (const neighbor of neighbors) {
            if (!cubePositions.has(neighbor)) {
                acc++;
            }
        }

        return acc;
    }, 0);
}

const buildDisjointSet = () => {
    const boundaries = new Set<string>();

    for (const coord of coords) {
        const neighbors = getNeighbors(coord, { diagonal: true });

        for (const neighbor of neighbors) {
            if (!cubePositions.has(neighbor)) {
                boundaries.add(neighbor);
            }
        }
    }
    const ds = new DisjointSet(boundaries);

    for (const boundary of boundaries) {
        const neighbors = getNeighbors(boundary);

        for (const neighbor of neighbors) {
            if (boundaries.has(neighbor)) {
                ds.union(boundary, neighbor);
            }
        }
    }

    return ds;
};

export function partTwo() {
    const ds = buildDisjointSet();
    const outerBoundaryParent = Object.entries(ds.rank).sort(
        (a, b) => b[1] - a[1]
    )[0][0];

    let total = 0;

    for (const coord of coords) {
        const neighbors = getNeighbors(coord);

        for (const neighbor of neighbors) {
            if (ds.find(neighbor) === outerBoundaryParent) {
                total++;
            }
        }
    }

    return total;
}
