import { describe, it, expect } from "vitest";
import { Money } from "./money";

describe(Money.name, () => {
  it("should be able to create a new Money", () => {
    const money = new Money();
    expect(money).toBeTruthy();
  });

  it("should be able to add money", () => {
    const money1 = new Money(0, 2);
    const money2 = new Money(0, 1, 2);

    expect(money1.add(money2)).toEqual(new Money(0, 3, 2));
  });

  describe("getTotalAmount", () => {
    [
      { input: Money.None(), expected: 0 },
      { input: Money.OneCent(), expected: 0.01 },
      { input: Money.TenCent(), expected: 0.1 },
      { input: Money.Quarter(), expected: 0.25 },
      { input: Money.Dollar(), expected: 1 },
      { input: Money.FiveDollar(), expected: 5 },
      { input: Money.TenDollar(), expected: 10 },
      { input: new Money(2, 2, 2, 2, 2, 2), expected: 32.72 },
    ].forEach(({ input, expected }) => {
      it("should return the total amount of money", () => {
        expect(input.getTotalAmount()).toEqual(expected);
      });
    });
  });

  describe("substract", () => {
    [
      {
        inputs: { minuend: new Money(), subtrahend: new Money() },
        expected: new Money(),
      },
      {
        inputs: {
          minuend: new Money(10, 10, 10, 10, 10, 10),
          subtrahend: new Money(1, 2, 3, 4, 5, 6),
        },
        expected: new Money(9, 8, 7, 6, 5, 4),
      },
    ].forEach(({ inputs: { minuend, subtrahend }, expected }) => {
      it("should return money instance that represent subtraction result", () => {
        expect(minuend.subtraction(subtrahend)).toEqual(expected);
      });
    });

    [
      {
        inputs: { minuend: new Money(1), subtrahend: new Money(2) },
        expected: "One cent count is negative",
      },
      {
        inputs: { minuend: new Money(0, 1), subtrahend: new Money(0, 2) },
        expected: "Ten cent count is negative",
      },
      {
        inputs: { minuend: new Money(0, 0, 1), subtrahend: new Money(0, 0, 2) },
        expected: "Quarter count is negative",
      },
      {
        inputs: {
          minuend: new Money(0, 0, 0, 1),
          subtrahend: new Money(0, 0, 0, 2),
        },
        expected: "One dollar count is negative",
      },
      {
        inputs: {
          minuend: new Money(0, 0, 0, 0, 1),
          subtrahend: new Money(0, 0, 0, 0, 2),
        },
        expected: "Five dollars count is negative",
      },
      {
        inputs: {
          minuend: new Money(0, 0, 0, 0, 0, 1),
          subtrahend: new Money(0, 0, 0, 0, 0, 2),
        },
        expected: "Ten dollars count is negative",
      },
    ].forEach(({ inputs: { minuend, subtrahend }, expected }) => {
      it("should throw an error if minuend is less than subtrahend", () => {
        expect(() => minuend.subtraction(subtrahend)).toThrowError(expected);
      });
    });
  });
});