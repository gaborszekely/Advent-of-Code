// https://adventofcode.com/2020/day/19

const { getInput, getTestInput } = require('../../utils');

const i = getInput(__dirname);
const _i = getTestInput(__dirname);

const parseInput = input => {
    let [rules, phrases] = input.split('\n\n');

    rules = rules.split('\n').reduce((acc, row) => {
        const [num, specs] = row.split(': ');

        const subspecs = /[a-z]/.test(specs)
            ? {
                  exact: true,
                  char: specs.replace(/\"/g, ''),
              }
            : {
                  exact: false,
                  rules: specs
                      .split(' | ')
                      .map(subspec => subspec.split(' ').map(Number)),
              };

        acc[num] = subspecs;

        return acc;
    }, {});

    phrases = phrases.split('\n');

    return { rules, phrases };
};

const recurse = (input, phrase, rule = 0, index = 0) => {
    if (input.rules[rule].exact) {
        if (phrase[index] === input.rules[rule].char) {
            return new Set([index + 1]);
        }

        return new Set();
    }

    const nextIndexes = new Set();

    // Starting indexes to pass in to the next number.
    let startingIndexes = new Set([index]);

    for (const subrules of input.rules[rule].rules) {
        // Loop through each rule in the set ofsubrules.
        for (const num of subrules) {
            const nextToTry = new Set();

            // Take next possible starting indexes from previous rule, and
            // try them all.
            for (const startingIndex of startingIndexes) {
                const results = recurse(input, phrase, num, startingIndex);

                results.forEach(i => {
                    if (i <= phrase.length) {
                        nextToTry.add(i);
                    }
                });
            }

            startingIndexes = nextToTry;
        }

        startingIndexes.forEach(i => {
            nextIndexes.add(i);
        });

        startingIndexes = new Set([index]);
    }

    return nextIndexes;
};

const findMatchingPhrases = input => {
    return input.phrases.reduce((acc, phrase) => {
        const matchingPhrase = recurse(input, phrase).has(phrase.length);
        return acc + (matchingPhrase ? 1 : 0);
    }, 0);
};

exports.partOne = () => {
    const input = parseInput(i);

    return findMatchingPhrases(input);
};

exports.partTwo = () => {
    const input = parseInput(i);

    input.rules[8].rules = [[42], [42, 8]];

    input.rules[11].rules = [
        [42, 31],
        [42, 11, 31],
    ];

    return findMatchingPhrases(input);
};
