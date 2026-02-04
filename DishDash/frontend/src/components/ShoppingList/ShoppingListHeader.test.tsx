import { describe, it, expect, vi, afterEach } from "vitest";
import { fireEvent, render, screen, cleanup } from "@testing-library/react";
import { ShoppingListHeader } from "./ShoppingListHeader";
import { prettyDOM } from "@testing-library/dom";

afterEach(cleanup);

// ============================================================================
// Component Tests: ShoppingListHeader
// Tests the header component that shows title and Add/Clear buttons
// ============================================================================
describe("ShoppingListHeader", () => {
  // Test: Empty list should show Add button but hide Clear button
  it("renders Add button and hides Clear when list is empty", () => {
    render(
      <ShoppingListHeader
        itemsCount={0}
        onAddClick={vi.fn()}
        onClearClick={vi.fn()}
        isClearing={false}
      />
    );

    expect(screen.getByText("+ Add")).toBeInTheDocument();
    expect(screen.queryByText("Clear All")).not.toBeInTheDocument();
  });

  // Test: Non-empty list shows Clear button and both buttons trigger callbacks
  it("shows Clear button and handles clicks", () => {
    const onAddClick = vi.fn();
    const onClearClick = vi.fn();

    render(
      <ShoppingListHeader
        itemsCount={2}
        onAddClick={onAddClick}
        onClearClick={onClearClick}
        isClearing={false}
      />
    );

    fireEvent.click(screen.getByText("+ Add"));
    fireEvent.click(screen.getByText("Clear All"));

    expect(onAddClick).toHaveBeenCalledTimes(1);
    expect(onClearClick).toHaveBeenCalledTimes(1);
  });

  // Test: Clear button should be disabled while clearing is in progress
  it("disables Clear button while clearing", () => {
    render(
      <ShoppingListHeader
        itemsCount={1}
        onAddClick={vi.fn()}
        onClearClick={vi.fn()}
        isClearing
      />
    );

    const button = screen.getByText("Clearing...") as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });

  console.log(prettyDOM(document.body, 20000));
  screen.debug();
});
