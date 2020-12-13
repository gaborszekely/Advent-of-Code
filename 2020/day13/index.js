// https://adventofcode.com/2020/day/13

const { getInput, getTestInput } = require('../../utils');

const crt = require('nodejs-chinese-remainder');
const bignum = require('bignum');

const i = getInput(__dirname);
const _i = getTestInput(__dirname);

const parseInput = input => {
    const [departureStamp, busIds] = input.split('\n');

    return {
        departureStamp: Number(departureStamp),
        busIds: busIds
            .split(',')
            .reduce(
                (acc, id, i) => (id === 'x' ? acc : [...acc, [Number(id), i]]),
                []
            ),
    };
};

exports.partOne = () => {
    const { departureStamp, busIds } = parseInput(i);

    let closest = Infinity;
    let cId;

    for (const [busId] of busIds) {
        let incr = busId;

        while (incr < departureStamp) {
            incr += busId;
        }

        if (incr < closest) {
            closest = incr;
            cId = busId;
        }
    }

    return (closest - departureStamp) * cId;
};

exports.partTwo = () => {
    const { busIds } = parseInput(i);

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
