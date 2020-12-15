// https://adventofcode.com/2020/day/15

const { getInput, getTestInput } = require('../../utils');

const i = getInput(__dirname);
const _i = getTestInput(__dirname);

const parseInput = input => input.split(',').map(Number);

const playGame = (nums, iterations) => {
    let currNum = nums[0];

    const seen = new Map();

    for (let i = 1; i < iterations + 1; ++i) {
        const prev = nums[i - 1];

        // Number exists in the starting array.
        if (prev !== undefined) {
            seen.set(prev, i);
            currNum = prev;
            continue;
        }

        // Calculate current based off last seen number.
        const prevIndex = seen.get(currNum);

        seen.set(currNum, i - 1);

        if (!prevIndex) {
            currNum = 0;
        } else {
            currNum = i - 1 - prevIndex;
        }
    }

    return currNum;
};

exports.partOne = () => {
    const input = parseInput(i);

    return playGame(input, 2020);
};

exports.partTwo = () => {
    const input = parseInput(i);

    return playGame(input, 30000000);
};
