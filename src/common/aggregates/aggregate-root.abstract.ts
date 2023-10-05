import { Entity } from "../entities/entity.abstract";
import { IDomainEvent } from "../events/domain-event";

export abstract class AggregateRoot extends Entity {
  private readonly domainEvents = new Set<IDomainEvent>();

  protected addDomainEvent(domainEvent: IDomainEvent): void {
    this.domainEvents.add(domainEvent);
  }

  public getDomainEvents(): IDomainEvent[] {
    return [...this.domainEvents];
  }

  public clearDomainEvents(): void {
    this.domainEvents.clear();
  }
}
