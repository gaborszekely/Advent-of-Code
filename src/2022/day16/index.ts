// https://adventofcode.com/2022/day/16

import { getInput } from '@utils/fs';
import { sum } from 'lodash';

const input = getInput(__dirname);

interface Valve {
    flowRate: number;
    neighbors: string[];
}

// Create an adjacency list of all connected valves and their flow rates.
const valves = input.split('\n').reduce((acc: Record<string, Valve>, row) => {
    const [, valve, flowRate, neighbors] =
        row.match(
            /Valve ([A-Z]+) has flow rate=(\d+); tunnels? leads? to valves? ([^\n]+)/
        ) || [];

    acc[valve] = {
        flowRate: Number(flowRate),
        neighbors: neighbors.split(', '),
    };

    return acc;
}, {});

// The set of valves with non-zero flow rates.
const valvesWithFlowRates = new Set(
    Object.keys(valves).filter(valve => valves[valve].flowRate !== 0)
);

function findShortestPaths(from: string) {
    const shortestPaths: { [key: string]: number } = {};
    const queue: [string, number][] = [[from, 0]];
    const visited = new Set([from]);

    while (queue.length) {
        const [current, distance] = queue.pop();
        shortestPaths[current] = distance;

        for (const neighbor of valves[current].neighbors) {
            if (!visited.has(neighbor)) {
                visited.add(current);
                queue.unshift([neighbor, distance + 1]);
            }
        }
    }

    return shortestPaths;
}

// A map of shortest paths from every valve to every other valve it can reach.
const shortestPaths: Record<string, Record<string, number>> = {};

for (const valve of Object.keys(valves)) {
    shortestPaths[valve] = findShortestPaths(valve);
}

// A map of opened valves and their contributions to the total pressure released.
type ValveReleases = Record<string, number>;

function findTotalPressureReleased(valveReleases: ValveReleases) {
    return sum(Object.values(valveReleases));
}

export function partOne() {
    const valveReleases: ValveReleases = {};
    let result = 0;

    function visit(current: string, valve: string, minutes = 0) {
        if (valvesWithFlowRates.has(valve) && !valveReleases[valve]) {
            const newMinutes = minutes + shortestPaths[current][valve];
            if (newMinutes < 30) {
                dfs(valve, newMinutes);
            }
        }
    }

    function dfs(current: string, minutes = 0) {
        minutes++;
        valveReleases[current] = (30 - minutes) * valves[current].flowRate;
        result = Math.max(result, findTotalPressureReleased(valveReleases));

        for (const valve in shortestPaths[current]) {
            visit(current, valve, minutes);
        }

        delete valveReleases[current];
    }

    const startValve = 'AA';

    for (const valve in shortestPaths[startValve]) {
        visit(startValve, valve);
    }

    return result;
}

export function partTwo() {
    const valveReleases: ValveReleases = {};
    const cache: { [key: string]: number } = {};
    let result = 0;

    function visit(current: string, valve: string, minutes = 0) {
        if (valvesWithFlowRates.has(valve) && !valveReleases[valve]) {
            const newMinutes = minutes + shortestPaths[current][valve];
            if (newMinutes < 26) {
                dfs(valve, newMinutes);
            }
        }
    }

    function visitElephant(current: string, valve: string, minutes = 0) {
        if (valvesWithFlowRates.has(valve) && !valveReleases[valve]) {
            const newMinutes = minutes + shortestPaths[current][valve];

            return newMinutes < 26 ? dfsElephant(valve, newMinutes) : 0;
        }

        return 0;
    }

    function dfs(current: string, minutes = 0) {
        minutes++;
        valveReleases[current] = (26 - minutes) * valves[current].flowRate;
        const released = findTotalPressureReleased(valveReleases);
        const visitedNodes = Object.keys(valveReleases).sort().join(':');

        if (typeof cache[visitedNodes] === 'undefined') {
            cache[visitedNodes] = 0;
            for (const valve in shortestPaths[startValve]) {
                cache[visitedNodes] = Math.max(
                    cache[visitedNodes],
                    visitElephant(startValve, valve)
                );
            }
        } else {
            result = Math.max(result, released + cache[visitedNodes]);
        }

        for (const valve in shortestPaths[current]) {
            visit(current, valve, minutes);
        }

        delete valveReleases[current];
    }

    function dfsElephant(current: string, minutes = 0) {
        minutes++;
        valveReleases[current] = (26 - minutes) * valves[current].flowRate;
        result = Math.max(result, findTotalPressureReleased(valveReleases));

        let res = 0;

        for (const valve in shortestPaths[current]) {
            res = Math.max(
                res,
                valveReleases[current] + visitElephant(current, valve, minutes)
            );
        }

        delete valveReleases[current];

        return res;
    }

    const startValve = 'AA';

    for (const valve in shortestPaths[startValve]) {
        visit(startValve, valve);
    }

    return result;
}
