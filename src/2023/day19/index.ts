// https://adventofcode.com/2023/day/19

import { getInput } from '@utils/fs';
import { groupBy, sum } from 'lodash';

const input = getInput(__dirname);

type Part = Record<string, number>;

interface Comparison {
    readonly destination: string;
    readonly partComponent?: string;
    readonly operation?: string;
    readonly comparator?: number;
}

const [workflowsStr, partsStr] = input.split('\n\n');

const workflows = workflowsStr.split('\n').reduce(
    (acc, row) => {
        const [, workflow, conditionsStr] = row.match(/^(\w+)\{(.+)\}$/);
        const predicateFns = conditionsStr
            .split(',')
            .map((condition, i, conditions): Comparison => {
                if (i === conditions.length - 1) {
                    return { destination: condition };
                }

                const [, partComponent, operation, comparator, destination] =
                    condition.match(/(\w+)([\<\>])(\d+)\:(\w+)/);

                return {
                    partComponent,
                    comparator: Number(comparator),
                    operation,
                    destination,
                };
            });
        acc[workflow] = predicateFns;
        return acc;
    },
    {} as Record<string, Comparison[]>
);

const parts = partsStr.split('\n').map((row): Part => {
    const [, x, m, a, s] = row
        .match(/\{x=(\d+),m=(\d+),a=(\d+),s=(\d+)\}/)
        .map(Number);
    return { x, m, a, s };
});

export function partOne() {
    const runWorkflow = (
        part: Part,
        workflows: Record<string, Comparison[]>
    ) => {
        let workflow = 'in';

        while (true) {
            if (workflow === 'R' || workflow === 'A') {
                return workflow;
            }

            const comparisons = workflows[workflow];

            for (const comparison of comparisons) {
                const { partComponent, comparator, destination, operation } =
                    comparison;

                if (
                    !operation ||
                    (operation === '>' && part[partComponent] > comparator) ||
                    (operation === '<' && part[partComponent] < comparator)
                ) {
                    workflow = destination;
                    break;
                }
            }
        }
    };

    let total = 0;

    for (const part of parts) {
        const status = runWorkflow(part, workflows);
        if (status === 'A') {
            total += sum(Object.values(part));
        }
    }

    return total;
}

export function partTwo() {
    const paths: string[][] = [];
    const path: string[] = [];
    const seen = new Set<string>();

    const inner = (workflow: string) => {
        if (workflow === 'R' || workflow === 'A') {
            if (workflow === 'A') {
                paths.push([...path]);
            }
            return;
        }

        if (seen.has(workflow)) {
            return;
        }
        seen.add(workflow);

        const comparisons = workflows[workflow];
        const pathLen = path.length;

        for (const {
            comparator,
            partComponent,
            operation,
            destination,
        } of comparisons) {
            if (!operation) {
                inner(destination);
            } else {
                const toAdd = `${partComponent}${operation}${comparator}`;
                path.push(toAdd);
                inner(destination);
                path.pop();

                const toAdd2 = `${partComponent}${
                    operation === '<' ? '>=' : '<='
                }${comparator}`;
                path.push(toAdd2);
            }
        }

        while (path.length !== pathLen) {
            path.pop();
        }
    };

    inner('in');

    const allowedRanges = paths
        .map(path => {
            const grouped = groupBy(path, v => v[0]);

            const ranges: Record<string, { min: number; max: number }> = {
                x: { min: 1, max: 4000 },
                m: { min: 1, max: 4000 },
                a: { min: 1, max: 4000 },
                s: { min: 1, max: 4000 },
            };

            for (const key in grouped) {
                const range = ranges[key];

                for (const comparison of grouped[key]) {
                    let [, operation, comparatorStr] =
                        comparison.match(/\w([\<\>\=]+)(\d+)/);
                    const comparator = Number(comparatorStr);

                    switch (operation) {
                        case '>':
                            range.min = Math.max(range.min, comparator + 1);
                            break;
                        case '>=':
                            range.min = Math.max(range.min, comparator);
                            break;
                        case '<':
                            range.max = Math.min(range.max, comparator - 1);
                            break;
                        case '<=':
                            range.max = Math.min(range.max, comparator);
                            break;
                    }
                }

                if (range.min > range.max) {
                    return undefined;
                }
            }

            return ranges;
        })
        .filter(Boolean);

    let totalCombinations = 0;

    for (const allowedRange of allowedRanges) {
        let combinations = 1;
        for (const { min, max } of Object.values(allowedRange)) {
            combinations *= max + 1 - min;
        }

        totalCombinations += combinations;
    }

    return totalCombinations;
}
