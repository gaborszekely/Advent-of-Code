/** Grid data structure, with common grid functionality. */
class Grid {
    constructor(input) {
        this._grid = Grid.deserializeMatrix(input);
    }

    /** Clones a matrix representation of a grid. */
    static cloneMatrix(grid) {
        return Array.from({ length: grid.length }, (_, row) =>
            Array.from({ length: grid[0].length }, (_, col) => grid[row][col])
        );
    }

    /** Deserializes a string representation of a grid into a matrix. */
    static deserializeMatrix(input) {
        return input.split('\n').map(r => r.split(''));
    }

    /** Generates a Grid instance from a matrix representation. */
    static fromMatrix(matrix) {
        const serialized = Grid.serializeMatrix(matrix);
        return new Grid(serialized);
    }

    /** Generates a Grid instance from a string representation. */
    static fromSerialized(input) {
        return new Grid(input);
    }

    /**
     * Generates a matrix of a certain size, and populates it's cells with a
     * default value.
     */
    static generateMatrix(rows, cols, defaultVal) {
        return Array.from({ length: rows }, () =>
            Array.from({ length: cols }, () =>
                typeof defaultVal === 'function' ? defaultVal() : defaultVal
            )
        );
    }

    /** Gets all the neighbors of a coordinate set, including diagonal ones. */
    static getAllNeighborCoords(i, j) {
        return Grid.getAllNeighborOffsets().map(([dI, dJ]) => [i + dI, j + dJ]);
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

    /** Get the manhattan distance between two coordinates. */
    static getManhattanDistance([cX, cY], [sX, sY] = [0, 0]) {
        return Math.abs(cX - sX) + Math.abs(cY - sY);
    }

    /** Gets the coordinates that are up, down, left, and right of the current. */
    static getNeighborCoords(i, j) {
        return Grid.getNeighborOffsets().map(([dI, dJ]) => [i + dI, j + dJ]);
    }

    /** Get neighbor coordinate offsets. */
    static getNeighborOffsets() {
        return [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1],
        ];
    }

    /** Checks whether a set of grid coordinates are valid. */
    static inRange(matrix, row, col) {
        return (
            row >= 0 &&
            row < matrix.length &&
            col >= 0 &&
            col < matrix[0].length
        );
    }

    /**
     * Rotate a set of coordinates aronud a central location by a given number
     * of degrees.
     */
    static rotate([cx, cy], [x, y], angle = 90) {
        const radians = (Math.PI / 180) * angle;
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);
        const nx = cos * (x - cx) + sin * (y - cy) + cx;
        const ny = cos * (y - cy) - sin * (x - cx) + cy;

        return [Math.round(nx), Math.round(ny)];
    }

    /** Serializes grid coordinates as a 'row:col' string. */
    static serializeCoords(row, col) {
        return `${row}:${col}`;
    }

    /** Serializes a matrix into a string representation. */
    static serializeMatrix(matrix) {
        let serialized = '';
        for (let i = 0; i < matrix.length; ++i) {
            for (let j = 0; j < matrix[0].length; ++j) {
                serialized += matrix[i][j];
            }
            serialized += '\n';
        }
        return serialized.slice(0, -1);
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
        return Grid.serializeMatrix(this._grid);
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
