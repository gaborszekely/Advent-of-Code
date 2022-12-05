// https://adventofcode.com/2020/day/N

import { getInput } from '@utils/fs';

const input = getInput(__dirname);

const parseInput = (rawInput: string) => {
    return rawInput.split('\n').map(Number);
};

const DIVISOR = 20201227;

const transform = (curr: number, subjectNumber: number) => {
    const intermediate = curr * subjectNumber;

    return intermediate % DIVISOR;
};

const calculateLoopSize = (encryptionKey: number) => {
    let i = 0;
    let curr = 1;

    while (curr !== encryptionKey) {
        curr = transform(curr, 7);
        i++;
    }

    return i;
};

const calculateEncryptionKey = (subjectNumber: number, loopSize: number) => {
    let v = 1;

    for (let i = 0; i < loopSize; ++i) {
        v = transform(v, subjectNumber);
    }

    return v;
};

export function partOne() {
    const [roomKey, doorKey] = parseInput(input);

    const roomLoopsize = calculateLoopSize(roomKey);

    return calculateEncryptionKey(doorKey, roomLoopsize);
}

export function partTwo() {
    return 'CHALLENGE COMPLETE! WOO HOO';
}
