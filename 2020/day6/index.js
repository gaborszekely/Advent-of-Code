// https://adventofcode.com/2020/day/6

const { getInput, sumArray, findOverlappingValues } = require('../../utils');

const input = getInput(__dirname);

const groups = input
    .split('\n\n')
    .map(group =>
        group.split('\n').map(memberAnswers => memberAnswers.split(''))
    );

const findTotalMatches = matcher => sumArray(groups.map(matcher));

// PART ONE

const questionsWithAtLeastOneAnswer = group => {
    // Affirmatively answered question IDs.
    const answered = new Set();

    for (const memberAnswers of group) {
        for (const questionId of memberAnswers) {
            answered.add(questionId);
        }
    }

    return answered.size;
};

exports.partOne = findTotalMatches(questionsWithAtLeastOneAnswer);

// PART TWO

const questionsWithAllAnswers = group => findOverlappingValues(...group).length;

exports.partTwo = findTotalMatches(questionsWithAllAnswers);
