/** Clone a set. */
export const cloneSet = <T>(set: Set<T>) => {
    const cloned = new Set<T>();
    set.forEach(val => cloned.add(val));

    return cloned;
};
