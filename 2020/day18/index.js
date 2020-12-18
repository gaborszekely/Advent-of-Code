// https://adventofcode.com/2020/day/18

const { getInput, getTestInput } = require('../../utils');

const i = getInput(__dirname);
const _i = getTestInput(__dirname);

const parseInput = input => input.split('\n');

const evaluate = (expression, evaluatorFn) => {
    const stack = [[]];

    for (const char of expression) {
        if (char === ' ') continue;

        if (/\d/.test(char)) {
            stack[stack.length - 1].push(Number(char));
        }

        if (['+', '*'].includes(char)) {
            stack[stack.length - 1].push(char);
        }

        if (char === '(') {
            stack.push([]);
        }

        if (char === ')') {
            const latestEvaluation = evaluatorFn(stack.pop());
            stack[stack.length - 1].push(latestEvaluation);
        }
    }

    return evaluatorFn(stack[0]);
};

const sumEvaluations = (input, evaluator) =>
    input.reduce((acc, expression) => acc + evaluate(expression, evaluator), 0);

exports.partOne = () => {
    const evaluator = expression => {
        let total = 0;
        let operator = '+';

        for (const value of expression) {
            if (typeof value === 'number') {
                if (operator === '*') total *= value;
                if (operator === '+') total += value;
                continue;
            }

            operator = value;
        }

        return total;
    };

    const input = parseInput(i);

    return sumEvaluations(input, evaluator);
};

exports.partTwo = () => {
    const advancedEvaluator = expression => {
        let expressionStr = expression.join('');

        // First, do all the additions.
        expressionStr = expressionStr.replace(/[\d\+]+/g, match => {
            return match.split('+').reduce((acc, i) => acc + Number(i), 0);
        });

        // Then, do all the multiplications.
        expressionStr = expressionStr.replace(/[\d\*]+/g, match => {
            return match.split('*').reduce((acc, i) => acc * Number(i), 1);
        });

        return Number(expressionStr);
    };

    const input = parseInput(i);

    return sumEvaluations(input, advancedEvaluator);
};
