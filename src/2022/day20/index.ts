// https://adventofcode.com/2022/day/20

import { getInput } from '@utils/fs';
import { ListNode, swapBackward, swapForward } from '@utils/linkedlist';

const input = getInput(__dirname);
const entries = input.split('\n').map(Number);

const buildList = (mapFn: (val: number) => number = val => val) => {
    const head = new ListNode(mapFn(entries[0]));
    const indexes: ListNode<number>[] = [head];
    let zeroNode: ListNode<number>;
    let prev = head;

    for (let i = 1; i < entries.length; ++i) {
        const node = new ListNode(mapFn(entries[i]));
        indexes.push(node);
        if (node.value === 0) {
            zeroNode = node;
        }
        prev.next = node;
        node.prev = prev;
        prev = node;
    }

    prev.next = head;
    head.prev = prev;

    return { zeroNode, indexes };
};

type NodeList = ReturnType<typeof buildList>;

function mixFile({ indexes }: NodeList) {
    for (const node of indexes) {
        for (let j = 0; j < Math.abs(node.value) % (entries.length - 1); ++j) {
            node.value > 0 ? swapForward(node) : swapBackward(node);
        }
    }
}

const getResult = ({ zeroNode }: NodeList) => {
    let result = 0;
    let node = zeroNode;

    for (let i = 1; i <= 3000; ++i) {
        node = node.next;

        if (i === 1000 || i === 2000 || i === 3000) {
            result += node.value;
        }
    }

    return result;
};

export function partOne() {
    const list = buildList();
    mixFile(list);

    return getResult(list);
}

export function partTwo() {
    const DECRYPTION_KEY = 811589153;
    const list = buildList(val => val * DECRYPTION_KEY);

    for (let i = 0; i < 10; ++i) {
        mixFile(list);
    }

    return getResult(list);
}
