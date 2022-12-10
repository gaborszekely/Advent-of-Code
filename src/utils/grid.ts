/** Grid data structure, with common grid functionality. */
export class Grid<T> {
    constructor(private readonly grid: T[][] = []) {}

    /** Clones a matrix representation of a grid. */
    static cloneMatrix<T>(matrix: T[][]) {
        return Array.from({ length: matrix.length }, (_, row) =>
            Array.from(
                { length: matrix[0].length },
                (_, col) => matrix[row][col]
            )
        );
    }

    /** Deserializes a string representation of a grid into a matrix. */
    static deserializeMatrix(input: string) {
        return input.split('\n').map(r => r.split(''));
    }

    /** Generates a Grid instance from a matrix representation. */
    static fromMatrix<T>(matrix: T[][]) {
        const grid = Grid.fromProportions<T>(
            matrix.length,
            matrix[0].length,
            null
        );

        grid.forEach((_, r, c) => {
            grid.set(r, c, matrix[r][c]);
        });

        return grid;
    }

    /** Generates a Grid instance from a string representation. */
    static fromSerialized(input: string) {
        const matrix = Grid.deserializeMatrix(input);
        return new Grid(matrix);
    }

    /**
     * Generates a grid of a certain size, with a default value assigned to
     * each cell.
     */
    static fromProportions<T>(rows: number, cols: number, defaultVal: T) {
        const matrix = Grid.generateMatrix(rows, cols, 0);
        const grid = new Grid<T>(matrix);
        const val =
            typeof defaultVal === 'function' ? defaultVal() : defaultVal;

        grid.forEach((_, r, c) => {
            grid.set(r, c, val);
        });

        return grid;
    }

    /**
     * Generates a matrix of a certain size, and populates it's cells with a
     * default value.
     */
    static generateMatrix<T>(
        rows: number,
        cols: number,
        defaultVal: T | Function
    ) {
        return Array.from({ length: rows }, () =>
            Array.from({ length: cols }, () =>
                typeof defaultVal === 'function'
                    ? (defaultVal as Function)()
                    : defaultVal
            )
        );
    }

    /** Gets all the neighbors of a coordinate set, including diagonal ones. */
    static getAllNeighborCoords(i: number, j: number) {
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
    static getManhattanDistance([cX, cY]: number[], [sX, sY] = [0, 0]) {
        return Math.abs(cX - sX) + Math.abs(cY - sY);
    }

    /** Gets the coordinates that are up, down, left, and right of the current. */
    static getNeighborCoords(i: number, j: number) {
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
    static inRange<T>(matrix: T[][], row: number, col: number) {
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
    static rotate([cx, cy]: number[], [x, y]: number[], angle = 90) {
        const radians = (Math.PI / 180) * angle;
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);
        const nx = cos * (x - cx) + sin * (y - cy) + cx;
        const ny = cos * (y - cy) - sin * (x - cx) + cy;

        return [Math.round(nx), Math.round(ny)];
    }

    /** Serializes grid coordinates as a 'row:col' string. */
    static serializeCoords(row: number, col: number) {
        return `${row}:${col}`;
    }

    /** Serializes a matrix into a string representation. */
    static serializeMatrix<T>(matrix: T[][]) {
        const rows = matrix.length;
        const cols = matrix[0].length;

        let serialized = '';
        for (let i = 0; i < rows; ++i) {
            for (let j = 0; j < cols; ++j) {
                serialized += matrix[i][j];
            }
            serialized += '\n';
        }
        return serialized.slice(0, -1);
    }

    get rows() {
        return this.grid.length;
    }

    get cols() {
        return this.grid[0].length;
    }

    pushCol(val: T) {
        this.grid.forEach(row => {
            row.push(val);
        });
    }

    unshiftCol(val: T) {
        this.grid.forEach(row => {
            row.unshift(val);
        });
    }

    pushRow(val: T) {
        this.grid.push(Array.from({ length: this.cols }, () => val));
    }

    unshiftRow(val: T) {
        this.grid.unshift(Array.from({ length: this.cols }, () => val));
    }

    expandBoundaries(val: T) {
        this.pushCol(val);
        this.unshiftCol(val);
        this.pushRow(val);
        this.unshiftRow(val);
    }

    /** Clones the Grid instance. */
    clone() {
        const matrix = Grid.cloneMatrix(this.grid);

        return new Grid(matrix);
    }

    /** Counts the number of elements in the grid. */
    countElements(target: T) {
        let total = 0;
        this.forEach(el => {
            if (el === target) {
                total++;
            }
        });
        return total;
    }

    flipHorizontal() {
        const newGrid = this.grid.map(row => row.slice().reverse());

        return Grid.fromMatrix(newGrid);
    }

    flipVertical() {
        const newGrid = this.grid.slice().reverse();

        return Grid.fromMatrix(newGrid);
    }

    /** Iterates over each cell in the grid. */
    forEach(cb: (val: T, row: number, col: number, self: Grid<T>) => void) {
        for (let i = 0; i < this.grid.length; ++i) {
            for (let j = 0; j < this.grid[0].length; ++j) {
                cb(this.get(i, j), i, j, this);
            }
        }
    }

    /** Gets the grid coordinates. */
    get(row: number, col: number) {
        if (!this.inRange(row, col)) {
            throw new Error(`Coordinates [${row}, ${col}] are out of bounds.`);
        }
        return this.grid[row][col];
    }

    /** Gets all the neighbors of a current cell, including diagonal ones. */
    getAllNeighbors(i: number, j: number) {
        return this._mapCoordsToNeighbors(Grid.getAllNeighborCoords(i, j));
    }

    /** Gets the neighbors of a current cell. */
    getNeighbors(i: number, j: number) {
        return this._mapCoordsToNeighbors(Grid.getNeighborCoords(i, j));
    }

    /** Gets the grid row. */
    getRow(row: number) {
        if (!this.inRange(row, 0)) {
            throw new Error('Row is out of bounds.');
        }
        return this.grid[row];
    }

    /** Checks whether a value is a valid grid coordinate. */
    inRange(row: number, col: number) {
        return Grid.inRange(this.grid, row, col);
    }

    /** Prints the grid in the console. */
    print() {
        for (const row of this.grid) {
            console.log(row.join(''));
        }
        console.log('\n');
    }

    rotateClockwise() {
        const matrix = this.grid;

        return Grid.fromMatrix(
            matrix[0].map((val, index) =>
                matrix.map(row => row[index]).reverse()
            )
        );
    }

    /** Serializes the grid into a string representation. */
    serialize() {
        return Grid.serializeMatrix(this.grid);
    }

    /** Sets the grid coordinates to a given value. */
    set(row: number, col: number, val: T) {
        if (!this.inRange(row, col)) {
            throw new Error(`Coordinates [${row}, ${col}] are out of bounds.`);
        }
        this.grid[row][col] = val;
    }

    spliceCol(col: number) {
        this.grid.forEach(row => {
            row.splice(col, 1);
        });
    }

    spliceRow(row: number) {
        this.grid.splice(row, 1);
    }

    _mapCoordsToNeighbors(coords: number[][]) {
        return coords
            .filter(([nI, nJ]) => this.inRange(nI, nJ))
            .map(([nI, nJ]) => this.get(nI, nJ));
    }
}
