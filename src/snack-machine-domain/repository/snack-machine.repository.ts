import { SnackMachine } from "../model/aggregates/snack-machine/snack-machine";
import { IdbService } from "../../shared-kernel/storage/idb.service";
import { SnackMachineMap } from "./mappers/snack-machine.map";
import { SnackRepository } from "./snack.repository";
import { SlotFromDb } from "../../shared-kernel/storage/idb.model";
import {
  Slot,
  SnackMachineSlotsPosition,
} from "../model/aggregates/snack-machine/entities/slot";
import { SlotMap } from "./mappers/slot.map";
import { SnackPile } from "../model/aggregates/snack-machine/value-objects/snack-pile";
import { SnackMachineWithPersistence } from "../model/aggregates/snack-machine/snack-machine-with-persistence";
import { SnackMap } from "./mappers/snack.map";
import { Snack } from "../model/aggregates/snack/snack";
import { EntityId } from "../../common/entities/entity.abstract";
import { Repository } from "../../common/repositories/repository.abstract";
import { Guard } from "../../util/guard";
import { SnackMachineDto } from "../dto/snack-machine.dto";

export class SnackMachineRepository extends Repository<SnackMachine> {
  private static instance: SnackMachineRepository;

  constructor(
    private db = IdbService.getInstance(),
    private snackRepository = SnackRepository.getInstance()
  ) {
    super();
  }

  public static getInstance(): SnackMachineRepository {
    if (!SnackMachineRepository.instance) {
      SnackMachineRepository.instance = new SnackMachineRepository();
    }
    return SnackMachineRepository.instance;
  }

  async getById(id: string): Promise<SnackMachineWithPersistence> {
    const snackMachineFromDb = await this.db.getSnackMachineById(id);
    Guard.againstTruthy(!snackMachineFromDb, "Snack machine not found");
    const snackMachine = SnackMachineMap.toDomain(snackMachineFromDb!);

    for await (let [index, slotId] of snackMachine.getSlotsIds().entries()) {
      const slot = await this.getSlotWithSnack(slotId);
      snackMachine._setSlot(index as SnackMachineSlotsPosition, slot);
    }

    return snackMachine;
  }

  // TODO test what happened when snack put fails
  async saveOrUpdate(
    aggregateRoot: SnackMachineWithPersistence
  ): Promise<EntityId> {
    for await (let slot of aggregateRoot.getSlots()) {
      if (slot.snackPile.snack?.id) {
        await this.db.putSnackById(
          slot.snackPile.snack?.id,
          SnackMap.toPersistence(slot.snackPile.snack)
        );
      }

      const slotToDb = SlotMap.toPersistence(slot);
      await this.db.putSlotById(slot.id, slotToDb);
    }

    const snackMachineToDb = SnackMachineMap.toPersistence(aggregateRoot);
    return this.db
      .putSnackMachineById(aggregateRoot.id, snackMachineToDb)
      .then((id) => {
        this.onPostSaveOrUpdate(aggregateRoot);
        return id;
      });
  }

  async getAll(): Promise<SnackMachineDto[]> {
    const snackMachinesFromDb = await this.db.getAllSnackMachines();
    return snackMachinesFromDb.map(SnackMachineMap.toDto);
  }

  private async getSlotWithSnack(slotId: EntityId): Promise<Slot> {
    const slotFromDb = await this.db.getSlotById(slotId);
    Guard.againstTruthy(!slotFromDb, "Slot not found");

    const slot = SlotMap.toDomain(slotFromDb!);
    slot.snackPile = await this.getSnackPileWithSnack(slotFromDb!);

    return slot;
  }

  private async getSnackPileWithSnack(
    slotFromDb: SlotFromDb
  ): Promise<SnackPile> {
    const snackId = slotFromDb.snackId;
    const snack = snackId
      ? await this.snackRepository.getById(snackId)
      : Snack.None;
    return new SnackPile(snack, slotFromDb.price, slotFromDb.quantity);
  }
}
