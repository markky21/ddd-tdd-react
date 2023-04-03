import { describe, expect, it } from "vitest";
import { SnackMachine } from "./snack-machine";
import { Money } from "../../value-objects/money";
import { Snack } from "../snack/snack";
import { SnackPile } from "./value-objects/snack-pile";

const getSnackMachine = () => new SnackMachine(1);

describe(SnackMachine.name, () => {
  it("should be able to insert money to the machine", () => {
    const snackMachine = getSnackMachine();
    snackMachine.insertMoney(Money.OneCent());
    snackMachine.insertMoney(Money.TenCent());
    snackMachine.insertMoney(Money.Dollar());

    expect(snackMachine.getMoneyInTransaction()).toEqual(new Money(1, 1, 0, 1));
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
    expect(snackMachine.getMoneyInTransaction()).toEqual(new Money());
  });

  it("should be able to buy a snack", () => {
    const snackMachine = getSnackMachine();
    snackMachine.loadSnacks(0, new SnackPile(new Snack("Snickers"), 1, 10));
    snackMachine.insertMoney(Money.Dollar());

    snackMachine.buySnack(0);

    expect(snackMachine.getMoneyInTransaction()).toEqual(Money.None());
    expect(snackMachine.getMoneyInMachine()).toEqual(Money.Dollar());
    expect(snackMachine.getSnackPile(0).quantity).toEqual(9);
  });

  it("should NOT be able to buy a snack if the slot is empty", () => {
    const snackMachine = getSnackMachine();
    snackMachine.insertMoney(Money.Dollar());

    expect(() => snackMachine.buySnack(0)).toThrowError(
      "There is no snack in the slot"
    );
  });

  it("should NOT be able to buy a snack if there is less money in the machine than Snack price", () => {
    const snackMachine = getSnackMachine();
    snackMachine.loadSnacks(0, new SnackPile(new Snack("Snickers"), 1, 10));
    snackMachine.insertMoney(Money.TenCent());

    expect(() => snackMachine.buySnack(0)).toThrowError(
      "Not enough money to buy the snack"
    );
  });

  it.skip("should return money with the highest value coins possible", () => {
    const snackMachine = getSnackMachine();
    snackMachine.loadSnacks(0, new SnackPile(new Snack("Snickers"), 1, 10));
    snackMachine.insertMoney(Money.Dollar());

    snackMachine.insertMoney(Money.Quarter());
    snackMachine.insertMoney(Money.Quarter());
    snackMachine.insertMoney(Money.Quarter());
    snackMachine.insertMoney(Money.Quarter());
    snackMachine.returnMoney();

    expect(
      snackMachine.getMoneyInMachine().getCoinsAndNotes().quarterCentCount
    ).toEqual(4);
    expect(
      snackMachine.getMoneyInMachine().getCoinsAndNotes().oneDollarCount
    ).toEqual(0);
  });

  it.todo(
    "should NOT be able to buy a snack if there is NO possibility to return change",
    () => {}
  );
  it.todo("should return change when buy a snack", () => {});
});
