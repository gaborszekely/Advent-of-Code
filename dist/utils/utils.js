"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reverse = exports.assert = exports.inRange = exports.range = void 0;
const console = __importStar(require("console"));
const range = (i, j, inclusive = true) => i <= j
    ? Array.from({ length: j - i + +inclusive }, (_, idx) => i + idx)
    : Array.from({ length: i - j + +inclusive }, (_, idx) => i - idx);
exports.range = range;
console.assert((0, exports.range)(1, 3).join('') === '123', 'range(1, 3) incorrect');
console.assert((0, exports.range)(3, 1).join('') === '321', 'range(3, 1) incorrect');
/** Checks whether a value is included in a range (inclusive). */
const inRange = (min, max) => (v) => v >= min && v <= max;
exports.inRange = inRange;
const assert = (actual, expected) => {
    if (actual !== expected) {
        console.error(`Actual value did not match extected value!`);
        console.log('Actual: ', actual);
        console.log('Expected: ', expected);
    }
};
exports.assert = assert;
const reverse = (str) => str.split('').reverse().join('');
exports.reverse = reverse;
//# sourceMappingURL=utils.js.map