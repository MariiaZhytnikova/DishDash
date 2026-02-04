import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

function Hello() {
  return <h2>Hello</h2>;
}

describe("react rendering", () => {
  it("renders a React component", () => {
    render(<Hello />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });
});
