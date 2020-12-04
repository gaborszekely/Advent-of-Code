const fs = require('fs');
const {getInput} = require('../utils/utils');

const rawInput = getInput(__dirname);

const parsedInput = rawInput.split('\n').map(Number);

parsedInput.sort((a,b) => a - b);

const TARGET = 2020;

const twoSum = (nums, target = TARGET, i = 0, j = nums.length - 1) => {
  while(i < j) {
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

const threeSum = (nums, target = TARGET) => {
  for (let i = 0; i < nums.length - 3; ++i) {
    const current = nums[i];
    const localTarget = target - current;
    const match = twoSum(nums, localTarget, i + 1, nums.length);

    if (match) {
      return  current * match;
    }
  }
}

exports.partOne = twoSum(parsedInput);
exports.partTwo = threeSum(parsedInput);
