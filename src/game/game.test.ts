import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createBoard } from "./board.ts";
import {
  createGameState,
  gameReducer,
  getRemainingMines,
  MAX_ELAPSED_SECONDS,
} from "./game.ts";
import type { GameState } from "./game.ts";
import type { BoardConfig, Cell } from "./types.ts";

const CONFIG: BoardConfig = { rows: 2, columns: 2, mines: 1 };

const createState = (): GameState => createGameState(CONFIG, () => 0);

const cellAt = (state: GameState, row: number, column: number): Cell => {
  const cell = state.board.cells[row]?.[column];

  if (!cell) {
    throw new Error(`No cell at row ${row}, column ${column}.`);
  }

  return cell;
};

const revealAllSafeCells = (state: GameState): GameState => {
  let current = state;

  for (const [row, column] of [
    [0, 1],
    [1, 0],
    [1, 1],
  ] as const) {
    current = gameReducer(current, { type: "reveal", row, column });
  }

  return current;
};

describe("createGameState", () => {
  it("creates a running game with a stopped timer", () => {
    const state = createState();

    assert.equal(state.status, "running");
    assert.equal(state.elapsedSeconds, 0);
    assert.equal(state.hasStarted, false);
    assert.deepEqual(state.board.config, CONFIG);
  });
});

describe("gameReducer timer", () => {
  it("does not tick before the first reveal", () => {
    const state = createState();

    assert.strictEqual(gameReducer(state, { type: "tick" }), state);
  });

  it("starts on the first successful reveal", () => {
    const state = createState();
    const revealed = gameReducer(state, { type: "reveal", row: 0, column: 1 });

    assert.equal(revealed.hasStarted, true);
    assert.equal(revealed.status, "running");

    const ticked = gameReducer(revealed, { type: "tick" });

    assert.equal(ticked.elapsedSeconds, 1);
  });

  it("does not start when flagging", () => {
    const state = createState();
    const flagged = gameReducer(state, {
      type: "toggle-flag",
      row: 0,
      column: 0,
    });

    assert.equal(flagged.hasStarted, false);
  });

  it("does not start when a reveal is ignored", () => {
    const state = createState();
    const flagged = gameReducer(state, {
      type: "toggle-flag",
      row: 1,
      column: 1,
    });
    const result = gameReducer(flagged, {
      type: "reveal",
      row: 1,
      column: 1,
    });

    assert.strictEqual(result, flagged);
    assert.equal(result.hasStarted, false);
  });

  it("caps the elapsed time at the display limit", () => {
    const state = {
      ...createState(),
      hasStarted: true,
      elapsedSeconds: MAX_ELAPSED_SECONDS,
    };

    assert.strictEqual(gameReducer(state, { type: "tick" }), state);
  });
});

describe("gameReducer reveal", () => {
  it("starts the game on the first reveal and ignores reveals after a win", () => {
    const state = revealAllSafeCells(createState());

    assert.equal(state.status, "won");
    assert.equal(state.hasStarted, true);
    assert.strictEqual(
      gameReducer(state, { type: "reveal", row: 1, column: 0 }),
      state,
    );
  });

  it("wins when all safe cells are revealed, even with the mine flagged", () => {
    const flagged = gameReducer(createState(), {
      type: "toggle-flag",
      row: 0,
      column: 0,
    });
    const state = revealAllSafeCells(flagged);

    assert.equal(state.status, "won");
    assert.equal(cellAt(state, 0, 0).state, "flagged");
  });

  it("loses on a mine and reveals every mine", () => {
    const state = createState();
    const lost = gameReducer(state, { type: "reveal", row: 0, column: 0 });

    assert.equal(lost.status, "lost");
    assert.equal(cellAt(lost, 0, 0).state, "revealed");
    assert.equal(cellAt(lost, 1, 1).state, "hidden");
  });

  it("ignores reveal and flag actions after losing", () => {
    const lost = gameReducer(createState(), {
      type: "reveal",
      row: 0,
      column: 0,
    });

    assert.strictEqual(
      gameReducer(lost, { type: "reveal", row: 1, column: 1 }),
      lost,
    );
    assert.strictEqual(
      gameReducer(lost, { type: "toggle-flag", row: 1, column: 1 }),
      lost,
    );
  });
});

describe("gameReducer flags", () => {
  it("updates the remaining mine count", () => {
    const state = createState();

    assert.equal(getRemainingMines(state), 1);

    const flagged = gameReducer(state, {
      type: "toggle-flag",
      row: 0,
      column: 0,
    });

    assert.equal(getRemainingMines(flagged), 0);
  });
});

describe("gameReducer reset", () => {
  it("resets the board, status, and timer", () => {
    const lost = gameReducer(
      {
        ...createState(),
        elapsedSeconds: 25,
      },
      { type: "reveal", row: 0, column: 0 },
    );
    const nextBoard = createBoard(CONFIG, () => 0);
    const reset = gameReducer(lost, { type: "reset", board: nextBoard });

    assert.equal(reset.status, "running");
    assert.equal(reset.elapsedSeconds, 0);
    assert.equal(reset.hasStarted, false);
    assert.strictEqual(reset.board, nextBoard);
  });
});
