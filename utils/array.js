const { assert } = require('console');

/** Number of array elements matching a predicate function. */
exports.numMatches = (list, predicate) => list.filter(predicate).length;

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
exports.findIntersection = (...arys) => {
    return arys.reduce((acc, ary) => {
        const aryVals = new Set(ary);

        return acc.filter(val => aryVals.has(val));
    });
};

/** Find all unique values in a list of arrays. */
exports.findUniqueValues = (...arys) => [...new Set(arys.flat())];
