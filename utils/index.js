const fs = require('fs');

exports.range = (i, j, inclusive = true) =>
    Array.from({ length: j - i + +inclusive }, (_, idx) => i + idx);

exports.inRange = (min, max) => v => v >= min && v <= max;

exports.assert = (actual, expected) => {
    if (actual !== expected) {
        console.error(`Actual value did not match extected value!`);
        console.log('Actual: ', actual);
        console.log('Expected: ', expected);
    }
};

exports.getInput = dirname =>
    fs.readFileSync(`${dirname}/input.txt`, 'utf8').replace(/\n$/, '');

exports.numMatches = (list, predicate) => list.filter(predicate).length;
