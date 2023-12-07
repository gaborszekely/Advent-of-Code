// https://adventofcode.com/2023/day/6

import { getInput } from '@utils/fs';

const input = getInput(__dirname);

export function partOne() {
    const [times, records] = (
        input.match(/Time:\s+([\d\s]+)\nDistance:\s+([\d\s]+)/) || []
    )
        .slice(1)
        .map(nums => nums.trim().split(/\s+/).map(Number));

    let result = 1;
    let matches = 0;

    for (let i = 0; i < times.length; ++i) {
        const total = findTotalRecordBreaks(times[i], records[i]);
        matches = total > 0 ? matches + 1 : matches;
        result *= total;
    }

    return matches === 0 ? 0 : result;
}

export function partTwo() {
    const [time, record] = (
        input.match(/Time:\s+([\d\s]+)\nDistance:\s+([\d\s]+)/) || []
    )
        .slice(1)
        .map(nums => Number(nums.replaceAll(/\s+/g, '')));

    return findTotalRecordBreaks(time, record);
}

function findTotalRecordBreaks(time: number, record: number) {
    let total = 0;
    for (let j = 1; j <= time; ++j) {
        const distance = (time - j) * j;
        if (distance > record) {
            total++;
        }
    }

    return total;
}
