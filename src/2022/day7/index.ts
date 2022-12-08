// https://adventofcode.com/2022/day/7

import { getInput } from '@utils/fs';

const input = getInput(__dirname);
const entries = input.split('\n');

interface File {
    name: string;
    size: number;
}

interface Directory {
    name: string;
    parent?: Directory;
    files: Record<string, File>;
    subdirectories: Record<string, Directory>;
    totalSize: number;
}

const root: Directory = {
    name: '/',
    subdirectories: {},
    files: {},
    totalSize: 0,
};

buildFileSystem(root);

export function partOne() {
    let total = 0;

    const stack = [root];

    while (stack.length) {
        const current = stack.pop();

        if (current.totalSize <= 100000) {
            total += current.totalSize;
        }

        for (const subdirectory of Object.values(current.subdirectories)) {
            stack.push(subdirectory);
        }
    }

    return total;
}

export function partTwo() {
    const TOTAL_SPACE = 70000000;
    const REQUIRED_SPACE_FOR_UPDATE = 30000000;

    const remainingSpace = TOTAL_SPACE - root.totalSize;
    const requiredSpace = REQUIRED_SPACE_FOR_UPDATE - remainingSpace;

    let min = Infinity;

    const stack = [root];

    while (stack.length) {
        const current = stack.pop();

        if (current.totalSize >= requiredSpace) {
            min = Math.min(min, current.totalSize);
        }

        for (const subdirectory of Object.values(current.subdirectories)) {
            stack.push(subdirectory);
        }
    }

    return min;
}

function buildFileSystem(directory: Directory, index = 0) {
    if (index >= entries.length) {
        return;
    }

    if (!directory) {
        throw new Error(`Invalid directory on line ${index}`);
    }

    const instruction = entries[index];

    // list
    if (instruction === '$ ls') {
        let i = index + 1;

        while (isFileOrDirectory(entries[i])) {
            if (isFile(entries[i])) {
                const { size, name } = parseFile(entries[i]);
                directory.files[name] = {
                    name,
                    size,
                };

                let current = directory;
                while (current) {
                    current.totalSize += size;
                    current = current.parent;
                }
            } else {
                const { name } = parseDirectory(entries[i]);
                directory.subdirectories[name] ||= {
                    name,
                    files: {},
                    subdirectories: {},
                    parent: directory,
                    totalSize: 0,
                };
            }
            i++;
        }

        buildFileSystem(directory, i);
    }

    if (instruction.startsWith('$ cd')) {
        const [, destination] = instruction.match(/^\$ cd (.+)$/) || [];

        switch (destination) {
            case '/':
                buildFileSystem(root, index + 1);
                break;
            case '..':
                buildFileSystem(directory.parent, index + 1);
                break;
            default:
                buildFileSystem(
                    directory.subdirectories[destination],
                    index + 1
                );
        }
    }
}

const isFile = (row: string) => /^\d+/.test(row);
const isDirectory = (row: string) => /^dir/.test(row);
const isFileOrDirectory = (row: string) => isFile(row) || isDirectory(row);

function parseFile(row: string) {
    const [, size, name] = row.match(/^(\d+) (.+)$/) || [];

    return { size: Number(size), name };
}

function parseDirectory(row: string) {
    const [, name] = row.match(/^dir (.+)$/) || [];

    return { name };
}
