import { Stack } from "@mui/material";
import { type MouseEventHandler } from "react";
import { useMinesweeper } from "../hooks/use-minesweeper";
import Board from "./Board";
import Header from "./Header";
import { game, page } from "./styles";

const preventContextMenu: MouseEventHandler<HTMLDivElement> = event => {
  event.preventDefault();
};

const MineSweeper = () => {
  const {
    board,
    elapsedSeconds,
    remainingMines,
    reset,
    reveal,
    status,
    toggleFlag,
  } = useMinesweeper();

  return (
    <Stack alignItems="center" justifyContent="center" sx={page}>
      <Stack direction="column" onContextMenu={preventContextMenu} sx={game}>
        <Header
          elapsedSeconds={elapsedSeconds}
          onReset={reset}
          remainingMines={remainingMines}
          status={status}
        />

        <Board
          board={board}
          onReveal={reveal}
          onToggleFlag={toggleFlag}
          status={status}
        />
      </Stack>
    </Stack>
  );
};

export default MineSweeper;
