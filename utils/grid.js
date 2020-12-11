/** Grid data structure, with common grid functionality. */
class Grid {
    constructor(input) {
        this._grid = Grid.deserialize(input);
    }

    /** Checks whether a set of grid coordinates are valid. */
    static inRange(grid, row, col) {
        return (
            row >= 0 && row < grid.length && col >= 0 && col < grid[0].length
        );
    }

    /** Serializes a grid[][] into a string representation. */
    static serialize(grid) {
        let serialized = '';
        for (let i = 0; i < grid.length; ++i) {
            for (let j = 0; j < grid[0].length; ++j) {
                serialized += grid[i][j];
            }
            serialized += '\n';
        }
        return serialized.slice(0, -1);
    }

    /** Deserializes a string representation of a grid into a grid[][]. */
    static deserialize(input) {
        return input.split('\n').map(r => r.split(''));
    }

    /** Serializes grid coordinates as a 'row:col' string. */
    static serializeCoords(row, col) {
        return `${row}:${col}`;
    }

    /**
     * Generates a grid[][] of a certain size, and populates it's cells with a default value.
     */
    static generate(rows, cols, defaultVal) {
        return Array.from({ length: rows }, () =>
            Array.from({ length: cols }, () =>
                typeof defaultVal === 'function' ? defaultVal() : defaultVal
            )
        );
    }

    /** Generate a Grid instance from a string representation. */
    static fromSerialized(input) {
        return new Grid(input);
    }

    /** Generate a Grid instance from a grid[][] representation. */
    static fromDeserialized(grid) {
        const serialized = Grid.serialize(grid);
        return new Grid(serialized);
    }

    /** Clones the grid[][]. */
    static clone(grid) {
        return Array.from({ length: grid.length }, (_, row) =>
            Array.from({ length: grid[0].length }, (_, col) => grid[row][col])
        );
    }

    /** Gets the grid row. */
    getRow(row) {
        if (!this.inRange(row, 0)) {
            throw new Error('Row is out of bounds.');
        }
        return this._grid[row];
    }

    /** Gets the grid coordinates. */
    get(row, col) {
        if (!this.inRange(row, col)) {
            throw new Error(`Coordinates [${row}, ${col}] are out of bounds.`);
        }
        return this._grid[row][col];
    }

    /** Sets the grid coordinates to a given value. */
    set(row, col, val) {
        if (!this.inRange(row, col)) {
            throw new Error(`Coordinates [${row}, ${col}] are out of bounds.`);
        }
        this._grid[row][col] = val;
    }

    /** Checks whether a value is a valid grid coordinate. */
    inRange(row, col) {
        return Grid.inRange(this._grid, row, col);
    }

    /** Iterates over each cell in the grid. */
    forEach(cb) {
        for (let i = 0; i < this._grid.length; ++i) {
            for (let j = 0; j < this._grid[0].length; ++j) {
                cb(this.get(i, j), i, j, this);
            }
        }
    }

    /** Prints the grid in the console. */
    print() {
        for (const row of this._grid) {
            console.log(row.join(''));
        }
        console.log('\n');
    }

    /** Counts the number of elements in the grid. */
    countElements(target) {
        let total = 0;
        this.forEach(el => {
            if (el === target) {
                total++;
            }
        });
        return total;
    }

    /** Serializes the grid into a string representation. */
    serialize() {
        return Grid.serialize(this._grid);
    }

    /** Clones the Grid instance. */
    clone() {
        return new Grid(this.serialize());
    }
}

exports.Grid = Grid;
