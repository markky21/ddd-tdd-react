import { render, screen } from "@testing-library/react";

import { HeadOffice, HeadOfficeProps } from "./head-office";

function getSUT(props: Partial<HeadOfficeProps> = {}) {
  const finalProps: HeadOfficeProps = { ...props };
  return render(<HeadOffice {...finalProps} />);
}

test("title is visible", () => {
  getSUT();

  expect(
    screen.getByRole("heading", { name: "Head Office" })
  ).toBeInTheDocument();
});

test("balance is visible", () => {
  getSUT();

  expect(screen.getByText("Balance:")).toBeInTheDocument();
});

test("cache is visible", () => {
  getSUT();

  expect(screen.getByText("Cache:")).toBeInTheDocument();
});

test("snack machines section is visible", () => {
  getSUT();

  expect(
    screen.getByRole("heading", { name: "Snack machines:" })
  ).toBeInTheDocument();
});

test.todo("list of snack machines is visible");

test.todo("list of atms is visible");
test.todo("user can unload cash from snack machine");
test.todo("user can load cash to atm");
