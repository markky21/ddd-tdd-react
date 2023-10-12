/* eslint-disable testing-library/no-node-access */
import { act, render, screen, waitFor } from "@testing-library/react";
import { SnackMachines, SnackMachinesProps } from "./snack-machines";
import { expect, vitest } from "vitest";
import { getSnackMachineRepositoryFixture } from "../../../snack-machine-domain/repository/snack-machine.repository.fixtures";

function getSUT(props: Partial<SnackMachinesProps> = {}) {
  const finalProps: SnackMachinesProps = {
    onShow: () => null,
    onUnloadCash: () => null,
    ...props,
  };
  return render(<SnackMachines {...finalProps} />);
}

test("title is visible", () => {
  getSUT();

  expect(
    screen.getByRole("heading", { name: "Snack machines:" })
  ).toBeInTheDocument();
});

test('table has "id" column', () => {
  getSUT();

  expect(screen.getByRole("table")).toHaveTextContent("id");
});

test('table has "money in machine" column', () => {
  getSUT();

  expect(screen.getByRole("table")).toHaveTextContent("money in machine");
});

test("list of snack machines is visible", async () => {
  const {
    dbFixture: { snackMachineFromDb },
  } = await getSnackMachineRepositoryFixture();
  getSUT();

  await waitFor(() =>
    expect(screen.getByRole("table")).toHaveTextContent(snackMachineFromDb.id)
  );
});

test("row is selected and highlighted when clicked", async () => {
  const {
    dbFixture: { snackMachineFromDb },
  } = await getSnackMachineRepositoryFixture();
  getSUT();
  await waitFor(() =>
    expect(screen.getByRole("table")).toHaveTextContent(snackMachineFromDb.id)
  );
  // eslint-disable-next-line unicorn/consistent-function-scoping
  const getRow = () => screen.getByRole("table").querySelectorAll("tr").item(1);
  expect(getRow()).not.toHaveClass("bg-blue-100");

  act(() => getRow().click());

  await waitFor(() => expect(getRow()).toHaveClass("bg-blue-100"));
});

test("when row is not selected then 'show' button is disabled", async () => {
  getSUT();

  expect(screen.getByRole("button", { name: "Show" })).toBeDisabled();
});

test("when row is selected then 'show' button is enabled", async () => {
  const {
    dbFixture: { snackMachineFromDb },
  } = await getSnackMachineRepositoryFixture();
  getSUT();
  await waitFor(() =>
    expect(screen.getByRole("table")).toHaveTextContent(snackMachineFromDb.id)
  );
  // eslint-disable-next-line unicorn/consistent-function-scoping
  const getRow = () => screen.getByRole("table").querySelectorAll("tr").item(1);

  act(() => getRow().click());

  await waitFor(() =>
    expect(screen.getByRole("button", { name: "Show" })).toBeEnabled()
  );
});

test("when show button is clicked then onShow callback is called", async () => {
  const spy = vitest.fn();
  const {
    dbFixture: { snackMachineFromDb },
  } = await getSnackMachineRepositoryFixture();
  getSUT({ onShow: spy });
  await waitFor(() =>
    expect(screen.getByRole("table")).toHaveTextContent(snackMachineFromDb.id)
  );
  // eslint-disable-next-line unicorn/consistent-function-scoping

  act(() => screen.getByText(snackMachineFromDb.id).click());
  act(() => screen.getByRole("button", { name: "Show" }).click());

  expect(spy).toHaveBeenCalledWith(snackMachineFromDb.id);
});

test("when row is not selected then 'unload cash' button is disabled", async () => {
  getSUT();

  expect(screen.getByRole("button", { name: "Unload cash" })).toBeDisabled();
});

test("when row is selected then 'unload cash' button is enabled", async () => {
  const {
    dbFixture: { snackMachineFromDb },
  } = await getSnackMachineRepositoryFixture();
  getSUT();
  await waitFor(() =>
    expect(screen.getByRole("table")).toHaveTextContent(snackMachineFromDb.id)
  );
  // eslint-disable-next-line unicorn/consistent-function-scoping
  const getRow = () => screen.getByRole("table").querySelectorAll("tr").item(1);

  act(() => getRow().click());

  await waitFor(() =>
    expect(screen.getByRole("button", { name: "Unload cash" })).toBeEnabled()
  );
});

test("when 'unload cash' button is clicked then onUnloadCash callback is called", async () => {
  const spy = vitest.fn();
  const {
    dbFixture: { snackMachineFromDb },
  } = await getSnackMachineRepositoryFixture();
  getSUT({ onUnloadCash: spy });
  await waitFor(() =>
    expect(screen.getByRole("table")).toHaveTextContent(snackMachineFromDb.id)
  );
  // eslint-disable-next-line unicorn/consistent-function-scoping

  act(() => screen.getByText(snackMachineFromDb.id).click());
  act(() => screen.getByRole("button", { name: "Unload cash" }).click());

  expect(spy).toHaveBeenCalledWith(snackMachineFromDb.id);
});
