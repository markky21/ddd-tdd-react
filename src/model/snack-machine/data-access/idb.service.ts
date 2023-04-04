import { DBSchema, openDB } from "idb";
import { IDBPDatabase } from "idb/build/entry";
import { CoinsAndNotes } from "../core/aggregates/snack-machine/value-objects/money";

type SnackMachine = CoinsAndNotes;

interface MyDB extends DBSchema {
  "snack-machine": {
    value: SnackMachine;
    key: string;
  };
}

export class IdbService {
  private db: IDBPDatabase<MyDB> = {} as IDBPDatabase<MyDB>;

  constructor(
    private dbName: string = "snackMachine",
    private version: number = 1
  ) {}

  public async initialize(): Promise<IDBPDatabase<MyDB>> {
    this.db = await openDB<MyDB>(this.dbName, this.version, {
      upgrade(db) {
        db.createObjectStore("snack-machine", {
          autoIncrement: true,
        });
      },
    });
    return this.db;
  }

  private async getDb(): Promise<IDBPDatabase<MyDB>> {
    return !this.db.version ? this.initialize() : this.db;
  }

  async putSnackMachine(
    snackMachine: SnackMachine,
    id?: string
  ): Promise<string> {
    const db = await this.getDb();
    return db.put("snack-machine", snackMachine, id);
  }

  async getSnackMachine(id: string): Promise<SnackMachine | undefined> {
    const db = await this.getDb();
    return db.get("snack-machine", id);
  }
}
