"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTestInput = exports.getInput = exports.__basedir = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
exports.__basedir = path_1.default.join(__dirname, '..');
const getInput = (dirname, file = 'input.txt') => fs_1.default
    .readFileSync(`${dirname.replace('/dist/', '/src/')}/${file}`, 'utf8')
    .replace(/\n$/, '');
exports.getInput = getInput;
const getTestInput = (dirname) => (0, exports.getInput)(dirname, 'test.txt');
exports.getTestInput = getTestInput;
//# sourceMappingURL=fs.js.map