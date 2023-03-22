export class Guard {
  static againstTruthy(value: unknown, message: string): void {
    if (Boolean(value)) {
      throw new Error(message);
    }
  }

  static againstNegativeNumber(value: number, message: string): void {
    if (value < 0) {
      throw new Error(message);
    }
  }
}
