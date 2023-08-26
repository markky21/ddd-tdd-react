import { SnackMachineService } from "../snack-machine-domain/service/snack-machine.service";
import { IdbService } from "../shared-kernel/storage/idb.service";
import { SnackMachineRepository } from "../snack-machine-domain/repository/snack-machine.repository";
import { SnackRepository } from "../snack-machine-domain/repository/snack.repository";
import { nanoid } from "nanoid";
import { SnackMachineWithPersistence } from "../snack-machine-domain/model/aggregates/snack-machine/snack-machine-with-persistence";
import { Snack } from "../snack-machine-domain/model/aggregates/snack/snack";
import {
  Slot,
  SnackMachineSlotsPosition,
} from "../snack-machine-domain/model/aggregates/snack-machine/entities/slot";
import { SnackPile } from "../snack-machine-domain/model/aggregates/snack-machine/value-objects/snack-pile";
import { Money } from "../shared-kernel/value-objects/money";
import { SnackMachineMap } from "../snack-machine-domain/repository/mappers/snack-machine.map";
import { SlotMap } from "../snack-machine-domain/repository/mappers/slot.map";
import { EntityId } from "../common/entities/entity.abstract";
import { AtmWithPersistence } from "../atm-domain/model/atm-with-persistence";
import { AtmMap } from "../atm-domain/repository/mappers/atm.map";
import { AtmService } from "../atm-domain/service/atm.service";
import { AtmRepository } from "../atm-domain/repository/atm.repository";
import { HeadOfficeWithPersistence } from "../head-office-domain/model/head-office-with-persistence";
import { HeadOfficeMap } from "../head-office-domain/repository/mappers/head-office.map";
import { HeadOfficeService } from "../head-office-domain/service/head-office.service";
import { HeadOfficeInstance } from "../head-office-domain/repository/head-office-instance";

interface IniterConfig {
  snackMachineId: EntityId;
  atmId: EntityId;
  createIfNotExists?: boolean;
}
export class Initer {
  private static db = IdbService.getInstance();
  private static snackRepository = SnackRepository.getInstance();
  private static snackMachineRepository = SnackMachineRepository.getInstance();
  private static atmRepository = AtmRepository.getInstance();

  static async init({ snackMachineId, atmId }: IniterConfig): Promise<{
    snackMachineService: SnackMachineService;
    atmService: AtmService;
    headOfficeService: HeadOfficeService;
  }> {
    await this.db.initialize();

    if (!(await this.db.getSnackMachineById(snackMachineId))) {
      await Initer.createSnackMachine(snackMachineId);
    }

    if (!(await this.db.getAtmById(atmId))) {
      await Initer.createAtm(atmId);
    }

    await HeadOfficeInstance.getInstance().catch(() => {
      return Initer.createHeadOffice();
    });

    const snackMachineService = new SnackMachineService(
      this.snackMachineRepository
    );
    await snackMachineService.initializeSnackMachine(snackMachineId);

    const atmService = new AtmService(this.atmRepository);
    await atmService.initializeAtm(atmId);

    const headOffice = await HeadOfficeInstance.getInstance();
    const headOfficeService = new HeadOfficeService(headOffice);
    await headOfficeService.initialize();

    return { snackMachineService, atmService, headOfficeService };
  }

  private static async createSnackMachine(snackMachineId: EntityId) {
    const snackMachineToSave = new SnackMachineWithPersistence(snackMachineId);

    const snackPosition: SnackMachineSlotsPosition = 0;
    const snackPile0 = new SnackPile(Snack.Chocolate, 3, 10);
    const snackPile1 = new SnackPile(Snack.Soda, 2, 15);
    const snackPile2 = new SnackPile(Snack.Gum, 1, 20);

    const slot0 = new Slot(nanoid(), snackMachineId, 0);
    const slot1 = new Slot(nanoid(), snackMachineId, 1);
    const slot2 = new Slot(nanoid(), snackMachineId, 2);

    slot0.loadSnackPile(snackPile0);
    slot1.loadSnackPile(snackPile1);
    slot2.loadSnackPile(snackPile2);

    snackMachineToSave.loadSnacks(snackPosition, snackPile0);
    snackMachineToSave.loadMoney(new Money(10, 10, 10, 10, 10, 10));
    snackMachineToSave._setSlot(0, slot0);
    snackMachineToSave._setSlot(1, slot1);
    snackMachineToSave._setSlot(2, slot2);

    await this.db.putSnackMachineById(
      snackMachineId,
      SnackMachineMap.toPersistence(snackMachineToSave)
    );

    await this.db.putSlotById(slot0.id, SlotMap.toPersistence(slot0));
    await this.db.putSlotById(slot1.id, SlotMap.toPersistence(slot1));
    await this.db.putSlotById(slot2.id, SlotMap.toPersistence(slot2));
  }

  private static async createAtm(atmId: EntityId) {
    const atmToSave = new AtmWithPersistence(atmId);
    atmToSave.loadMoney(new Money(100, 100, 100, 100, 100, 100));

    await this.db.putAtmById(atmId, AtmMap.toPersistence(atmToSave));
  }

  private static async createHeadOffice() {
    const headOfficeId = await HeadOfficeInstance.ID;
    const headOfficeToSave = new HeadOfficeWithPersistence(headOfficeId);
    headOfficeToSave.addMoney(new Money(100, 100, 100, 100, 100, 100));

    await this.db.putHeadOfficeById(
      headOfficeId,
      HeadOfficeMap.toPersistence(headOfficeToSave)
    );
  }
}
