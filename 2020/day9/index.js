// https://adventofcode.com/2020/day/9

const {
    getInput,
    twoSum,
    getTestInput,
    sumArray,
    findMinMax,
} = require('../../utils');

const input = getInput(__dirname);
const testInput = getTestInput(__dirname);

const nums = input.split('\n').map(Number);

const findInvalidNumber = (numbers, preamble) => {
    for (let i = preamble; i < numbers.length; ++i) {
        if (!twoSum(numbers, numbers[i], i - preamble, i)) {
            return numbers[i];
        }
    }
};

exports.partOne = () => {
    return findInvalidNumber(nums, 25);
};

exports.partTwo = () => {
    // Finds the minimum and maximum values of the subarray, and sums them.
    const sumMinMax = (i, j) => sumArray(findMinMax(nums, i, j));

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
};
