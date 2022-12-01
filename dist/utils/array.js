"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.last = exports.first = exports.findMinMax = exports.PrefixSum = exports.twoSumSorted = exports.twoSum = exports.findUniqueValues = exports.findIntersection = exports.sumArray = exports.numMatches = void 0;
const console_1 = require("console");
/** Finds the number of array elements matching a predicate function. */
const numMatches = (list, predicate) => list.filter(predicate).length;
exports.numMatches = numMatches;
/** Sums the values of an array. */
const sumArray = (ary) => {
    (0, console_1.assert)(Array.isArray(ary), 'Please pass a valid array to sumArray()');
    return ary.reduce((acc, val) => acc + val, 0);
};
exports.sumArray = sumArray;
/**
 * Finds the overlapping values between two or more arrays.
 *
 * i.e., for [1,2,3] and [2,3,4,5], the values [2,3] are present in both arrays.
 */
const findIntersection = (...arys) => {
    return arys.reduce((acc, ary) => {
        const aryVals = new Set(ary);
        return acc.filter(val => aryVals.has(val));
    });
};
exports.findIntersection = findIntersection;
/** Finds all unique values in a list of arrays. */
const findUniqueValues = (...arys) => [
    ...new Set(arys.flat()),
];
exports.findUniqueValues = findUniqueValues;
/** Finds two numbers that add up to a target. */
const twoSum = (nums, target, start = 0, end = nums.length) => {
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
exports.twoSum = twoSum;
/** Finds two numbers in a sorted list that add up to a target. */
const twoSumSorted = (nums, target) => {
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
        }
        else {
            j--;
        }
    }
    return null;
};
exports.twoSumSorted = twoSumSorted;
/** Prefix sum data structure.  */
class PrefixSum {
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
            throw new Error('Please pass a valid range to calculate prefix sum');
        }
        return this.prefixes[j] - (this.prefixes[i - 1] || 0);
    }
}
exports.PrefixSum = PrefixSum;
/** Returns the [minimum, maximum] values of an array. */
const findMinMax = (ary, start = 0, end = ary.length - 1) => {
    let min = Infinity;
    let max = -Infinity;
    for (let i = start; i <= end; ++i) {
        min = Math.min(min, ary[i]);
        max = Math.max(max, ary[i]);
    }
    return [min, max];
};
exports.findMinMax = findMinMax;
const first = (ary) => ary[0];
exports.first = first;
const last = (ary) => ary[ary.length - 1];
exports.last = last;
//# sourceMappingURL=array.js.map