import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { SnackMachineInterface } from "./snack-machine-interface";
import { SnackMachineService } from "../../service/snack-machine.service";
import { getSnackMachineServiceFixture } from "../../service/snack-machine.service.fixture";

const getController = async (): Promise<SnackMachineService> => {
  const { service } = await getSnackMachineServiceFixture();
  return service;
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
        "Money inside: $163.60¢1: 10¢10: 10¢25: 10$1: 10$5: 10$10: 10"
      )
    );

    fireEvent.click(screen.getByText("Put $10"));
    await waitFor(() =>
      expect(screen.getByTestId("moneyInside")).toHaveTextContent(
        "$173.60¢1: 10¢10: 10¢25: 10$1: 10$5: 10$10: 11"
      )
    );

    fireEvent.click(screen.getByText("Buy a snack 1"));
    await waitFor(() =>
      expect(screen.getByTestId("moneyInside")).toHaveTextContent(
        "Money inside: $164.60¢1: 10¢10: 10¢25: 10$1: 6$5: 9$10: 11"
      )
    );

    fireEvent.click(screen.getByText("Put $5"));
    expect(screen.getByTestId("moneyInside")).toHaveTextContent(
      "Money inside: $169.60¢1: 10¢10: 10¢25: 10$1: 6$5: 10$10: 11"
    );
  });
});
