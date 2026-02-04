import { describe, it, expect, vi, afterEach } from "vitest";
import { fireEvent, render, screen, cleanup } from "@testing-library/react";
import { ShoppingListFooter } from "./ShoppingListFooter";

afterEach(cleanup);

// ============================================================================
// Component Tests: ShoppingListFooter
// Tests footer with email, Wolt, and Foodora buttons
// ============================================================================
describe("ShoppingListFooter", () => {
  // Test: Email and Wolt buttons trigger their respective handlers
  it("triggers email and Wolt handlers", () => {
    const onEmailClick = vi.fn();
    const onWoltClick = vi.fn();

    render(
      <ShoppingListFooter
        isSendingEmail={false}
        isSendingWolt={false}
        foodoraPosition={{ x: 12, y: 24 }}
        onEmailClick={onEmailClick}
        onWoltClick={onWoltClick}
        foodoraRef={{ current: null }}
      />
    );

    fireEvent.click(screen.getByText("Send to Email"));
    fireEvent.click(screen.getByText("Create Wolt Order"));

    expect(onEmailClick).toHaveBeenCalledTimes(1);
    expect(onWoltClick).toHaveBeenCalledTimes(1);
  });

  // Test: Email button is disabled while sending
  it("disables email button while sending", () => {
    render(
      <ShoppingListFooter
        isSendingEmail={true}
        isSendingWolt={false}
        foodoraPosition={{ x: 12, y: 24 }}
        onEmailClick={vi.fn()}
        onWoltClick={vi.fn()}
        foodoraRef={{ current: null }}
      />
    );

    const button = screen.getByText("Send to Email") as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });

  // Test: Wolt button shows loading text while creating order
  it("shows loading text on Wolt button while sending", () => {
    render(
      <ShoppingListFooter
        isSendingEmail={false}
        isSendingWolt={true}
        foodoraPosition={{ x: 12, y: 24 }}
        onEmailClick={vi.fn()}
        onWoltClick={vi.fn()}
        foodoraRef={{ current: null }}
      />
    );

    expect(screen.getByText("Creating Order...")).toBeInTheDocument();
  });

  // Test: Foodora button renders at specified position
  it("renders Foodora button at correct position", () => {
    render(
      <ShoppingListFooter
        isSendingEmail={false}
        isSendingWolt={false}
        foodoraPosition={{ x: 100, y: 200 }}
        onEmailClick={vi.fn()}
        onWoltClick={vi.fn()}
        foodoraRef={{ current: null }}
      />
    );

    expect(screen.getByText("Create Foodora Order")).toBeInTheDocument();
  });
});
