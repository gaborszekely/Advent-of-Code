// https://adventofcode.com/2023/day/1

import { getInput } from '@utils/fs';

const input = getInput(__dirname);

const numsMap: Record<string, string> = {
    0: 'zero',
    1: 'one',
    2: 'two',
    3: 'three',
    4: 'four',
    5: 'five',
    6: 'six',
    7: 'seven',
    8: 'eight',
    9: 'nine',
};

export function partOne() {
    return input.split('\n').reduce((acc, row) => {
        let minFirstIndex = Infinity;
        let minFirstValue = '';
        let maxLastIndex = -1;
        let maxLastValue = '';

        for (const num of Object.keys(numsMap)) {
            const firstIndex = row.indexOf(num);
            if (firstIndex >= 0 && firstIndex < minFirstIndex) {
                minFirstIndex = firstIndex;
                minFirstValue = num;
            }

            const lastIndex = row.lastIndexOf(num);
            if (lastIndex >= 0 && lastIndex > maxLastIndex) {
                maxLastIndex = lastIndex;
                maxLastValue = num;
            }
        }

        return acc + Number(minFirstValue + maxLastValue);
    }, 0);
}

export function partTwo() {
    return input.split('\n').reduce((acc, row) => {
        let minFirstIndex = Infinity;
        let minFirstValue = '';
        let maxLastIndex = -1;
        let maxLastValue = '';

        for (const num of Object.keys(numsMap)) {
            const firstIndex = row.indexOf(num);
            if (firstIndex >= 0 && firstIndex < minFirstIndex) {
                minFirstIndex = firstIndex;
                minFirstValue = num;
            }

            const firstNumberIndex = row.indexOf(numsMap[num]);
            if (firstNumberIndex >= 0 && firstNumberIndex < minFirstIndex) {
                minFirstIndex = firstNumberIndex;
                minFirstValue = num;
            }

            const lastIndex = row.lastIndexOf(num);
            if (lastIndex >= 0 && lastIndex > maxLastIndex) {
                maxLastIndex = lastIndex;
                maxLastValue = num;
            }

            const lastNumberIndex = row.lastIndexOf(numsMap[num]);
            if (lastIndex >= 0 && lastIndex > maxLastIndex) {
                maxLastIndex = lastNumberIndex;
                maxLastValue = num;
            }
        }

        return acc + Number(minFirstValue + maxLastValue);
    }, 0);
}
