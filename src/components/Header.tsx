import { Stack } from "@mui/material";
import type { GameStatus } from "../game/types.ts";
import Digits from "./Digits";
import FaceButton from "./FaceButton";
import { header } from "./styles";

type Props = {
  elapsedSeconds: number;
  onReset: () => void;
  remainingMines: number;
  status: GameStatus;
};

const Header = (props: Props) => {
  const { elapsedSeconds, onReset, remainingMines, status } = props;

  return (
    <Stack
      alignItems="center"
      direction="row"
      justifyContent="space-around"
      sx={header}
    >
      <Digits label="Mines remaining" value={remainingMines} />
      <FaceButton onClick={onReset} status={status} />
      <Digits label="Elapsed seconds" value={elapsedSeconds} />
    </Stack>
  );
};

export default Header;
