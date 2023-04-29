import { describe } from "vitest";
import { Snack } from "./snack";

describe(Snack.name, () => {
  it("should be able to get snack reference by id", () => {
    expect(Snack.getSnackReferenceById(Snack.None.id)).toBe(Snack.None);
    expect(Snack.getSnackReferenceById(Snack.Chocolate.id)).toBe(
      Snack.Chocolate
    );
    expect(Snack.getSnackReferenceById(Snack.Soda.id)).toBe(Snack.Soda);
    expect(Snack.getSnackReferenceById(Snack.Gum.id)).toBe(Snack.Gum);
  });

  it("should throw error when snack reference not found", () => {
    expect(() => Snack.getSnackReferenceById("invalid-id")).toThrowError(
      "Snack not found"
    );
  });
});
