export abstract class ValueObject<T> {
  equals(entity: ValueObject<T>): boolean {
    return (
      Object.entries(this).every(([key, value]) => {
        // @ts-ignore
        return entity[key] === value;
      }) &&
      Object.entries(entity).every(([key, value]) => {
        // @ts-ignore
        return this[key] === value;
      })
    );
  }
}
