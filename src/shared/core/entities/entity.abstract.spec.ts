import { Entity } from "./entity.abstract";

class SimpleEntity extends Entity {}
class OtherEntity extends Entity {}

describe("Entity", () => {
  it("Entity instance should have an id", () => {
    const entity = new SimpleEntity("1");
    expect(entity.id).toBeTruthy();
  });

  describe("Entity equals", () => {
    it("should return true if the ids are equal", () => {
      const entity1 = new SimpleEntity("1");
      const entity2 = new SimpleEntity("1");
      expect(entity1.equals(entity2)).toBeTruthy();
    });

    it("should return false if the ids are equal but have different constructor", () => {
      const entity1 = new SimpleEntity("1");
      const entity2 = new OtherEntity("1");
      expect(entity1.equals(entity2)).toBeFalsy();
    });

    it("should return false if the ids are equal but have different constructor", () => {
      const entity1 = new SimpleEntity("1");
      const entity2 = new OtherEntity("1");
      expect(entity1.equals(entity2)).toBeFalsy();
    });

    it("should return false if the ids are not equal", () => {
      const entity1 = new SimpleEntity("1");
      const entity2 = new SimpleEntity("2");
      expect(entity1.equals(entity2)).toBeFalsy();
    });

    it("should return false if the ids are not set", () => {
      // @ts-ignore
      const entity1 = new SimpleEntity(null);
      // @ts-ignore
      const entity2 = new SimpleEntity(null);
      expect(entity1.equals(entity2)).toBeFalsy();
    });
  });
});
