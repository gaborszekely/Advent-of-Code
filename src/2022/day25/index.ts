// https://adventofcode.com/2022/day/24

import { getInput } from '@utils/fs';
import { sum } from 'lodash';

const input = getInput(__dirname);

const fromSnafu = (snafuNum: string): number => {
    return snafuNum
        .split('')
        .reverse()
        .reduce((acc, digit, i) => {
            switch (digit) {
                case '1':
                    return acc + 5 ** i;
                case '2':
                    return acc + 5 ** i * 2;
                case '0':
                    return acc;
                case '-':
                    return acc + 5 ** i * -1;
                case '=':
                    return acc + 5 ** i * -2;
            }
        }, 0);
};

const resolve = (i1: string, i2: string) => {
    let result = '';
    let i = i1.length - 1;
    let j = i2.length - 1;

    while (i >= 0) {
        result = (i2[j] ? i2[j] : i1[i]) + result;
        i--;
        j--;
    }

    return result;
};

const maxPossible = [2];

const toSnafu = (num: number): string => {
    // Find starting index.
    let i = 0;
    while (true) {
        maxPossible[i] ||= maxPossible[i - 1] + 5 ** i * 2;
        if (maxPossible[i] < Math.abs(num)) {
            i++;
        } else {
            break;
        }
    }

    if (num === 0) return '';

    if (num > 0) {
        if (num <= 5 ** i + (maxPossible[i - 1] || 0)) {
            return resolve(`1${'0'.repeat(i)}`, toSnafu(num - 5 ** i));
        }

        return resolve(`2${'0'.repeat(i)}`, toSnafu(num - 5 ** i * 2));
    }

    if (Math.abs(num) <= 5 ** i + (maxPossible[i - 1] || 0)) {
        return resolve('-' + '0'.repeat(i), toSnafu(num + 5 ** i));
    }

    return resolve('=' + '0'.repeat(i), toSnafu(num + 5 ** i * 2));
};

export function partOne() {
    const num = sum(input.split('\n').map(row => fromSnafu(row)));

    return toSnafu(num);
}

export function partTwo() {
    console.log('FINISHED!');
}
