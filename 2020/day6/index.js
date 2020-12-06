// https://adventofcode.com/2020/day/6

const { getInput, sumArray } = require('../../utils');

const input = getInput(__dirname);

const groups = input.split('\n\n').map(group => group.split('\n'));

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

const matchAllGroupMembers = group => {
    const affirmativeCounts = {};
    let totalMatches = 0;

    for (const member of group) {
        for (const questionId of member) {
            affirmativeCounts[questionId] =
                (affirmativeCounts[questionId] || 0) + 1;

            // All members answered question affirmatively.
            if (affirmativeCounts[questionId] === group.length) {
                totalMatches++;
            }
        }
    }

    return totalMatches;
};

exports.partTwo = findTotalMatches(matchAllGroupMembers);
