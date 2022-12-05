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
