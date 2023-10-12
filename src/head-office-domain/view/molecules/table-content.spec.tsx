/* eslint-disable testing-library/no-node-access,testing-library/no-container */
import { act, render, waitFor } from "@testing-library/react";
import { TableContent, TableContentProps } from "./table-content";
import { expect, vitest } from "vitest";

function getSUT(props: Partial<TableContentProps> = {}) {
  const finalProps: TableContentProps = {
    th: ["a", "b"],
    tr: [
      ["a1", "b1"],
      ["a2", "b2"],
    ],
    onRowSelected: () => {},
    ...props,
  };
  return render(<TableContent {...finalProps} />);
}

test("th is visible", () => {
  const { container } = getSUT();

  expect(container.querySelectorAll("th").item(0)).toHaveTextContent("a");
  expect(container.querySelectorAll("th").item(1)).toHaveTextContent("b");
});

test("td is visible", () => {
  const { container } = getSUT();

  expect(container.querySelectorAll("td").item(0)).toHaveTextContent("a1");
  expect(container.querySelectorAll("td").item(1)).toHaveTextContent("b1");

  expect(container.querySelectorAll("td").item(2)).toHaveTextContent("a2");
  expect(container.querySelectorAll("td").item(3)).toHaveTextContent("b2");
});

test("onRowSelected is called when row is clicked", () => {
  const spy = vitest.fn();
  const { container } = getSUT({ onRowSelected: spy });

  act(() => {
    container.querySelectorAll("tr").item(1).click();
  });

  expect(spy).toHaveBeenCalledWith(["a1", "b1"]);
});

test("when row is clicked row is selected", () => {
  const spy = vitest.fn();
  const { container } = getSUT({ onRowSelected: spy });

  act(() => {
    container.querySelectorAll("tr").item(1).click();
  });

  expect(container.querySelectorAll("tr").item(1)).toHaveClass("bg-blue-100");
});

// NOTE: useOnClickOutside is not working in tests
test.skip("when is clicked outside row is unselected", async () => {
  const spy = vitest.fn();
  const { container } = getSUT({ onRowSelected: spy });

  act(() => container.querySelectorAll("tr").item(1).click());

  expect(container.querySelectorAll("tr").item(1)).toHaveClass("bg-blue-100");

  act(() => container.querySelector("thead")?.click());

  await waitFor(() =>
    expect(container.querySelectorAll("tr").item(1)).not.toHaveClass(
      "bg-blue-100"
    )
  );
});
