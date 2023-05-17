import { Repository } from "../../shared/repositories/repository.abstract";
import { SnackMachine } from "../model/aggregates/snack-machine/snack-machine";
import { IdbService } from "../storage/idb.service";
import { Guard } from "../../shared/core/utils/guard";
import { SnackMachineMap } from "./mappers/snack-machine.map";
import { SnackRepository } from "./snack.repository";
import { EntityId } from "../../shared/core/entities/entity.abstract";
import { SlotFromDb } from "../storage/idb.model";
import {
  Slot,
  SnackMachineSlotsPosition,
} from "../model/aggregates/snack-machine/entities/slot";
import { SlotMap } from "./mappers/slot.map";
import { SnackPile } from "../model/aggregates/snack-machine/value-objects/snack-pile";
import { SnackMachineWithPersistence } from "../model/aggregates/snack-machine/snack-machine-with-persistence";
import { SnackMap } from "./mappers/snack.map";
import { Snack } from "../model/aggregates/snack/snack";

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
    return await this.db.putSnackMachineById(
      aggregateRoot.id,
      snackMachineToDb
    );
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
