// https://adventofcode.com/2022/day/18

import { DisjointSet } from '@utils/disjointset';
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

    const neighbors = [
        serialize(x, y, z + 1),
        serialize(x, y, z - 1),
        serialize(x, y + 1, z),
        serialize(x, y - 1, z),
        serialize(x + 1, y, z),
        serialize(x - 1, y, z),
    ];

    if (diagonal) {
        neighbors.push(
            serialize(x + 1, y, z + 1),
            serialize(x + 1, y, z - 1),
            serialize(x - 1, y, z + 1),
            serialize(x - 1, y, z - 1),
            serialize(x - 1, y - 1, z),
            serialize(x - 1, y + 1, z),
            serialize(x - 1, y - 1, z - 1),
            serialize(x - 1, y - 1, z + 1)
        );
    }

    return neighbors;
};

const entries = input.split('\n').map(row => deserialize(row));
const cubePositions = new Set(entries.map(entry => serialize(...entry)));

export function partOne() {
    return entries.reduce((acc, entry) => {
        const neighbors = getNeighbors(entry);

        for (const neighbor of neighbors) {
            if (!cubePositions.has(neighbor)) acc++;
        }

        return acc;
    }, 0);
}

function buildDisjointSet(boundaries: Set<string>) {
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
}

export function partTwo() {
    const boundaries = new Set<string>();

    for (const entry of entries) {
        const neighbors = getNeighbors(entry, { diagonal: true });

        for (const neighbor of neighbors) {
            if (!cubePositions.has(neighbor)) {
                boundaries.add(neighbor);
            }
        }
    }

    const ds = buildDisjointSet(boundaries);
    const outerBoundaryParent = Object.entries(ds.rank).sort(
        (a, b) => b[1] - a[1]
    )[0][0];

    let total = 0;

    for (const entry of entries) {
        const neighbors = getNeighbors(entry);

        for (const neighbor of neighbors) {
            if (ds.find(neighbor) === outerBoundaryParent) {
                total++;
            }
        }
    }

    return total;
}
