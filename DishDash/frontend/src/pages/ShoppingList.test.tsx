import type React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fireEvent, render, screen, cleanup } from "@testing-library/react";
import { ShoppingListHeader } from "../components/ShoppingList/ShoppingListHeader";
import { ShoppingListItemComponent } from "../components/ShoppingList/ShoppingListItem";
import { ShoppingListTableComponent } from "../components/ShoppingList/ShoppingListTable";
import { ShoppingListFooter } from "../components/ShoppingList/ShoppingListFooter";
import { StateDisplay } from "../components/ShoppingList/StateDisplay";
import { AddItemModal } from "../components/ShoppingList/AddItemModal";
import { SendEmailModal } from "../components/ShoppingList/SendEmailModal";
import { SuccessModal } from "../components/ShoppingList/SuccessModal";
import { ClearConfirmModal } from "../components/ShoppingList/ClearConfirmModal";
import { ShoppingList } from "./ShoppingList";
import type { Ingredient } from "../api";

const mockUseShoppingList = vi.fn();
vi.mock("../hooks/useShoppingList", () => ({
  useShoppingList: () => mockUseShoppingList(),
}));

const createIngredient = (overrides: Partial<Ingredient> = {}): Ingredient => ({
  name: "Milk",
  quantity: 2,
  unit: "pcs",
  ...overrides,
});

const createHookState = (overrides: Partial<ReturnType<typeof mockUseShoppingList>> = {}) => {
  const foodoraButtonRef = { current: null } as React.RefObject<HTMLButtonElement | null>;
  const nameInputRef = { current: null } as React.RefObject<HTMLInputElement | null>;
  const emailInputRef = { current: null } as React.RefObject<HTMLInputElement | null>;

  return {
    items: [],
    loading: false,
    error: null,
    removingItem: null,
    clearing: false,
    showClearAllModal: false,
    showAddModal: false,
    formData: { name: "", quantity: "", unit: "pcs" },
    adding: false,
    showEmailModal: false,
    email: "",
    sendingEmail: false,
    sendingWolt: false,
    showSuccessModal: false,
    successMessage: "",
    foodoraPosition: { x: 10, y: 10 },
    nameInputRef,
    emailInputRef,
    foodoraButtonRef,
    setShowAddModal: vi.fn(),
    setFormData: vi.fn(),
    setEmail: vi.fn(),
    setShowEmailModal: vi.fn(),
    setShowSuccessModal: vi.fn(),
    handleOpenClearConfirm: vi.fn(),
    handleCancelClearConfirm: vi.fn(),
    handleRemoveItem: vi.fn(),
    handleUpdateQuantity: vi.fn(),
    handleAddItem: vi.fn((e: React.FormEvent) => e.preventDefault()),
    handleSendEmail: vi.fn((e: React.FormEvent) => e.preventDefault()),
    handleWoltOrder: vi.fn(),
    handleClearAll: vi.fn(),
    ...overrides,
  };
};

beforeEach(() => {
  vi.clearAllMocks();
});

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
});

// ============================================================================
// Component Tests: ShoppingListTableComponent
// Tests the table wrapper that displays headers and list items
// ============================================================================
describe("ShoppingListTableComponent", () => {
  // Test: Table renders column headers and item rows
  it("renders headers and items", () => {
    const items = [createIngredient({ name: "Apple" })];

    render(
      <ShoppingListTableComponent
        items={items}
        removingItem={null}
        onRemoveItem={vi.fn()}
        onQuantityIncrease={vi.fn()}
        onQuantityDecrease={vi.fn()}
      />
    );

    expect(screen.getByText("Item")).toBeInTheDocument();
    expect(screen.getByText("Quantity")).toBeInTheDocument();
    expect(screen.getByText("Unit")).toBeInTheDocument();
    expect(screen.getByText("Action")).toBeInTheDocument();
    expect(screen.getByText("Apple")).toBeInTheDocument();
  });
});

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
});

// ============================================================================
// Component Tests: StateDisplay
// Tests loading and empty state messages
// ============================================================================
describe("StateDisplay", () => {
  // Test: Shows loading message while fetching data
  it("shows loading state", () => {
    render(<StateDisplay isLoading isEmpty={false} />);
    expect(screen.getByText("Loading shopping list...")).toBeInTheDocument();
  });

  // Test: Shows empty message when no items exist
  it("shows empty state", () => {
    render(<StateDisplay isLoading={false} isEmpty />);
    expect(screen.getByText("Your shopping list is empty")).toBeInTheDocument();
  });
});

