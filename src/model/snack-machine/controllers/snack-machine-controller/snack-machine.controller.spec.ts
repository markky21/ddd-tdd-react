import "fake-indexeddb/auto";
import { SnackMachineController } from "./snack-machine.controller";
import { describe, expect, it, vi } from "vitest";
import { Money } from "../../core/value-objects/money";
import { SnackMachineWithPersistence } from "../../core/aggregates/snack-machine/snack-machine-with-persistence";
import { getTestDb } from "../../data-access/idb.service.testing";
import { nanoid } from "nanoid";
import { Snack } from "../../core/aggregates/snack/snack";
import { SnackPile } from "../../core/aggregates/snack-machine/value-objects/snack-pile";

const getSUT = async (): Promise<SnackMachineController> => {
  const db = await getTestDb();
  const snackMachine = new SnackMachineWithPersistence(nanoid(), db);
  await snackMachine.load();

  const snack = new Snack("Snickers");
  snackMachine.loadSnacks(0, new SnackPile(snack, 1, 10));

  return new SnackMachineController(snackMachine);
};

describe(SnackMachineController.name, () => {
  describe("initial state", () => {
    it("should initially give information about inserted money", async () => {
      const spy = vi.fn();
      const sut = await getSUT();

      const subscription = sut.moneyInserted$.subscribe(spy);
      subscription.unsubscribe();

      expect(spy).toHaveBeenNthCalledWith(1, "¢0");
    });

    it("should initially give information about inserted money in snack machine", async () => {
      const spy = vi.fn();
      const sut = await getSUT();

      const subscription = sut.coinsAndNotes$.subscribe(spy);
      subscription.unsubscribe();

      expect(spy).toHaveBeenNthCalledWith(1, Money.None().getCoinsAndNotes());
    });

    it("should initially give empty message from snack machine", async () => {
      const spy = vi.fn();
      const sut = await getSUT();

      const subscription = sut.message$.subscribe(spy);
      subscription.unsubscribe();

      expect(spy).toHaveBeenNthCalledWith(1, "");
    });
  });

  describe("inserting money", () => {
    it("should to insert money into snack machine", async () => {
      const spy = vi.fn();
      const sut = await getSUT();

      const subscription = sut.moneyInserted$.subscribe(spy);
      sut.insertOneCent();
      sut.insertTenCent();
      sut.insertQuarter();
      sut.insertDollar();
      sut.insertFiveDollar();
      sut.insertTenDollar();
      subscription.unsubscribe();

      expect(spy).toHaveBeenNthCalledWith(1, "¢0");
      expect(spy).toHaveBeenNthCalledWith(2, "¢1");
      expect(spy).toHaveBeenNthCalledWith(3, "¢11");
      expect(spy).toHaveBeenNthCalledWith(4, "¢36");
      expect(spy).toHaveBeenNthCalledWith(5, "$1.36");
      expect(spy).toHaveBeenNthCalledWith(6, "$6.36");
      expect(spy).toHaveBeenNthCalledWith(7, "$16.36");
    });

    it("should return message from snack machine", async () => {
      const spy = vi.fn();
      const sut = await getSUT();

      const subscription = sut.message$.subscribe(spy);
      sut.insertOneCent();
      sut.insertTenCent();
      sut.insertQuarter();
      sut.insertDollar();
      sut.insertFiveDollar();
      sut.insertTenDollar();
      subscription.unsubscribe();

      expect(spy).toHaveBeenNthCalledWith(2, "You inserted ¢1");
      expect(spy).toHaveBeenNthCalledWith(3, "You inserted ¢10");
      expect(spy).toHaveBeenNthCalledWith(4, "You inserted ¢25");
      expect(spy).toHaveBeenNthCalledWith(5, "You inserted $1.00");
      expect(spy).toHaveBeenNthCalledWith(6, "You inserted $5.00");
      expect(spy).toHaveBeenNthCalledWith(7, "You inserted $10.00");
    });

    it("should calculate coins and notes inside machine", async () => {
      const spy = vi.fn();
      const sut = await getSUT();

      const subscription = sut.coinsAndNotes$.subscribe(spy);
      sut.insertOneCent();
      sut.insertTenCent();

      subscription.unsubscribe();

      expect(spy).toHaveBeenNthCalledWith(1, Money.None().getCoinsAndNotes());
      expect(spy).toHaveBeenNthCalledWith(2, new Money(1).getCoinsAndNotes());
      expect(spy).toHaveBeenNthCalledWith(
        3,
        new Money(1, 1).getCoinsAndNotes()
      );
    });
  });

  describe("returning money", () => {
    it("should to return money from snack machine", async () => {
      const spy = vi.fn();
      const sut = await getSUT();

      const subscription = sut.moneyInserted$.subscribe(spy);
      sut.insertOneCent();
      sut.insertTenCent();
      sut.returnMoney();
      subscription.unsubscribe();

      expect(spy).toHaveBeenNthCalledWith(1, "¢0");
      expect(spy).toHaveBeenNthCalledWith(2, "¢1");
      expect(spy).toHaveBeenNthCalledWith(3, "¢11");
      expect(spy).toHaveBeenNthCalledWith(4, "¢0");
    });

    it("should to return message from snack machine", async () => {
      const spy = vi.fn();
      const sut = await getSUT();

      const subscription = sut.message$.subscribe(spy);
      sut.insertOneCent();
      sut.returnMoney();
      subscription.unsubscribe();

      expect(spy).toHaveBeenNthCalledWith(3, "Money returned");
    });

    it("should calculate coins and notes inside machine", async () => {
      const spy = vi.fn();
      const sut = await getSUT();

      const subscription = sut.coinsAndNotes$.subscribe(spy);
      sut.insertOneCent();
      sut.insertTenCent();
      sut.returnMoney();

      subscription.unsubscribe();

      expect(spy).toHaveBeenNthCalledWith(
        3,
        new Money(1, 1).getCoinsAndNotes()
      );
      expect(spy).toHaveBeenNthCalledWith(4, Money.None().getCoinsAndNotes());
    });
  });

  describe("buying snack", () => {
    it("should to buy from snack machine", async () => {
      const spy = vi.fn();
      const sut = await getSUT();

      const subscription = sut.moneyInserted$.subscribe(spy);
      sut.insertDollar();
      await sut.buySnack(0);
      subscription.unsubscribe();

      expect(spy).toHaveBeenNthCalledWith(2, "$1.00");
      expect(spy).toHaveBeenNthCalledWith(3, "¢0");
    });

    it("should to return message from snack machine", async () => {
      const spy = vi.fn();
      const sut = await getSUT();

      const subscription = sut.message$.subscribe(spy);
      sut.insertDollar();
      await sut.buySnack(0);
      subscription.unsubscribe();

      expect(spy).toHaveBeenNthCalledWith(3, "You have bought a snack");
    });

    it("should calculate coins and notes inside machine", async () => {
      const spy = vi.fn();
      const sut = await getSUT();

      const subscription = sut.coinsAndNotes$.subscribe(spy);
      sut.insertDollar();
      await sut.buySnack(0);
      sut.insertFiveDollar();
      await sut.buySnack(0);

      subscription.unsubscribe();

      expect(spy).toHaveBeenLastCalledWith(
        new Money(0, 0, 0, 1, 1).getCoinsAndNotes()
      );
    });
  });
});
