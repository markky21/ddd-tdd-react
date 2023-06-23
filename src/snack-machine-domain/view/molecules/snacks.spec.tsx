import { render, screen } from "@testing-library/react";
import { Snacks } from "./snacks";
import { SlotView } from "../../service/slot.service";

const testSnackMachineSlots: SlotView[] = [
  { position: 0, price: "1", quantity: 10, name: "Chocolate" },
  { position: 1, price: "0", quantity: 0, name: "None" },
  { position: 2, price: "0", quantity: 0, name: "None" },
];

test("is display snacks", async () => {
  render(<Snacks slots={testSnackMachineSlots} />);

  expect(screen.getByText("Chocolate")).toBeInTheDocument();
});
