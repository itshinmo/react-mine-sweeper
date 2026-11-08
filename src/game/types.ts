export type GameStatus = "running" | "won" | "lost";

export type CellState = "hidden" | "flagged" | "revealed";

export type Cell = {
  mine: boolean;
  adjacentMines: number;
  state: CellState;
};

export type BoardConfig = {
  rows: number;
  columns: number;
  mines: number;
};

export type Board = {
  readonly config: BoardConfig;
  readonly cells: readonly (readonly Cell[])[];
};

export type Position = {
  readonly row: number;
  readonly column: number;
};

export type RevealResult = {
  readonly board: Board;
  readonly hitMine: boolean;
  readonly changed: boolean;
};
