import {
  countRemainingMines,
  createBoard,
  isWon,
  revealAllMines,
  revealCell,
  toggleFlag,
} from "./board.ts";
import type { Board, BoardConfig, GameStatus } from "./types.ts";

export const MAX_ELAPSED_SECONDS = 999;

export type GameState = {
  board: Board;
  status: GameStatus;
  elapsedSeconds: number;
  hasStarted: boolean;
};

export type GameAction =
  | { type: "reveal"; row: number; column: number }
  | { type: "toggle-flag"; row: number; column: number }
  | { type: "tick" }
  | { type: "reset"; board: Board };

export const createGameState = (
  config: BoardConfig,
  random: () => number = Math.random,
): GameState => ({
  board: createBoard(config, random),
  status: "running",
  elapsedSeconds: 0,
  hasStarted: false,
});

export const gameReducer = (
  state: GameState,
  action: GameAction,
): GameState => {
  switch (action.type) {
    case "reveal": {
      if (state.status !== "running") return state;

      const result = revealCell(state.board, action.row, action.column);

      if (!result.changed) return state;

      if (result.hitMine) {
        return {
          ...state,
          board: revealAllMines(result.board),
          status: "lost",
          hasStarted: true,
        };
      }

      return {
        ...state,
        board: result.board,
        status: isWon(result.board) ? "won" : "running",
        hasStarted: true,
      };
    }

    case "toggle-flag": {
      if (state.status !== "running") return state;

      const board = toggleFlag(state.board, action.row, action.column);

      return board === state.board ? state : { ...state, board };
    }

    case "tick": {
      if (state.status !== "running" || !state.hasStarted) return state;

      const elapsedSeconds = Math.min(
        state.elapsedSeconds + 1,
        MAX_ELAPSED_SECONDS,
      );

      return elapsedSeconds === state.elapsedSeconds
        ? state
        : { ...state, elapsedSeconds };
    }

    case "reset":
      return {
        board: action.board,
        status: "running",
        elapsedSeconds: 0,
        hasStarted: false,
      };

    default:
      return state;
  }
};

export const getRemainingMines = (state: GameState): number =>
  countRemainingMines(state.board);
