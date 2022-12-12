// https://adventofcode.com/2022/day/11

import { getInput } from '@utils/fs';
import { lcm } from '@utils/math';

const input = getInput(__dirname);

const getMonkeys = () =>
    input.split('\n\n').map(row => {
        const lines = row.split('\n').map(line => line.trim());
        const items = [...lines[1].matchAll(/\d+/g)].map(match =>
            Number(match[0])
        );
        const [, operator, amount] = lines[2].match(/new = old (.) (.+)/) || [];

        const getWorryLevel = (old: number) => {
            const factor = amount === 'old' ? old : Number(amount);

            switch (operator) {
                case '+':
                    return old + factor;
                case '*':
                    return old * factor;
                default:
                    throw new Error(`Unexpected operator ${operator}`);
            }
        };

        const [, divisor] = (lines[3].match(/divisible by (\d+)/) || []).map(
            Number
        );
        const [, trueMonkey] = (lines[4].match(/monkey (\d+)/) || []).map(
            Number
        );
        const [, falseMonkey] = (lines[5].match(/monkey (\d+)/) || []).map(
            Number
        );

        const getDestinationMonkey = (worryLevel: number) => {
            const isTrue = worryLevel % divisor === 0;

            return isTrue ? trueMonkey : falseMonkey;
        };

        return {
            items,
            divisor,
            getWorryLevel,
            getDestinationMonkey,
        };
    });

type Monkey = ReturnType<typeof getMonkeys>[number];

interface GetWorryLevelFn {
    (monkey: Monkey, worryLevel: number): number;
}

function getMonkeyBusinessLevel(
    monkeys: ReturnType<typeof getMonkeys>,
    {
        getManagedWorryLevel,
        rounds,
    }: {
        getManagedWorryLevel: GetWorryLevelFn;
        rounds: number;
    }
) {
    const processCounts: {
        [key: string]: number;
    } = {};

    for (let i = 0; i < rounds; ++i) {
        monkeys.forEach((monkey, i) => {
            const { items, getDestinationMonkey } = monkey;
            while (items.length) {
                const current = items.shift();
                const worryLevel = getManagedWorryLevel(monkey, current);
                const destinationMonkey = getDestinationMonkey(worryLevel);
                monkeys[destinationMonkey].items.push(worryLevel);
                processCounts[i] ||= 0;
                processCounts[i]++;
            }
        });
    }

    const sorted = Object.values(processCounts).sort((a, b) => b - a);

    return sorted[0] * sorted[1];
}

export function partOne() {
    const monkeys = getMonkeys();
    const getManagedWorryLevel: GetWorryLevelFn = (monkey, worryLevel) =>
        Math.floor(monkey.getWorryLevel(worryLevel) / 3);

    return getMonkeyBusinessLevel(monkeys, {
        getManagedWorryLevel,
        rounds: 20,
    });
}

export function partTwo() {
    const monkeys = getMonkeys();
    const divisors = monkeys.map(monkey => monkey.divisor);
    const getManagedWorryLevel: GetWorryLevelFn = (monkey, worryLevel) =>
        monkey.getWorryLevel(worryLevel) % lcm(divisors);

    return getMonkeyBusinessLevel(monkeys, {
        getManagedWorryLevel,
        rounds: 10000,
    });
}
