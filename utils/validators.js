const utils = require('./utils');

const equals = expected => val => {
    if (val !== expected) {
        return {
            error: true,
            message: ` - Must be equal to '${expected}'`,
        };
    }
};

const transformValidators = validators =>
    validators.map(validator =>
        typeof validator === 'function' ? validator : equals(validator)
    );

const oneOf = validators => val => {
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

const inRange = (min, max) => val => {
    if (isNaN(Number(val)) || !utils.inRange(min, max)(val)) {
        return {
            error: true,
            message: ` - Must be in the range ${min}-${max}`,
        };
    }
};

const regex = rx => val => {
    if (!rx.test(val)) {
        return {
            error: true,
            message: ` - Must match the regular expression: ${rx.toString()}`,
        };
    }
};

exports.validateArgs = (commander, validationRules) => {
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

exports.Validators = { equals, inRange, oneOf, regex };
