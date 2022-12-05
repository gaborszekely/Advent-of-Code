// https://adventofcode.com/2020/day/9

import { findMinMax, twoSum } from '@utils/array';
import { getInput, getTestInput } from '@utils/fs';
import _ from 'lodash';

const input = getInput(__dirname);
const testInput = getTestInput(__dirname);

const nums = input.split('\n').map(Number);

const findInvalidNumber = (numbers: number[], preamble: number) => {
    for (let i = preamble; i < numbers.length; ++i) {
        const current = numbers[i];

        if (!twoSum(numbers, current, i - preamble, i)) {
            return current;
        }
    }
};

export function partOne() {
    return findInvalidNumber(nums, 25);
}

export function partTwo() {
    // Finds the minimum and maximum values of the subarray, and sums them.
    const sumMinMax = (i: number, j: number) => _.sum(findMinMax(nums, i, j));

    const target = exports.partOne();

    let [i, j, sum] = [0, 0, 0];

    while (i < nums.length && j < nums.length) {
        const [left, right] = [nums[i], nums[j]];

        if (right > target) {
            i = ++j;
            sum = nums[j];
            continue;
        }

        if (sum < target) {
            sum += nums[j];

            if (sum === target) {
                return sumMinMax(i, j);
            }

            j++;
        }

        if (sum > target) {
            sum -= left;
            i++;

            if (sum === target) {
                return sumMinMax(i, j);
            }
        }
    }
}
