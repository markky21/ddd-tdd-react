import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { TakeMoneyForm } from "./take-money-form";
import { expect, vitest } from "vitest";

const getSUT = () => {
  const onSubmit = vitest.fn();

  const view = render(<TakeMoneyForm onSubmit={onSubmit} />);

  const input = screen.getByLabelText("Amount to take:");
  const form = screen.getByRole("form", { name: "" });
  const submitButton = screen.getByRole("button", { name: "Take money" });

  return { onSubmit, view, input, form, submitButton };
};

test("form is visible", () => {
  getSUT();

  expect(screen.getByLabelText("Amount to take:")).toBeInTheDocument();
  expect(screen.getByText("Take money")).toBeInTheDocument();
});

test("submit the form with entered number when submitted", async () => {
  const { onSubmit, input, form } = getSUT();

  fireEvent.input(input, { target: { value: 50 } });
  expect(input).toHaveValue(50);

  fireEvent.submit(form);

  await waitFor(() => {
    expect(onSubmit).toHaveBeenCalledWith(50);
  });
});

test("should not submit the form with empty input", async () => {
  const { onSubmit, form } = getSUT();

  fireEvent.submit(form);

  await waitFor(() => {
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
