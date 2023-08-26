import { HeadOfficeFromDb } from "../../../shared-kernel/storage/idb.model";
import { Money } from "../../../shared-kernel/value-objects/money";
import { Cash } from "../../../shared-kernel/value-objects/cash";
import { HeadOffice } from "../../model/head-office";

export class HeadOfficeMap {
  public static toDomain(headOfficeFromDb: HeadOfficeFromDb): HeadOffice {
    const headOffice = new HeadOffice(headOfficeFromDb.id);
    headOffice.addMoney(Money.FromCoinsAndNotes(headOfficeFromDb.money));
    headOffice.loadBalance(new Cash(headOfficeFromDb.balance));
    return headOffice;
  }

  public static toPersistence(headOffice: HeadOffice): HeadOfficeFromDb {
    return {
      id: headOffice.id,
      money: headOffice.getMoney().getCoinsAndNotes(),
      balance: headOffice.getBalance().amount,
    };
  }
}
