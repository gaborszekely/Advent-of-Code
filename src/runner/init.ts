import fs from 'fs';
import path from 'path';
import { __basedir } from '@utils/fs';

const date = new Date();
const year = date.getFullYear();
const day = date.getDate() + 1;

const challengeDir = path.join(__basedir, year.toString(), `day${day}`);
const challengePath = `${challengeDir}/index.ts`;
const inputPath = `${challengeDir}/input.txt`;
const testInputPath = `${challengeDir}/test_input.txt`;
const readmePath = `${challengeDir}/README.md`;

const template = `// https://adventofcode.com/${year}/day/${day}

import { getInput } from '@utils/fs';
    
const input = getInput(__dirname);

export function partOne() {
    
}

export function partTwo() {
    
}
`;

if (!fs.existsSync(challengePath)) {
    fs.mkdirSync(challengeDir);
    fs.writeFileSync(challengePath, template);
    fs.writeFileSync(inputPath, '');
    fs.writeFileSync(testInputPath, '');
    fs.writeFileSync(readmePath, '');
}
