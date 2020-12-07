const fs = require('fs');
const path = require('path');

exports.__basedir = path.join(__dirname, '..');

exports.getInput = dirname =>
    fs.readFileSync(`${dirname}/input.txt`, 'utf8').replace(/\n$/, '');
