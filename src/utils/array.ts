/** Finds the number of array elements matching a predicate function. */
export const numMatches = <T>(list: T[], predicate: (val: T) => boolean) =>
    list.filter(predicate).length;

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
        this.generatePrefixes();
    }

    getSum(i: number, j: number) {
        if (i < 0 || j >= this.input.length) {
            throw new Error(
                'Please pass a valid range to calculate prefix sum'
            );
        }

        return this.prefixes[j] - (this.prefixes[i - 1] || 0);
    }

    private generatePrefixes() {
        this.prefixes = [this.input[0]];
        for (let i = 1; i < this.input.length; ++i) {
            this.prefixes[i] = this.prefixes[i - 1] + this.input[i];
        }
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
