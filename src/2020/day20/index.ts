// https://adventofcode.com/2020/day/20

import { getInput, getTestInput } from '@utils/fs';
import { Grid } from '@utils/grid';
import { first, last, reverse, range } from 'lodash';

const i = getInput(__dirname);
const _i = getTestInput(__dirname);

type Tiles = { [key: string]: string[] };

const parseTiles = (input: string) => {
    const rawTiles = input.split('\n\n');

    return rawTiles.reduce((acc, rawTile) => {
        const tileId = rawTile
            .split('\n')[0]
            .replace('Tile ', '')
            .replace(':', '');

        const grid = rawTile.split('\n').slice(1);

        const sides = [];

        sides.push(first(grid));
        sides.push(last(grid));
        sides.push(grid.map(first).join(''));
        sides.push(grid.map(last).join(''));

        acc[tileId] = sides;

        return acc;
    }, {} as { [key: string]: string[] });
};

const getPieceTypes = (tiles: Tiles) => {
    const unmatched: { [key: string]: number } = {};

    for (const id in tiles) {
        const sides = tiles[id];

        let matchedSides = 0;

        for (const side of sides) {
            const reversed = reverse(side);

            for (const neighborId in tiles) {
                if (id === neighborId) continue;

                const neighborSides = tiles[neighborId];

                const reversedNeighborSides = neighborSides.map(reverse);

                if (
                    neighborSides.includes(side) ||
                    neighborSides.includes(reversed) ||
                    reversedNeighborSides.includes(side) ||
                    reversedNeighborSides.includes(reversed)
                ) {
                    matchedSides++;
                }
            }
        }

        unmatched[id] = 4 - matchedSides;
    }

    const corners = [];
    const borders = [];
    const centers = [];

    for (const id in unmatched) {
        const current = unmatched[id];

        if (current === 2) {
            corners.push(id);
        }

        if (current === 1) {
            borders.push(id);
        }

        if (current === 0) {
            centers.push(id);
        }
    }

    return [corners, borders, centers];
};

export function partOne() {
    const tiles = parseTiles(_i);
    const [corners] = getPieceTypes(tiles);

    return corners.reduce((acc, corner) => acc * Number(corner), 1);
}

const parseGrids = (input: string) => {
    const rawTiles = input.split('\n\n');

    return rawTiles.reduce((acc, rawTile) => {
        const tileId = rawTile
            .split('\n')[0]
            .replace('Tile ', '')
            .replace(':', '');

        let grid = rawTile.split('\n').slice(1);

        acc[tileId] = Grid.fromString(grid.join('\n').trim());

        return acc;
    }, {} as { [key: string]: Grid<string> });
};

const checkMatch = (row1: string[], row2: string[]) =>
    row1.join('') === row2.join('');

const isFull = (currArrangement: string[][], gridSize: number) => {
    return (
        currArrangement.length === gridSize &&
        currArrangement.every(row => row.length === gridSize)
    );
};

const checkAbove = (arrangement, addition, row, col) => {
    const gridAbove = arrangement[row - 1][col];

    const topRow = addition.grid.getRow(0);
    const bottomRowOfTopGrid = gridAbove.grid.getRow(gridAbove.grid.rows - 1);

    return checkMatch(topRow, bottomRowOfTopGrid);
};

const checkLeft = (arrangement, addition, row, col) => {
    const gridLeft = arrangement[row][col - 1];

    const firstCol = addition.grid._grid.map(row => row[0]);
    const lastColOfLeftGrid = gridLeft.grid._grid.map(
        row => row[row.length - 1]
    );

    return checkMatch(firstCol, lastColOfLeftGrid);
};

const canAddRow = (arrangement, row, col, addition) => {
    if (row === 0 && col === 0) {
        return true;
    }

    if (col === 0) {
        return checkAbove(arrangement, addition, row, col);
    }

    if (row === 0) {
        return checkLeft(arrangement, addition, row, col);
    }

    return (
        checkAbove(arrangement, addition, row, col) &&
        checkLeft(arrangement, addition, row, col)
    );
};

const findNextPlacement = (currArrangement: string[][], gridSize: number) => {
    for (let i = 0; i < currArrangement.length; ++i) {
        const currRow = currArrangement[i];

        if (currRow.length < gridSize) {
            return [i, currRow.length];
        }
    }
};

const getCurrArrangement = (gridSize: number) => {
    return range(0, gridSize - 1).map(() => []);
};

const isCornerPlacement = (
    nextRow: number,
    nextCol: number,
    gridSize: number
) => {
    return (
        (nextRow === 0 && nextCol === 0) ||
        (nextRow === 0 && nextCol === gridSize - 1) ||
        (nextRow === gridSize - 1 && nextCol === 0) ||
        (nextRow === gridSize - 1 && nextCol === gridSize - 1)
    );
};

const isBorderPlacement = (
    nextRow: number,
    nextCol: number,
    gridSize: number
) => {
    return (
        nextRow === 0 ||
        nextRow === gridSize - 1 ||
        nextCol === 0 ||
        nextCol === gridSize - 1
    );
};

const isCenterPlacement = (
    nextRow: number,
    nextCol: number,
    gridSize: number
) => {
    return (
        !isCornerPlacement(nextRow, nextCol, gridSize) &&
        !isBorderPlacement(nextRow, nextCol, gridSize)
    );
};

