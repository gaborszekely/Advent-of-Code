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

    /** Generates a Grid instance from a string representation. */
    static fromSerialized(input) {
        return new Grid(input);
    }

    /** Generates a Grid instance from a grid[][] representation. */
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

    /** Get neighbor cuurdinate offsets. */
    static getNeighborOffsets() {
        return [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1],
        ];
    }

    /** Get all neighbor cooridnate offsets, including diagonal ones. */
    static getAllNeighborOffsets() {
        return [
            ...Grid.getNeighborOffsets(),
            [1, 1],
            [-1, -1],
            [1, -1],
            [-1, 1],
        ];
    }

    /** Gets the coordinates that are up, down, left, and right of the current. */
    static getNeighborCoords(i, j) {
        return Grid.getNeighborOffsets().map(([dI, dJ]) => [i + dI, j + dJ]);
    }

    /** Gets all the neighbors of a coordinate set, including diagonal ones. */
    static getAllNeighborCoords(i, j) {
        return Grid.getAllNeighborOffsets().map(([dI, dJ]) => [i + dI, j + dJ]);
    }

    /** Clones the Grid instance. */
    clone() {
        return new Grid(this.serialize());
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

    /** Iterates over each cell in the grid. */
    forEach(cb) {
        for (let i = 0; i < this._grid.length; ++i) {
            for (let j = 0; j < this._grid[0].length; ++j) {
                cb(this.get(i, j), i, j, this);
            }
        }
    }

    /** Gets the grid coordinates. */
    get(row, col) {
        if (!this.inRange(row, col)) {
            throw new Error(`Coordinates [${row}, ${col}] are out of bounds.`);
        }
        return this._grid[row][col];
    }

    /** Gets all the neighbors of a current cell, including diagonal ones. */
    getAllNeighbors(i, j) {
        return this._mapCoordsToNeighbors(Grid.getAllNeighborCoords(i, j));
    }

    /** Gets the neighbors of a current cell. */
    getNeighbors(i, j) {
        return this._mapCoordsToNeighbors(Grid.getNeighborCoords(i, j));
    }

    /** Gets the grid row. */
    getRow(row) {
        if (!this.inRange(row, 0)) {
            throw new Error('Row is out of bounds.');
        }
        return this._grid[row];
    }

    /** Checks whether a value is a valid grid coordinate. */
    inRange(row, col) {
        return Grid.inRange(this._grid, row, col);
    }

    /** Prints the grid in the console. */
    print() {
        for (const row of this._grid) {
            console.log(row.join(''));
        }
        console.log('\n');
    }

    /** Serializes the grid into a string representation. */
    serialize() {
        return Grid.serialize(this._grid);
    }

    /** Sets the grid coordinates to a given value. */
    set(row, col, val) {
        if (!this.inRange(row, col)) {
            throw new Error(`Coordinates [${row}, ${col}] are out of bounds.`);
        }
        this._grid[row][col] = val;
    }

    _mapCoordsToNeighbors(coords) {
        return coords
            .filter(([nI, nJ]) => this.inRange(nI, nJ))
            .map(([nI, nJ]) => this.get(nI, nJ));
    }
}

exports.Grid = Grid;
