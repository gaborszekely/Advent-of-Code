/** Finds the great common denominator of two numbers. */
export function gcd(x: number, y: number) {
    x = Math.abs(x);
    y = Math.abs(y);
    while (y) {
        var t = y;
        y = x % y;
        x = t;
    }
    return x;
}

/** Finds the least common multiple of a set of numbers. */
export function lcm(nums: number[]) {
    let res = nums[0];

    for (let i = 1; i < nums.length; ++i) {
        res =
            !res || !nums[i]
                ? 0
                : Math.abs((res * nums[i]) / gcd(res, nums[i]));
    }

    return res;
}
