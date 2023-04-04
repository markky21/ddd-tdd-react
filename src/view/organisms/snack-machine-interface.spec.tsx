import "fake-indexeddb/auto";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SnackMachineInterface } from "./snack-machine-interface";
import { SnackMachineWithPersistence } from "../../model/snack-machine/core/aggregates/snack-machine/snack-machine-with-persistence";
import { SnackMachineController } from "../../model/snack-machine/controllers/snack-machine-controller/snack-machine.controller";
import { getTestDb } from "../../model/snack-machine/data-access/idb.service.testing";
import { Snack } from "../../model/snack-machine/core/aggregates/snack/snack";
import { nanoid } from "nanoid";
import "@testing-library/jest-dom";
import { SnackPile } from "../../model/snack-machine/core/aggregates/snack-machine/value-objects/snack-pile";
import { Money } from "../../model/snack-machine/core/aggregates/snack-machine/value-objects/money";

const getSnackPile = () => {
  const snack = new Snack("Snickers");
  return new SnackPile(snack, 1, 10);
};

const getController = async (): Promise<SnackMachineController> => {
  const db = await getTestDb();
  const snackMachine = new SnackMachineWithPersistence(nanoid(), db);
  await snackMachine.load();
  await snackMachine.loadMoneyAndStoreInDB(new Money(5, 5, 5, 5, 5, 5));

  snackMachine.loadSnacks(0, getSnackPile());

  return new SnackMachineController(snackMachine);
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
        "Money inside: ¢1: 5¢10: 5¢25: 5$1: 5$5: 5$10: 5"
      )
    );

    fireEvent.click(screen.getByText("Put $10"));
    await waitFor(() =>
      expect(screen.getByTestId("moneyInside")).toHaveTextContent(
        "Money inside: ¢1: 5¢10: 5¢25: 5$1: 5$5: 5$10: 6"
      )
    );

    fireEvent.click(screen.getByText("Buy a snack 1"));
    await waitFor(() =>
      expect(screen.getByTestId("moneyInside")).toHaveTextContent(
        "Money inside: ¢1: 5¢10: 5¢25: 5$1: 1$5: 4$10: 6"
      )
    );

    fireEvent.click(screen.getByText("Put $5"));
    expect(screen.getByTestId("moneyInside")).toHaveTextContent(
      "Money inside: ¢1: 5¢10: 5¢25: 5$1: 1$5: 5$10: 6"
    );
  });
});
