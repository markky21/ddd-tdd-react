import { HeadOfficeRepository } from "./head-office.repository";
import { HeadOffice } from "../model/head-office";

export class HeadOfficeInstance {
  public static readonly ID = "headOfficeId-1";
  private static instance: HeadOffice;

  private constructor() {}

  static async getInstance(): Promise<HeadOffice> {
    if (!HeadOfficeInstance.instance) {
      const repository = HeadOfficeRepository.getInstance();
      HeadOfficeInstance.instance = await repository.getById(
        HeadOfficeInstance.ID
      );
    }
    return HeadOfficeInstance.instance;
  }

  public static async update(): Promise<void> {
    const repository = HeadOfficeRepository.getInstance();
    await repository.saveOrUpdate(this.instance);
  }
}
