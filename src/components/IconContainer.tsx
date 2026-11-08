import { Box } from "@mui/material";
import { type ReactNode } from "react";
import { iconContainer } from "./styles";

type Props = {
  children: ReactNode;
};

const IconContainer = (props: Props) => {
  const { children } = props;

  return (
    <Box aria-hidden="true" sx={iconContainer}>
      {children}
    </Box>
  );
};

export default IconContainer;
