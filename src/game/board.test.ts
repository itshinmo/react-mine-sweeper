import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  countFlags,
  countRemainingMines,
  createBoard,
  isWon,
  revealAllMines,
  revealCell,
  toggleFlag,
} from "./board.ts";
import type { Board, Cell } from "./types.ts";

const cellAt = (board: Board, row: number, column: number): Cell => {
  const cell = board.cells[row]?.[column];

  if (!cell) {
    throw new Error(`No cell at row ${row}, column ${column}.`);
  }

  return cell;
};

const seededRandom = (seed: number): (() => number) => {
  let value = seed;

  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;

    return value / 0x100000000;
  };
};

const countMines = (board: Board): number => {
  let count = 0;

  for (const row of board.cells) {
    for (const cell of row) {
      if (cell.mine) count++;
    }
  }

  return count;
};

describe("createBoard", () => {
  it("places the requested number of unique mines", () => {
    const board = createBoard(
      { rows: 10, columns: 10, mines: 99 },
      seededRandom(7),
    );

    assert.equal(countMines(board), 99);
  });

  it("places mines at the start of the board when the random source returns 0", () => {
    const board = createBoard({ rows: 3, columns: 3, mines: 2 }, () => 0);

    assert.equal(cellAt(board, 0, 0).mine, true);
    assert.equal(cellAt(board, 0, 1).mine, true);
    assert.equal(cellAt(board, 0, 2).mine, false);
  });

  it("calculates adjacent mine counts", () => {
    const board = createBoard({ rows: 3, columns: 3, mines: 1 }, () => 0);

    assert.equal(cellAt(board, 0, 1).adjacentMines, 1);
    assert.equal(cellAt(board, 1, 0).adjacentMines, 1);
    assert.equal(cellAt(board, 1, 1).adjacentMines, 1);
    assert.equal(cellAt(board, 2, 2).adjacentMines, 0);
  });

  it("supports rectangular boards", () => {
    const board = createBoard({ rows: 2, columns: 4, mines: 1 }, () => 0);

    assert.equal(board.cells.length, 2);
    assert.equal(board.cells[0]?.length, 4);
    assert.equal(cellAt(board, 0, 0).mine, true);
    assert.equal(cellAt(board, 0, 1).adjacentMines, 1);
    assert.equal(cellAt(board, 1, 0).adjacentMines, 1);
    assert.equal(cellAt(board, 1, 3).adjacentMines, 0);
  });

  it("rejects invalid configurations", () => {
    assert.throws(() => createBoard({ rows: 0, columns: 3, mines: 0 }), /rows/);
    assert.throws(
      () => createBoard({ rows: 3, columns: 0, mines: 0 }),
      /columns/,
    );
    assert.throws(
      () => createBoard({ rows: 3, columns: 3, mines: -1 }),
      /mines/,
    );
    assert.throws(
      () => createBoard({ rows: 3, columns: 3, mines: 1.5 }),
      /mines/,
    );
    assert.throws(
      () => createBoard({ rows: 2.5, columns: 3, mines: 1 }),
      /rows/,
    );
    assert.throws(
      () => createBoard({ rows: 3, columns: 3, mines: 9 }),
      /safe cell/,
    );
  });
});

describe("revealCell", () => {
  it("reveals a connected empty area and stops at numbered cells", () => {
    const board = createBoard({ rows: 3, columns: 3, mines: 1 }, () => 0);
    const result = revealCell(board, 2, 2);

    assert.equal(result.changed, true);
    assert.equal(result.hitMine, false);
    assert.equal(cellAt(result.board, 0, 0).state, "hidden");
    assert.equal(cellAt(result.board, 0, 1).state, "revealed");
    assert.equal(cellAt(result.board, 2, 2).state, "revealed");
    assert.equal(isWon(result.board), true);
  });

  it("only reveals a numbered cell without flood filling", () => {
    const board = createBoard({ rows: 3, columns: 3, mines: 1 }, () => 0);
    const result = revealCell(board, 0, 1);

    assert.equal(result.changed, true);
    assert.equal(cellAt(result.board, 0, 1).state, "revealed");
    assert.equal(cellAt(result.board, 1, 1).state, "hidden");
    assert.equal(isWon(result.board), false);
  });

  it("does not reveal a flagged cell", () => {
    const board = createBoard({ rows: 3, columns: 3, mines: 1 }, () => 0);
    const flagged = toggleFlag(board, 2, 2);
    const result = revealCell(flagged, 2, 2);

    assert.equal(result.changed, false);
    assert.strictEqual(result.board, flagged);
  });

  it("keeps flags in place while flood filling", () => {
    const board = createBoard({ rows: 3, columns: 3, mines: 1 }, () => 0);
    const flagged = toggleFlag(board, 2, 2);
    const result = revealCell(flagged, 2, 1);

    assert.equal(result.changed, true);
    assert.equal(cellAt(result.board, 2, 2).state, "flagged");
    assert.equal(isWon(result.board), false);
  });

  it("reports a mine hit without revealing the other cells", () => {
    const board = createBoard({ rows: 3, columns: 3, mines: 1 }, () => 0);
    const result = revealCell(board, 0, 0);

    assert.equal(result.changed, true);
    assert.equal(result.hitMine, true);
    assert.equal(cellAt(result.board, 0, 0).state, "revealed");
    assert.equal(cellAt(result.board, 2, 2).state, "hidden");
  });

  it("ignores out of bounds positions", () => {
    const board = createBoard({ rows: 3, columns: 3, mines: 1 }, () => 0);
    const result = revealCell(board, -1, 0);

    assert.equal(result.changed, false);
    assert.strictEqual(result.board, board);
  });

  it("does not mutate the original board", () => {
    const board = createBoard({ rows: 3, columns: 3, mines: 1 }, () => 0);
    const snapshot = JSON.stringify(board);

    revealCell(board, 2, 2);

    assert.equal(JSON.stringify(board), snapshot);
  });

  it("handles large empty boards without overflowing the call stack", () => {
    const board = createBoard({ rows: 100, columns: 100, mines: 0 });
    const result = revealCell(board, 50, 50);

    assert.equal(result.changed, true);
    assert.equal(isWon(result.board), true);
  });
});

