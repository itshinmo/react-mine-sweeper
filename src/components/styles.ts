import { type SxProps, type Theme } from "@mui/material";
import { type CSSProperties } from "react";
import { COLORS, SIZES, VALUE_COLORS } from "../theme";

export const page: SxProps<Theme> = {
  minHeight: "100vh",
  padding: { xs: 1, sm: 2 },
};

export const game: SxProps<Theme> = {
  overflow: "hidden",
  backgroundColor: COLORS.frame,
  padding: `${SIZES.frameBorder}px`,

  borderTop: `${SIZES.frameBorder}px solid ${COLORS.frameHighlight}`,
  borderLeft: `${SIZES.frameBorder}px solid ${COLORS.frameHighlight}`,

  borderRight: `${SIZES.frameBorder}px solid ${COLORS.frameShadow}`,
  borderBottom: `${SIZES.frameBorder}px solid ${COLORS.frameShadow}`,
};

export const header: SxProps<Theme> = {
  backgroundColor: COLORS.frame,
  padding: `${SIZES.frameBorder}px`,

  borderTop: `${SIZES.frameBorder}px solid ${COLORS.frameShadow}`,
  borderLeft: `${SIZES.frameBorder}px solid ${COLORS.frameShadow}`,

  borderRight: `${SIZES.frameBorder}px solid ${COLORS.frameHighlight}`,
  borderBottom: `${SIZES.frameBorder}px solid ${COLORS.frameHighlight}`,
};

export const board = (columns: number): SxProps<Theme> => ({
  display: "grid",
  gridTemplateColumns: `repeat(${columns}, ${SIZES.cell}px)`,
  width: "fit-content",
  marginTop: `${SIZES.frameBorder}px`,
  backgroundColor: COLORS.frame,

  borderTop: `${SIZES.frameBorder}px solid ${COLORS.frameShadow}`,
  borderLeft: `${SIZES.frameBorder}px solid ${COLORS.frameShadow}`,

  borderRight: `${SIZES.frameBorder}px solid ${COLORS.frameHighlight}`,
  borderBottom: `${SIZES.frameBorder}px solid ${COLORS.frameHighlight}`,
});

export const cell = (isGameOver: boolean) => ({
  appearance: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: SIZES.cell,
  height: SIZES.cell,
  padding: 0,
  margin: 0,
  font: "inherit",
  lineHeight: 1,
  color: "inherit",
  backgroundColor: COLORS.cellHidden,

  borderTop: `${SIZES.hiddenCellBorder}px solid ${COLORS.frameHighlight}`,
  borderLeft: `${SIZES.hiddenCellBorder}px solid ${COLORS.frameHighlight}`,

  borderRight: `${SIZES.hiddenCellBorder}px solid ${COLORS.frameShadow}`,
  borderBottom: `${SIZES.hiddenCellBorder}px solid ${COLORS.frameShadow}`,

  boxSizing: "border-box",
  userSelect: "none",
  touchAction: "manipulation",
  cursor: isGameOver ? "default" : "pointer",

  ":focus-visible": {
    outline: "2px solid #fff",
    outlineOffset: `-${SIZES.hiddenCellBorder}px`,
  },
});

export const revealedCell = (isBomb: boolean) => ({
  backgroundColor: isBomb ? COLORS.cellBomb : COLORS.cellRevealed,
  border: `${SIZES.revealedCellBorder}px solid ${COLORS.cellBorder}`,
  cursor: "default",
});

export const cellValue: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  height: "100%",
  overflow: "hidden",
  lineHeight: 1,
};

export const cellNumber = (value: number): SxProps<Theme> => ({
  fontSize: SIZES.valueFont,
  lineHeight: 1,
  color: VALUE_COLORS[value] ?? "inherit",
});

export const faceButton: SxProps<Theme> = {
  appearance: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: SIZES.faceButton,
  height: SIZES.faceButton,
  padding: 0,
  margin: 0,
  borderRadius: 0,
  backgroundColor: COLORS.frame,

  borderTop: `${SIZES.faceButtonBorder}px solid ${COLORS.frameHighlight}`,
  borderLeft: `${SIZES.faceButtonBorder}px solid ${COLORS.frameHighlight}`,

  borderRight: `${SIZES.faceButtonBorder}px solid ${COLORS.frameShadow}`,
  borderBottom: `${SIZES.faceButtonBorder}px solid ${COLORS.frameShadow}`,

  cursor: "pointer",

  ":active": {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },

  ":focus-visible": {
    outline: "2px solid #fff",
    outlineOffset: `-${SIZES.faceButtonBorder}px`,
  },
};

export const iconContainer: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  height: "100%",

  "& svg": {
    display: "block",
    width: "100%",
    height: "100%",
  },
};

export const digits: SxProps<Theme> = {
  display: "flex",
  gap: `${SIZES.digitGap}px`,
  padding: 0.4,
  backgroundColor: COLORS.digitBackground,

  borderTop: `${SIZES.digitContainerBorder}px solid ${COLORS.frameShadow}`,
  borderLeft: `${SIZES.digitContainerBorder}px solid ${COLORS.frameShadow}`,

  borderRight: `${SIZES.digitContainerBorder}px solid ${COLORS.frameHighlight}`,
  borderBottom: `${SIZES.digitContainerBorder}px solid ${COLORS.frameHighlight}`,
};

