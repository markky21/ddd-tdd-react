import { render, screen } from "@testing-library/react";
import { describe, it } from "vitest";
import App from "../../app";

describe("App", () => {
  it("renders headline", () => {
    render(<App />);

    // screen.debug();

    // check if App components renders headline
  });
});
