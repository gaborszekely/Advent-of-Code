/**
 * Linked List node.
 */
export class ListNode<T> {
    next: ListNode<T> | null = null;
    prev: ListNode<T> | null = null;
    constructor(readonly value: T) {}
}

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
