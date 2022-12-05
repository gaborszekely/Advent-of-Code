// https://adventofcode.com/2020/day/4

import { inRange } from '@utils/array';
import { getInput } from '@utils/fs';

const input = getInput(__dirname);

const requiredFields = [
    'byr',
    'iyr',
    'eyr',
    'hgt',
    'hcl',
    'ecl',
    'pid',
] as const;

/** Maps each input row to a {field: value} object. */
const toPassword = (row: string) =>
    row
        .split(/[\s\n]/)
        .map(row => row.split(':'))
        .reduce(
            (acc, [k, v]) => ({
                ...acc,
                [k]: v,
            }),
            {} as Record<typeof requiredFields[number], string>
        );

/** Full list of deserialized passwords. */
const passwords = input.split(/\n\n/).map(toPassword);

// PART ONE

/** Rows that contain all required fields. */
const validPasswords = passwords.filter(password =>
    requiredFields.every(field => field in password)
);

exports.partOne = () => validPasswords.length;

// PART TWO

export function partTwo() {
    const eyeColors = ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'];

    /** [min, max] allowed heights for each unit type. */
    const heightConstraints = {
        cm: [150, 193],
        in: [59, 76],
    };

    const strictFieldTests = {
        /** Four digits; at least 1920 and at most 2002. */
        byr: ({ byr }: { byr: string }) => inRange(1920, 2002)(Number(byr)),

        /** Four digits; at least 2010 and at most 2020. */
        iyr: ({ iyr }: { iyr: string }) => inRange(2010, 2020)(Number(iyr)),

        /** Four digits; at least 2020 and at most 2030. */
        eyr: ({ eyr }: { eyr: string }) => inRange(2020, 2030)(Number(eyr)),

        /** Exactly one of: amb blu brn gry grn hzl oth. */
        ecl: ({ ecl }: { ecl: string }) => eyeColors.includes(ecl),

        /** A # followed by exactly six characters 0-9 or a-f. */
        hcl: ({ hcl }: { hcl: string }) => /#[0-9a-f]{6}/.test(hcl),

        // A nine-digit number, including leading zeroes.
        pid: ({ pid }: { pid: string }) => /^\d{9}$/.test(pid),

        /**
         * A number followed by either cm or in:
         * If cm, the number must be at least 150 and at most 193.
         * If in, the number must be at least 59 and at most 76.
         */
        hgt: ({ hgt }: { hgt: string }) => {
            const [match, size, unit] =
                (hgt || '').match(/^(\d+)(cm|in)$/) || [];

            if (!match) return false;

            const [min, max] = heightConstraints[
                unit as keyof typeof heightConstraints
            ];

            return inRange(min, max)(Number(size));
        },
    };

    /**
     * Passwords that contain all required fields, and pass all
     * strict field checks.
     */
    const validStrictPasswords = validPasswords.filter(password =>
        Object.values(strictFieldTests).every(test => test(password))
    );

    return validStrictPasswords.length;
}
