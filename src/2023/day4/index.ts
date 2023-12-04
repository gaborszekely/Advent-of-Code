// https://adventofcode.com/2023/day/4

import { getInput } from '@utils/fs';
import { sum } from 'lodash';

const input = getInput(__dirname);

const matchesByCard = input.split('\n').map(card => {
    const [winningNums, assignedNums] = (
        card.match(/Card\s+\d+\:([\d\s]+)\|([\d\s]+)/) || []
    )
        .slice(1)
        .map(nums => nums.trim().split(/\s+/).map(Number));

    return assignedNums.filter(num => winningNums.includes(num)).length;
});

export function partOne() {
    const pointsByCard = matchesByCard.map(matches =>
        matches === 0 ? 0 : 2 ** (matches - 1)
    );

    return sum(pointsByCard);
}

export function partTwo() {
    const copiesByCard = Array(matchesByCard.length).fill(1);

    matchesByCard.forEach((matches, i) => {
        for (let j = 1; j <= matches; ++j) {
            copiesByCard[i + j] += copiesByCard[i];
        }
    });

    return sum(copiesByCard);
}
