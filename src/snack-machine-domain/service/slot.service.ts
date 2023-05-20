import { Slot } from "../model/aggregates/snack-machine/entities/slot";
import { Cash } from "../../shared-kernel/value-objects/cash";

export interface SlotView {
  position: number;
  price: string;
  quantity: number;
  name: string;
}
export class SlotService {
  constructor(private slot: Slot) {}

  toView(): SlotView {
    return {
      position: this.slot.position,
      price: new Cash(this.slot.snackPile.price).toView(),
      quantity: this.slot.snackPile.quantity,
      name: this.slot.snackPile.snack.name,
    };
  }
}
