// https://adventofcode.com/2022/day/5

import { getInput } from '@utils/fs';

const input = getInput(__dirname);

const [drawing, rawDirections] = input.split('\n\n');
const directions = rawDirections.split('\n');

export function partOne() {
    const stacks = getStacks();

    directions.forEach(row => {
        const [count, source, destination] = getValues(row, stacks);

        for (let i = 0; i < count; ++i) {
            destination.push(source.pop());
        }
    });

    return getResult(stacks);
}

export function partTwo() {
    const stacks = getStacks();

    directions.forEach(row => {
        const [count, source, destination] = getValues(row, stacks);
        destination.push(...source.splice(source.length - count, count));
    });

    return getResult(stacks);
}

function getStacks() {
    return drawing
        .split('\n')
        .slice(0, -1)
        .map(row => {
            const columns: (string | null)[] = [];
            for (let i = 0; i < row.length; i += 4) {
                const columnVal = row.slice(i, i + 3);
                if (columnVal.trim() === '') {
                    columns.push(null);
                } else {
                    columns.push(columnVal.slice(1, -1));
                }
            }
            return columns;
        })
        .reduce((acc, column) => {
            column.forEach((val, i) => {
                if (val !== null) {
                    acc[i] ||= [];
                    acc[i].unshift(val);
                }
            });
            return acc;
        }, [] as string[][]);
}

function getValues(row: string, stacks: string[][]) {
    const [, count, source, destination] = (
        row.match(/^move (\d+) from (\d+) to (\d+)$/) || []
    ).map(Number);

    return [count, stacks[source - 1], stacks[destination - 1]] as const;
}

function getResult(stacks: string[][]) {
    return stacks.map(stack => stack.at(-1)).join('');
}
