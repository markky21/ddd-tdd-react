import { HeadOfficeService } from "./head-office.service";
import { getHeadOfficeServiceFixture } from "./head-office.service.fixture";
import { map } from "rxjs";
import { expect } from "vitest";

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

    // it("should initially give list of atms", async () => {
    //   const spy = vi.fn();
    //   const {
    //     service,
    //     dbFixture: { atmFromDb },
    //   } = await getHeadOfficeServiceFixture();
    //
    //   const subscription = service.atms$.subscribe(spy);
    //   subscription.unsubscribe();
    //
    //   expect(spy).toHaveBeenCalledWith(
    //     expect.arrayContaining([
    //       { id: atmFromDb?.id, moneyCharged: atmFromDb?.moneyCharged },
    //     ])
    //   );
    // });

    // it("should initially give list of snackMachines", async () => {
    //   const spy = vi.fn();
    //   const {
    //     service,
    //     dbFixture: { snackMachineFromDb },
    //   } = await getHeadOfficeServiceFixture();
    //
    //   const subscription = service.snackMachines$.subscribe(spy);
    //   subscription.unsubscribe();
    //
    //   expect(spy).toHaveBeenCalledWith(
    //     expect.arrayContaining([
    //       {
    //         id: snackMachineFromDb.id,
    //         moneyInMachine: snackMachineFromDb.moneyInMachine,
    //       },
    //     ])
    //   );
    // });
  });
});
