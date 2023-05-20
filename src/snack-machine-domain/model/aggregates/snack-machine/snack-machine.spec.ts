import { SnackMachine } from "./snack-machine";
import { Money } from "../../../../shared-kernel/value-objects/money";
import { Snack } from "../snack/snack";
import { SnackPile } from "./value-objects/snack-pile";
import { Cash } from "../../../../shared-kernel/value-objects/cash";
import { expect } from "vitest";

describe(SnackMachine.name, () => {
  describe("insertMoney", () => {
    it("should be able to insert money to the machine", () => {
      const snackMachine = new SnackMachine("1");
      snackMachine.insertMoney(Money.OneCent());
      snackMachine.insertMoney(Money.TenCent());
      snackMachine.insertMoney(Money.Dollar());

      expect(snackMachine.getMoneyInTransaction()).toEqual(new Cash(1.11));
    });

    it("should NOT be able to insert more than one coins at a time", () => {
      const snackMachine = new SnackMachine("1");

      expect(() => snackMachine.insertMoney(new Money(2))).toThrowError(
        "Cannot insert more than one coin at a time"
      );
    });

    it("should be able to return money", () => {
      const snackMachine = new SnackMachine("1");
      snackMachine.loadMoney(new Money(5, 5, 5, 5, 5, 5));

      snackMachine.insertMoney(Money.OneCent());
      snackMachine.insertMoney(Money.TenCent());
      snackMachine.insertMoney(Money.TenCent());
      snackMachine.insertMoney(Money.FiveDollar());
      snackMachine.insertMoney(Money.FiveDollar());
      snackMachine.returnMoney();

      expect(snackMachine.getMoneyInTransaction()).toEqual(Cash.None);
    });
  });

  describe("returnMoney", () => {
    it("should return money with the highest value coins possible", () => {
      const snackMachine = new SnackMachine("1");
      snackMachine.loadMoney(Money.Dollar());

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
  });

  describe("buySnack", () => {
    it("should be able to buy a snack", () => {
      const snackMachine = new SnackMachine("1");
      snackMachine.loadSnacks(0, new SnackPile(Snack.Chocolate, 1, 10));
      snackMachine.insertMoney(Money.Dollar());

      snackMachine.buySnack(0);

      expect(snackMachine.getMoneyInTransaction()).toEqual(Cash.None);
      expect(snackMachine.getMoneyInMachine()).toEqual(Money.Dollar());
      expect(snackMachine.getSnackPile(0).quantity).toEqual(9);
    });

    it("should NOT be able to buy a snack if the slot is empty", () => {
      const snackMachine = new SnackMachine("1");
      snackMachine.insertMoney(Money.Dollar());

      expect(() => snackMachine.buySnack(0)).toThrowError(
        "There is no snack in the slot"
      );
    });

    it("should NOT be able to buy a snack if there is less money in the machine than Snack price", () => {
      const snackMachine = new SnackMachine("1");
      snackMachine.loadSnacks(0, new SnackPile(Snack.Chocolate, 1, 10));
      snackMachine.insertMoney(Money.TenCent());

      expect(() => snackMachine.buySnack(0)).toThrowError(
        "Not enough money to buy the snack"
      );
    });

    it("should NOT be able to buy a snack if there is NO possibility to return change", () => {
      const snackMachine = new SnackMachine("1");
      snackMachine.loadSnacks(0, new SnackPile(Snack.Chocolate, 1, 10));
      snackMachine.insertMoney(Money.FiveDollar());

      expect(() => snackMachine.buySnack(0)).toThrowError(
        "Not enough money to allocate"
      );
    });
  });

  describe("canBuySnack", () => {
    it("should be able to buy a snack", () => {
      const snackMachine = new SnackMachine("1");
      snackMachine.loadSnacks(0, new SnackPile(Snack.Chocolate, 1, 10));
      snackMachine.insertMoney(Money.Dollar());

      expect(snackMachine.canBuySnack(0)).toEqual(true);
    });

    it("should NOT be able to buy a snack if the slot is empty", () => {
      const snackMachine = new SnackMachine("1");
      snackMachine.insertMoney(Money.Dollar());

      expect(snackMachine.canBuySnack(0)).toEqual(
        "There is no snack in the slot"
      );
    });

    it("should NOT be able to buy a snack if there is less money in the machine than Snack price", () => {
      const snackMachine = new SnackMachine("1");
      snackMachine.loadSnacks(0, new SnackPile(Snack.Chocolate, 1, 10));
      snackMachine.insertMoney(Money.TenCent());

      expect(snackMachine.canBuySnack(0)).toEqual(
        "Not enough money to buy the snack"
      );
    });

    it("should NOT be able to buy a snack if there is NO possibility to return change", () => {
      const snackMachine = new SnackMachine("1");
      snackMachine.loadSnacks(0, new SnackPile(Snack.Chocolate, 1, 10));
      snackMachine.insertMoney(Money.FiveDollar());

      expect(snackMachine.canBuySnack(0)).toEqual(
        "Not enough money to allocate"
      );
    });
  });
});
