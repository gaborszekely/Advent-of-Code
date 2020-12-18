// https://adventofcode.com/2020/day/N

const { getInput, getTestInput } = require('../../utils');

const i = getInput(__dirname);
const _i = getTestInput(__dirname);

const parseInput = input => input.split('\n');

const evaluate = (expression, processFn) => {
    const stack = [[]];

    for (const char of expression) {
        if (char === ' ') continue;

        if (/\d+/.test(char)) {
            stack[stack.length - 1].push(Number(char));
        }

        if (['+', '-', '*'].includes(char)) {
            stack[stack.length - 1].push(char);
        }

        if (char === '(') {
            stack.push([]);
        }

        if (char === ')') {
            const currentExpression = stack.pop();
            const total = processFn(currentExpression);
            stack[stack.length - 1].push(total);
        }
    }

    return processFn(stack[0]);
};

exports.partOne = () => {
    const processSimple = expression => {
        let total = 0;
        let operator = '+';

        for (const value of expression) {
            if (typeof value === 'number') {
                if (operator === '*') total *= value;
                if (operator === '+') total += value;
            } else {
                operator = value;
            }
        }

        return total;
    };

    const input = parseInput(i);

    return input.reduce(
        (acc, expression) => acc + evaluate(expression, processSimple),
        0
    );
};

exports.partTwo = () => {
    const processAdvanced = expression => {
        let expressionStr = expression.join('');

        // First, do all the additions.
        expressionStr = expressionStr.replace(/[\d\+]+/g, match => {
            return match
                .trim()
                .split('+')
                .reduce((acc, i) => acc + Number(i), 0);
        });

        // Then, do all the multiplications.
        expressionStr = expressionStr.replace(/[\d\*]+/g, match => {
            return match
                .trim()
                .split('*')
                .reduce((acc, i) => acc * Number(i), 1);
        });

        return Number(expressionStr);
    };

    const input = parseInput(i);

    return input.reduce(
        (acc, expression) => acc + evaluate(expression, processAdvanced),
        0
    );
};
