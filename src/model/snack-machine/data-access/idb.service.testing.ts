import { IdbService } from "./idb.service";

export async function getTestDb(
  dBName: string = Date.now().toString()
): Promise<IdbService> {
  const db = new IdbService(dBName);
  await db.initialize();
  return db;
}
