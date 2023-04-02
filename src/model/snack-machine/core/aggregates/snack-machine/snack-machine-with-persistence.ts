import { IdbService } from "../../../data-access/idb.service";
import { SnackMachine } from "./snack-machine";
import { Money } from "../../value-objects/money";
import { EntityId } from "../../../../shared/core/entities/entity.abstract";
import { SnackMachineSlotsPosition } from "./entities/slot";

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
      await this.db.putSnackMachine(
        this.getMoneyInMachine().getCoinsAndNotes()
      );
    }
  }

  async buySnack(position: SnackMachineSlotsPosition): Promise<void> {
    super.buySnack(position);
    await this.db.putSnackMachine(
      this.getMoneyInMachine().getCoinsAndNotes(),
      this.id as string
    );
  }
}
