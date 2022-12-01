import fs from 'fs';
import path from 'path';

export const __basedir = path.join(__dirname, '..');

export const getInput = (dirname: string, file = 'input.txt') =>
    fs
        .readFileSync(`${dirname.replace('/dist/', '/src/')}/${file}`, 'utf8')
        .replace(/\n$/, '');

export const getTestInput = (dirname: string) => getInput(dirname, 'test.txt');
