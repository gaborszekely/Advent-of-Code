// https://adventofcode.com/2020/day/17

const { getInput, getTestInput, Grid } = require('../../utils');

const i = getInput(__dirname);
const _i = getTestInput(__dirname);

const getEmptyLayer = layer =>
    Grid.fromMatrix(Grid.generateMatrix(layer.rows, layer.cols, '.'));

const getEmptyGrid = grid => grid.map(getEmptyLayer);

/**
 * If a cube is active and exactly 2 or 3 of its neighbors are also active, the cube remains active. Otherwise, the cube becomes inactive.
 * If a cube is inactive but exactly 3 of its neighbors are active, the cube becomes active. Otherwise, the cube remains inactive.
 */
const getNewCellState = (state, activeNeighbors) => {
    if (state === '#') {
        if ([2, 3].includes(activeNeighbors)) return '#';
        return '.';
    }

    if (state === '.') {
        if (activeNeighbors === 3) return '#';
        return '.';
    }
};

const countActiveNeighbors = slice => slice.filter(val => val === '#').length;

exports.partOne = () => {
    const parseInput = input => [new Grid(input)];

    const getActiveNeighbors = (grid, layerI, row, col) => {
        const currentSlice = grid[layerI];

        const layerNeighbors = [-1, 0, 1]
            .map(i => layerI + i)
            .filter(i => grid[i] && i !== layerI)
            .reduce(
                (acc, i) =>
                    acc +
                    countActiveNeighbors([
                        ...grid[i].getAllNeighbors(row, col),
                        grid[i].get(row, col),
                    ]),
                0
            );

        // Check neighbors in current slice
        const localNeighbors = countActiveNeighbors(
            currentSlice.getAllNeighbors(row, col)
        );

        return localNeighbors + layerNeighbors;
    };

    const sumActiveCells = grid => {
        let total = 0;

        grid.forEach(layer => {
            layer.forEach(cell => {
                if (cell === '#') {
                    total++;
                }
            });
        });

        return total;
    };

    let currentGrid = parseInput(i);
    let emptyGrid = getEmptyGrid(currentGrid);

    for (let i = 0; i < 6; ++i) {
        // Expand all layers
        for (let gridI = 0; gridI < currentGrid.length; ++gridI) {
            [currentGrid, emptyGrid].forEach(grid => {
                grid[gridI].expandBoundaries('.');
            });
        }

        const curr = currentGrid[0];

        // Add boundary layers
        [currentGrid, emptyGrid].forEach(grid => {
            grid.push(getEmptyLayer(curr));
            grid.unshift(getEmptyLayer(curr));
        });

        for (let layerI = 0; layerI < currentGrid.length; ++layerI) {
            const currentLayer = currentGrid[layerI];

            currentLayer.forEach((el, row, col) => {
                const activeNeighbors = getActiveNeighbors(
                    currentGrid,
                    layerI,
                    row,
                    col
                );
                const newCellValue = getNewCellState(el, activeNeighbors);
                emptyGrid[layerI].set(row, col, newCellValue);
            });
        }

        currentGrid = emptyGrid;
        emptyGrid = getEmptyGrid(currentGrid);
    }

    return sumActiveCells(currentGrid);
};

exports.partTwo = () => {
    const parse4dInput = input => [[new Grid(input)]];

    const getActive4dNeighbors = (grid, dimensionI, layerI, row, col) => {
        const currentDimension = grid[dimensionI];

        const allNeighborSlices = [-1, 0, 1]
            .map(i => dimensionI + i)
            .filter(i => grid[i])
            .reduce((acc, i) => {
                const dimension = grid[i];

                for (let j = layerI - 1; j <= layerI + 1; ++j) {
                    const currentLayer = dimension[j];

                    if (
                        currentLayer &&
                        (dimension !== currentDimension || j !== layerI)
                    ) {
                        acc.push(currentLayer);
                    }
                }

                return acc;
            }, []);

        const currentSlice = grid[dimensionI][layerI];

        // Check neighbors in current slice
        const localNeighbors = countActiveNeighbors(
            currentSlice.getAllNeighbors(row, col)
        );

        // Check neighbors in neighboring slices
        const otherNeighbors = allNeighborSlices.reduce(
            (acc, slice) =>
                acc +
                countActiveNeighbors([
                    ...slice.getAllNeighbors(row, col),
                    slice.get(row, col),
                ]),
            0
        );

        return localNeighbors + otherNeighbors;
    };

    const getEmptyDimension = dimension =>
        dimension.map(layer => getEmptyLayer(layer));

    const getEmpty4dGrid = grid => grid.map(getEmptyDimension);

    const sumActive4dCells = grid => {
        let total = 0;

        grid.forEach(dimension => {
            dimension.forEach(layer => {
                layer.forEach(cell => {
                    if (cell === '#') {
                        total++;
                    }
                });
            });
        });

        return total;
    };

    const expand = (currentGrid, emptyGrid) => {
        // Expand all layers.
        for (
            let dimensionI = 0;
            dimensionI < currentGrid.length;
            ++dimensionI
        ) {
            for (
                let layerI = 0;
                layerI < currentGrid[dimensionI].length;
                ++layerI
            ) {
                [currentGrid, emptyGrid].forEach(grid => {
                    grid[dimensionI][layerI].expandBoundaries('.');
                });
            }
        }

        const curr = currentGrid[0][0];

        // Add extra layers to each dimension.
        for (
            let dimensionI = 0;
            dimensionI < currentGrid.length;
            ++dimensionI
        ) {
            [currentGrid, emptyGrid].forEach(grid => {
                grid[dimensionI].push(getEmptyLayer(curr));
                grid[dimensionI].unshift(getEmptyLayer(curr));
            });
        }

        // Add extra dimensions.
        [currentGrid, emptyGrid].forEach(grid => {
            grid.push(getEmptyDimension(currentGrid[0]));
            grid.unshift(getEmptyDimension(currentGrid[0]));
        });
    };

    let currentGrid = parse4dInput(i);
    let emptyGrid = getEmpty4dGrid(currentGrid);

    for (let i = 0; i < 6; ++i) {
        expand(currentGrid, emptyGrid);

        for (
            let dimensionI = 0;
            dimensionI < currentGrid.length;
            ++dimensionI
        ) {
            for (
                let layerI = 0;
                layerI < currentGrid[dimensionI].length;
                ++layerI
            ) {
                const layer = currentGrid[dimensionI][layerI];

                layer.forEach((el, row, col) => {
                    const activeNeighbors = getActive4dNeighbors(
                        currentGrid,
                        dimensionI,
                        layerI,
                        row,
                        col
                    );

                    const newCellValue = getNewCellState(el, activeNeighbors);

                    emptyGrid[dimensionI][layerI].set(row, col, newCellValue);
                });
            }
        }

        currentGrid = emptyGrid;
        emptyGrid = getEmpty4dGrid(currentGrid);
    }

    return sumActive4dCells(currentGrid);
};
