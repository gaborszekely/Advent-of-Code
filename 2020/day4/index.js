// https://adventofcode.com/2020/day/4

const fs = require('fs');
const { getInput, inRange } = require('../../utils');

const input = getInput(__dirname);

const requiredFields = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'];

/** Maps each input row to a {field: value} object. */
const toPassword = row =>
    row
        .split(/[\s\n]/)
        .map(row => row.split(':'))
        .reduce(
            (acc, [k, v]) => ({
                ...acc,
                [k]: v,
            }),
            {}
        );

/** Full list of deserialized passwords. */
const passwords = input.split(/\n\n/).map(toPassword);

// PART ONE

/** Rows that contain all required fields. */
const validPasswords = passwords.filter(password =>
    requiredFields.every(field => field in password)
);

// PART TWO

const eyeColors = ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'];

/** [min, max] allowed heights for each unit type. */
const heightConstraints = {
    cm: [150, 193],
    in: [59, 76],
};

const strictFieldTests = {
    /** Four digits; at least 1920 and at most 2002. */
    byr: ({ byr }) => inRange(1920, 2002)(byr),

    /** Four digits; at least 2010 and at most 2020. */
    iyr: ({ iyr }) => inRange(2010, 2020)(iyr),

    /** Four digits; at least 2020 and at most 2030. */
    eyr: ({ eyr }) => inRange(2020, 2030)(eyr),

    /** Exactly one of: amb blu brn gry grn hzl oth. */
    ecl: ({ ecl }) => eyeColors.includes(ecl),

    /** A # followed by exactly six characters 0-9 or a-f. */
    hcl: ({ hcl }) => /#[0-9a-f]{6}/.test(hcl),

    // A nine-digit number, including leading zeroes.
    pid: ({ pid }) => /^\d{9}$/.test(pid),

    /**
     * A number followed by either cm or in:
     * If cm, the number must be at least 150 and at most 193.
     * If in, the number must be at least 59 and at most 76.
     */
    hgt: ({ hgt }) => {
        const [match, size, unit] = (hgt || '').match(/^(\d+)(cm|in)$/) || [];

        if (!match) return false;

        const [min, max] = heightConstraints[unit];

        return inRange(min, max)(size);
    },
};

/**
 * Passwords that contain all required fields, and pass all
 * strict field checks.
 */
const validStrictPasswords = validPasswords.filter(password =>
    Object.values(strictFieldTests).every(test => test(password))
);

exports.partOne = validPasswords.length;
exports.partTwo = validStrictPasswords.length;