export const digit = {
  display: "flex",
  flexDirection: "column",
};

export const digitBox = {
  width: SIZES.digitBox,
  height: SIZES.digitBox,
  backgroundColor: COLORS.digitBackground,
};

export const digitTopBox = {
  borderTop: `${SIZES.digitBorder}px solid ${COLORS.digitInactive}`,
  borderRight: `${SIZES.digitBorder}px solid ${COLORS.digitInactive}`,
  borderBottom: `${SIZES.digitBorder / 2}px solid ${COLORS.digitInactive}`,
  borderLeft: `${SIZES.digitBorder}px solid ${COLORS.digitInactive}`,
};

export const digitBottomBox = {
  borderTop: `${SIZES.digitBorder / 2}px solid ${COLORS.digitInactive}`,
  borderRight: `${SIZES.digitBorder}px solid ${COLORS.digitInactive}`,
  borderBottom: `${SIZES.digitBorder}px solid ${COLORS.digitInactive}`,
  borderLeft: `${SIZES.digitBorder}px solid ${COLORS.digitInactive}`,
};

type DigitStyle = {
  top: CSSProperties;
  bottom: CSSProperties;
};

export const DIGIT_STYLES: Record<string, DigitStyle> = {
  "-": {
    top: { borderBottomColor: COLORS.digitActive },
    bottom: { borderTopColor: COLORS.digitActive },
  },
  "0": {
    top: {
      borderTopColor: COLORS.digitActive,
      borderRightColor: COLORS.digitActive,
      borderLeftColor: COLORS.digitActive,
    },
    bottom: {
      borderRightColor: COLORS.digitActive,
      borderBottomColor: COLORS.digitActive,
      borderLeftColor: COLORS.digitActive,
    },
  },
  "1": {
    top: {
      borderRightColor: COLORS.digitActive,
    },
    bottom: {
      borderRightColor: COLORS.digitActive,
    },
  },
  "2": {
    top: {
      borderTopColor: COLORS.digitActive,
      borderRightColor: COLORS.digitActive,
      borderBottomColor: COLORS.digitActive,
    },
    bottom: {
      borderTopColor: COLORS.digitActive,
      borderBottomColor: COLORS.digitActive,
      borderLeftColor: COLORS.digitActive,
    },
  },
  "3": {
    top: {
      borderTopColor: COLORS.digitActive,
      borderRightColor: COLORS.digitActive,
      borderBottomColor: COLORS.digitActive,
    },
    bottom: {
      borderTopColor: COLORS.digitActive,
      borderRightColor: COLORS.digitActive,
      borderBottomColor: COLORS.digitActive,
    },
  },
  "4": {
    top: {
      borderRightColor: COLORS.digitActive,
      borderBottomColor: COLORS.digitActive,
      borderLeftColor: COLORS.digitActive,
    },
    bottom: {
      borderTopColor: COLORS.digitActive,
      borderRightColor: COLORS.digitActive,
    },
  },
  "5": {
    top: {
      borderTopColor: COLORS.digitActive,
      borderBottomColor: COLORS.digitActive,
      borderLeftColor: COLORS.digitActive,
    },
    bottom: {
      borderTopColor: COLORS.digitActive,
      borderRightColor: COLORS.digitActive,
      borderBottomColor: COLORS.digitActive,
    },
  },
  "6": {
    top: {
      borderTopColor: COLORS.digitActive,
      borderBottomColor: COLORS.digitActive,
      borderLeftColor: COLORS.digitActive,
    },
    bottom: {
      borderTopColor: COLORS.digitActive,
      borderRightColor: COLORS.digitActive,
      borderBottomColor: COLORS.digitActive,
      borderLeftColor: COLORS.digitActive,
    },
  },
  "7": {
    top: {
      borderTopColor: COLORS.digitActive,
      borderRightColor: COLORS.digitActive,
    },
    bottom: {
      borderRightColor: COLORS.digitActive,
    },
  },
  "8": {
    top: {
      borderTopColor: COLORS.digitActive,
      borderRightColor: COLORS.digitActive,
      borderBottomColor: COLORS.digitActive,
      borderLeftColor: COLORS.digitActive,
    },
    bottom: {
      borderTopColor: COLORS.digitActive,
      borderRightColor: COLORS.digitActive,
      borderBottomColor: COLORS.digitActive,
      borderLeftColor: COLORS.digitActive,
    },
  },
  "9": {
    top: {
      borderTopColor: COLORS.digitActive,
      borderRightColor: COLORS.digitActive,
      borderBottomColor: COLORS.digitActive,
      borderLeftColor: COLORS.digitActive,
    },
    bottom: {
      borderTopColor: COLORS.digitActive,
      borderRightColor: COLORS.digitActive,
      borderBottomColor: COLORS.digitActive,
    },
  },
};
