/**
 * Takes two ranges as an input, and determines whether one range fully overlaps the other.
 *
 * i.e.,
 *      ---
 *     ------
 */
export function contains([start1, end1]: number[], [start2, end2]: number[]) {
    return (
        (start1 <= start2 && end1 >= end2) || (start2 <= start1 && end2 >= end1)
    );
}

/**
 * Takes two ranges as an input, and determines whether one range overlaps the other.
 *
 * i.e,
 *    ----
 *   ---
 */
export function overlaps([start1, end1]: number[], [start2, end2]: number[]) {
    return Math.max(start1, start2) <= Math.min(end1, end2);
}

/** Merges a range of intervals. */
export function mergeIntervals(intervals: number[][]) {
    if (!intervals.length) return [];
    if (intervals.length === 1) return intervals;

    intervals.sort((a, b) => a[0] - b[0]);
    const result = [intervals[0]];

    for (let i = 1; i < intervals.length; i++) {
        const current = result[result.length - 1];
        const next = intervals[i];

        if (current[1] >= next[0] - 1) {
            const newInterval = [current[0], Math.max(current[1], next[1])];
            result[result.length - 1] = newInterval;
        } else {
            result.push(next);
        }
    }
    return result;
}
