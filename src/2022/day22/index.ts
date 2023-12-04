// https://adventofcode.com/2022/day/22

import { getInput } from '@utils/fs';
import { convertToCircularLinkedList } from '@utils/linkedlist';
import { Console } from 'console';

const input = getInput(__dirname);
const lines = input.split('\n');
const last = lines.pop();
lines.pop();

const DIRECTIONS = ['R', 'D', 'L', 'U'] as const;
type Direction = (typeof DIRECTIONS)[number];
type RotateDirection = Extract<Direction, 'L' | 'R'>;

const board = lines.map(row => row.split(''));

const instructions = [...last.matchAll(/\d+|[LR]/g)].map(match => {
    const [, direction] = match[0].match(/(\d+|[LR])/);

    return !isNaN(Number(direction))
        ? Number(direction)
        : (direction as RotateDirection);
});

const isOutOfBounds = (x: number, y: number) =>
    board[x]?.[y] === ' ' || board[x]?.[y] === undefined;

const getNewCoords = (x: number, y: number, direction: Direction) => {
    switch (direction) {
        case 'R': {
            let newY = y + 1;
            if (isOutOfBounds(x, newY)) {
                while (true) {
                    newY--;
                    if (newY === 0 || board[x][newY - 1] === ' ') {
                        break;
                    }
                }
            }
            return [x, newY];
        }
        case 'D': {
            let newX = x + 1;
            if (isOutOfBounds(newX, y)) {
                while (true) {
                    newX--;
                    if (
                        board[newX - 1]?.[y] === undefined ||
                        board[newX - 1][y] === ' '
                    ) {
                        break;
                    }
                }
            }
            return [newX, y];
        }
        case 'L': {
            let newY = y - 1;
            if (isOutOfBounds(x, newY)) {
                while (true) {
                    newY++;
                    if (
                        newY === board[x].length - 1 ||
                        board[x][newY + 1] === ' '
                    ) {
                        break;
                    }
                }
            }
            return [x, newY];
        }
        case 'U': {
            let newX = x - 1;
            if (isOutOfBounds(newX, y)) {
                while (true) {
                    newX++;
                    if (
                        board[newX + 1]?.[y] === undefined ||
                        board[newX + 1][y] === ' '
                    ) {
                        break;
                    }
                }
            }
            return [newX, y];
        }
    }
};

const move = (
    startX: number,
    startY: number,
    direction: Direction,
    amount: number
) => {
    let x = startX;
    let y = startY;
    for (let i = 0; i < amount; ++i) {
        const [newX, newY] = getNewCoords(x, y, direction);
        if (board[newX][newY] === '.') {
            x = newX;
            y = newY;
        } else {
            break;
        }
    }
    return [x, y];
};

const getScore = (x: number, y: number, direction: Direction) => {
    return 1000 * (x + 1) + 4 * (y + 1) + DIRECTIONS.indexOf(direction);
};

const getNewDirection = (
    direction: Direction,
    rotateDirection: RotateDirection
) => {
    const currentIndex = DIRECTIONS.indexOf(direction);

    if (rotateDirection === 'R') {
        return DIRECTIONS[(currentIndex + 1) % DIRECTIONS.length];
    } else {
        return DIRECTIONS[
            currentIndex - 1 >= 0 ? currentIndex - 1 : DIRECTIONS.length - 1
        ];
    }
};

export function partOne() {
    let x = 0;
    let y = board[0].indexOf('.');
    let direction: Direction = 'R';
    for (const instruction of instructions) {
        if (typeof instruction === 'number') {
            [x, y] = move(x, y, direction, instruction);
        } else {
            direction = getNewDirection(direction, instruction);
        }
    }
    return getScore(x, y, direction);
}

const factors: { [key: string]: [number, number] } = {
    1: [0, 1],
    2: [0, 2],
    3: [1, 1],
    4: [2, 1],
    5: [2, 0],
    6: [3, 0],
};

const getRelativeFromRealCoords = (
    x: number,
    y: number,
    quadrant: number,
    gridSize: number
) => [x - gridSize * factors[quadrant][0], y - gridSize * factors[quadrant][1]];

const getRealFromRelativeCoords = (
    x: number,
    y: number,
    quadrant: number,
    gridSize: number
) => [x + factors[quadrant][0] * gridSize, y + factors[quadrant][1] * gridSize];

const isOutOfQuadrantBounds = (x: number, y: number, gridSize: number) => {
    return x < 0 || x >= gridSize || y < 0 || y >= gridSize;
};