// ============================================================================
// Component Tests: AddItemModal
// Tests modal for adding new items to shopping list
// ============================================================================
describe("AddItemModal", () => {
  // Test: Modal renders form, handles input changes, and triggers submit/cancel
  it("renders when open and handles submit/cancel", () => {
    const onFormChange = vi.fn();
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    const onClose = vi.fn();

    render(
      <AddItemModal
        isOpen
        isAdding={false}
        formData={{ name: "Eggs", quantity: "2", unit: "pcs" }}
        onFormChange={onFormChange}
        onSubmit={onSubmit}
        onClose={onClose}
        inputRef={{ current: null }}
      />
    );

    fireEvent.change(screen.getByLabelText("Item Name *"), {
      target: { value: "Milk" },
    });
    fireEvent.click(screen.getByText("Add Item"));
    fireEvent.click(screen.getByText("Cancel"));

    expect(onFormChange).toHaveBeenCalled();
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  // Test: Modal does not render when isOpen is false
  it("does not render when closed", () => {
    render(
      <AddItemModal
        isOpen={false}
        isAdding={false}
        formData={{ name: "", quantity: "", unit: "pcs" }}
        onFormChange={vi.fn()}
        onSubmit={vi.fn()}
        onClose={vi.fn()}
        inputRef={{ current: null }}
      />
    );

    expect(screen.queryByText("Add Item to Shopping List")).not.toBeInTheDocument();
  });
});

// ============================================================================
// Component Tests: SendEmailModal
// Tests modal for sending shopping list via email
// ============================================================================
describe("SendEmailModal", () => {
  // Test: Email modal renders, updates email input, and triggers submit/cancel
  it("renders and submits email", () => {
    const onEmailChange = vi.fn();
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    const onClose = vi.fn();

    render(
      <SendEmailModal
        isOpen
        isSending={false}
        email="test@example.com"
        onEmailChange={onEmailChange}
        onSubmit={onSubmit}
        onClose={onClose}
        inputRef={{ current: null }}
      />
    );

    fireEvent.change(screen.getByLabelText("Email Address *"), {
      target: { value: "user@example.com" },
    });
    fireEvent.click(screen.getByText("Send Email"));
    fireEvent.click(screen.getByText("Cancel"));

    expect(onEmailChange).toHaveBeenCalledWith("user@example.com");
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

// ============================================================================
// Component Tests: SuccessModal
// Tests success notification modal
// ============================================================================
describe("SuccessModal", () => {
  // Test: Success modal displays message and closes on OK button click
  it("renders message and closes", () => {
    const onClose = vi.fn();

    render(<SuccessModal isOpen message="Done" onClose={onClose} />);

    // New SuccessModal has checkmark in separate div, title is just "Success!"
    expect(screen.getByText("Success!")).toBeInTheDocument();
    expect(screen.getByText("✓")).toBeInTheDocument(); // Checkmark in icon div
    expect(screen.getByText("Done")).toBeInTheDocument();
    fireEvent.click(screen.getByText("OK"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

// ============================================================================
// Component Tests: ClearConfirmModal
// Tests confirmation modal for clearing entire shopping list
// ============================================================================
describe("ClearConfirmModal", () => {
  // Test: Clear confirmation modal triggers confirm or cancel handlers
  it("renders and confirms/cancels", () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();

    render(
      <ClearConfirmModal
        isOpen
        isClearing={false}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );

    fireEvent.click(screen.getByText("Yes, clear"));
    fireEvent.click(screen.getByText("Cancel"));

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});

// ============================================================================
// Integration Tests: ShoppingList Page
// Tests the full page component with mocked useShoppingList hook
// ============================================================================
describe("ShoppingList page", () => {
  // Test: Page renders items, table, and footer when list has items
  it("renders items and footer when list has items", () => {
    mockUseShoppingList.mockReturnValue(
      createHookState({
        items: [createIngredient({ name: "Bread" })],
      })
    );

    render(<ShoppingList />);

    expect(screen.getByText("Shopping List")).toBeInTheDocument();
    expect(screen.getByText("Bread")).toBeInTheDocument();
    expect(screen.getByText("Send to Email")).toBeInTheDocument();
  });

  // Test: Page shows empty state when list has no items
  it("shows empty state when list is empty", () => {
    mockUseShoppingList.mockReturnValue(createHookState({ items: [] }));

    render(<ShoppingList />);

    expect(screen.getByText("Your shopping list is empty")).toBeInTheDocument();
  });
});
