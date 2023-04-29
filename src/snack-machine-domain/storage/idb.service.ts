import { DBSchema, openDB } from "idb";
import { IDBPDatabase } from "idb/build/entry";
import { SlotFromDb, SnackMachineFromDb, SnackFromDb } from "./idb.model";

interface MyDB extends DBSchema {
  "snack-machine": {
    value: SnackMachineFromDb;
    key: string;
  };
  slot: {
    value: SlotFromDb;
    key: string;
  };
  snack: {
    value: SnackFromDb;
    key: string;
  };
}

export class IdbService {
  private db: IDBPDatabase<MyDB> = {} as IDBPDatabase<MyDB>;

  constructor(
    private dbName: string = "ddd-snack-machine",
    private version: number = 1
  ) {}

  public async initialize(): Promise<IDBPDatabase<MyDB>> {
    this.db = await openDB<MyDB>(this.dbName, this.version, {
      upgrade(db) {
        db.createObjectStore("snack-machine", {
          autoIncrement: true,
        });
        db.createObjectStore("slot", {
          autoIncrement: true,
        });
        db.createObjectStore("snack", {
          autoIncrement: true,
        });
      },
    });
    return this.db;
  }

  private async getDb(): Promise<IDBPDatabase<MyDB>> {
    return !this.db.version ? this.initialize() : this.db;
  }

  async getSnackMachineById(
    id: string
  ): Promise<SnackMachineFromDb | undefined> {
    const db = await this.getDb();
    return db.get("snack-machine", id);
  }

  async putSnackMachineById(
    id: string,
    snackMachine: SnackMachineFromDb
  ): Promise<string> {
    const db = await this.getDb();
    return db.put("snack-machine", snackMachine, id);
  }

  async getSnackById(id: string): Promise<SnackFromDb | undefined> {
    const db = await this.getDb();
    return db.get("snack", id);
  }

  async putSnackById(id: string, snack: SnackFromDb): Promise<string> {
    const db = await this.getDb();
    return db.put("snack", snack, id);
  }

  async getSlotById(id: string): Promise<SlotFromDb | undefined> {
    const db = await this.getDb();
    return db.get("slot", id);
  }

  async putSlotById(id: string, slot: SlotFromDb): Promise<string> {
    const db = await this.getDb();
    return db.put("slot", slot, id);
  }
}
