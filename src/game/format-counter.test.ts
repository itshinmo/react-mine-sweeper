import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { COUNTER_DIGITS, formatCounter } from "./format-counter.ts";

describe("formatCounter", () => {
  it("pads positive values to the display width", () => {
    assert.equal(formatCounter(0), "000");
    assert.equal(formatCounter(7), "007");
    assert.equal(formatCounter(42), "042");
    assert.equal(formatCounter(999), "999");
  });

  it("clamps values that do not fit the display", () => {
    assert.equal(formatCounter(1000), "999");
    assert.equal(formatCounter(-3), "-03");
    assert.equal(formatCounter(-100), "-99");
  });

  it("keeps the sign at the start of negative values", () => {
    assert.equal(formatCounter(-3), "-03");
    assert.equal(formatCounter(-71), "-71");
  });

  it("handles invalid numbers", () => {
    assert.equal(formatCounter(Number.NaN), "000");
    assert.equal(formatCounter(Number.POSITIVE_INFINITY), "000");
    assert.equal(formatCounter(Number.NEGATIVE_INFINITY), "000");
  });

  it("truncates fractional values", () => {
    assert.equal(formatCounter(3.9), "003");
    assert.equal(formatCounter(-3.9), "-03");
  });

  it("supports custom display widths", () => {
    assert.equal(formatCounter(7, 5), "00007");
    assert.equal(formatCounter(-7, 5), "-0007");
  });

  it("rejects invalid display widths", () => {
    assert.throws(() => formatCounter(1, 0), /positive integer/);
    assert.throws(() => formatCounter(1, 1.5), /positive integer/);
  });

  it("uses three digits by default", () => {
    assert.equal(COUNTER_DIGITS, 3);
    assert.equal(formatCounter(1).length, COUNTER_DIGITS);
  });
});
