import { Cash } from "../../shared-kernel/value-objects/cash";
import { IDomainEvent } from "../../common/events/domain-event";

export class BalanceChangedEvent implements IDomainEvent {
  constructor(public readonly delta: Cash) {}
}
