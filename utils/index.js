const { assert } = require('console');
const fs = require('fs');

exports.range = (i, j, inclusive = true) =>
    i <= j
        ? Array.from({ length: j - i + +inclusive }, (_, idx) => i + idx)
        : Array.from({ length: i - j + +inclusive }, (_, idx) => i - idx);

assert(exports.range(1, 3).join('') === '123', 'range(1, 3) incorrect');
assert(exports.range(3, 1).join('') === '321', 'range(3, 1) incorrect');

/** Checks whether a value is included in a range (inclusive). */
exports.inRange = (min, max) => v => v >= min && v <= max;

/** Checks whether a value is a valid grid coordinate. */
exports.inGridRange = (grid, i, j) =>
    i >= 0 && i < grid.length && j >= 0 && j < grid[i].length;

exports.assert = (actual, expected) => {
    if (actual !== expected) {
        console.error(`Actual value did not match extected value!`);
        console.log('Actual: ', actual);
        console.log('Expected: ', expected);
    }
};

exports.getInput = dirname =>
    fs.readFileSync(`${dirname}/input.txt`, 'utf8').replace(/\n$/, '');

/** Number of array elements matching a predicate function. */
exports.numMatches = (list, predicate) => list.filter(predicate).length;

/** Serialize a set of coordinates as a string. */
exports.serializeCoords = (i, j) => `${i}:${j}`;

/** Sum the values in an array. */
exports.sumArray = ary => {
    assert(Array.isArray(ary), 'Please pass a valid array to sumArray()');

    return ary.reduce((acc, val) => acc + val, 0);
};

/**
 * Find the overlapping values between two or more arrays.
 *
 * i.e., for [1,2,3] and [2,3,4,5], the values [2,3] are present in both arrays.
 */
exports.findOverlappingValues = (...arys) => {
    return arys.reduce((acc, ary) => {
        const aryVals = new Set(ary);

        return acc.filter(val => aryVals.has(val));
    });
};
