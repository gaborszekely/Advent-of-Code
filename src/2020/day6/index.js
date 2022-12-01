// https://adventofcode.com/2020/day/6

const {
    getInput,
    sumArray,
    findIntersection,
    findUniqueValues,
} = require('../../utils');

const input = getInput(__dirname);

const groups = input
    .split('\n\n')
    .map(group =>
        group.split('\n').map(memberAnswers => memberAnswers.split(''))
    );

const findTotalMatches = mapper => sumArray(groups.map(mapper));

// PART ONE

const questionsWithAtLeastOneAnswer = group =>
    findUniqueValues(...group).length;

exports.partOne = () => findTotalMatches(questionsWithAtLeastOneAnswer);

// PART TWO

const questionsWithAllAnswers = group => findIntersection(...group).length;

exports.partTwo = () => findTotalMatches(questionsWithAllAnswers);
