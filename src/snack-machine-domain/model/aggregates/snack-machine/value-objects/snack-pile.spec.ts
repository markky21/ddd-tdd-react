import { SnackPile } from "./snack-pile";
import { Snack } from "../../snack/snack";

describe(SnackPile.name, () => {
  it("should NOT be able to create a new SnackPile with negative quantity", () => {
    expect(() => new SnackPile(Snack.None, 0, -1)).toThrowError(
      "Quantity is negative"
    );
  });

  it("should NOT be able to create a new SnackPile with negative price", () => {
    expect(() => new SnackPile(Snack.None, 0, -1)).toThrowError(
      "Quantity is negative"
    );
  });

  it("should NOT be able to create a new SnackPile with price fraction lower than one cent", () => {
    expect(() => new SnackPile(Snack.None, 0.001, 1)).toThrowError(
      "Price is not rounded to one cent"
    );
  });

  describe("decreaseQuantity", () => {
    it("should decrease quantity by 1", () => {
      const snackPile = new SnackPile(Snack.None, 0, 10);
      expect(snackPile.decreaseQuantity().quantity).toBe(9);
    });
  });
});
