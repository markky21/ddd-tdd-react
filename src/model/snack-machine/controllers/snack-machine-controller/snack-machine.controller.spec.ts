import { SnackMachineController } from "./snack-machine.controller";
import { Money } from "../../core/aggregates/snack-machine/value-objects/money";
import { getSnackMachineControllerFixture } from "./snack-machine.controller.fixture";

describe(SnackMachineController.name, () => {
  describe("initial state", () => {
    it("should initially give information about inserted money", async () => {
      const spy = vi.fn();
      const { controller } = await getSnackMachineControllerFixture();

      const subscription = controller.moneyInserted$.subscribe(spy);
      subscription.unsubscribe();

      expect(spy).toHaveBeenNthCalledWith(1, "¢0");
    });

    it("should initially give information about inserted money in snack machine", async () => {
      const spy = vi.fn();
      const { controller } = await getSnackMachineControllerFixture();

      const subscription = controller.coinsAndNotes$.subscribe(spy);
      subscription.unsubscribe();

      expect(spy).toHaveBeenNthCalledWith(
        1,
        new Money(10, 10, 10, 10, 10, 10).getCoinsAndNotes()
      );
    });

    it("should initially give empty message from snack machine", async () => {
      const spy = vi.fn();
      const { controller } = await getSnackMachineControllerFixture();

      const subscription = controller.message$.subscribe(spy);
      subscription.unsubscribe();

      expect(spy).toHaveBeenNthCalledWith(1, "");
    });
  });

  describe("inserting money", () => {
    it("should to insert money into snack machine", async () => {
      const spy = vi.fn();
      const { controller } = await getSnackMachineControllerFixture();

      const subscription = controller.moneyInserted$.subscribe(spy);
      controller.insertOneCent();
      controller.insertTenCent();
      controller.insertQuarter();
      controller.insertDollar();
      controller.insertFiveDollar();
      controller.insertTenDollar();
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
      const { controller } = await getSnackMachineControllerFixture();

      const subscription = controller.message$.subscribe(spy);
      controller.insertOneCent();
      controller.insertTenCent();
      controller.insertQuarter();
      controller.insertDollar();
      controller.insertFiveDollar();
      controller.insertTenDollar();
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
        controller,
        snackMachineRepositoryFixture: { moneyInMachineInitial },
      } = await getSnackMachineControllerFixture();

      const subscription = controller.coinsAndNotes$.subscribe(spy);
      controller.insertOneCent();
      controller.insertTenCent();

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

  describe("returning money", () => {
    it("should to return money from snack machine", async () => {
      const spy = vi.fn();
      const { controller } = await getSnackMachineControllerFixture();

      const subscription = controller.moneyInserted$.subscribe(spy);
      controller.insertOneCent();
      controller.insertTenCent();
      controller.returnMoney();
      subscription.unsubscribe();

      expect(spy).toHaveBeenNthCalledWith(1, "¢0");
      expect(spy).toHaveBeenNthCalledWith(2, "¢1");
      expect(spy).toHaveBeenNthCalledWith(3, "¢11");
      expect(spy).toHaveBeenNthCalledWith(4, "¢0");
    });

    it("should to return message from snack machine", async () => {
      const spy = vi.fn();
      const { controller } = await getSnackMachineControllerFixture();

      const subscription = controller.message$.subscribe(spy);
      controller.insertOneCent();
      controller.returnMoney();
      subscription.unsubscribe();

      expect(spy).toHaveBeenNthCalledWith(3, "Money returned");
    });

    it("should calculate coins and notes inside machine", async () => {
      const spy = vi.fn();
      const {
        controller,
        snackMachineRepositoryFixture: { moneyInMachineInitial },
      } = await getSnackMachineControllerFixture();

      const subscription = controller.coinsAndNotes$.subscribe(spy);
      controller.insertOneCent();
      controller.insertTenCent();
      controller.returnMoney();

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
      const { controller } = await getSnackMachineControllerFixture();

      const subscription = controller.moneyInserted$.subscribe(spy);
      controller.insertDollar();
      await controller.buySnack(0);
      subscription.unsubscribe();

      expect(spy).toHaveBeenNthCalledWith(2, "$1.00");
      expect(spy).toHaveBeenNthCalledWith(3, "¢0");
    });

    it("should to return message from snack machine", async () => {
      const spy = vi.fn();
      const { controller } = await getSnackMachineControllerFixture();

      const subscription = controller.message$.subscribe(spy);
      controller.insertDollar();
      await controller.buySnack(0);
      subscription.unsubscribe();

      expect(spy).toHaveBeenNthCalledWith(3, "You have bought a snack");
    });

    it("should calculate coins and notes inside machine", async () => {
      const spy = vi.fn();
      const { controller } = await getSnackMachineControllerFixture();

      const subscription = controller.coinsAndNotes$.subscribe(spy);
      controller.insertDollar();
      await controller.buySnack(0);
      controller.insertFiveDollar();
      await controller.buySnack(0);

      subscription.unsubscribe();

      expect(spy).toHaveBeenLastCalledWith(
        new Money(10, 10, 10, 7, 11, 10).getCoinsAndNotes()
      );
    });
  });
});