describe("toggleFlag", () => {
  it("toggles a hidden cell between hidden and flagged", () => {
    const board = createBoard({ rows: 3, columns: 3, mines: 1 }, () => 0);
    const flagged = toggleFlag(board, 2, 2);

    assert.equal(cellAt(flagged, 2, 2).state, "flagged");
    assert.equal(cellAt(board, 2, 2).state, "hidden");

    const unflagged = toggleFlag(flagged, 2, 2);

    assert.equal(cellAt(unflagged, 2, 2).state, "hidden");
  });

  it("does not flag a revealed cell", () => {
    const board = createBoard({ rows: 3, columns: 3, mines: 1 }, () => 0);
    const revealed = revealCell(board, 0, 1).board;

    assert.strictEqual(toggleFlag(revealed, 0, 1), revealed);
  });

  it("ignores out of bounds positions", () => {
    const board = createBoard({ rows: 3, columns: 3, mines: 1 }, () => 0);

    assert.strictEqual(toggleFlag(board, 3, 0), board);
  });
});

describe("winning", () => {
  it("is not won while safe cells are still hidden", () => {
    const board = createBoard({ rows: 3, columns: 3, mines: 1 }, () => 0);

    assert.equal(isWon(board), false);
  });

  it("is won when every safe cell is revealed, even if mines are flagged", () => {
    const board = createBoard({ rows: 3, columns: 3, mines: 1 }, () => 0);
    const flaggedMine = toggleFlag(board, 0, 0);
    const result = revealCell(flaggedMine, 2, 2);

    assert.equal(isWon(result.board), true);
  });

  it("is not won while a safe cell is flagged instead of revealed", () => {
    const board = createBoard({ rows: 3, columns: 3, mines: 1 }, () => 0);
    const flagged = toggleFlag(board, 2, 2);
    const result = revealCell(flagged, 2, 1);

    assert.equal(isWon(result.board), false);
  });
});

describe("counters", () => {
  it("tracks flags and allows the remaining mine count to go negative", () => {
    const board = createBoard({ rows: 3, columns: 3, mines: 1 }, () => 0);

    assert.equal(countFlags(board), 0);
    assert.equal(countRemainingMines(board), 1);

    const flaggedMine = toggleFlag(board, 0, 0);

    assert.equal(countFlags(flaggedMine), 1);
    assert.equal(countRemainingMines(flaggedMine), 0);

    const flaggedSafeCell = toggleFlag(flaggedMine, 2, 2);

    assert.equal(countFlags(flaggedSafeCell), 2);
    assert.equal(countRemainingMines(flaggedSafeCell), -1);
  });
});

describe("revealAllMines", () => {
  it("reveals every mine without revealing safe cells", () => {
    const board = createBoard({ rows: 3, columns: 3, mines: 2 }, () => 0);
    const result = revealAllMines(board);

    assert.equal(cellAt(result, 0, 0).state, "revealed");
    assert.equal(cellAt(result, 0, 1).state, "revealed");
    assert.equal(cellAt(result, 1, 1).state, "hidden");
  });

  it("reveals flagged mines on loss", () => {
    const board = createBoard({ rows: 3, columns: 3, mines: 1 }, () => 0);
    const flaggedMine = toggleFlag(board, 0, 0);
    const result = revealAllMines(flaggedMine);

    assert.equal(cellAt(result, 0, 0).state, "revealed");
  });
});
