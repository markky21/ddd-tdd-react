import { AtmService } from "./atm.service";
import { getAtmServiceFixture } from "./atm.service.fixture";
import { Cash } from "../../shared-kernel/value-objects/cash";
import { Money } from "../../shared-kernel/value-objects/money";
import { vitest } from "vitest";
import { IdbService } from "../../shared-kernel/storage/idb.service";

describe(AtmService.name, () => {
  describe("initialize state", () => {
    it("should initially give information about money inside", async () => {
      const spy = vi.fn();
      const { service } = await getAtmServiceFixture();

      const subscription = service.moneyInside$.subscribe(spy);
      subscription.unsubscribe();

      expect(spy).toHaveBeenNthCalledWith(1, {
        fiveDollarCount: 100,
        oneCentCount: 100,
        oneDollarCount: 100,
        quarterCentCount: 100,
        tenCentCount: 100,
        tenDollarCount: 100,
      });
    });

    it("should initially give information about money charged", async () => {
      const spy = vi.fn();
      const { service } = await getAtmServiceFixture();

      const subscription = service.moneyCharged$.subscribe(spy);
      subscription.unsubscribe();

      expect(spy).toHaveBeenNthCalledWith(1, "$0.00");
    });
  });

  describe("takeMoney", () => {
    it("should charge money with fee", async () => {
      const spy = vi.fn();
      const { service } = await getAtmServiceFixture();
      const subscription = service.moneyCharged$.subscribe(spy);

      await service.takeMoney(new Cash(105.25));
      subscription.unsubscribe();

      expect(spy).toHaveBeenNthCalledWith(2, "$106.31");
    });

    it("should to return message about taken money", async () => {
      const spy = vi.fn();
      const { service } = await getAtmServiceFixture();
      const subscription = service.message$.subscribe(spy);

      await service.takeMoney(new Cash(1));
      subscription.unsubscribe();

      expect(spy).toHaveBeenNthCalledWith(1, "You have been charged $1.01");
    });

    it("should calculate coins and notes inside atm", async () => {
      const spy = vi.fn();
      const { service } = await getAtmServiceFixture();
      const subscription = service.moneyInside$.subscribe(spy);

      await service.takeMoney(new Cash(105.25));
      subscription.unsubscribe();

      expect(spy).toHaveBeenNthCalledWith(
        2,
        new Money(100, 100, 99, 100, 99, 90).getCoinsAndNotes()
      );
    });

    it("should to return message if atm has not enough money", async () => {
      const spy = vi.fn();
      const { service } = await getAtmServiceFixture();
      const subscription = service.message$.subscribe(spy);

      await service.takeMoney(new Cash(10_000));
      subscription.unsubscribe();

      expect(spy).toHaveBeenNthCalledWith(
        1,
        "There is not enough money in the ATM"
      );
    });

    it("should to return message if atm could not save request", async () => {
      const spy = vi.fn();
      const { service } = await getAtmServiceFixture();
      const subscription = service.message$.subscribe(spy);
      vitest
        .spyOn(IdbService.getInstance(), "putAtmById")
        .mockRejectedValue(new Error("test error"));

      await service.takeMoney(new Cash(1));
      subscription.unsubscribe();

      expect(spy).toBeCalledWith("Error while saving atm");
    });
  });
});