const getAllOrientations = (grid: Grid<string>) => {
    const results = [];
    // Try all four arrangements - Regular grid, flipped horizontal,
    // flipped vertical, and flipped both horizontal and vertical.
    for (let i = 0; i < 4; ++i) {
        let flipped = grid;

        // Flip grid horizontally.
        if (i === 1) {
            flipped = grid.flipHorizontal();
        }

        // Flip grid vertically.
        else if (i === 2) {
            flipped = grid.flipVertical();
        }

        // Flip grid both horizontally and vertically.
        else if (i === 3) {
            flipped = grid.flipVertical().flipHorizontal();
        }

        // Rotate in all four opientations.
        for (let j = 0; j < 4; ++j) {
            flipped = flipped.rotateClockwise();
            results.push(flipped);
        }
    }

    return results;
};

const buildArrangements = (
    input: string[],
    gridSize: number,
    corners: string[],
    borders: string[],
    centers: string[],
    usedIndexes = new Set(),
    currArrangement = getCurrArrangement(gridSize)
) => {
    // Check if arrangement was arranged successfully. If so, return the
    // arrangement.
    if (isFull(currArrangement, gridSize)) {
        return currArrangement;
    }

    const [nextRow, nextCol] = findNextPlacement(currArrangement, gridSize);

    for (let gridI = 0; gridI < input.length; ++gridI) {
        if (usedIndexes.has(gridI)) continue;

        const [tileId, grid] = input[gridI];

        const [corner, border, center] = [
            isCornerPlacement,
            isBorderPlacement,
            isCenterPlacement,
        ].map(checker => checker(nextRow, nextCol, gridSize));

        const canPlace =
            (corner && corners.includes(tileId)) ||
            (border && borders.includes(tileId)) ||
            (center && centers.includes(tileId));

        if (!canPlace) continue;

        const orientations = getAllOrientations(grid);

        for (const orientation of orientations) {
            const addition = {
                tileId,
                grid: orientation,
            };

            const canAdd = canAddRow(
                currArrangement,
                nextRow,
                nextCol,
                addition
            );

            if (canAdd) {
                usedIndexes.add(gridI);

                // Add to arrangement
                currArrangement[nextRow][nextCol] = addition;

                // Recruse
                const result = buildArrangements(
                    input,
                    gridSize,
                    corners,
                    borders,
                    centers,
                    usedIndexes,
                    currArrangement
                );

                if (result) {
                    return result;
                }

                usedIndexes.delete(gridI);

                // Remove from arrangement
                currArrangement[nextRow].splice(nextCol, 1);
            }
        }
    }
};

const hashCoords = [
    [0, 18],
    [1, 0],
    [1, 5],
    [1, 6],
    [1, 11],
    [1, 12],
    [1, 17],
    [1, 18],
    [1, 19],
    [2, 1],
    [2, 4],
    [2, 7],
    [2, 10],
    [2, 13],
    [2, 16],
];

const hasSeaMonster = (grid: Grid<string>, i: number, j: number) => {
    if (i > grid.rows - 3 || j > grid.cols - 20) {
        return false;
    }

    for (const [hI, hJ] of hashCoords) {
        if (grid.get(i + hI, j + hJ) !== '#') {
            return false;
        }
    }

    return true;
};

const findSeaMonsters = (grid: Grid<string>) => {
    let totalMonsters = 0;

    grid.forEach((_, row, col) => {
        if (hasSeaMonster(grid, row, col)) totalMonsters++;
    });

    return totalMonsters;
};

const buildMonsterGrid = (result, gridSize: number) => {
    const size = 8 * gridSize;
    const monsterGrid = Grid.fromMatrix(Grid.generateMatrix(size, size, '.'));

    result.forEach((row, rowI) => {
        row.forEach(({ grid }, colI) => {
            grid.forEach((el, gridRow, gridCol) => {
                const matrixRow = rowI * 8 + gridRow;
                const matrixCol = colI * 8 + gridCol;

                monsterGrid.set(matrixRow, matrixCol, el);
            });
        });
    });

    return monsterGrid;
};

const countRemainingHashes = orientation => {
    orientation.forEach((_, row, col) => {
        if (hasSeaMonster(orientation, row, col)) {
            for (const [hI, hJ] of hashCoords) {
                orientation.set(row + hI, col + hJ, 'O');
            }
        }
    });

    return orientation.countElements('#');
};

export function partTwo() {
    const input = parseGrids(_i);
    const tiles = parseTiles(_i);

    const [corners, borders, centers] = getPieceTypes(tiles);

    const gridsWithIds = Object.entries(input);

    const gridSize = Math.sqrt(gridsWithIds.length);

    const result = buildArrangements(
        gridsWithIds,
        gridSize,
        corners,
        borders,
        centers
    );

    for (let i = 0; i < result.length; ++i) {
        for (let j = 0; j < result[i].length; ++j) {
            const current = result[i][j];

            current.grid.spliceRow(0);
            current.grid.spliceRow(current.grid.rows - 1);
            current.grid.spliceCol(0);
            current.grid.spliceCol(current.grid.cols - 1);
        }
    }

    const monsterGrid = buildMonsterGrid(result, gridSize);

    const orientations = getAllOrientations(monsterGrid);

    let totalSeaMonsters = 0;
    let maxOrientation;

    for (const orientation of orientations) {
        const localSeaMonsters = findSeaMonsters(orientation);

        if (localSeaMonsters > totalSeaMonsters) {
            totalSeaMonsters = localSeaMonsters;
            maxOrientation = orientation;
        }
    }

    return countRemainingHashes(maxOrientation);
}
