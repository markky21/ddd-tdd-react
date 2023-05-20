import { Guard } from "../../util/guard";
import { EntityId } from "../../common/entities/entity.abstract";
import { Repository } from "../../common/repositories/repository.abstract";
import { IdbService } from "../../shared-kernel/storage/idb.service";
import { Atm } from "../model/atm";
import { AtmMap } from "./mappers/atm.map";
import { ATMFromDb } from "../../shared-kernel/storage/idb.model";

export class AtmRepository extends Repository<Atm> {
  private static instance: AtmRepository;

  private constructor(private db = IdbService.getInstance()) {
    super();
  }

  public static getInstance(): AtmRepository {
    if (!AtmRepository.instance) {
      AtmRepository.instance = new AtmRepository();
    }
    return AtmRepository.instance;
  }

  async getById(id: string): Promise<Atm> {
    const atmFromDb = await IdbService.getInstance().getAtmById(id);
    Guard.againstTruthy(!atmFromDb, "Atm not found");
    return AtmMap.toDomain(atmFromDb as ATMFromDb);
  }

  async saveOrUpdate(aggregateRoot: Atm): Promise<EntityId> {
    return this.db.putAtmById(
      aggregateRoot.id,
      AtmMap.toPersistence(aggregateRoot)
    );
  }
}
