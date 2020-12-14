// https://adventofcode.com/2020/day/14

const { getInput, getTestInput, sumArray } = require('../../utils');

const i = getInput(__dirname);
const _i = getTestInput(__dirname);

const parseInput = input => {
    return input.split('\n').reduce((acc, instruction) => {
        if (instruction.startsWith('mask')) {
            acc.push({
                mask: instruction.replace(/mask = /, ''),
                changes: [],
            });
        } else {
            const [, address, update] = instruction.match(
                /mem\[(\d+)\] = ([\d\w]+)/
            );
            acc[acc.length - 1].changes.push([Number(address), Number(update)]);
        }

        return acc;
    }, []);
};

const findFloatingCombos = (value, idx = 0) => {
    while (value[idx] && value[idx] !== 'X') {
        idx++;
    }

    if (idx === value.length) return [value];

    let newStr1 = value.slice(0, idx) + '0' + value.slice(idx + 1);
    let newStr2 = value.slice(0, idx) + '1' + value.slice(idx + 1);

    return [
        ...findFloatingCombos(newStr1, idx + 1),
        ...findFloatingCombos(newStr2, idx + 1),
    ];
};

const applyMask = (mask, value, updaterFn) => {
    const binary = value.toString(2).padStart(36, '0');

    let result = '';

    for (let i = 0; i < binary.length; ++i) {
        const maskChar = mask[i];
        const valChar = binary[i];

        result += updaterFn(maskChar, valChar);
    }

    return result;
};

const sumMemoryValues = (input, buildMemory) => {
    const operations = parseInput(input);
    const memory = buildMemory(operations);

    return sumArray(Object.values(memory));
};

exports.partOne = () => {
    const populateMemoryFn = operations => {
        const memory = {};

        const bitUpdaterFn = (maskChar, valChar) =>
            maskChar === 'X' ? valChar : maskChar;

        for (const { mask, changes } of operations) {
            for (const [address, update] of changes) {
                const masked = applyMask(mask, update, bitUpdaterFn);
                memory[address] = parseInt(masked, 2);
            }
        }

        return memory;
    };

    return sumMemoryValues(i, populateMemoryFn);
};

exports.partTwo = () => {
    const populateMemoryFn = operations => {
        const memory = {};

        const bitUpdaterFn = (maskChar, valChar) =>
            maskChar === '0' ? valChar : maskChar === '1' ? maskChar : 'X';

        for (const { mask, changes } of operations) {
            for (const [address, update] of changes) {
                const masked = applyMask(mask, address, bitUpdaterFn);
                const addresses = findFloatingCombos(masked);

                for (const a of addresses) {
                    memory[a] = update;
                }
            }
        }

        return memory;
    };

    return sumMemoryValues(i, populateMemoryFn);
};
