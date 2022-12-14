// https://adventofcode.com/2022/day/13

import { getInput } from '@utils/fs';
import { sum } from 'lodash';

const input = getInput(__dirname);

type Packet = Array<number | Packet>;

const pairs = input
    .split('\n\n')
    .map(pair => pair.split('\n').map(packet => JSON.parse(packet) as Packet));

function inOrder(packet1: Packet, packet2: Packet): number {
    for (let i = 0; i < packet1.length; ++i) {
        const p1 = packet1[i];
        const p2 = packet2[i];

        // packet 1 is longer than packet 2
        if (p2 === undefined) {
            return -1;
        }

        // both items are numbers
        if (typeof p1 === 'number' && typeof p2 === 'number') {
            if (p1 < p2) return 1;
            if (p1 > p2) return -1;
            continue;
        }

        // at least one is a list
        const p1List = Array.isArray(p1) ? p1 : [p1];
        const p2List = Array.isArray(p2) ? p2 : [p2];
        const ordered = inOrder(p1List, p2List);

        if (ordered !== 0) {
            return ordered;
        }
    }

    return packet1.length < packet2.length ? 1 : 0;
}

export function partOne() {
    return sum(
        pairs.map(([packet1, packet2], i) =>
            inOrder(packet1, packet2) === 1 ? i + 1 : 0
        )
    );
}

export function partTwo() {
    const divider1 = [[2]];
    const divider2 = [[6]];
    const packets = [...pairs.flat(1), divider1, divider2]
        .sort(inOrder)
        .reverse();
    const divider1Index = packets.findIndex(p => p === divider1) + 1;
    const divider2Index = packets.findIndex(p => p === divider2) + 1;

    return divider1Index * divider2Index;
}
