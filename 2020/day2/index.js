// https://adventofcode.com/2020/day/2

const { getInput, inRange, numMatches } = require('../../utils');

const rawInput = getInput(__dirname);

/** Maps each row into [min, max, targetChar, password] tuple. */
const passwords = rawInput
    .split('\n')
    .map(line => line.match(/(\d+)\-(\d+) (\w): (.+)/).slice(1));

/**
 * Each line gives the password policy and then the password.
 * The password policy indicates the lowest and highest number of times
 * a given letter must appear for the password to be valid. For example,
 * 1-3 a means that the password must contain a at least 1 time and at
 * most 3 times.
 */
exports.partOne = () => numMatches(passwords, ([min, max, targetChar, password]) => {
    const matchingChars = numMatches(
        [...password],
        char => char === targetChar
    );
    return inRange(min, max)(matchingChars);
});

/**
 * Each policy actually describes two positions in the password, where
 * 1 means the first character, 2 means the second character, and so on.
 * (Be careful; Toboggan Corporate Policies have no concept of "index zero"!)
 * Exactly one of these positions must contain the given letter.
 * Other occurrences of the letter are irrelevant for the purposes of
 * policy enforcement.
 */
exports.partTwo = () => numMatches(passwords, ([min, max, targetChar, password]) => {
    const [firstChar, secondChar] = [password[min - 1], password[max - 1]];
    return (
        [firstChar, secondChar].filter(char => char === targetChar).length === 1
    );
});
