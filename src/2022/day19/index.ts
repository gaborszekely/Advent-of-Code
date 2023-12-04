// https://adventofcode.com/2022/day/19

import { getInput } from '@utils/fs';
import { extractNumbers } from '@utils/string';

const input = getInput(__dirname);
const blueprints = input.split('\n').map(row => {
    const [
        id,
        oreCostOre,
        clayCostOre,
        obsidianCostOre,
        obsidianCostClay,
        geodeCostOre,
        geodeCostObsidian,
    ] = extractNumbers(row);

    return {
        id,
        ore: {
            ore: oreCostOre,
        },
        clay: {
            ore: clayCostOre,
        },
        obsidian: {
            ore: obsidianCostOre,
            clay: obsidianCostClay,
        },
        geode: {
            ore: geodeCostOre,
            obsidian: geodeCostObsidian,
        },
    };
});

const ROCKS = ['ore', 'clay', 'obsidian', 'geode'] as const;

const reversed = [...ROCKS].reverse();

type Blueprint = (typeof blueprints)[number];
type Rock = (typeof ROCKS)[number];
type Robots = Record<Rock, number>;
type Totals = Record<Rock, number>;

function findMaxGeodes(blueprint: Blueprint): number {
    const robots: Robots = {
        ore: 1,
        clay: 0,
        obsidian: 0,
        geode: 0,
    };

    const totals: Totals = {
        ore: 0,
        clay: 0,
        obsidian: 0,
        geode: 0,
    };

    let result = 0;

    const canBuy = (type: Rock) => {
        for (const [requirement, amount] of Object.entries(blueprint[type])) {
            if (totals[requirement as Rock] < amount) {
                return false;
            }
        }
        return true;
    };
    const buy = (type: Rock) => {
        for (const [requirement, amount] of Object.entries(blueprint[type])) {
            totals[requirement as Rock] -= amount;
        }
    };
    const unbuy = (type: Rock) => {
        for (const [requirement, amount] of Object.entries(blueprint[type])) {
            totals[requirement as Rock] += amount;
        }
    };
    const harvest = () => {
        for (const [type, total] of Object.entries(robots)) {
            totals[type as Rock] += total;
        }
    };
    const unharvest = () => {
        for (const [type, total] of Object.entries(robots)) {
            totals[type as Rock] -= total;
        }
    };

    let max = 0;

    const cache: any = {};

    const inner = (minutes = 0): number => {
        minutes++;

        if (!cache[minutes]) {
            cache[minutes] = robots.geode;
        } else {
            if (cache[minutes] > robots.geode) {
                return -1;
            } else {
                cache[minutes] = robots.geode;
            }
        }

        if (minutes === 25) {
            if (totals.geode > max) {
                max = Math.max(max, totals.geode);
            }
            return totals.geode;
        } else {
            let max = -1;

            // Decide to buy or not buy
            for (const rock of reversed) {
                if (canBuy(rock)) {
                    buy(rock);
                    harvest();
                    robots[rock]++;
                    max = Math.max(max, inner(minutes));
                    robots[rock]--;
                    unharvest();
                    unbuy(rock);
                }
            }

            // Buy no rocks
            harvest();
            max = Math.max(max, inner(minutes));
            unharvest();

            return max;
        }
    };

    return inner();
}

// 33
export function partOne() {
    let result = 0;

    for (const blueprint of blueprints) {
        const maxGeodes = findMaxGeodes(blueprint);
        console.log(blueprint.id, maxGeodes);
        result += blueprint.id * maxGeodes;
    }

    return result;
}

export function partTwo() {}
