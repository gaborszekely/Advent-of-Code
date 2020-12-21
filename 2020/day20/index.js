// https://adventofcode.com/2020/day/20

const { getInput, getTestInput, Grid, range } = require('../../utils');

const i = getInput(__dirname);
const _i = getTestInput(__dirname);

class Tile {
    constructor(id) {
        this.id = id;
        this.edges = [];
        this.matchedEdges = [];
        this.unmatchedSides = 0;
    }

    addEdge(edge) {
        this.edges.push(edge);
        this.edges.push(edge.split('').reverse().join(''));
        this.matchedEdges.push(false, false);
    }

    countUnmatched() {
        let unmatched = 0;

        for (let i = 0; i < this.matchedEdges.length; i += 2) {
            if (!this.matchedEdges[i] && !this.matchedEdges[i + 1]) unmatched++;
        }

        this.unmatchedSides = unmatched;
    }
}

const parseTiles = input => {
    const rawTiles = input.split('\n\n');

    return rawTiles.reduce((acc, rawTile) => {
        const tileId = rawTile
            .split('\n')[0]
            .replace('Tile ', '')
            .replace(':', '');

        const grid = rawTile.split('\n').slice(1);

        const tile = new Tile(tileId);
        const edges = [];

        edges.push(grid[0]);
        edges.push(grid[grid.length - 1]);
        edges.push(grid.map(row => row[0]).join(''));
        edges.push(grid.map(row => row[row.length - 1]).join(''));

        edges.forEach(edge => {
            tile.addEdge(edge);
        });

        acc[tileId] = tile;

        return acc;
    }, {});
};

const setUnmatchedCount = tiles => {
    for (const tile of tiles) {
        tile.edges.forEach((edge, edgeNumber) => {
            for (const potentialMatch of tiles) {
                if (tile.id === potentialMatch.id) continue;

                if (potentialMatch.edges.includes(edge)) {
                    tile.matchedEdges[edgeNumber] = true;
                    break;
                }
            }
        });

        tile.countUnmatched();
    }
};

const getPieceTypes = tiles => {
    setUnmatchedCount(tiles);

    const corners = [];
    const borders = [];
    const centers = [];

    for (const tile of tiles) {
        if (tile.unmatchedSides === 2) {
            corners.push(tile.id);
        }

        if (tile.unmatchedSides === 1) {
            borders.push(tile.id);
        }

        if (tile.unmatchedSides === 0) {
            centers.push(tile.id);
        }
    }

    return [corners, borders, centers];
};

exports.partOne = () => {
    const tiles = Object.values(parseTiles(i));
    const [corners] = getPieceTypes(tiles);

    return corners.reduce((acc, corner) => acc * Number(corner), 1);
};

const parseGrids = input => {
    const rawTiles = input.split('\n\n');

    return rawTiles.reduce((acc, rawTile) => {
        const tileId = rawTile
            .split('\n')[0]
            .replace('Tile ', '')
            .replace(':', '');

        let grid = rawTile.split('\n').slice(1);

        acc[tileId] = new Grid(grid.join('\n').trim());

        return acc;
    }, {});
};

const checkMatch = (row1, row2) => {
    for (let i = 0; i < row1.length; ++i) {
        if (row1[i] !== row2[i]) return false;
    }

    return true;
};

