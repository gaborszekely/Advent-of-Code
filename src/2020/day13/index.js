// https://adventofcode.com/2020/day/13

const { getInput, getTestInput } = require('../../utils');

const crt = require('nodejs-chinese-remainder');
const bignum = require('bignum');

const i = getInput(__dirname);
const _i = getTestInput(__dirname);

const parseInput = input => {
    const [departure, busIds] = input.split('\n');

    return {
        departure: Number(departure),
        busIds: busIds
            .split(',')
            .reduce(
                (acc, id, i) => (id === 'x' ? acc : [...acc, [Number(id), i]]),
                []
            ),
    };
};

export function partOne() {
    const { departure, busIds } = parseInput(i);

    let closest = Infinity;
    let cId;

    for (const [busId] of busIds) {
        let incr = busId;

        while (incr < departure) {
            incr += busId;
        }

        if (incr < closest) {
            closest = incr;
            cId = busId;
        }
    }

    return (closest - departure) * cId;
}

export function partTwo() {
    const { busIds } = parseInput(_i);

    let incr = 1;
    let timestamp = 0;

    for (const [busId, offset] of busIds) {
        while (true) {
            timestamp += incr;

            if ((timestamp + offset) % busId === 0) {
                incr = incr * busId;
                break;
            }
        }
    }

    return timestamp;
}

exports.partTwoSimplified = () => {
    const { busIds } = parseInput(_i);

    return crt(
        ...busIds.reduce(
            ([remainders, mods], [busId, offset]) => [
                [...remainders, bignum(busId - offset)],
                [...mods, bignum(busId)],
            ],
            [[], []]
        )
    ).toString();
};
