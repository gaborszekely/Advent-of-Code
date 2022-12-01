"use strict";
// https://adventofcode.com/2022/day/1
Object.defineProperty(exports, "__esModule", { value: true });
exports.partTwo = exports.partOne = void 0;
const index_1 = require("../../utils/index");
const input = (0, index_1.getInput)(__dirname);
const entries = input
    .trim()
    .split('\n\n')
    .map(byDeer => byDeer.split('\n').reduce((acc, item) => acc + Number(item), 0))
    .sort((a, b) => b - a);
function partOne() {
    return entries[0];
}
exports.partOne = partOne;
function partTwo() {
    let result = 0;
    for (let i = 0; i < 3; ++i) {
        result += entries[i];
    }
    return result;
}
exports.partTwo = partTwo;
//# sourceMappingURL=index.js.map