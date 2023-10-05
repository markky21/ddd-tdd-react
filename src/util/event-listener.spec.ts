import { describe, expect, vitest } from "vitest";
import { EventListener } from "./event-listener";
import { AggregateRoot } from "../common/aggregates/aggregate-root.abstract";
import { EntityId } from "../common/entities/entity.abstract";
import { IDomainEvent } from "../common/events/domain-event";
import { DomainEvents } from "../common/events/domain-events";

class StubAggregateRoot extends AggregateRoot {
  constructor(id: EntityId) {
    super(id);

    const event1: IDomainEvent = { name: "test event 1" };
    const event2: IDomainEvent = { name: "test event 2" };
    this.addDomainEvent(event1);
    this.addDomainEvent(event2);
  }
}

describe(EventListener.name, () => {
  it("should dispatch events and clear them on post put", () => {
    const eventListener = EventListener.getInstance();
    const aggregateRoot = new StubAggregateRoot("id");
    vitest.spyOn(DomainEvents, "dispatch");

    eventListener.onPostPut(aggregateRoot);

    expect(aggregateRoot.getDomainEvents().length).toEqual(0);
    expect(DomainEvents.dispatch).toHaveBeenCalledWith({
      name: "test event 1",
    });
    expect(DomainEvents.dispatch).toHaveBeenCalledWith({
      name: "test event 2",
    });
  });
});
