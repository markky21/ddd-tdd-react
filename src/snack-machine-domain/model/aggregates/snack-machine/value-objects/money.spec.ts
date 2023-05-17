import { Money } from "./money";
import { Cash } from "./cash";

describe(Money.name, () => {
  [
    { input: [-1], output: "One cent count is negative" },
    { input: [0, -1], output: "Ten cent count is negative" },
    { input: [0, 0, -1], output: "Quarter count is negative" },
    { input: [0, 0, 0, -1], output: "One dollar count is negative" },
    { input: [0, 0, 0, 0, -1], output: "Five dollars count is negative" },
    { input: [0, 0, 0, 0, 0, -1], output: "Ten dollars count is negative" },
  ].forEach(({ input, output }) => {
    it(`should NOT be able to create a new Money with negative coins and notes`, () => {
      expect(() => new Money(...input)).toThrowError(output);
    });
  });

  describe("add", () => {
    it("should be able to add money", () => {
      const money1 = new Money(0, 2);
      const money2 = new Money(0, 1, 2);

      expect(money1.add(money2)).toEqual(new Money(0, 3, 2));
    });
  });

  describe("multiply", () => {
    it("should be able to multiply money", () => {
      const money1 = new Money(0, 2, 0, 4);

      expect(money1.multiply(2)).toEqual(new Money(0, 4, 0, 8));
    });

    it("should NOT be able to multiply money with fraction", () => {
      expect(() => new Money().multiply(0.5)).toThrowError(
        "Multiplier is not an integer"
      );
    });

    it("should NOT be able to multiply money with negative value", () => {
      expect(() => new Money().multiply(-2)).toThrowError(
        "Multiplier is negative value"
      );
    });
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

  describe("subtraction", () => {
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

  describe("toView", () => {
    [
      { input: Money.None(), expected: "¢0" },
      { input: Money.OneCent(), expected: "¢1" },
      { input: Money.TenCent(), expected: "¢10" },
      { input: Money.Quarter(), expected: "¢25" },
      { input: Money.Dollar(), expected: "$1.00" },
      { input: Money.FiveDollar(), expected: "$5.00" },
      { input: Money.TenDollar(), expected: "$10.00" },
      { input: new Money(2, 2, 2, 2, 2, 2), expected: "$32.72" },
      { input: new Money(2, 1), expected: "¢12" },
    ].forEach(({ input, expected }) => {
      it("should return the amount in presentational form", () => {
        expect(input.toView()).toEqual(expected);
      });
    });
  });

  describe("getCoinsAndNotes", () => {
    [
      {
        input: Money.None(),
        expected: {
          oneCentCount: 0,
          tenCentCount: 0,
          quarterCentCount: 0,
          oneDollarCount: 0,
          fiveDollarCount: 0,
          tenDollarCount: 0,
        },
      },
      {
        input: new Money(1, 2, 3, 4, 5, 6),
        expected: {
          oneCentCount: 1,
          tenCentCount: 2,
          quarterCentCount: 3,
          oneDollarCount: 4,
          fiveDollarCount: 5,
          tenDollarCount: 6,
        },
      },
    ].forEach(({ input, expected }) => {
      it("should return the amount in presentational form", () => {
        expect(input.getCoinsAndNotes()).toEqual(expected);
      });
    });
  });

  describe("allocate", () => {
    it("should be able to allocate money from biggest denomination to smallest", () => {
      const money = new Money(5, 5, 5, 5, 5, 5);

      const allocated = money.allocate(new Cash(26.48));

      expect(allocated).toEqual(new Money(3, 2, 1, 1, 1, 2));
    });

    it("should be able to allocate money if available from biggest denomination to smallest", () => {
      const money = new Money(5, 5, 5, 0, 5, 1);

      const allocated = money.allocate(new Cash(26.48));

      expect(allocated).toEqual(new Money(3, 2, 5, 0, 3, 1));
    });

    it("should throw an error if not enough money to allocate", () => {
      const money = new Money(0, 5, 5, 0, 5, 1);

      expect(() => money.allocate(new Cash(26.48))).toThrowError(
        "Not enough money to allocate"
      );
    });
  });

  describe("canAllocate", () => {
    it("should return TRUE if valid", () => {
      const allocated = Money.Dollar().canAllocate(new Cash(1));

      expect(allocated).toEqual(true);
    });

    it("should return FALSE if not enough money to allocate", () => {
      const money = new Money(0, 5, 5, 0, 5, 1);

      expect(money.canAllocate(new Cash(26.48))).toEqual(false);
    });
  });
});
