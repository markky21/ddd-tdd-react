import { ATMFromDb } from "../../../shared-kernel/storage/idb.model";
import { Atm } from "../../model/atm";
import { Money } from "../../../shared-kernel/value-objects/money";
import { Cash } from "../../../shared-kernel/value-objects/cash";
import { AtmDto } from "../../dto/atm.dto";

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
      moneyInMachine: atm.getMoneyInside().getCoinsAndNotes(),
      moneyCharged: atm.getMoneyCharged().amount,
    };
  }

  public static toDto(atmFromDb: ATMFromDb): AtmDto {
    return new AtmDto(
      atmFromDb.id,
      Money.FromCoinsAndNotes(atmFromDb.moneyInMachine).toView()
    );
  }
}