const isFull = (currArrangement, gridSize) => {
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

// Adds a new grid to the arrangement.

const canAddRow = (arrangement, row, col, addition) => {
    if (row === 0 && col === 0) {
        return true;
    }

    // Check against the grid above
    if (col === 0) {
        return checkAbove(arrangement, addition, row, col);
    }

    if (row === 0) {
        // Check against grid above, and to the left
        return checkLeft(arrangement, addition, row, col);
    }

    // Check against grid above, and to the left
    return (
        checkAbove(arrangement, addition, row, col) &&
        checkLeft(arrangement, addition, row, col)
    );
};

const findNextPlacement = (currArrangement, gridSize) => {
    for (let i = 0; i < currArrangement.length; ++i) {
        const currRow = currArrangement[i];

        if (currRow.length < gridSize) {
            return [i, currRow.length];
        }
    }
};

const getCurrArrangement = gridSize => {
    return range(0, gridSize - 1).map(() => []);
};

const isCornerPlacement = (nextRow, nextCol, gridSize) => {
    return (
        (nextRow === 0 && nextCol === 0) ||
        (nextRow === 0 && nextCol === gridSize - 1) ||
        (nextRow === gridSize - 1 && nextCol === 0) ||
        (nextRow === gridSize - 1 && nextCol === gridSize - 1)
    );
};

const isBorderPlacement = (nextRow, nextCol, gridSize) => {
    return (
        nextRow === 0 ||
        nextRow === gridSize - 1 ||
        nextCol === 0 ||
        nextCol === gridSize - 1
    );
};

const getAllOrientations = grid => {
    const results = [];
    // Try all four arrangements - Regular grid, flipped horizontal,
    // flipped vertical, and flipped both horizontal and vertical.
    for (let i = 0; i < 4; ++i) {
        let flipped = grid;

        // flip grid horizontally
        if (i === 1) {
            flipped = grid.flipHorizontal();
        }

        // flip grid vertically
        else if (i === 2) {
            flipped = grid.flipVertical();
        }

        // flip grid both horizontally and vertically
        else if (i === 3) {
            flipped = grid.flipVertical().flipHorizontal();
        }

        for (let j = 0; j < 4; ++j) {
            flipped = flipped.rotateClockwise();
            results.push(flipped);
        }
    }

    return results;
};

const buildArrangements = (
    input,
    gridSize,
    corners,
    borders,
    centers,
    usedIndexes = new Set(),
    currArrangement = getCurrArrangement(gridSize)
) => {
    // Check if arrangement was made successfully. If so, return.
    if (isFull(currArrangement, gridSize)) {
        return currArrangement;
    }

    const [nextRow, nextCol] = findNextPlacement(currArrangement, gridSize);

    // For each available index
    for (let gridI = 0; gridI < input.length; ++gridI) {
        if (usedIndexes.has(gridI)) continue;

        const [tileId, grid] = input[gridI];

        if (isCornerPlacement(nextRow, nextCol, gridSize)) {
            if (!corners.includes(tileId)) {
                continue;
            }
        } else if (isBorderPlacement(nextRow, nextCol, gridSize)) {
            if (!borders.includes(tileId)) continue;
        } else {
            if (!centers.includes(tileId)) continue;
        }

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

        // Try all four arrangements - Regular grid, flipped horizontal,
        // flipped vertical, and flipped both horizontal and vertical.
        // for (let i = 0; i < 4; ++i) {
        //     let flipped = grid;

        //     // flip grid horizontally
        //     if (i === 1) {
        //         flipped = grid.flipHorizontal();
        //     }

        //     // flip grid vertically
        //     else if (i === 2) {
        //         flipped = grid.flipVertical();
        //     }

        //     // flip grid both horizontally and vertically
        //     else if (i === 3) {
        //         flipped = grid.flipVertical().flipHorizontal();
        //     }

        //     for (let j = 0; j < 4; ++j) {
        //         flipped = flipped.rotateClockwise();

        //         const addition = {
        //             tileId,
        //             grid: flipped,
        //         };

        //         const canAdd = canAddRow(
        //             currArrangement,
        //             nextRow,
        //             nextCol,
        //             addition
        //         );

        //         if (canAdd) {
        //             usedIndexes.add(gridI);

        //             // Add to arrangement
        //             currArrangement[nextRow][nextCol] = addition;

        //             // Recruse
        //             const result = buildArrangements(
        //                 input,
        //                 gridSize,
        //                 corners,
        //                 borders,
        //                 centers,
        //                 usedIndexes,
        //                 currArrangement
        //             );

        //             if (result) {
        //                 return result;
        //             }

        //             usedIndexes.delete(gridI);

        //             // Remove from arrangement
        //             currArrangement[nextRow].splice(nextCol, 1);
        //         }
        //     }
        // }
    }
};

    // 18 to the right
    // 1 down, 0 right
    // 1 down, 5+6 right
    // 1 down, 11+12 right
    // 1 down, 17,18,19 right

    // 2 down, 1 right
    // 2 down, 4 right
    // 2 down, 7 right
    // 2 down, 10 right
    // 2 down, 13 right
    // 2 down, 16 right

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

const hasSeaMonster = (grid, i, j) => {
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

const findSeaMonsters = grid => {
    let totalMonsters = 0;

    grid.forEach((el, row, col) => {
        if (hasSeaMonster(grid, row, col)) totalMonsters++;
    });

    return totalMonsters;
};

const buildMonsterGrid = (result, gridSize) => {
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

const countRemainingHashes = (orientation) => {
  orientation.forEach((_, row, col) => {
    if (hasSeaMonster(orientation, row, col)) {
      for (const [hI, hJ] of hashCoords) {
       orientation.set(row + hI, col + hJ, 'O');
    }
    }
  });

  let totalHashes = 0;

  return orientation.countElements('#');
};

exports.partTwo = () => {
    const input = parseGrids(i);

    const tiles = Object.values(parseTiles(i));

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
        // console.log(localSeaMonsters);
        if (localSeaMonsters > totalSeaMonsters) {
          totalSeaMonsters = localSeaMonsters;
          maxOrientation = orientation;
        }
    }

    return countRemainingHashes(maxOrientation);

    return totalSeaMonsters;
};
