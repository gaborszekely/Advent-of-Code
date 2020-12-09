const fs = require('fs');
const path = require('path');

exports.__basedir = path.join(__dirname, '..');

exports.getInput = (dirname, file = 'input.txt') =>
    fs.readFileSync(`${dirname}/${file}`, 'utf8').replace(/\n$/, '');

exports.getTestInput = dirname => this.getInput(dirname, 'test.txt');
