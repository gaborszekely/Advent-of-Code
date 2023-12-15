// https://adventofcode.com/2023/day/15

import { getInput } from '@utils/fs';
import { sum } from 'lodash';

const input = getInput(__dirname);

function hash(sequence: string) {
    let total = 0;

    for (const char of sequence) {
        const asciiValue = char.charCodeAt(0);
        total += asciiValue;
        total *= 17;
        total = total % 256;
    }

    return total;
}

export function partOne() {
    const sequences = input.replace('\n', '').split(',');

    return sum(sequences.map(hash));
}

export function partTwo() {
    const sequences = input.replace('\n', '').split(',');
    const boxes = Array.from(
        { length: 256 },
        () => [] as Array<{ label: string; lensSize: number }>
    );

    for (const sequence of sequences) {
        const [separator] = sequence.match(/[=-]/);
        const [label, lensSizeStr] = sequence.split(separator);
        const boxIndex = hash(label);
        const lensSize = Number(lensSizeStr);
        const currentBox = boxes[boxIndex];
        const slotIndex = currentBox.findIndex(slot => slot.label === label);

        if (separator === '-') {
            if (slotIndex >= 0) {
                currentBox.splice(slotIndex, 1);
            }
        } else {
            if (slotIndex >= 0) {
                currentBox[slotIndex].lensSize = lensSize;
            } else {
                currentBox.push({ label, lensSize });
            }
        }
    }

    let total = 0;

    for (let i = 0; i < boxes.length; ++i) {
        for (let j = 0; j < boxes[i].length; ++j) {
            total += (i + 1) * (j + 1) * boxes[i][j].lensSize;
        }
    }

    return total;
}
