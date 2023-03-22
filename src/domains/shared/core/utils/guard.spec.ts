import { describe, it, expect } from "vitest";
import { Guard } from "./guard";

describe(Guard.name, () => {
  describe("againstNegativeNumber", () => {
    it("should throw an error if value is negative", () => {
      expect(() => Guard.againstNegativeNumber(-1, "test")).toThrowError(
        "test"
      );
    });

    it("should not throw an error if value is not negative", () => {
      expect(() => Guard.againstNegativeNumber(1, "test")).not.toThrowError();
    });

    it("should not throw an error if value is not negative", () => {
      expect(() => Guard.againstNegativeNumber(0, "test")).not.toThrowError();
    });
  });

  describe("againstTruthy", () => {
    [
      { input: 1, expected: "test" },
      { input: true, expected: "test" },
      { input: "true", expected: "test" },
    ].forEach(({ input, expected }) => {
      it("should throw an error if value is truthy", () => {
        expect(() => Guard.againstTruthy(input, expected)).toThrowError(
          expected
        );
      });
    });

    [
      { input: 0 },
      { input: false },
      { input: undefined },
      { input: null },
    ].forEach(({ input }) => {
      expect(() => Guard.againstTruthy(input, "")).not.toThrowError();
    });
  });
});
