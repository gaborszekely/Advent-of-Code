import { assert } from 'console';

/** Finds the number of array elements matching a predicate function. */
export const numMatches = <T>(list: T[], predicate: (val: T) => boolean) =>
    list.filter(predicate).length;

/** Sums the values of an array. */
export const sumArray = (ary: number[]) => {
    assert(Array.isArray(ary), 'Please pass a valid array to sumArray()');

    return ary.reduce((acc, val) => acc + val);
};

/**
 * Finds the overlapping values between two or more arrays.
 *
 * i.e., for [1,2,3] and [2,3,4,5], the values [2,3] are present in both arrays.
 */
export const findIntersection = <T>(...arys: T[][]) => {
    return arys.reduce((acc, ary) => {
        const aryVals = new Set(ary);

        return acc.filter(val => aryVals.has(val));
    });
};

/** Finds all unique values in a list of arrays. */
export const findUniqueValues = <T>(...arys: T[][]) => [
    ...new Set(arys.flat()),
];

/** Finds two numbers that add up to a target. */
export const twoSum = (
    nums: number[],
    target: number,
    start = 0,
    end = nums.length
) => {
    const visited = new Set();

    for (let i = start; i < end; ++i) {
        const num = nums[i];
        const remaining = target - num;

        if (visited.has(remaining)) {
            return [remaining, num];
        }

        visited.add(num);
    }

    return null;
};

/** Finds two numbers in a sorted list that add up to a target. */
export const twoSumSorted = (nums: number[], target: number) => {
    let i = 0;
    let j = nums.length;

    while (i < j) {
        const [low, high] = [nums[i], nums[j]];
        const sum = low + high;

        if (sum === target) {
            return [low, high];
        }

        if (sum < target) {
            i++;
        } else {
            j--;
        }
    }

    return null;
};

/** Prefix sum data structure.  */
export class PrefixSum {
    private prefixes: number[];

    constructor(private readonly input: number[]) {
        this.prefixes = [input[0]];
        this.generatePrefixes();
    }

    private generatePrefixes() {
        for (let i = 1; i < this.input.length; ++i) {
            this.prefixes[i] = this.prefixes[i - 1] + this.input[i];
        }
    }

    getSum(i: number, j: number) {
        if (i < 0 || j >= this.input.length) {
            throw new Error(
                'Please pass a valid range to calculate prefix sum'
            );
        }

        return this.prefixes[j] - (this.prefixes[i - 1] || 0);
    }
}

/** Returns the [minimum, maximum] values of an array. */
export const findMinMax = (ary: number[], start = 0, end = ary.length - 1) => {
    let min = Infinity;
    let max = -Infinity;

    for (let i = start; i <= end; ++i) {
        min = Math.min(min, ary[i]);
        max = Math.max(max, ary[i]);
    }

    return [min, max];
};

export const first = <T>(ary: T[]) => ary[0];

export const last = <T>(ary: T[]) => ary[ary.length - 1];

export function batchArray<T>(array: T[], n: number) {
    return array.reduce((acc, val, i) => {
        if (i % n === 0) {
            acc.push([val]);
        } else {
            acc.at(-1).push(val);
        }
        return acc;
    }, [] as T[][]);
}
