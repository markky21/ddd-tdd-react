import { AggregateRoot } from "../common/aggregates/aggregate-root.abstract";
import { DomainEvents } from "../common/events/domain-events";

export class EventListener {
  private static instance: EventListener;

  static getInstance() {
    if (!EventListener.instance) {
      EventListener.instance = new EventListener();
    }
    return EventListener.instance;
  }

  onPostPut(aggregateRoot: AggregateRoot): void {
    this.dispatchEvent(aggregateRoot);
  }

  private dispatchEvent(aggregateRoot: AggregateRoot): void {
    const domainEvents = aggregateRoot.getDomainEvents();
    domainEvents.forEach((event) => {
      DomainEvents.dispatch(event);
    });
    aggregateRoot.clearDomainEvents();
  }
}
