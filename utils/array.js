const { assert } = require('console');

/** Finds the number of array elements matching a predicate function. */
exports.numMatches = (list, predicate) => list.filter(predicate).length;

/** Sums the values of an array. */
exports.sumArray = ary => {
    assert(Array.isArray(ary), 'Please pass a valid array to sumArray()');

    return ary.reduce((acc, val) => acc + val, 0);
};

/**
 * Finds the overlapping values between two or more arrays.
 *
 * i.e., for [1,2,3] and [2,3,4,5], the values [2,3] are present in both arrays.
 */
exports.findIntersection = (...arys) => {
    return arys.reduce((acc, ary) => {
        const aryVals = new Set(ary);

        return acc.filter(val => aryVals.has(val));
    });
};

/** Finds all unique values in a list of arrays. */
exports.findUniqueValues = (...arys) => [...new Set(arys.flat())];

/** Finds two numbers that add up to a target. */
exports.twoSum = (nums, target, start = 0, end = nums.length) => {
    const visited = new Set();

    for (let i = start; i < end; ++i) {
        const num = nums[i];
        const remaining = target - num;

        if (visited.has(remaining)) {
            return [remaining, num];
        }

        visited.add(num);
    }

    return null;
};

/** Finds two numbers in a sorted list that add up to a target. */
exports.twoSumSorted = (nums, target) => {
    let i = 0;
    let j = nums.length;

    while (i < j) {
        const [low, high] = [nums[i], nums[j]];
        const sum = low + high;

        if (sum === target) {
            return [low, high];
        }

        if (sum < target) {
            i++;
        } else {
            j--;
        }
    }

    return null;
};

/** Prefix sum data structure.  */
exports.PrefixSum = class {
    constructor(input) {
        this.input = input;
        this.prefixes = [input[0]];

        this.generatePrefixes();
    }

    generatePrefixes() {
        for (let i = 1; i < this.input.length; ++i) {
            this.prefixes[i] = this.prefixes[i - 1] + this.input[i];
        }
    }

    getSum(i, j) {
        if (i < 0 || j >= this.input.length) {
            throw new Error(
                'Please pass a valid range to calculate prefix sum'
            );
        }

        return this.prefixes[j] - (this.prefixes[i - 1] || 0);
    }
};

/** Returns the [minimum, maximum] values of an array. */
exports.findMinMax = (ary, start = 0, end = ary.length - 1) => {
    let min = Infinity;
    let max = -Infinity;

    for (let i = start; i <= end; ++i) {
        min = Math.min(min, ary[i]);
        max = Math.max(max, ary[i]);
    }

    return [min, max];
};

exports.first = ary => ary[0];

exports.last = ary => ary[ary.length - 1];
