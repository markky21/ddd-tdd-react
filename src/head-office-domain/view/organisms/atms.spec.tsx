/* eslint-disable testing-library/no-node-access */
import { act, render, screen, waitFor } from "@testing-library/react";
import { expect, vitest } from "vitest";
import { Atms, AtmsProps } from "./atms";
import { getAtmRepositoryFixture } from "../../../atm-domain/repository/atm.repository.fixtures";

function getSUT(props: Partial<AtmsProps> = {}) {
  const finalProps: AtmsProps = {
    onShow: () => null,
    onLoadCash: () => null,
    ...props,
  };
  return render(<Atms {...finalProps} />);
}

test("title is visible", () => {
  getSUT();

  expect(screen.getByRole("heading", { name: "Atms:" })).toBeInTheDocument();
});

test('table has "id" column', () => {
  getSUT();

  expect(screen.getByRole("table")).toHaveTextContent("id");
});

test('table has "cash" column', () => {
  getSUT();

  expect(screen.getByRole("table")).toHaveTextContent("cash");
});

test("list of atms is visible", async () => {
  const {
    dbFixture: { atmFromDb },
  } = await getAtmRepositoryFixture();
  getSUT();

  await waitFor(() =>
    expect(screen.getByRole("table")).toHaveTextContent(atmFromDb?.id as string)
  );
});

test("row is selected and highlighted when clicked", async () => {
  const {
    dbFixture: { atmFromDb },
  } = await getAtmRepositoryFixture();
  getSUT();
  await waitFor(() =>
    expect(screen.getByRole("table")).toHaveTextContent(atmFromDb?.id as string)
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
    dbFixture: { atmFromDb },
  } = await getAtmRepositoryFixture();
  getSUT();
  await waitFor(() =>
    expect(screen.getByRole("table")).toHaveTextContent(atmFromDb?.id as string)
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
    dbFixture: { atmFromDb },
  } = await getAtmRepositoryFixture();
  getSUT({ onShow: spy });
  await waitFor(() =>
    expect(screen.getByRole("table")).toHaveTextContent(atmFromDb?.id as string)
  );
  // eslint-disable-next-line unicorn/consistent-function-scoping

  act(() => screen.getByText(atmFromDb?.id as string).click());
  act(() => screen.getByRole("button", { name: "Show" }).click());

  expect(spy).toHaveBeenCalledWith(atmFromDb?.id as string);
});

test("when row is not selected then 'load cash' button is disabled", async () => {
  getSUT();

  expect(screen.getByRole("button", { name: "Load cash" })).toBeDisabled();
});

test("when row is selected then 'load cash' button is enabled", async () => {
  const {
    dbFixture: { atmFromDb },
  } = await getAtmRepositoryFixture();
  getSUT();
  await waitFor(() =>
    expect(screen.getByRole("table")).toHaveTextContent(atmFromDb?.id as string)
  );
  // eslint-disable-next-line unicorn/consistent-function-scoping
  const getRow = () => screen.getByRole("table").querySelectorAll("tr").item(1);

  act(() => getRow().click());

  await waitFor(() =>
    expect(screen.getByRole("button", { name: "Load cash" })).toBeEnabled()
  );
});

test("when 'load cash' button is clicked then onLoadCash callback is called", async () => {
  const spy = vitest.fn();
  const {
    dbFixture: { atmFromDb },
  } = await getAtmRepositoryFixture();
  getSUT({ onLoadCash: spy });
  await waitFor(() =>
    expect(screen.getByRole("table")).toHaveTextContent(atmFromDb?.id as string)
  );
  // eslint-disable-next-line unicorn/consistent-function-scoping

  act(() => screen.getByText(atmFromDb?.id as string).click());
  act(() => screen.getByRole("button", { name: "Load cash" }).click());

  expect(spy).toHaveBeenCalledWith(atmFromDb?.id as string);
});
