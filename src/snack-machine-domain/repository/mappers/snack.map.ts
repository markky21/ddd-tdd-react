import { SnackFromDb } from "../../storage/idb.model";
import { Snack } from "../../model/aggregates/snack/snack";

export class SnackMap {
  public static toDomain(id: string, snackDB: SnackFromDb): Snack {
    return new Snack(id, snackDB.name);
  }

  public static toPersistence(snack: Snack): SnackFromDb {
    return {
      id: snack.id,
      name: snack.name,
    };
  }
}
