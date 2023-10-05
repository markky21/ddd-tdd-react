import { IEventHandler } from "../../common/events/event-handler";
import { BalanceChangedEvent } from "../../atm-domain/events/balance-changed.event";
import { HeadOfficeRepository } from "../repository/head-office.repository";
import { HeadOfficeInstance } from "../repository/head-office-instance";

export class BalanceChangedEventHandler
  implements IEventHandler<BalanceChangedEvent>
{
  readonly eventClassName = BalanceChangedEvent.name;

  async handle(domainEvent: BalanceChangedEvent): Promise<void> {
    const headOfficeRepository = HeadOfficeRepository.getInstance();
    const headOffice = await HeadOfficeInstance.getInstance();
    headOffice.changeBalance(domainEvent.delta);
    await headOfficeRepository.saveOrUpdate(headOffice);
  }
}
