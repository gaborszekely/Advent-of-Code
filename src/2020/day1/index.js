// https://adventofcode.com/2020/day/1

const { getInput } = require('../../utils');

const input = getInput(__dirname);

const entries = input.split('\n').map(Number);

entries.sort((a, b) => a - b);

const TARGET = 2020;

// PART 1

const twoSum = (nums, target = TARGET, i = 0, j = nums.length - 1) => {
    while (i < j) {
        let [left, right] = [nums[i], nums[j]];
        const sum = left + right;

        if (sum === target) {
            return left * right;
        }

        if (sum < target) {
            i++;
        } else {
            j--;
        }
    }
};

exports.partOne = () => twoSum(entries);

// PART 2

const threeSum = nums => {
    for (let i = 0; i < nums.length - 3; ++i) {
        const current = nums[i];
        const localTarget = TARGET - current;
        const match = twoSum(nums, localTarget, i + 1, nums.length);

        if (match) {
            return current * match;
        }
    }
};

exports.partTwo = () => threeSum(entries);
