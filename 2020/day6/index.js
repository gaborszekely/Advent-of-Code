// https://adventofcode.com/2020/day/6

const { getInput, sumArray, findOverlappingValues } = require('../../utils');

const input = getInput(__dirname);

const groups = input
    .split('\n\n')
    .map(group => group.split('\n').map(questionIds => questionIds.split('')));

const findTotalMatches = matcher => sumArray(groups.map(matcher));

// PART ONE

const matchAtLeastOneMember = group => {
    // Affirmatively answered question IDs.
    const affirmatives = new Set();

    for (const member of group) {
        for (const questionId of member) {
            affirmatives.add(questionId);
        }
    }

    return affirmatives.size;
};

exports.partOne = findTotalMatches(matchAtLeastOneMember);

// PART TWO

const matchAllGroupMembers = group => findOverlappingValues(...group).length;

exports.partTwo = findTotalMatches(matchAllGroupMembers);
