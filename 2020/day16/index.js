// https://adventofcode.com/2020/day/16

const {
    getInput,
    getTestInput,
    sumArray,
    inRange,
} = require('../../utils');

const i = getInput(__dirname);
const _i = getTestInput(__dirname);

const parseInput = input => {
    let [rules, myTicket, nearbyTickets] = input.split('\n\n');

    myTicket = myTicket
        .replace('your ticket:', '')
        .trim()
        .split(',')
        .map(Number);

    nearbyTickets = nearbyTickets
        .replace('nearby tickets:', '')
        .trim()
        .split('\n')
        .map(ticket => ticket.split(',').map(Number));

    rules = rules.split('\n').reduce((acc, rule) => {
        let [name, ranges] = rule.split(': ');

        ranges = ranges
            .split(' or ')
            .map(range => range.split('-').map(Number));

        acc[name] = ranges;

        return acc;
    }, {});

    return {
        myTicket,
        nearbyTickets,
        rules,
    };
};

/** Checks if a number matches a set of ranges. */
const matchesRange = (ranges, number) => {
    return ranges.some(([min, max]) => inRange(min, max)(number));
};

/** Checks if a number does not match any of the set of ranges. */
const validNumber = (number, rules) =>
    Object.values(rules).some(ranges => matchesRange(ranges, number));

/**
 * Checks if a ticket is invalid, i.e. if one of it's numbers does not match
 * any of the ranges.
 */
const invalidTicket = (ticket, rules) =>
    ticket.some(number => !validNumber(number, rules));

exports.partOne = () => {
    const { nearbyTickets, rules } = parseInput(i);

    const invalidTickets = nearbyTickets.filter(ticket =>
        invalidTicket(ticket, rules)
    );

    return sumArray(
        invalidTickets.flatMap(ticket =>
            ticket.filter(number => !validNumber(number, rules))
        )
    );
};

exports.partTwo = () => {
    /**
     * Calculates the only possible mapping of rules to ticket indexes that
     * match each rule's ranges.
     */
    const getRuleIndexes = (possibles, map = new Map(), startI = 0) => {
        for (let i = startI; i < possibles.length; ++i) {
            const [rule, possibleColumns] = possibles[i];

            for (const column of possibleColumns) {
                if (!map.has(column)) {
                    map.set(column, rule);

                    getRuleIndexes(possibles, map);

                    if (map.size === possibles.length) return map;
                    map.delete(column);
                }
            }
        }
    };

    /** Finds all ticket indexes that match each rule's ranges. */
    const getPossibleRuleIndexes = (rules, validTickets) => {
        const possibles = {};

        for (const [rule, ranges] of Object.entries(rules)) {
            possibles[rule] = [];

            for (let i = 0; i < validTickets[0].length; ++i) {
                const allMatching = validTickets.every(ticket =>
                    matchesRange(ranges, ticket[i])
                );

                if (allMatching) {
                    possibles[rule].push(i);
                }
            }
        }

        return Object.entries(possibles).sort(
            (a, b) => a[1].length - b[1].length
        );
    };

    const { myTicket, nearbyTickets, rules } = parseInput(i);

    const validTickets = nearbyTickets.filter(
        ticket => !invalidTicket(ticket, rules)
    );

    const possibleRuleIndexes = getPossibleRuleIndexes(rules, validTickets);
    const ruleIndexes = getRuleIndexes(possibleRuleIndexes);

    for (const [index, rule] of ruleIndexes.entries()) {
        if (!rule.startsWith('departure')) {
            ruleIndexes.delete(index);
        }
    }

    return myTicket
        .filter((_, i) => ruleIndexes.has(i))
        .reduce((acc, value) => acc * value, 1);
};
