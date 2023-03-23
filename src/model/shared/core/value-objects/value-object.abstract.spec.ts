import { describe, expect, it } from "vitest";
import { ValueObject } from "./value-object.abstract";

class SimpleObjectValue extends ValueObject<unknown> {
  constructor(public a: string, public b: number, public c?: boolean) {
    super();
  }
}

describe(ValueObject.name, () => {
  describe("ObjectValue equals", () => {
    it("should return true if objects have same properties", () => {
      const objectValue1 = new SimpleObjectValue("a", 1);
      const objectValue2 = new SimpleObjectValue("a", 1);
      expect(objectValue1.equals(objectValue2)).toEqual(true);
    });

    it("should return false if some of objects properties differ", () => {
      const objectValue1 = new SimpleObjectValue("a", 1);
      const objectValue2 = new SimpleObjectValue("a", 1, false);
      expect(objectValue1.equals(objectValue2)).toEqual(false);
    });
  });
});
