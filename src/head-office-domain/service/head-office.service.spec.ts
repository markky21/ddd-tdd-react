import { HeadOfficeService } from "./head-office.service";
import { getHeadOfficeServiceFixture } from "./head-office.service.fixture";
import { map } from "rxjs";

describe(HeadOfficeService.name, () => {
  describe("initialize state", () => {
    it("should initially give information about money", async () => {
      const spy = vi.fn();
      const { service } = await getHeadOfficeServiceFixture();

      const subscription = service.money$.subscribe(spy);
      subscription.unsubscribe();

      expect(spy).toHaveBeenNthCalledWith(1, {
        _fiveDollarCount: 1000,
        _oneCentCount: 1000,
        _oneDollarCount: 1000,
        _quarterCentCount: 1000,
        _tenCentCount: 1000,
        _tenDollarCount: 1000,
      });
    });

    it("should initially give information about balance", async () => {
      const spy = vi.fn();
      const { service } = await getHeadOfficeServiceFixture();

      const subscription = service.balance$
        .pipe(map((b) => b.toView()))
        .subscribe(spy);
      subscription.unsubscribe();

      expect(spy).toHaveBeenNthCalledWith(1, "$5,000.00");
    });
  });

  // describe("takeMoney", () => {
  //   it("should charge money with fee", async () => {
  //     const spy = vi.fn();
  //     const { service } = await getHeadOfficeServiceFixture();
  //     const subscription = service.moneyCharged$.subscribe(spy);
  //
  //     service.takeMoney(new Cash(105.25));
  //     subscription.unsubscribe();
  //
  //     expect(spy).toHaveBeenNthCalledWith(2, "$106.31");
  //   });
  //
  //   it("should to return message about taken money", async () => {
  //     const spy = vi.fn();
  //     const { service } = await getHeadOfficeServiceFixture();
  //     const subscription = service.message$.subscribe(spy);
  //
  //     service.takeMoney(new Cash(1));
  //     subscription.unsubscribe();
  //
  //     expect(spy).toHaveBeenNthCalledWith(1, "You have been charged $1.01");
  //   });
  //
  //   it("should calculate coins and notes inside atm", async () => {
  //     const spy = vi.fn();
  //     const { service } = await getHeadOfficeServiceFixture();
  //     const subscription = service.moneyInside$.subscribe(spy);
  //
  //     service.takeMoney(new Cash(105.25));
  //     subscription.unsubscribe();
  //
  //     expect(spy).toHaveBeenNthCalledWith(
  //       2,
  //       new Money(100, 100, 99, 100, 99, 90).getCoinsAndNotes()
  //     );
  //   });
  //
  //   it("should to return message if atm has not enough money", async () => {
  //     const spy = vi.fn();
  //     const { service } = await getHeadOfficeServiceFixture();
  //     const subscription = service.message$.subscribe(spy);
  //
  //     service.takeMoney(new Cash(10_000));
  //     subscription.unsubscribe();
  //
  //     expect(spy).toHaveBeenNthCalledWith(
  //       1,
  //       "There is not enough money in the ATM"
  //     );
  //   });
  // });
});
