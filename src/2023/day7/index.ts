// https://adventofcode.com/2023/day/7

import { getInput } from '@utils/fs';

const input = getInput(__dirname);

const getData = () =>
    input.split('\n').map(row => {
        const [hand, wager] = row.split(' ');
        return [hand.split(''), Number(wager)] as const;
    });

const HAND_RANKINGS = [
    'FIVE_OF_A_KIND',
    'FOUR_OF_A_KIND',
    'FULL_HOUSE',
    'THREE_OF_A_KIND',
    'TWO_PAIR',
    'ONE_PAIR',
    'HIGH_CARD',
];

const isFiveOfAKind = (counts: Map<string, number>) => {
    return Array.from(counts.values()).some(count => count === 5);
};

const isFourOfAKind = (counts: Map<string, number>) => {
    return Array.from(counts.values()).some(count => count === 4);
};

const isFullHouse = (counts: Map<string, number>) => {
    const countsArr = Array.from(counts.values());

    return (
        counts.size === 2 &&
        countsArr.some(count => count === 3) &&
        countsArr.some(count => count === 2)
    );
};

const isThreeOfAKind = (counts: Map<string, number>) => {
    return (
        Array.from(counts.values()).some(count => count === 3) &&
        !isFullHouse(counts)
    );
};

const isTwoPair = (counts: Map<string, number>) => {
    return (
        Array.from(counts.values()).filter(count => count === 2).length === 2
    );
};

const isOnePair = (counts: Map<string, number>) => {
    return (
        Array.from(counts.values()).filter(count => count === 2).length === 1
    );
};

const getCardCounts = (hand: string[]) => {
    return hand.reduce((acc, card) => {
        acc.set(card, (acc.get(card) || 0) + 1);
        return acc;
    }, new Map<string, number>());
};

const getHandType = (
    hand: string[],
    cardRankings: string[],
    hasWildcards: boolean
) => {
    const cardCounts = getCardCounts(hand);

    // Handle wildcards. If it should be applied, apply it towards the card with the highest count and highest card ranking.
    if (hasWildcards && cardCounts.has('J') && cardCounts.get('J') !== 5) {
        let wildcardCount = cardCounts.get('J');
        cardCounts.delete('J');
        const rankedCards = Array.from(cardCounts.entries()).sort(
            ([card1, count1], [card2, count2]) => {
                if (count1 > count2) {
                    return -1;
                }

                if (count1 < count2) {
                    return 1;
                }

                const card1Ranking = cardRankings.indexOf(card1);
                const card2Ranking = cardRankings.indexOf(card2);

                if (card1Ranking > card2Ranking) {
                    return -1;
                }

                if (card1Ranking < card2Ranking) {
                    return 1;
                }

                return 0;
            }
        );

        cardCounts.set(rankedCards[0][0], rankedCards[0][1] + wildcardCount);
    }

    return isFiveOfAKind(cardCounts)
        ? 'FIVE_OF_A_KIND'
        : isFourOfAKind(cardCounts)
          ? 'FOUR_OF_A_KIND'
          : isFullHouse(cardCounts)
            ? 'FULL_HOUSE'
            : isThreeOfAKind(cardCounts)
              ? 'THREE_OF_A_KIND'
              : isTwoPair(cardCounts)
                ? 'TWO_PAIR'
                : isOnePair(cardCounts)
                  ? 'ONE_PAIR'
                  : 'HIGH_CARD';
};

const rankHands = (
    hand1: string[],
    hand2: string[],
    cardRankings: string[],
    hasWildcards: boolean
) => {
    const hand1Type = getHandType(hand1, cardRankings, hasWildcards);
    const hand2Type = getHandType(hand2, cardRankings, hasWildcards);
    const hand1Ranking = HAND_RANKINGS.indexOf(hand1Type);
    const hand2Ranking = HAND_RANKINGS.indexOf(hand2Type);

    if (hand1Ranking > hand2Ranking) {
        return -1;
    } else if (hand1Ranking < hand2Ranking) {
        return 1;
    } else {
        // Hand rankings are the same. In this case, check which hand has the higher card come first.
        for (let i = 0; i < hand1.length; ++i) {
            const card1Ranking = cardRankings.indexOf(hand1[i]);
            const card2Ranking = cardRankings.indexOf(hand2[i]);

            if (card1Ranking > card2Ranking) {
                return -1;
            } else if (card1Ranking < card2Ranking) {
                return 1;
            }
        }

        return 0;
    }
};

const getTotalWinnings = (
    data: (readonly [string[], number])[],
    cardRankings: string[],
    hasWildcards: boolean
) => {
    const ranked = data.sort(([hand1], [hand2]) =>
        rankHands(hand1, hand2, cardRankings, hasWildcards)
    );

    return ranked.reduce((acc, [, wager], i) => {
        return acc + wager * (i + 1);
    }, 0);
};

export function partOne() {
    const data = getData();

    const cardRankings = [
        'A',
        'K',
        'Q',
        'J',
        'T',
        '9',
        '8',
        '7',
        '6',
        '5',
        '4',
        '3',
        '2',
    ];

    return getTotalWinnings(data, cardRankings, false);
}

export function partTwo() {
    const data = getData();

    const cardRankings = [
        'A',
        'K',
        'Q',
        'T',
        '9',
        '8',
        '7',
        '6',
        '5',
        '4',
        '3',
        '2',
        'J',
    ];

    return getTotalWinnings(data, cardRankings, true);
}
