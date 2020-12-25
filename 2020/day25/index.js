// https://adventofcode.com/2020/day/N

const { getInput } = require('../../utils');

const input = getInput(__dirname);

const parseInput = rawInput => {
    return rawInput.split('\n').map(Number);
};

const DIVISOR = 20201227;

const transform = (curr, subjectNumber) => {
    const intermediate = curr * subjectNumber;

    return intermediate % DIVISOR;
};

const calculateLoopSize = encryptionKey => {
    let i = 0;
    let curr = 1;

    while (curr !== encryptionKey) {
        curr = transform(curr, 7);
        i++;
    }

    return i;
};

const calculateEncryptionKey = (subjectNumber, loopSize) => {
    let v = 1;

    for (let i = 0; i < loopSize; ++i) {
        v = transform(v, subjectNumber);
    }

    return v;
};

exports.partOne = () => {
    const [roomKey, doorKey] = parseInput(input);

    const roomLoopsize = calculateLoopSize(roomKey);

    return calculateEncryptionKey(doorKey, roomLoopsize);
};

exports.partTwo = () => {
    return 'CHALLENGE COMPLETE! WOO HOO';
};
