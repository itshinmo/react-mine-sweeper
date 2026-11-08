export const COUNTER_DIGITS = 3;

/**
 * Formats a counter for the three digit display.
 *
 * Values are truncated and clamped so the display can never overflow. Negative
 * values keep their sign at the start, e.g. -3 becomes "-03".
 */
export const formatCounter = (
  value: number,
  digits: number = COUNTER_DIGITS,
): string => {
  if (!Number.isInteger(digits) || digits < 1) {
    throw new Error("Counter digits must be a positive integer.");
  }

  const safeValue = Number.isFinite(value) ? Math.trunc(value) : 0;
  const sign = safeValue < 0 ? "-" : "";
  const availableDigits = digits - sign.length;
  const maxAbsolute = 10 ** availableDigits - 1;
  const absolute = Math.min(Math.abs(safeValue), maxAbsolute);

  return `${sign}${absolute.toString().padStart(availableDigits, "0")}`;
};
