import { render, screen } from "@testing-library/react";
import { MoneyInside } from "./money-inside";
import { Money } from "../../../shared-kernel/value-objects/money";
import { Cash } from "../../../shared-kernel/value-objects/cash";
import { expect } from "vitest";

const getSUT = () => {
  const moneyInside = new Money(100, 100, 100, 100, 100, 100);
  const moneyCharged = new Cash(1.1);
  const view = render(
    <MoneyInside moneyInside={moneyInside} moneyCharged={moneyCharged} />
  );
  return { moneyInside, view };
};

test("money inside amount is visible", () => {
  getSUT();

  expect(screen.getByText(`Money inside: $1,636.00`)).toBeInTheDocument();
});

test("money charged amount is visible", () => {
  getSUT();

  expect(screen.getByText(`Money charged: $1.10`)).toBeInTheDocument();
});

test("coins and notes are visible", () => {
  getSUT();

  expect(screen.getByTestId("moneyInside")).toHaveTextContent(
    "Coins and notes:¢1: 100¢10: 100¢25: 100$1: 100$5: 100$10: 100"
  );
});
