// https://adventofcode.com/2020/day/23

const {
    getInput,
    linkedListHas,
    convertToCircularLinkedList,
} = require('../../utils');

const i = getInput(__dirname);

const parseInput = input => {
    return input.split('').map(Number);
};

const getNextDown = (currentVal, maxVal) => {
    return currentVal - 1 === 0 ? maxVal : currentVal - 1;
};

const getDestinationCup = (currentVal, list, maxVal) => {
    let target = getNextDown(currentVal, maxVal);

    while (linkedListHas(list, target)) {
        target = getNextDown(target, maxVal);
    }

    return target;
};

const saveListReferences = (head, size) => {
    const vals = new Array(size + 1);

    vals[head.value] = head;

    let node = head.next;

    while (node && node !== head) {
        vals[node.value] = node;
        node = node.next;
    }

    return vals;
};

const playGame = (head, vals, iterations, maxVal) => {
    let currentNode = head;

    for (let i = 0; i < iterations; ++i) {
        const nextHead = currentNode.next.next.next.next;
        const nextCupsStart = currentNode.next;
        const nextCupsEnd = nextCupsStart.next.next;

        nextCupsEnd.next = null;

        currentNode.next = nextHead;

        const destinationCup = getDestinationCup(
            currentNode.value,
            nextCupsStart,
            maxVal
        );

        const ref = vals[destinationCup];

        const oldNext = ref.next;

        ref.next = nextCupsStart;

        nextCupsEnd.next = oldNext;

        currentNode = currentNode.next;
    }

    return currentNode;
};

exports.partOne = () => {
    const input = parseInput(i);

    const maxVal = 9;
    const iterations = 100;

    const head = convertToCircularLinkedList(input);
    const vals = saveListReferences(head, maxVal);

    playGame(head, vals, iterations, maxVal);

    let node = vals[1].next;

    let result = '';

    while (node.value !== 1) {
        result += node.value;
        node = node.next;
    }

    return result;
};

exports.partTwo = () => {
    const input = parseInput(i);

    const maxVal = 1000000;
    const iterations = 10000000;

    for (let i = 10; i <= maxVal; ++i) {
        input.push(i);
    }

    const head = convertToCircularLinkedList(input);
    const vals = saveListReferences(head, maxVal);

    playGame(head, vals, iterations, maxVal);

    const node = vals[1];

    return node.next.value * node.next.next.value;
};
