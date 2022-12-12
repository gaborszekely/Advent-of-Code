// https://adventofcode.com/2022/day/11

import { getInput } from '@utils/fs';
import { lcm } from '@utils/math';
import { extractNumber, extractNumbers } from '@utils/string';

const input = getInput(__dirname);

function getMonkeys() {
    return input.split('\n\n').map(row => {
        const lines = row.split('\n');
        const items = extractNumbers(lines[1]);
        const [, operator, amount] = lines[2].match(/new = old (.) (.+)/) || [];

        function getWorryLevel(old: number) {
            const operand = amount === 'old' ? old : Number(amount);

            switch (operator) {
                case '+':
                    return old + operand;
                case '*':
                    return old * operand;
                default:
                    throw new Error(`Unexpected operator ${operator}`);
            }
        }

        const divisor = extractNumber(lines[3]);
        const trueMonkey = extractNumber(lines[4]);
        const falseMonkey = extractNumber(lines[5]);

        function getDestinationMonkey(worryLevel: number) {
            return worryLevel % divisor === 0 ? trueMonkey : falseMonkey;
        }

        return {
            items,
            divisor,
            getWorryLevel,
            getDestinationMonkey,
        };
    });
}

type Monkeys = ReturnType<typeof getMonkeys>;
type Monkey = Monkeys[number];

interface GetWorryLevelFn {
    (monkey: Monkey, worryLevel: number): number;
}

function getMonkeyBusinessLevel(
    monkeys: Monkeys,
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
