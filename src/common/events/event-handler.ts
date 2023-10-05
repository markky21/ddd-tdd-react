import { IDomainEvent } from "./domain-event";

export interface IEventHandler<T extends IDomainEvent> {
  readonly eventClassName: string;
  handle(domainEvent: T): void;
}
