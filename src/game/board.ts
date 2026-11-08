import type {
  Board,
  BoardConfig,
  Cell,
  Position,
  RevealResult,
} from "./types.ts";

const getItem = <T>(items: readonly T[], index: number): T => {
  const item = items[index];

  if (item === undefined) {
    throw new Error(`Index ${index} is out of bounds.`);
  }

  return item;
};

const assertValidConfig = (config: BoardConfig): void => {
  const { rows, columns, mines } = config;

  if (!Number.isInteger(rows) || rows <= 0) {
    throw new Error("Board rows must be a positive integer.");
  }

  if (!Number.isInteger(columns) || columns <= 0) {
    throw new Error("Board columns must be a positive integer.");
  }

  if (!Number.isInteger(mines) || mines < 0) {
    throw new Error("Board mines must be a non-negative integer.");
  }

  if (mines >= rows * columns) {
    throw new Error("Board must contain at least one safe cell.");
  }
};

const forEachNeighbor = (
  config: BoardConfig,
  row: number,
  column: number,
  visit: (row: number, column: number) => void,
): void => {
  const startRow = Math.max(0, row - 1);
  const endRow = Math.min(config.rows - 1, row + 1);
  const startColumn = Math.max(0, column - 1);
  const endColumn = Math.min(config.columns - 1, column + 1);

  for (let neighborRow = startRow; neighborRow <= endRow; neighborRow++) {
    for (
      let neighborColumn = startColumn;
      neighborColumn <= endColumn;
      neighborColumn++
    ) {
      if (neighborRow === row && neighborColumn === column) continue;

      visit(neighborRow, neighborColumn);
    }
  }
};

const isInBounds = (board: Board, row: number, column: number): boolean =>
  row >= 0 &&
  row < board.config.rows &&
  column >= 0 &&
  column < board.config.columns;

const cloneCells = (board: Board): Cell[][] =>
  board.cells.map(row => row.map(cell => ({ ...cell })));

const withCells = (board: Board, cells: Cell[][]): Board => ({
  ...board,
  cells,
});

const pickMineIndices = (
  totalCells: number,
  mines: number,
  random: () => number,
): Set<number> => {
  const indices = Array.from({ length: totalCells }, (_, index) => index);

  for (let index = 0; index < mines; index++) {
    const remaining = totalCells - index;
    const offset = Math.min(
      Math.max(Math.floor(random() * remaining), 0),
      remaining - 1,
    );
    const swapIndex = index + offset;

    const current = getItem(indices, index);
    indices[index] = getItem(indices, swapIndex);
    indices[swapIndex] = current;
  }

  return new Set(indices.slice(0, mines));
};

export const createBoard = (
  config: BoardConfig,
  random: () => number = Math.random,
): Board => {
  assertValidConfig(config);

  const { rows, columns, mines } = config;
  const totalCells = rows * columns;
  const flatCells: Cell[] = Array.from({ length: totalCells }, () => ({
    mine: false,
    adjacentMines: 0,
    state: "hidden",
  }));

  for (const mineIndex of pickMineIndices(totalCells, mines, random)) {
    flatCells[mineIndex] = {
      ...getItem(flatCells, mineIndex),
      mine: true,
    };
  }

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const index = row * columns + column;
      const cell = getItem(flatCells, index);

      if (cell.mine) continue;

      let adjacentMines = 0;

      forEachNeighbor(config, row, column, (neighborRow, neighborColumn) => {
        const neighbor = getItem(
          flatCells,
          neighborRow * columns + neighborColumn,
        );

        if (neighbor.mine) adjacentMines++;
      });

      flatCells[index] = { ...cell, adjacentMines };
    }
  }

  const cells: Cell[][] = [];

  for (let row = 0; row < rows; row++) {
    const start = row * columns;
    cells.push(flatCells.slice(start, start + columns));
  }

  return { config: { ...config }, cells };
};

/**
 * Reveals one cell. Revealing a cell with no adjacent mines opens the whole
 * connected empty area, but never reveals flagged or already revealed cells.
 */
export const revealCell = (
  board: Board,
  row: number,
  column: number,
): RevealResult => {
  if (!isInBounds(board, row, column)) {
    return { board, hitMine: false, changed: false };
  }

  const target = getItem(getItem(board.cells, row), column);

  if (target.state !== "hidden") {
    return { board, hitMine: false, changed: false };
  }

  const cells = cloneCells(board);
  const nextTarget = getItem(getItem(cells, row), column);

  if (nextTarget.mine) {
    nextTarget.state = "revealed";

    return { board: withCells(board, cells), hitMine: true, changed: true };
  }

  const queue: Position[] = [{ row, column }];

  while (queue.length > 0) {
    const position = queue.pop();

    if (!position) continue;

    const cell = getItem(getItem(cells, position.row), position.column);

    if (cell.state !== "hidden" || cell.mine) continue;

    cell.state = "revealed";

    if (cell.adjacentMines !== 0) continue;

    forEachNeighbor(
      board.config,
      position.row,
      position.column,
      (neighborRow, neighborColumn) => {
        const neighbor = getItem(getItem(cells, neighborRow), neighborColumn);

        if (neighbor.state === "hidden" && !neighbor.mine) {
          queue.push({ row: neighborRow, column: neighborColumn });
        }
      },
    );
  }

  return { board: withCells(board, cells), hitMine: false, changed: true };
};

export const toggleFlag = (
  board: Board,
  row: number,
  column: number,
): Board => {
  if (!isInBounds(board, row, column)) return board;

  const cell = getItem(getItem(board.cells, row), column);

  if (cell.state === "revealed") return board;

  const cells = cloneCells(board);
  const nextCell = getItem(getItem(cells, row), column);

  nextCell.state = nextCell.state === "flagged" ? "hidden" : "flagged";

  return withCells(board, cells);
};

export const revealAllMines = (board: Board): Board => {
  const cells = cloneCells(board);

  for (const row of cells) {
    for (const cell of row) {
      if (cell.mine) cell.state = "revealed";
    }
  }

  return withCells(board, cells);
};

export const countFlags = (board: Board): number => {
  let count = 0;

  for (const row of board.cells) {
    for (const cell of row) {
      if (cell.state === "flagged") count++;
    }
  }

  return count;
};

export const countRemainingMines = (board: Board): number =>
  board.config.mines - countFlags(board);

export const isWon = (board: Board): boolean => {
  for (const row of board.cells) {
    for (const cell of row) {
      if (!cell.mine && cell.state !== "revealed") return false;
    }
  }

  return true;
};
