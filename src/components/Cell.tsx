import { Box, Typography } from "@mui/material";
import { memo, type MouseEvent } from "react";
import { BombIcon, FlagIcon } from "../assets";
import type { Cell as CellModel } from "../game/types.ts";
import {
  cell as cellStyles,
  cellNumber,
  cellValue,
  revealedCell,
} from "./styles";

type Props = {
  cell: CellModel;
  column: number;
  isGameOver: boolean;
  onReveal: (row: number, column: number) => void;
  onToggleFlag: (row: number, column: number) => void;
  row: number;
};

const getCellLabel = (cell: CellModel, row: number, column: number): string => {
  const position = `Row ${row + 1}, column ${column + 1}`;

  if (cell.state === "flagged") return `${position}, flagged`;
  if (cell.state === "hidden") return `${position}, hidden`;
  if (cell.mine) return `${position}, mine`;
  if (cell.adjacentMines === 0) return `${position}, empty`;

  const adjacentMines = cell.adjacentMines;
  const noun = adjacentMines === 1 ? "mine" : "mines";

  return `${position}, ${adjacentMines} adjacent ${noun}`;
};

const Cell = (props: Props) => {
  const { cell, column, isGameOver, onReveal, onToggleFlag, row } = props;
  const isRevealed = cell.state === "revealed";
  const isFlagged = cell.state === "flagged";

  const handleReveal = () => {
    if (isGameOver) return;

    onReveal(row, column);
  };

  const handleToggleFlag = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (isGameOver) return;

    onToggleFlag(row, column);
  };

  const renderValue = () => {
    if (!isRevealed) {
      if (isFlagged) return <FlagIcon />;

      return null;
    }

    if (cell.mine) return <BombIcon />;

    if (cell.adjacentMines === 0) return null;

    return (
      <Typography component="span" sx={cellNumber(cell.adjacentMines)}>
        {cell.adjacentMines}
      </Typography>
    );
  };

  return (
    <Box
      aria-label={getCellLabel(cell, row, column)}
      component="button"
      onClick={handleReveal}
      onContextMenu={handleToggleFlag}
      sx={
        isRevealed
          ? [cellStyles(isGameOver), revealedCell(cell.mine)]
          : cellStyles(isGameOver)
      }
      type="button"
    >
      <Box sx={cellValue}>{renderValue()}</Box>
    </Box>
  );
};

export default memo(Cell);
