import { SlotView } from "../../service/slot.service";
import { Snack } from "../atoms/snack";

interface SnacksProps {
  slots: SlotView[];
}
export const Snacks = ({ slots }: SnacksProps) => {
  return (
    <section className="w-[220px] gap-4 flex flex-col">
      {slots.map((slot, index) => (
        <Snack
          key={index}
          quantity={slot.quantity}
          name={slot.name}
          price={slot.price}
        />
      ))}
    </section>
  );
};
