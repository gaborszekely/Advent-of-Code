import commander from 'commander';
import fs from 'fs';
import path from 'path';

export const __basedir = path.join(__dirname, '..');

export function getInput(dirname: string) {
    const file = commander.test ? 'test_input.txt' : 'input.txt';

    return fs
        .readFileSync(`${dirname.replace('/dist/', '/src/')}/${file}`, 'utf8')
        .replace(/\n$/, '');
}
