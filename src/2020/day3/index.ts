// https://adventofcode.com/2020/day/3

import { getInput } from '@utils/fs';

const input = getInput(__dirname);

const grid = input.split('\n').map(row => [...row]);

const traversePath = (right: number, down: number) => {
    let [i, j, totalTrees] = [0, 0, 0];

    while (i < grid.length) {
        j = j % grid[0].length;

        let current = grid[i][j];

        if (current === '#') {
            totalTrees++;
        }

        i += down;
        j += right;
    }

    return totalTrees;
};

const traversePaths = (paths: number[][]) =>
    paths.reduce((acc, [right, down]) => acc * traversePath(right, down), 1);

exports.partOne = () => traversePath(/*right=*/ 3, /*down=*/ 1);

exports.partTwo = () =>
    traversePaths([
        [3, 1],
        [1, 1],
        [5, 1],
        [7, 1],
        [1, 2],
    ]);
