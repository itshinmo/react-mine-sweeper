import { Box } from "@mui/material";
import {
  digit as digitStyles,
  digitBottomBox,
  digitBox,
  digitTopBox,
  DIGIT_STYLES,
} from "./styles";

type Props = {
  digit: string;
};

const Digit = (props: Props) => {
  const { digit } = props;
  const styles = DIGIT_STYLES[digit];
  const topStyles = styles?.top ?? {};
  const bottomStyles = styles?.bottom ?? {};

  return (
    <Box sx={digitStyles}>
      <Box sx={[digitBox, digitTopBox, topStyles]} />
      <Box sx={[digitBox, digitBottomBox, bottomStyles]} />
    </Box>
  );
};

export default Digit;
