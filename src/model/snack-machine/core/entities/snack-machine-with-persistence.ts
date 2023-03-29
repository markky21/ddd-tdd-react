import { IdbService } from "../../data-access/idb.service";
import { SnackMachine } from "./snack-machine";
import { Money } from "../value-objects/money";
import { EntityId } from "../../../shared/core/entities/entity.abstract";

export class SnackMachineWithPersistence extends SnackMachine {
  constructor(id: EntityId, private db: IdbService) {
    super(id);
  }

  async load(): Promise<void> {
    const moneyInMachine = await this.db.getSnackMachine(this.id as string);
    if (moneyInMachine) {
      this._moneyInMachine = new Money(
        moneyInMachine.oneCentCount,
        moneyInMachine.tenCentCount,
        moneyInMachine.quarterCentCount,
        moneyInMachine.oneDollarCount,
        moneyInMachine.fiveDollarCount,
        moneyInMachine.tenDollarCount
      );
    } else {
      await this.db.putSnackMachine(this.moneyInMachine.getCoinsAndNotes());
    }
  }

  async buySnack(): Promise<void> {
    super.buySnack();
    await this.db.putSnackMachine(
      this.moneyInMachine.getCoinsAndNotes(),
      this.id as string
    );
  }
}
