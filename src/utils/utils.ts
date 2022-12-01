import * as console from 'console';

export const range = (i: number, j: number, inclusive = true) =>
    i <= j
        ? Array.from({ length: j - i + +inclusive }, (_, idx) => i + idx)
        : Array.from({ length: i - j + +inclusive }, (_, idx) => i - idx);

console.assert(range(1, 3).join('') === '123', 'range(1, 3) incorrect');
console.assert(range(3, 1).join('') === '321', 'range(3, 1) incorrect');

/** Checks whether a value is included in a range (inclusive). */
export const inRange = (min: number, max: number) => (v: number) =>
    v >= min && v <= max;

export const assert = <T>(actual: T, expected: T) => {
    if (actual !== expected) {
        console.error(`Actual value did not match extected value!`);
        console.log('Actual: ', actual);
        console.log('Expected: ', expected);
    }
};

export const reverse = (str: string) => str.split('').reverse().join('');
