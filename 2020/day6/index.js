// https://adventofcode.com/2020/day/6

const { getInput, sumArray } = require('../../utils');

const input = getInput(__dirname);

const groups = input.split('\n\n').map(group => group.split('\n'));

const findTotalMatches = matcher => sumArray(groups.map(matcher));

// PART ONE

const matchAtLeastOneMember = group =>
    group.reduce((acc, member) => {
        for (const questionId of member) {
            acc.add(questionId);
        }

        return acc;
    }, new Set()).size;

exports.partOne = findTotalMatches(matchAtLeastOneMember);

// PART TWO

const matchAllGroupMembers = group =>
    Object.values(
        group.reduce((acc, member) => {
            for (const questionId of member) {
                acc[questionId] = (acc[questionId] || 0) + 1;
            }

            return acc;
        }, {})
    ).filter(occurrences => occurrences === group.length).length;

exports.partTwo = findTotalMatches(matchAllGroupMembers);