const getNewCubeCoords = (
    x: number,
    y: number,
    quadrant: number,
    direction: Direction,
    gridSize: number
): [number, number, number, Direction] => {
    switch (direction) {
        case 'R': {
            let newY = y + 1;
            if (!isOutOfQuadrantBounds(x, newY, gridSize)) {
                return [x, newY, quadrant, direction];
            }
            switch (quadrant) {
                case 1: {
                    return [x, 0, 2, 'R'];
                }
                case 2:
                    return [gridSize - 1 - x, gridSize - 1, 4, 'L'];
                case 3:
                    return [gridSize - 1, x, 2, 'U'];
                case 4: {
                    return [gridSize - 1 - x, gridSize - 1, 2, 'L'];
                }
                case 5:
                    return [x, 0, 4, 'R'];
                case 6:
                    return [gridSize - 1, x, 4, 'U'];
            }
        }

        case 'D': {
            let newX = x + 1;
            if (!isOutOfQuadrantBounds(newX, y, gridSize)) {
                return [newX, y, quadrant, direction];
            }
            switch (quadrant) {
                case 1:
                    return [0, y, 3, 'D'];
                case 2:
                    return [y, gridSize - 1, 3, 'L'];
                case 3:
                    return [0, y, 4, 'D'];
                case 4:
                    return [y, gridSize - 1, 6, 'L'];
                case 5: {
                    return [0, y, 6, 'D'];
                }
                case 6:
                    return [0, y, 2, 'D'];
            }
        }

        case 'L': {
            let newY = y - 1;
            if (!isOutOfQuadrantBounds(x, newY, gridSize)) {
                return [x, newY, quadrant, direction];
            }
            switch (quadrant) {
                case 1:
                    return [gridSize - 1 - x, 0, 5, 'R'];
                case 2:
                    return [x, gridSize - 1, 1, 'L'];
                case 3:
                    return [0, x, 5, 'D'];
                case 4:
                    return [x, gridSize - 1, 5, 'L'];
                case 5:
                    return [gridSize - 1 - x, 0, 1, 'R'];
                case 6:
                    return [0, x, 1, 'D'];
            }
        }

        case 'U': {
            let newX = x - 1;
            if (!isOutOfQuadrantBounds(newX, y, gridSize)) {
                return [newX, y, quadrant, direction];
            }
            switch (quadrant) {
                case 1:
                    return [y, 0, 6, 'R'];
                case 2:
                    return [gridSize - 1, y, 6, 'U'];
                case 3:
                    return [gridSize - 1, y, 1, 'U'];
                case 4:
                    return [gridSize - 1, y, 3, 'U'];
                case 5:
                    return [y, 0, 3, 'R'];
                case 6:
                    return [gridSize - 1, y, 5, 'U'];
            }
        }
    }
};

const moveInCube = (
    startX: number,
    startY: number,
    direction: Direction,
    amount: number,
    quadrant: number,
    gridSize: number
) => {
    let x = startX;
    let y = startY;
    for (let i = 0; i < amount; ++i) {
        const [newX, newY, newQuadrant, newDirection] = getNewCubeCoords(
            x,
            y,
            quadrant,
            direction,
            gridSize
        );
        const [realX, realY] = getRealFromRelativeCoords(
            newX,
            newY,
            newQuadrant,
            gridSize
        );
        if (board[realX][realY] === '.') {
            x = newX;
            y = newY;
            quadrant = newQuadrant;
            direction = newDirection;
        } else {
            break;
        }
    }
    return [x, y, quadrant, direction] as const;
};

export function partTwo() {
    let quadrant = 1;
    let direction: Direction = 'R';
    const gridSize = 50;
    let [x, y] = getRelativeFromRealCoords(
        0,
        board[0].indexOf('.'),
        quadrant,
        gridSize
    );

    for (const instruction of instructions) {
        if (typeof instruction === 'number') {
            const [newX, newY, newQuadrant, newDirection] = moveInCube(
                x,
                y,
                direction,
                instruction,
                quadrant,
                gridSize
            );
            x = newX;
            y = newY;
            quadrant = newQuadrant;
            direction = newDirection;
        } else {
            direction = getNewDirection(direction, instruction);
        }
    }

    const [realX, realY] = getRealFromRelativeCoords(x, y, quadrant, gridSize);

    return getScore(realX, realY, direction);
}
