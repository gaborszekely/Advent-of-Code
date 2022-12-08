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

const isFile = (row: string) => /^\d+/.test(row);
const isDirectory = (row: string) => /^dir/.test(row);

function parseFile(row: string) {
    const [, size, name] = row.match(/^(\d+) (.+)$/) || [];

    return { size: Number(size), name };
}

function parseDirectory(row: string) {
    const [, name] = row.match(/^dir (.+)$/) || [];

    return { name };
}

function buildFileSystem() {
    const root: Directory = {
        name: '/',
        subdirectories: {},
        files: {},
        totalSize: 0,
    };

    let directory = root;

    entries.forEach((entry, i) => {
        if (!directory) {
            throw new Error(`Invalid directory on line ${i}`);
        }

        if (isFile(entry)) {
            const { size, name } = parseFile(entry);
            directory.files[name] = {
                name,
                size,
            };

            // Update total sizes of all ancestor directories.
            let ancestor = directory;
            while (ancestor) {
                ancestor.totalSize += size;
                ancestor = ancestor.parent;
            }
        }

        if (isDirectory(entry)) {
            const { name } = parseDirectory(entry);
            directory.subdirectories[name] ||= {
                name,
                files: {},
                subdirectories: {},
                parent: directory,
                totalSize: 0,
            };
        }

        if (entry.startsWith('$ cd')) {
            const [, destination] = entry.match(/^\$ cd (.+)$/) || [];

            switch (destination) {
                case '/':
                    directory = root;
                    break;
                case '..':
                    directory = directory.parent;
                    break;
                default:
                    directory = directory.subdirectories[destination];
            }
        }
    });

    return root;
}

const root = buildFileSystem();

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
