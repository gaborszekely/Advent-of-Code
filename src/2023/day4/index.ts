// https://adventofcode.com/2023/day/4

import { getInput } from '@utils/fs';
import { sum } from 'lodash';

const input = getInput(__dirname);

const matchesByRow = input.split('\n').map(row => {
    const [winningNums, myNums] = (
        row.match(/Card\s+\d+\:([\d\s]+)\|([\d\s]+)/) || []
    )
        .slice(1)
        .map(nums =>
            nums.trim().replaceAll(/\s+/g, ' ').split(' ').map(Number)
        );

    return myNums.filter(num => winningNums.includes(num)).length;
});

export function partOne() {
    return sum(
        matchesByRow.map(matches => (matches === 0 ? 0 : 2 ** (matches - 1)))
    );
}

export function partTwo() {
    const copiesByRow = Array(matchesByRow.length).fill(1);

    for (let i = 0; i < matchesByRow.length; ++i) {
        for (let j = 1; j <= matchesByRow[i]; ++j) {
            copiesByRow[i + j] += copiesByRow[i];
        }
    }

    return sum(copiesByRow);
}
