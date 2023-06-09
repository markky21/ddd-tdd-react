import { Cash } from "./cash";

describe(Cash.name, () => {
  describe("toView", () => {
    [
      { input: 0, expected: "$0.00" },
      { input: 0.01, expected: "$0.01" },
      { input: 0.1, expected: "$0.10" },
      { input: 0.25, expected: "$0.25" },
      { input: 1, expected: "$1.00" },
      { input: 5.25, expected: "$5.25" },
      { input: 5.5, expected: "$5.50" },
    ].forEach(({ input, expected }) => {
      it("should return the amount in presentational form", () => {
        expect(new Cash(input).toView()).toEqual(expected);
      });
    });
  });

  it("should be able to add two Cash", () => {
    expect(new Cash(0.01).add(new Cash(0.02))).toEqual(new Cash(0.03));
  });

  it(`should NOT be able to create a new Cash with negative value`, () => {
    expect(() => new Cash(-1)).toThrowError("Amount is negative");
  });

  it("should be able to subtract two Cash", () => {
    expect(new Cash(0.03).subtraction(new Cash(0.02))).toEqual(new Cash(0.01));
  });
});
