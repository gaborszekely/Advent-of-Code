"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloneSet = void 0;
/** Clone a set. */
const cloneSet = (set) => {
    const cloned = new Set();
    set.forEach(val => cloned.add(val));
    return cloned;
};
exports.cloneSet = cloneSet;
//# sourceMappingURL=set.js.map