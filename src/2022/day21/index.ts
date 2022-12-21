import { getInput } from '@utils/fs';

const input = getInput(__dirname);

interface Monkey {
    id: string;
    value?: number;
    humanAncestor?: boolean;
    operator?: string;
    dependencies?: string[];
}

type Monkies = Record<string, Monkey>;

const getMonkies = () =>
    input.split('\n').reduce((acc: Monkies, row) => {
        const [monkey, numberOrEquation] = row.split(': ');
        acc[monkey] ||= { id: monkey };
        const maybeNum = Number(numberOrEquation);

        // The monkey is an equation monkey.
        if (isNaN(maybeNum)) {
            acc[monkey].dependencies = numberOrEquation.split(/ [+-/*] /);
            const [operator] = numberOrEquation.match(/[+-/*]/);
            acc[monkey].operator = operator;
        } else {
            acc[monkey].value = maybeNum;
        }

        return acc;
    }, {});

const operate = (operator: string, val1: number, val2: number) => {
    switch (operator) {
        case '+':
            return val1 + val2;
        case '-':
            return val1 - val2;
        case '*':
            return val1 * val2;
        case '/':
            return val1 / val2;
    }
};

const resolveEquation = (monkey: Monkey, monkies: Monkies): number => {
    if (monkey.value) {
        return monkey.value;
    }

    const [dep1, dep2] = monkey.dependencies!.map(dep => monkies[dep]);

    monkey.value = operate(
        monkey.operator,
        resolveEquation(dep1, monkies),
        resolveEquation(dep2, monkies)
    );

    return monkey.value;
};

export function partOne() {
    const monkies = getMonkies();

    return resolveEquation(monkies.root, monkies);
}

const HUMAN = 'humn';

const markHumanAncestors = (node: Monkey, monkies: Monkies): boolean => {
    if (node.id === HUMAN) {
        node.humanAncestor = true;
    } else if (!node.dependencies) {
        node.humanAncestor = false;
    } else {
        node.humanAncestor = node.dependencies.some(dependency =>
            markHumanAncestors(monkies[dependency], monkies)
        );
    }

    return node.humanAncestor;
};

const findMissingNumber = (
    monkey: Monkey,
    monkies: Monkies,
    currentTarget?: number
): number => {
    const [dep1, dep2] = monkey.dependencies.map(dep => monkies[dep]);

    if (dep1.humanAncestor) {
        const dep2Total = resolveEquation(dep2, monkies);

        let newTarget: number;

        switch (monkey.operator) {
            case '+':
                newTarget = currentTarget - dep2Total;
                break;
            case '-':
                newTarget = currentTarget + dep2Total;
                break;
            case '*':
                newTarget = currentTarget / dep2Total;
                break;
            case '/':
                newTarget = currentTarget * dep2Total;
                break;
            case '==':
                newTarget = dep2Total;
        }

        return dep1.id === HUMAN
            ? newTarget
            : findMissingNumber(dep1, monkies, newTarget);
    }

    // Dep 2 is the human ancestor.
    const dep1Total = resolveEquation(dep1, monkies);

    let newTarget: number;

    switch (monkey.operator) {
        case '+':
            newTarget = currentTarget - dep1Total;
            break;
        case '-':
            newTarget = dep1Total - currentTarget;
            break;
        case '*':
            newTarget = currentTarget / dep1Total;
            break;
        case '/':
            newTarget = dep1Total / currentTarget;
            break;
        case '==':
            newTarget = dep1Total;
    }

    return dep2.id === HUMAN
        ? newTarget
        : findMissingNumber(dep2, monkies, newTarget);
};

export function partTwo() {
    const monkies = getMonkies();
    monkies.root.operator = '==';
    markHumanAncestors(monkies.root, monkies);

    return findMissingNumber(monkies.root, monkies);
}
