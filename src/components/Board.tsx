import { Box } from "@mui/material";
import { memo } from "react";
import type { Board as BoardModel, GameStatus } from "../game/types.ts";
import Cell from "./Cell";
import { board as boardStyles } from "./styles";

type Props = {
  board: BoardModel;
  onReveal: (row: number, column: number) => void;
  onToggleFlag: (row: number, column: number) => void;
  status: GameStatus;
};

const Board = (props: Props) => {
  const { board, onReveal, onToggleFlag, status } = props;
  const isGameOver = status !== "running";

  return (
    <Box
      aria-label="Minesweeper board"
      role="group"
      sx={boardStyles(board.config.columns)}
    >
      {board.cells.map((cellsRow, rowIndex) =>
        cellsRow.map((cell, columnIndex) => (
          <Cell
            cell={cell}
            column={columnIndex}
            isGameOver={isGameOver}
            key={`${rowIndex}-${columnIndex}`}
            onReveal={onReveal}
            onToggleFlag={onToggleFlag}
            row={rowIndex}
          />
        )),
      )}
    </Box>
  );
};

export default memo(Board);
