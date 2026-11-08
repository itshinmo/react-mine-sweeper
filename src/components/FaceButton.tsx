import { Box } from "@mui/material";
import { CoolFaceIcon, DeadFaceIcon, ThinkingFaceIcon } from "../assets";
import type { GameStatus } from "../game/types.ts";
import { faceButton } from "./styles";

type Props = {
  onClick: () => void;
  status: GameStatus;
};

const FaceButton = (props: Props) => {
  const { onClick, status } = props;

  const renderIcon = () => {
    if (status === "lost") return <DeadFaceIcon />;

    if (status === "won") return <CoolFaceIcon />;

    return <ThinkingFaceIcon />;
  };

  return (
    <Box
      aria-label="Start a new game"
      component="button"
      onClick={onClick}
      sx={faceButton}
      type="button"
    >
      {renderIcon()}
    </Box>
  );
};

export default FaceButton;
