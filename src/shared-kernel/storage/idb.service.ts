import { DBSchema, openDB } from "idb";
import { IDBPDatabase } from "idb/build/entry";
import {
  SlotFromDb,
  SnackMachineFromDb,
  SnackFromDb,
  ATMFromDb,
  HeadOfficeFromDb,
} from "./idb.model";

interface MyDB extends DBSchema {
  atm: {
    value: ATMFromDb;
    key: string;
  };
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
  "head-office": {
    value: HeadOfficeFromDb;
    key: string;
  };
}

export class IdbService {
  private static instance: IdbService;

  private db: IDBPDatabase<MyDB> = {} as IDBPDatabase<MyDB>;

  private constructor(
    private dbName: string = "ddd-practice",
    private version: number = 1
  ) {}

  public static getInstance(): IdbService {
    if (!IdbService.instance) {
      IdbService.instance = new IdbService();
    }
    return IdbService.instance;
  }

  public async initialize(): Promise<IDBPDatabase<MyDB>> {
    this.db = await openDB<MyDB>(this.dbName, this.version, {
      upgrade(db) {
        db.createObjectStore("snack-machine", {
          autoIncrement: true,
        });
        db.createObjectStore("atm", {
          autoIncrement: true,
        });
        db.createObjectStore("slot", {
          autoIncrement: true,
        });
        db.createObjectStore("snack", {
          autoIncrement: true,
        });
        db.createObjectStore("head-office", {
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

  async getAllSnackMachines(): Promise<SnackMachineFromDb[]> {
    const db = await this.getDb();
    return db.getAll("snack-machine");
  }

  async getAtmById(id: string): Promise<ATMFromDb | undefined> {
    const db = await this.getDb();
    return db.get("atm", id);
  }

  async putAtmById(id: string, atm: ATMFromDb): Promise<string> {
    const db = await this.getDb();
    return db.put("atm", atm, id);
  }

  async getAllAtms(): Promise<ATMFromDb[]> {
    const db = await this.getDb();
    return db.getAll("atm");
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

  async getHeadOfficeById(id: string): Promise<HeadOfficeFromDb | undefined> {
    const db = await this.getDb();
    return db.get("head-office", id);
  }

  async putHeadOfficeById(
    id: string,
    headOffice: HeadOfficeFromDb
  ): Promise<string> {
    const db = await this.getDb();
    return db.put("head-office", headOffice, id);
  }
}
