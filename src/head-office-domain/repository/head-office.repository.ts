import { Guard } from "../../util/guard";
import { EntityId } from "../../common/entities/entity.abstract";
import { Repository } from "../../common/repositories/repository.abstract";
import { IdbService } from "../../shared-kernel/storage/idb.service";
import { HeadOfficeMap } from "./mappers/head-office.map";
import { HeadOffice } from "../model/head-office";
import { HeadOfficeFromDb } from "../../shared-kernel/storage/idb.model";

export class HeadOfficeRepository extends Repository<HeadOffice> {
  private static instance: HeadOfficeRepository;

  private constructor(private db = IdbService.getInstance()) {
    super();
  }

  public static getInstance(): HeadOfficeRepository {
    if (!HeadOfficeRepository.instance) {
      HeadOfficeRepository.instance = new HeadOfficeRepository();
    }
    return HeadOfficeRepository.instance;
  }

  async getById(id: EntityId): Promise<HeadOffice> {
    const headOfficeFromDb = await IdbService.getInstance().getHeadOfficeById(
      id
    );
    Guard.againstTruthy(!headOfficeFromDb, "HeadOffice not found");
    return HeadOfficeMap.toDomain(headOfficeFromDb as HeadOfficeFromDb);
  }

  async saveOrUpdate(aggregateRoot: HeadOffice): Promise<EntityId> {
    return this.db.putHeadOfficeById(
      aggregateRoot.id,
      HeadOfficeMap.toPersistence(aggregateRoot)
    );
  }
}
