import { describe, it, expect, vi, afterEach } from "vitest";
import { fireEvent, render, screen, cleanup } from "@testing-library/react";
import { ShoppingListItemComponent } from "./ShoppingListItem";
import type { Ingredient } from "../../api";

afterEach(cleanup);

const createIngredient = (overrides: Partial<Ingredient> = {}): Ingredient => ({
  name: "Milk",
  quantity: 2,
  unit: "pcs",
  ...overrides,
});

// ============================================================================
// Component Tests: ShoppingListItemComponent
// Tests individual shopping list item row with quantity controls and remove button
// ============================================================================
describe("ShoppingListItemComponent", () => {
  // Test: Item displays all data and all buttons trigger correct callbacks
  it("renders item data and triggers callbacks", () => {
    const onRemove = vi.fn();
    const onIncrease = vi.fn();
    const onDecrease = vi.fn();

    render(
      <ShoppingListItemComponent
        item={createIngredient({ name: "Tomato", quantity: 3, unit: "kg" })}
        index={1}
        isRemoving={false}
        onRemove={onRemove}
        onQuantityIncrease={onIncrease}
        onQuantityDecrease={onDecrease}
      />
    );

    expect(screen.getByText("Tomato")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("kg")).toBeInTheDocument();

    fireEvent.click(screen.getByText("+"));
    fireEvent.click(screen.getByText("−"));
    fireEvent.click(screen.getByTitle("Delete"));

    expect(onIncrease).toHaveBeenCalledWith(1);
    expect(onDecrease).toHaveBeenCalledWith(1);
    expect(onRemove).toHaveBeenCalledWith("Tomato");
  });

  // Test: Remove button is disabled when item is being removed
  it("disables Remove button while removing", () => {
    render(
      <ShoppingListItemComponent
        item={createIngredient({ name: "Apple" })}
        index={0}
        isRemoving={true}
        onRemove={vi.fn()}
        onQuantityIncrease={vi.fn()}
        onQuantityDecrease={vi.fn()}
      />
    );

    const button = screen.getByTitle("Removing...") as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });
});
