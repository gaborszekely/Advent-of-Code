"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToLinkedList = exports.convertToCircularLinkedList = exports.linkedListHas = exports.ListNode = void 0;
/**
 * Linked List node.
 */
class ListNode {
    constructor(value) {
        this.value = value;
        this.next = null;
        this.prev = null;
    }
}
exports.ListNode = ListNode;
const linkedListHas = (list, target) => {
    let node = list;
    while (node) {
        if (node.value === target) {
            return true;
        }
        node = node.next;
    }
    return false;
};
exports.linkedListHas = linkedListHas;
const convertToCircularLinkedList = (input) => {
    const head = new ListNode(input[0]);
    let node = head;
    for (let i = 1; i < input.length; ++i) {
        node.next = new ListNode(input[i]);
        node = node.next;
    }
    node.next = head;
    return head;
};
exports.convertToCircularLinkedList = convertToCircularLinkedList;
const convertToLinkedList = (input) => {
    const head = new ListNode(input[0]);
    let node = head;
    for (let i = 1; i < input.length; ++i) {
        node.next = new ListNode(input[i]);
        node = node.next;
    }
    return head;
};
exports.convertToLinkedList = convertToLinkedList;
//# sourceMappingURL=linkedlist.js.map