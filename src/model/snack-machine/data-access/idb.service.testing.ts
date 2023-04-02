import { IdbService } from "./idb.service";
import { nanoid } from "nanoid";

export async function getTestDb(
  dBName: string = nanoid()
): Promise<IdbService> {
  const db = new IdbService(dBName);
  await db.initialize();
  return db;
}
