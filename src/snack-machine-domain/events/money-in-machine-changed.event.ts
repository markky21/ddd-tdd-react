import { IDomainEvent } from "../../common/events/domain-event";
import { CoinsAndNotes } from "../../shared-kernel/value-objects/money";

export class MoneyInMachineChangedEvent implements IDomainEvent {
  constructor(public readonly delta: CoinsAndNotes) {}
}
