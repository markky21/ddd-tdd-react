import "fake-indexeddb/auto";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SnackMachineInterface } from "./snack-machine-interface";
import { SnackMachineWithPersistence } from "../../model/snack-machine/core/entities/snack-machine-with-persistence";
import { SnackMachineController } from "../../model/snack-machine/controllers/snack-machine-controller/snack-machine.controller";
import { getTestDb } from "../../model/snack-machine/data-access/idb.service.testing";

const getController = async (): Promise<SnackMachineController> => {
  const db = await getTestDb();
  const snackMachine = new SnackMachineWithPersistence(1, db);
  await snackMachine.load();
  return new SnackMachineController(snackMachine);
};

describe(SnackMachineInterface.name, () => {
  it("user can insert money", async () => {
    const controller = await getController();
    const { getByTestId } = render(
      <SnackMachineInterface snackMachine={controller} />
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

  it("user can buy a snack", async () => {
    const controller = await getController();
    const { getByTestId } = render(
      <SnackMachineInterface snackMachine={controller} />
    );

    fireEvent.click(screen.getByText("Put $10"));
    expect(getByTestId("message").textContent).toEqual("You inserted $10.00");

    fireEvent.click(screen.getByText("Buy a snack"));
    await waitFor(() =>
      expect(getByTestId("message").textContent).toEqual(
        "You have bought a snack"
      )
    );

    expect(getByTestId("insertedMoney").textContent).toEqual(
      "Money inserted: ¢0"
    );
  });

  it("user can return money", async () => {
    const controller = await getController();
    const { getByTestId } = render(
      <SnackMachineInterface snackMachine={controller} />
    );

    fireEvent.click(screen.getByText("Put $10"));
    expect(getByTestId("message").textContent).toEqual("You inserted $10.00");

    fireEvent.click(screen.getByText("Return money"));
    expect(getByTestId("message").textContent).toEqual("Money returned");
    expect(getByTestId("insertedMoney").textContent).toEqual(
      "Money inserted: ¢0"
    );
  });

  it("user should see messages", async () => {
    const controller = await getController();
    const { getByTestId } = render(
      <SnackMachineInterface snackMachine={controller} />
    );

    fireEvent.click(screen.getByText("Put $10"));
    expect(getByTestId("message").textContent).toEqual("You inserted $10.00");
  });

  it("user should see coins and notes", async () => {
    const controller = await getController();
    const { getByTestId } = render(
      <SnackMachineInterface snackMachine={controller} />
    );

    fireEvent.click(screen.getByText("Put $10"));
    expect(getByTestId("moneyInside").textContent).toEqual(
      "Money inside: ¢1: 0¢10: 0¢25: 0$1: 0$5: 0$10: 1"
    );

    fireEvent.click(screen.getByText("Buy a snack"));
    await waitFor(() =>
      expect(getByTestId("moneyInside").textContent).toEqual(
        "Money inside: ¢1: 0¢10: 0¢25: 0$1: 0$5: 0$10: 1"
      )
    );

    fireEvent.click(screen.getByText("Put $5"));
    expect(getByTestId("moneyInside").textContent).toEqual(
      "Money inside: ¢1: 0¢10: 0¢25: 0$1: 0$5: 1$10: 1"
    );
  });
});
