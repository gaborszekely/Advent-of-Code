/** Clone a set. */
exports.cloneSet = set => {
    const cloned = new Set();

    set.forEach(val => cloned.add(val));

    return cloned;
};
