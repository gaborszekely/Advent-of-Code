// https://adventofcode.com/2020/day/15

const { getInput, getTestInput } = require('../../utils');

const i = getInput(__dirname);
const _i = getTestInput(__dirname);

const parseInput = input => input.split(',').map(Number);

const playGame = (nums, iterations) => {
    let currNum;

    const seen = new Map();

    for (let i = 0; i < iterations; ++i) {
        const prev = nums[i];

        // Number exists in the starting array.
        if (prev !== undefined) {
            seen.set(prev, i + 1);
            continue;
        }

        // Calculate current based off last seen number.
        const prevIndex = seen.get(currNum);
        seen.set(currNum, i);
        currNum = prevIndex ? i - prevIndex : 0;
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
