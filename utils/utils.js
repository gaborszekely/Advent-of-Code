const { assert } = require('console');

exports.range = (i, j, inclusive = true) =>
    i <= j
        ? Array.from({ length: j - i + +inclusive }, (_, idx) => i + idx)
        : Array.from({ length: i - j + +inclusive }, (_, idx) => i - idx);

assert(exports.range(1, 3).join('') === '123', 'range(1, 3) incorrect');
assert(exports.range(3, 1).join('') === '321', 'range(3, 1) incorrect');

/** Checks whether a value is included in a range (inclusive). */
exports.inRange = (min, max) => v => v >= min && v <= max;

exports.assert = (actual, expected) => {
    if (actual !== expected) {
        console.error(`Actual value did not match extected value!`);
        console.log('Actual: ', actual);
        console.log('Expected: ', expected);
    }
};

exports.reverse = str => str.split('').reverse().join('');
