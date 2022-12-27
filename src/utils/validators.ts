import { CommanderStatic } from 'commander';
import * as array from './array';

// import utils from './utils';

const equals = (expected: unknown) => (val: unknown) => {
    if (val !== expected) {
        return {
            error: true,
            message: ` - Must be equal to '${expected}'`,
        };
    }
};

const transformValidators = (validators: unknown[]) =>
    validators.map(validator =>
        typeof validator === 'function' ? validator : equals(validator)
    );

const oneOf = (validators: unknown[]) => (val: unknown) => {
    const transformedValidators = transformValidators(validators);
    const errors = transformedValidators
        .map(validator => validator(val))
        .filter(Boolean);

    if (errors.length === validators.length) {
        return {
            error: true,
            message:
                ' - One of the following must be true: \n' +
                errors.map(error => `   ${error.message}`).join('\n'),
        };
    }
};

const inRange = (min: number, max: number) => (val: unknown) => {
    if (
        isNaN(Number(val)) ||
        (typeof val === 'number' && !array.inRange(min, max)(val))
    ) {
        return {
            error: true,
            message: ` - Must be in the range ${min}-${max}`,
        };
    }
};

const regex = (rx: RegExp) => (val: string) => {
    if (!rx.test(val)) {
        return {
            error: true,
            message: ` - Must match the regular expression: ${rx.toString()}`,
        };
    }
};

export const validateArgs = (
    commander: CommanderStatic,
    validationRules: { [key: string]: unknown[] }
) => {
    for (const [arg, validators] of Object.entries(validationRules)) {
        const transformedValidators = transformValidators(validators);
        const val = commander[arg];

        const errors = transformedValidators
            .map(validator => validator(val))
            .filter(Boolean);

        if (errors.length) {
            throw new Error(
                `ERROR - Could not validate command-line arg '${arg}'.\n\n` +
                    errors.map(error => `${error.message}\n`) +
                    '\n'
            );
        }
    }
};

export const Validators = { equals, inRange, oneOf, regex };
