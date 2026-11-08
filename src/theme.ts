export const COLORS = {
  frame: "#464f57",
  frameHighlight: "#788189",
  frameShadow: "#1e262f",
  cellHidden: "#4c545c",
  cellRevealed: "#384048",
  cellBomb: "#e66",
  cellBorder: "#1e262e",
  digitBackground: "#000000",
  digitActive: "red",
  digitInactive: "rgba(85, 10, 10, 1)",
} as const;

export const VALUE_COLORS: Record<number, string> = {
  1: "#658ae6",
  2: "#7ee9e4",
  3: "#20ee7c",
  4: "#9cee20",
  5: "#eec820",
  6: "#e86012",
  7: "#f10b02",
  8: "#f102d6",
};

export const SIZES = {
  frameBorder: 8,
  cell: 32,
  hiddenCellBorder: 4,
  revealedCellBorder: 2,
  valueFont: 24,
  faceButton: 48,
  faceButtonBorder: 4,
  digitBox: 16,
  digitBorder: 4,
  digitContainerBorder: 2,
  digitGap: 4,
} as const;
