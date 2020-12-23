/**
 * Linked List node.
 */
class ListNode {
    constructor(value) {
        this.value = value;
        this.next = this.prev = null;
    }
}

exports.ListNode = ListNode;

exports.linkedListHas = (list, target) => {
    let node = list;

    while (node) {
        if (node.value === target) {
            return true;
        }

        node = node.next;
    }

    return false;
};

exports.convertToCircularLinkedList = input => {
    const head = new ListNode(input[0]);

    let node = head;

    for (let i = 1; i < input.length; ++i) {
        node.next = new ListNode(input[i]);
        node = node.next;
    }

    node.next = head;

    return head;
};

exports.convertToLinkedList = input => {
    const head = new ListNode(input[0]);

    let node = head;

    for (let i = 1; i < input.length; ++i) {
        node.next = new ListNode(input[i]);
        node = node.next;
    }

    return head;
};
