import { describe, expect, it } from "vitest";
import { SnackMachine } from "./snack-machine";
import { Money } from "../value-objects/money";

const getSnackMachine = () => new SnackMachine(1);

describe(SnackMachine.name, () => {
  it("should be able to create a new SnackMachine", () => {
    const snackMachine = getSnackMachine();
    expect(snackMachine).toBeTruthy();
  });

  it("should be able to insert money to the machine", () => {
    const snackMachine = getSnackMachine();
    snackMachine.insertMoney(Money.OneCent());
    snackMachine.insertMoney(Money.TenCent());
    snackMachine.insertMoney(Money.Dollar());
    expect(snackMachine.moneyInTransaction).toEqual(new Money(1, 1, 0, 1));
  });

  it("should NOT be able to insert more than one coins at a time", () => {
    const snackMachine = getSnackMachine();
    expect(() => snackMachine.insertMoney(new Money(2))).toThrowError(
      "Cannot insert more than one coin at a time"
    );
  });

  it("should be able to return money from the machine", () => {
    const snackMachine = getSnackMachine();
    snackMachine.insertMoney(Money.OneCent());
    snackMachine.insertMoney(Money.TenCent());
    snackMachine.insertMoney(Money.TenCent());
    snackMachine.insertMoney(Money.Dollar());
    expect(snackMachine.returnMoney()).toEqual(new Money(1, 2, 0, 1));
    expect(snackMachine.moneyInTransaction).toEqual(new Money());
  });

  it("should be able to buy a snack", () => {
    const snackMachine = getSnackMachine();
    snackMachine.insertMoney(Money.FiveDollar());
    snackMachine.buySnack();
    expect(snackMachine.moneyInTransaction).toEqual(Money.None());
    expect(snackMachine.moneyInMachine).toEqual(Money.FiveDollar());
  });
});
