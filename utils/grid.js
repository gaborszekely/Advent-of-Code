/** Checks whether a value is a valid grid coordinate. */
exports.inGridRange = (grid, row, col) =>
    row >= 0 && row < grid.length && col >= 0 && col < grid[row].length;

/** Serializes a set of coordinates as a string. */
exports.serializeCoords = (row, col) => `${row}:${col}`;

/**
 * Generates a grid of a certain size, and populate cells with a default value.
 */
exports.generateGrid = (rows, cols, defaultVal) =>
    Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () =>
            typeof defaultVal === 'function' ? defaultVal() : defaultVal
        )
    );
