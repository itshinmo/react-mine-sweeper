import { Box } from "@mui/material";
import { formatCounter } from "../game/format-counter.ts";
import Digit from "./Digit";
import { digits as digitsStyles } from "./styles";

type Props = {
  label: string;
  value: number;
};

const Digits = (props: Props) => {
  const { label, value } = props;
  const text = formatCounter(value);

  return (
    <Box aria-label={`${label}: ${text}`} role="img" sx={digitsStyles}>
      {text.split("").map((digit, index) => (
        <Digit digit={digit} key={`${index}-${digit}`} />
      ))}
    </Box>
  );
};

export default Digits;
