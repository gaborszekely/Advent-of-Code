// https://adventofcode.com/2020/day/10

const { getInput, getTestInput } = require('../../utils');

const input = getInput(__dirname);
const _input = getTestInput(__dirname);

const myAdapters = input
    .split('\n')
    .map(Number)
    .sort((a, b) => a - b);

// Add wall adapter
myAdapters.unshift(0);
// Add built-in adapter
myAdapters.push(myAdapters[myAdapters.length - 1] + 3);

exports.partOne = () => {
    const findDiffProducts = adapters => {
        let [oneDiff, threeDiff, previousAdapter] = [0, 0, 0];

        for (let i = 1; i < adapters.length; ++i) {
            const currentAdapter = adapters[i];
            const diff = currentAdapter - previousAdapter;

            if (diff === 1) {
                oneDiff++;
            }

            if (diff === 3) {
                threeDiff++;
            }

            previousAdapter = currentAdapter;
        }

        return oneDiff * threeDiff;
    };

    return findDiffProducts(myAdapters);
};

exports.partTwo = () => {
    const findTotalConnections = adapters => {
        const memo = Array.from({ length: adapters.length }, () => 1);

        for (let i = adapters.length - 2; i >= 0; --i) {
            const currentAdapter = adapters[i];
            let totalConnections = 0;

            for (let j = 1; j <= 3; ++j) {
                const neighborIndex = i + j;

                if (neighborIndex >= adapters.length) break;

                const neighborAdapter = adapters[neighborIndex];

                if (neighborAdapter - currentAdapter <= 3) {
                    totalConnections += memo[neighborIndex];
                }
            }

            memo[i] = totalConnections;
        }

        return memo[0];
    };

    return findTotalConnections(myAdapters);
};
