import { Snack } from "./snack";
import { render, screen } from "@testing-library/react";

test("is display snack name", () => {
  render(<Snack name={"Snickers"} price={"0"} quantity={3} />);

  expect(screen.getByTestId("snackName")).toHaveTextContent("Snickers");
});

test("is display price", () => {
  render(<Snack price={"1.5"} name={"Snickers"} quantity={3} />);

  expect(screen.getByTestId("snackPrice")).toHaveTextContent("1.5");
});

test("is display left amount", () => {
  render(<Snack price={"1.5"} name={"Snickers"} quantity={3} />);

  expect(screen.getByTestId("snackAmount")).toHaveTextContent("3");
});
