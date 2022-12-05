import * as console from 'console';

export const assert = <T>(actual: T, expected: T) => {
    if (actual !== expected) {
        console.error(`Actual value did not match extected value!`);
        console.log('Actual: ', actual);
        console.log('Expected: ', expected);
    }
};

export const reverse = (str: string) => str.split('').reverse().join('');
