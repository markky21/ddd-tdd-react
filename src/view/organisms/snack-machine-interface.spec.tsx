import "fake-indexeddb/auto";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SnackMachineInterface } from "./snack-machine-interface";
import { SnackMachineController } from "../../model/snack-machine/controllers/snack-machine-controller/snack-machine.controller";
import "@testing-library/jest-dom";
import { getSUT } from "../../model/snack-machine/controllers/snack-machine-controller/snack-machine.controller.test-utils";

const getController = async (): Promise<SnackMachineController> => {
  const { controller } = await getSUT();
  return controller;
};

describe(SnackMachineInterface.name, () => {
  it("user can insert money", async () => {
    const controller = await getController();
    render(<SnackMachineInterface snackMachine={controller} />);

    expect(screen.getByTestId("insertedMoney")).toHaveTextContent(
      "Money inserted: ¢0"
    );

    fireEvent.click(screen.getByText("Put ¢1"));
    fireEvent.click(screen.getByText("Put ¢10"));
    fireEvent.click(screen.getByText("Put ¢25"));
    fireEvent.click(screen.getByText("Put $1"));
    fireEvent.click(screen.getByText("Put $5"));
    fireEvent.click(screen.getByText("Put $10"));

    expect(screen.getByTestId("insertedMoney")).toHaveTextContent(
      "Money inserted: $16.36"
    );
  });

  it("user can buy a snack", async () => {
    const controller = await getController();
    render(<SnackMachineInterface snackMachine={controller} />);

    fireEvent.click(screen.getByText("Put $10"));
    expect(screen.getByTestId("message")).toHaveTextContent(
      "You inserted $10.00"
    );

    fireEvent.click(screen.getByText("Buy a snack 1"));
    await waitFor(() =>
      expect(screen.getByTestId("message")).toHaveTextContent(
        "You have bought a snack"
      )
    );

    expect(screen.getByTestId("insertedMoney")).toHaveTextContent(
      "Money inserted: ¢0"
    );
  });

  it("user can return money", async () => {
    const controller = await getController();
    render(<SnackMachineInterface snackMachine={controller} />);

    fireEvent.click(screen.getByText("Put $10"));
    expect(screen.getByTestId("message")).toHaveTextContent(
      "You inserted $10.00"
    );

    fireEvent.click(screen.getByText("Return money"));
    expect(screen.getByTestId("message")).toHaveTextContent("Money returned");
    expect(screen.getByTestId("insertedMoney")).toHaveTextContent(
      "Money inserted: ¢0"
    );
  });

  it("user should see messages", async () => {
    const controller = await getController();
    render(<SnackMachineInterface snackMachine={controller} />);

    fireEvent.click(screen.getByText("Put $10"));
    expect(screen.getByTestId("message")).toHaveTextContent(
      "You inserted $10.00"
    );
  });

  it("user should see coins and notes", async () => {
    const controller = await getController();
    render(<SnackMachineInterface snackMachine={controller} />);

    await waitFor(() =>
      expect(screen.getByTestId("moneyInside")).toHaveTextContent(
        "Money inside: ¢1: 10¢10: 10¢25: 10$1: 10$5: 10$10: 10"
      )
    );

    fireEvent.click(screen.getByText("Put $10"));
    await waitFor(() =>
      expect(screen.getByTestId("moneyInside")).toHaveTextContent(
        "Money inside: ¢1: 10¢10: 10¢25: 10$1: 10$5: 10$10: 11"
      )
    );

    fireEvent.click(screen.getByText("Buy a snack 1"));
    await waitFor(() =>
      expect(screen.getByTestId("moneyInside")).toHaveTextContent(
        "Money inside: ¢1: 10¢10: 10¢25: 10$1: 6$5: 9$10: 11"
      )
    );

    fireEvent.click(screen.getByText("Put $5"));
    expect(screen.getByTestId("moneyInside")).toHaveTextContent(
      "Money inside: ¢1: 10¢10: 10¢25: 10$1: 6$5: 10$10: 11"
    );
  });
});
