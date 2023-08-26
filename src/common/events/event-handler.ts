import { IDomainEvent } from "./domain-event";

export interface IEventHandler<T extends IDomainEvent> {
  handle(domainEvent: T): void;
}
