// https://adventofcode.com/2020/day/14

const { getInput, getTestInput } = require('../../utils');

const i = getInput(__dirname);
const _i = getTestInput(__dirname);

const parseInput = input => {
    const operations = [];

    const instructions = input.split('\n');

    for (let i = 0; i < instructions.length; ++i) {
        const current = instructions[i];

        if (current.startsWith('mask')) {
            operations.push({
                mask: current.replace(/mask = /, ''),
                changes: [],
            });
        } else {
            const [, address, update] = current.match(
                /mem\[(\d+)\] = ([\d\w]+)/
            );
            operations[operations.length - 1].changes.push([
                Number(address),
                Number(update),
            ]);
        }
    }

    return operations;
};

const findFloatingCombos = (floating, result, idx = 0) => {
    const index = floating[idx];

    let newStr1 = result.slice(0, index) + '0' + result.slice(index + 1);
    let newStr2 = result.slice(0, index) + '1' + result.slice(index + 1);

    if (idx === floating.length) {
        return [result];
    }

    if (idx < floating.length) {
        return [
            ...findFloatingCombos(floating, newStr1, idx + 1),
            ...findFloatingCombos(floating, newStr2, idx + 1),
        ];
    }
};

const applyMask = (mask, value, updaterFn, floating = false) => {
    let binary = value.toString(2);

    binary = binary.padStart(36, '0');

    let result = '';

    for (let i = 0; i < binary.length; ++i) {
        const maskChar = mask[i];
        const valChar = binary[i];

        result += updaterFn(maskChar, valChar);
    }

    return floating ? findFloatingCombos(result) : result;
};

const applyFloatingMask = (mask, value, updaterFn) =>
    applyMask(mask, value, updaterFn, true);

const sumMemoryValues = (input, buildMemory) => {
    const operations = parseInput(input);
    const memory = buildMemory(operations);

    return Object.values(memory).reduce((acc, i) => acc + i, 0);
};

exports.partOne = () => {
    const buildMemory = operations => {
        const memory = {};

        for (const { mask, changes } of operations) {
            for (const [address, update] of changes) {
                const result = applyMask(mask, update, (maskChar, valChar) => {
                    if (maskChar === 'X') return valChar;
                    return maskChar;
                });

                memory[address] = parseInt(result[0], 2);
            }
        }

        return memory;
    };

    return sumMemoryValues(i, buildMemory);
};

exports.partTwo = () => {
    const buildMemory = operations => {
        const memory = {};

        for (const { mask, changes } of operations) {
            for (const [address, update] of changes) {
                const addresses = applyFloatingMask(
                    mask,
                    address,
                    (maskChar, valChar) =>
                        maskChar === '0'
                            ? valChar
                            : maskChar === '1'
                            ? maskChar
                            : 'X'
                );

                for (const a of addresses) {
                    memory[a] = update;
                }
            }
        }

        return memory;
    };

    return sumMemoryValues(i, buildMemory);
};
