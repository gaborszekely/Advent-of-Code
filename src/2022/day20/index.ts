// https://adventofcode.com/2022/day/20

import { getInput } from '@utils/fs';
import {
    LinkedList,
    ListNode,
    swapBackward,
    swapForward,
    toArray,
} from '@utils/linkedlist';

const input = getInput(__dirname);
const entries = input.split('\n').map(Number);

/**
 * The encrypted file represented as a linked list of file coordinates.
 */
class CoordinateList extends LinkedList<number> {
    /** Reference to the node with the zero value. */
    private readonly zeroNode: ListNode<number>;
    /** The array of nodes in their original indexes. */
    private readonly nodeOrder: ListNode<number>[] = [];

    constructor(input: number[]) {
        super(input);

        const seen = new Set<ListNode<number>>();
        let node = this.head;

        while (!seen.has(node)) {
            this.nodeOrder.push(node);
            seen.add(node);
            if (node.value === 0) {
                this.zeroNode = node;
            }
            node = node.next;
        }
    }

    /** Mixes the coordinates according to their numeric values. */
    mix() {
        for (const node of this.nodeOrder) {
            for (
                let j = 0;
                j < Math.abs(node.value) % (entries.length - 1);
                ++j
            ) {
                node.value > 0 ? swapForward(node) : swapBackward(node);
            }
        }
    }

    /** Sums the Grove coordinates at index 1000, 2000, and 3000. */
    sumGroveCoordinates() {
        let result = 0;
        let node = this.zeroNode;

        for (let i = 1; i <= 3000; ++i) {
            node = node.next;

            if (i === 1000 || i === 2000 || i === 3000) {
                result += node.value;
            }
        }

        return result;
    }
}

export function partOne() {
    const coordinateList = new CoordinateList(entries);
    coordinateList.mix();

    return coordinateList.sumGroveCoordinates();
}

export function partTwo() {
    const DECRYPTION_KEY = 811589153;
    const coordinateList = new CoordinateList(entries);
    coordinateList.mapValues(value => value * DECRYPTION_KEY);

    for (let i = 0; i < 10; ++i) {
        coordinateList.mix();
    }

    return coordinateList.sumGroveCoordinates();
}
