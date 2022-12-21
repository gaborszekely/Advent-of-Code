/**
 * Linked List node.
 */
export class ListNode<T> {
    next: ListNode<T> | null = null;
    prev: ListNode<T> | null = null;
    constructor(readonly value: T) {}
}

export const toArray = <T>(head: ListNode<T>) => {
    const seen = new Set<ListNode<T>>();
    const arr: T[] = [];
    let node = head;

    while (!seen.has(node)) {
        arr.push(node.value);
        seen.add(node);
        node = node.next;
    }

    return arr;
};

export const linkedListHas = <T>(list: ListNode<T> | null, target: T) => {
    let node = list;

    while (node) {
        if (node.value === target) {
            return true;
        }

        node = node.next;
    }

    return false;
};

export const convertToCircularLinkedList = <T>(input: T[]) => {
    const head = new ListNode(input[0]);

    let node = head;

    for (let i = 1; i < input.length; ++i) {
        node.next = new ListNode(input[i]);
        node = node.next;
    }

    node.next = head;

    return head;
};

export const convertToLinkedList = <T>(input: T[]) => {
    const head = new ListNode(input[0]);

    let node = head;

    for (let i = 1; i < input.length; ++i) {
        node.next = new ListNode(input[i]);
        node = node.next;
    }

    return head;
};

/** Swaps a node with it's next node. */
export const swapForward = (node: ListNode<number>) => {
    const oldPrev = node.prev;
    const oldNextNext = node.next.next;
    oldPrev.next = node.next;
    node.next.prev = oldPrev;
    node.prev = node.next;
    node.next.next = node;
    node.next = oldNextNext;
    oldNextNext.prev = node;
};

/** Swaps node with it's previous node. */
export const swapBackward = (node: ListNode<number>) => {
    const oldNext = node.next;
    const oldPrev = node.prev;
    const oldPrevPrev = node.prev.prev;
    oldPrevPrev.next = node;
    node.prev = oldPrevPrev;
    node.next = oldPrev;
    oldPrev.prev = node;
    oldPrev.next = oldNext;
    oldNext.prev = oldPrev;
};
