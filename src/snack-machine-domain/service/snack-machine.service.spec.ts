import { SnackMachineService } from "./snack-machine.service";
import { Money } from "../model/aggregates/snack-machine/value-objects/money";
import { getSnackMachineServiceFixture } from "./snack-machine.service.fixture";
import { Cash } from "../model/aggregates/snack-machine/value-objects/cash";
import { describe } from "vitest";

describe(SnackMachineService.name, () => {
  describe("initial state", () => {
    it("should initially give information about inserted money", async () => {
      const spy = vi.fn();
      const { service } = await getSnackMachineServiceFixture();

      const subscription = service.moneyInserted$.subscribe(spy);
      subscription.unsubscribe();

      expect(spy).toHaveBeenNthCalledWith(1, "¢0");
    });

    it("should initially give information about inserted money in snack machine", async () => {
      const spy = vi.fn();
      const { service } = await getSnackMachineServiceFixture();

      const subscription = service.coinsAndNotes$.subscribe(spy);
      subscription.unsubscribe();

      expect(spy).toHaveBeenNthCalledWith(
        1,
        new Money(10, 10, 10, 10, 10, 10).getCoinsAndNotes()
      );
    });

    it("should initially give empty message from snack machine", async () => {
      const spy = vi.fn();
      const { service } = await getSnackMachineServiceFixture();

      const subscription = service.message$.subscribe(spy);
      subscription.unsubscribe();

      expect(spy).toHaveBeenNthCalledWith(1, "");
    });
  });

  describe("inserting money", () => {
    it("should to insert money into snack machine", async () => {
      const spy = vi.fn();
      const { service } = await getSnackMachineServiceFixture();

      const subscription = service.moneyInserted$.subscribe(spy);
      service.insertOneCent();
      service.insertTenCent();
      service.insertQuarter();
      service.insertDollar();
      service.insertFiveDollar();
      service.insertTenDollar();
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
      const { service } = await getSnackMachineServiceFixture();

      const subscription = service.message$.subscribe(spy);
      service.insertOneCent();
      service.insertTenCent();
      service.insertQuarter();
      service.insertDollar();
      service.insertFiveDollar();
      service.insertTenDollar();
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
      const {
        service,
        snackMachineRepositoryFixture: { moneyInMachineInitial },
      } = await getSnackMachineServiceFixture();

      const subscription = service.coinsAndNotes$.subscribe(spy);
      service.insertOneCent();
      service.insertTenCent();

      subscription.unsubscribe();

      expect(spy).toHaveBeenNthCalledWith(
        1,
        moneyInMachineInitial.getCoinsAndNotes()
      );
      expect(spy).toHaveBeenNthCalledWith(
        2,
        moneyInMachineInitial.add(Money.OneCent()).getCoinsAndNotes()
      );
      expect(spy).toHaveBeenNthCalledWith(
        3,
        moneyInMachineInitial
          .add(Money.OneCent())
          .add(Money.TenCent())
          .getCoinsAndNotes()
      );
    });
  });

  describe("slots", () => {
    it("should update state after snack purchase", async () => {
      const spy = vi.fn();
      const { service } = await getSnackMachineServiceFixture();

      const subscription = service.snacks$.subscribe(spy);
      service.insertDollar();
      await service.buySnack(0);
      subscription.unsubscribe();

      expect(spy.mock.calls[0]).toEqual([
        [
          { position: 0, price: "$1.00", quantity: 10, name: "Chocolate" },
          { position: 1, price: "¢0", quantity: 0, name: "None" },
          { position: 2, price: "¢0", quantity: 0, name: "None" },
        ],
      ]);
      expect(spy.mock.calls[1]).toEqual([
        [
          { position: 0, price: "$1.00", quantity: 9, name: "Chocolate" },
          { position: 1, price: "¢0", quantity: 0, name: "None" },
          { position: 2, price: "¢0", quantity: 0, name: "None" },
        ],
      ]);
    });
  });

  describe("total money inside machine", () => {
    it("should be returned", async () => {
      const spy = vi.fn();
      const {
        service,
        snackMachineRepositoryFixture: { moneyInMachineInitial },
      } = await getSnackMachineServiceFixture();
      const initialCash = new Cash(moneyInMachineInitial.getTotalAmount());

      const subscription = service.moneyInMachine$.subscribe(spy);
      service.insertOneCent();

      subscription.unsubscribe();

      expect(spy).toHaveBeenNthCalledWith(1, initialCash.toView());
      expect(spy).toHaveBeenNthCalledWith(
        2,
        initialCash.add(new Cash(0.01)).toView()
      );
    });
  });

  describe("returning money", () => {
    it("should to return money from snack machine", async () => {
      const spy = vi.fn();
      const { service } = await getSnackMachineServiceFixture();

      const subscription = service.moneyInserted$.subscribe(spy);
      service.insertOneCent();
      service.insertTenCent();
      service.returnMoney();
      subscription.unsubscribe();

      expect(spy).toHaveBeenNthCalledWith(1, "¢0");
      expect(spy).toHaveBeenNthCalledWith(2, "¢1");
      expect(spy).toHaveBeenNthCalledWith(3, "¢11");
      expect(spy).toHaveBeenNthCalledWith(4, "¢0");
    });

    it("should to return message from snack machine", async () => {
      const spy = vi.fn();
      const { service } = await getSnackMachineServiceFixture();

      const subscription = service.message$.subscribe(spy);
      service.insertOneCent();
      service.returnMoney();
      subscription.unsubscribe();

      expect(spy).toHaveBeenNthCalledWith(3, "Money returned");
    });

    it("should calculate coins and notes inside machine", async () => {
      const spy = vi.fn();
      const {
        service,
        snackMachineRepositoryFixture: { moneyInMachineInitial },
      } = await getSnackMachineServiceFixture();

      const subscription = service.coinsAndNotes$.subscribe(spy);
      service.insertOneCent();
      service.insertTenCent();
      service.returnMoney();

      subscription.unsubscribe();

      expect(spy).toHaveBeenNthCalledWith(
        3,
        moneyInMachineInitial.add(new Money(1, 1)).getCoinsAndNotes()
      );
      expect(spy).toHaveBeenNthCalledWith(
        4,
        moneyInMachineInitial.getCoinsAndNotes()
      );
    });
  });

  describe("buying snack", () => {
    it("should to buy from snack machine", async () => {
      const spy = vi.fn();
      const { service } = await getSnackMachineServiceFixture();

      const subscription = service.moneyInserted$.subscribe(spy);
      service.insertDollar();
      await service.buySnack(0);
      subscription.unsubscribe();

      expect(spy).toHaveBeenNthCalledWith(2, "$1.00");
      expect(spy).toHaveBeenNthCalledWith(3, "¢0");
    });

    it("should to return message from snack machine", async () => {
      const spy = vi.fn();
      const { service } = await getSnackMachineServiceFixture();

      const subscription = service.message$.subscribe(spy);
      service.insertDollar();
      await service.buySnack(0);
      subscription.unsubscribe();

      expect(spy).toHaveBeenNthCalledWith(3, "You have bought a snack");
    });

    it("should calculate coins and notes inside machine", async () => {
      const spy = vi.fn();
      const { service } = await getSnackMachineServiceFixture();

      const subscription = service.coinsAndNotes$.subscribe(spy);
      service.insertDollar();
      await service.buySnack(0);
      service.insertFiveDollar();
      await service.buySnack(0);

      subscription.unsubscribe();

      expect(spy).toHaveBeenLastCalledWith(
        new Money(10, 10, 10, 7, 11, 10).getCoinsAndNotes()
      );
    });

    it("should show message when snack is not available", async () => {
      const spy = vi.fn();
      const { service } = await getSnackMachineServiceFixture();

      const subscription = service.message$.subscribe(spy);
      service.insertDollar();
      await service.buySnack(1);
      subscription.unsubscribe();

      expect(spy).toHaveBeenLastCalledWith("There is no snack in the slot");
    });

    it("should show message if there is not enough money", async () => {
      const spy = vi.fn();
      const { service } = await getSnackMachineServiceFixture();

      const subscription = service.message$.subscribe(spy);
      service.insertOneCent();
      await service.buySnack(0);
      subscription.unsubscribe();

      expect(spy).toHaveBeenLastCalledWith("Not enough money to buy the snack");
    });
  });
});
