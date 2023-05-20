import { ATMFromDb } from "../../../shared-kernel/storage/idb.model";
import { Atm } from "../../model/atm";
import { Money } from "../../../shared-kernel/value-objects/money";
import { Cash } from "../../../shared-kernel/value-objects/cash";

export class AtmMap {
  public static toDomain(atmFromDb: ATMFromDb): Atm {
    return new Atm(
      atmFromDb.id,
      Money.FromCoinsAndNotes(atmFromDb.moneyInMachine),
      new Cash(atmFromDb.moneyCharged)
    );
  }

  public static toPersistence(atm: Atm): ATMFromDb {
    return {
      id: atm.id,
      moneyInMachine: atm.moneyInside.getCoinsAndNotes(),
      moneyCharged: atm.moneyCharged.amount,
    };
  }
}
