import { useCallback, useEffect, useReducer } from "react";
import { createBoard } from "../game/board.ts";
import { BOARD_CONFIG } from "../game/config.ts";
import {
  createGameState,
  gameReducer,
  getRemainingMines,
  MAX_ELAPSED_SECONDS,
} from "../game/game.ts";
import type { BoardConfig } from "../game/types.ts";

export const useMinesweeper = (config: BoardConfig = BOARD_CONFIG) => {
  const [state, dispatch] = useReducer(gameReducer, config, createGameState);
  const isTimerCapped = state.elapsedSeconds >= MAX_ELAPSED_SECONDS;

  const reset = useCallback(() => {
    dispatch({ type: "reset", board: createBoard(config) });
  }, [config]);

  const reveal = useCallback((row: number, column: number) => {
    dispatch({ type: "reveal", row, column });
  }, []);

  const toggleFlag = useCallback((row: number, column: number) => {
    dispatch({ type: "toggle-flag", row, column });
  }, []);

  useEffect(() => {
    if (state.status !== "running" || !state.hasStarted || isTimerCapped) {
      return;
    }

    const intervalId = window.setInterval(() => {
      dispatch({ type: "tick" });
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isTimerCapped, state.hasStarted, state.status]);

  return {
    ...state,
    remainingMines: getRemainingMines(state),
    reset,
    reveal,
    toggleFlag,
  };
};
