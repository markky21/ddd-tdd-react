import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SnackMachineInterface } from "./snack-machine-interface";
import { SnackMachine } from "../../model/snack-machine/core/entities/snack-machine";

describe(SnackMachineInterface.name, () => {
  it("user can insert money", () => {
    const { getByTestId } = render(
      <SnackMachineInterface snackMachine={new SnackMachine(1)} />
    );

    expect(getByTestId("insertedMoney").textContent).toEqual(
      "Money inserted: ¢0"
    );

    fireEvent.click(screen.getByText("Put ¢1"));
    fireEvent.click(screen.getByText("Put ¢10"));
    fireEvent.click(screen.getByText("Put ¢25"));
    fireEvent.click(screen.getByText("Put $1"));
    fireEvent.click(screen.getByText("Put $5"));
    fireEvent.click(screen.getByText("Put $10"));

    expect(getByTestId("insertedMoney").textContent).toEqual(
      "Money inserted: $16.36"
    );
  });

  it("user can buy a snack", () => {
    const { getByTestId } = render(
      <SnackMachineInterface snackMachine={new SnackMachine(1)} />
    );

    fireEvent.click(screen.getByText("Put $10"));
    expect(getByTestId("message").textContent).toEqual("You inserted $10.00");

    fireEvent.click(screen.getByText("Buy a snack"));
    expect(getByTestId("message").textContent).toEqual(
      "You have bought a snack"
    );
    expect(getByTestId("insertedMoney").textContent).toEqual(
      "Money inserted: ¢0"
    );
  });

  it("user can return money", () => {
    const { getByTestId } = render(
      <SnackMachineInterface snackMachine={new SnackMachine(1)} />
    );

    fireEvent.click(screen.getByText("Put $10"));
    expect(getByTestId("message").textContent).toEqual("You inserted $10.00");

    fireEvent.click(screen.getByText("Return money"));
    expect(getByTestId("message").textContent).toEqual("Money returned");
    expect(getByTestId("insertedMoney").textContent).toEqual(
      "Money inserted: ¢0"
    );
  });

  it("user should see messages", () => {
    const { getByTestId } = render(
      <SnackMachineInterface snackMachine={new SnackMachine(1)} />
    );

    fireEvent.click(screen.getByText("Put $10"));
    expect(getByTestId("message").textContent).toEqual("You inserted $10.00");
  });

  it("user should see coins and notes", () => {
    const { getByTestId } = render(
      <SnackMachineInterface snackMachine={new SnackMachine(1)} />
    );

    fireEvent.click(screen.getByText("Put $10"));
    expect(getByTestId("moneyInside").textContent).toEqual(
      "Money inside: ¢1: 0¢10: 0¢25: 0$1: 0$5: 0$10: 1"
    );

    fireEvent.click(screen.getByText("Buy a snack"));
    expect(getByTestId("moneyInside").textContent).toEqual(
      "Money inside: ¢1: 0¢10: 0¢25: 0$1: 0$5: 0$10: 1"
    );

    fireEvent.click(screen.getByText("Put $5"));
    expect(getByTestId("moneyInside").textContent).toEqual(
      "Money inside: ¢1: 0¢10: 0¢25: 0$1: 0$5: 1$10: 1"
    );
  });
});
