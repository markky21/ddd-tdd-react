import { IEventHandler } from "./event-handler";
import { IDomainEvent } from "./domain-event";

export class DomainEvents {
  private static dynamicHandlers: {
    [key: string]: IEventHandler<IDomainEvent>[];
  } = {};

  public static register(eventHandler: IEventHandler<IDomainEvent>): void {
    const eventClassName = eventHandler.eventClassName;
    if (!this.dynamicHandlers[eventClassName]) {
      this.dynamicHandlers[eventClassName] = [];
    }
    this.dynamicHandlers[eventClassName].push(eventHandler);
  }

  public static dispatch(event: IDomainEvent): void {
    const eventClassName = event.constructor.name;
    if (this.dynamicHandlers[eventClassName]) {
      this.dynamicHandlers[eventClassName].forEach((handler) =>
        handler.handle(event)
      );
    }
  }
}
