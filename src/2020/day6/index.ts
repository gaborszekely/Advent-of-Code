// https://adventofcode.com/2020/day/6

import { getInput } from '@utils/fs';
import { intersection, sum, uniq } from 'lodash';

const input = getInput(__dirname);

const groups = input
    .split('\n\n')
    .map(group =>
        group.split('\n').map(memberAnswers => memberAnswers.split(''))
    );

const findTotalMatches = (mapper: (group: string[][]) => number) =>
    sum(groups.map(mapper));

// PART ONE

const questionsWithAtLeastOneAnswer = (group: string[][]) =>
    uniq(group.flat()).length;

exports.partOne = () => findTotalMatches(questionsWithAtLeastOneAnswer);

// PART TWO

const questionsWithAllAnswers = (group: string[][]) =>
    intersection(...group).length;

exports.partTwo = () => findTotalMatches(questionsWithAllAnswers);
