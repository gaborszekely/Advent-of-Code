// https://adventofcode.com/2020/day/21

import { getInput } from '@utils/fs';

const i = getInput(__dirname);

interface Row {
    ingredients: Set<string>;
    allergens: Set<string>;
}

const parseInput = (input: string) => {
    return input.split('\n').reduce((acc, line) => {
        const ingredients = new Set(line.split('(')[0].trim().split(' '));
        let [, allergens] = line.match(/\(contains ([\w\s\,]+)\)/);

        acc.push({
            ingredients,
            allergens: new Set(allergens.split(', ')),
        });

        return acc;
    }, [] as Row[]);
};

const getAllIngredients = (input: Row[]) => {
    const allIngredients = new Set<string>();

    input.forEach(line => {
        line.ingredients.forEach(allergen => {
            allIngredients.add(allergen);
        });
    });

    return allIngredients;
};

const getResults = (input: Row[]) => {
    const possibiliities: { [key: string]: string[] } = {};

    for (const line of input) {
        const { allergens, ingredients } = line;

        for (const allergen of allergens) {
            if (!possibiliities[allergen]) {
                possibiliities[allergen] = [...ingredients];
            } else {
                possibiliities[allergen] = possibiliities[allergen].filter(
                    ingredient => ingredients.has(ingredient)
                );
            }
        }
    }

    while (
        Object.values(possibiliities).some(
            ingredients => ingredients.length > 1
        )
    ) {
        for (const allergen in possibiliities) {
            const current = possibiliities[allergen];

            if (current.length === 1) {
                const matchingIngredient = current[0];

                for (const key in possibiliities) {
                    if (key !== allergen) {
                        possibiliities[key] = possibiliities[key].filter(
                            ingredient => ingredient !== matchingIngredient
                        );
                    }
                }
            }
        }
    }

    const results: Record<string, string> = {};

    for (const allergen in possibiliities) {
        results[possibiliities[allergen][0]] = allergen;
    }

    return results;
};

export function partOne() {
    const input = parseInput(i);

    const allIngredients = getAllIngredients(input);
    const results = getResults(input);

    const noMatching = [];

    for (const ingredient of allIngredients) {
        if (!(ingredient in results)) {
            noMatching.push(ingredient);
        }
    }

    let totalOccurences = 0;

    for (const ingredient of noMatching) {
        for (const line of input) {
            if (line.ingredients.has(ingredient)) {
                totalOccurences++;
            }
        }
    }

    return totalOccurences;
}

export function partTwo() {
    const input = parseInput(i);

    const results = getResults(input);

    return Object.entries(results)
        .sort((a, b) => a[1][0].localeCompare(b[1][0]))
        .map(entry => entry[0])
        .join(',');
}
