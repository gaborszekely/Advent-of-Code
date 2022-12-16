// https://adventofcode.com/2022/day/15

import { getInput } from '@utils/fs';
import { Grid } from '@utils/grid';
import { mergeIntervals } from '@utils/ranges';

const { getManhattanDistance, serializeCoords } = Grid;

const input = getInput(__dirname);

let maxX = -Infinity;
let minX = Infinity;

const beaconPositions = new Set<string>();

const data = input.split('\n').map(row => {
    const [, sensorX, sensorY, beaconX, beaconY] = (
        row.match(
            /^Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)$/
        ) || []
    ).map(Number);

    beaconPositions.add(serializeCoords(beaconX, beaconY));

    const beaconDistance = getManhattanDistance(
        [sensorX, sensorY],
        [beaconX, beaconY]
    );

    maxX = Math.max(maxX, sensorX + beaconDistance);
    minX = Math.min(minX, sensorX - beaconDistance);

    return { sensorX, sensorY, beaconDistance };
});

const isBeacon = (x: number, y: number) =>
    beaconPositions.has(serializeCoords(x, y));

export function partOne() {
    const targetY = 2000000;
    let result = 0;

    for (let i = minX; i <= maxX; ++i) {
        if (
            data.some(({ sensorX, sensorY, beaconDistance }) => {
                const distance = getManhattanDistance(
                    [sensorX, sensorY],
                    [i, targetY]
                );

                return distance <= beaconDistance && !isBeacon(i, targetY);
            })
        ) {
            result++;
        }
    }

    return result;
}

const getTuningFrequency = (x: number, y: number) => x * 4000000 + y;

export function partTwo() {
    const maxSize = 4000000;

    // For each row, a range of Y coordinates that cannot contain the beacon.
    const rowRanges: number[][][] = Array(maxSize + 1);

    const candidateRows = new Set(
        Array.from({ length: maxSize + 1 }, (_, i) => i)
    );

    for (const { sensorX, sensorY, beaconDistance } of data) {
        for (let i = -beaconDistance; i <= beaconDistance; ++i) {
            const y = sensorY + i;

            if (y < 0 || y > maxSize) continue;

            const range = [
                sensorX - (beaconDistance - Math.abs(i)),
                sensorX + (beaconDistance - Math.abs(i)),
            ];

            rowRanges[y] = mergeIntervals([...(rowRanges[y] || []), range]);

            // If the row cannot contain a beacon from Y coords 0 - 4m, delete it from the set of candidate rows that can contain the beacon.
            if (
                rowRanges[y].length === 1 &&
                rowRanges[y][0][0] <= 0 &&
                rowRanges[y][0][1] >= maxSize
            ) {
                candidateRows.delete(y);
            }
        }
    }

    const y = [...candidateRows][0];
    const ranges = rowRanges[y];

    let x: number;
    if (ranges.length === 1) {
        x = ranges[0][0] !== 0 ? 0 : ranges[0][1] + 1;
    } else {
        x = ranges[0][1] + 1;
    }

    return getTuningFrequency(x, y);
}
