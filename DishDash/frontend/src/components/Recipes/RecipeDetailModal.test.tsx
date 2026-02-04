import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import { RecipeDetailModal } from "./RecipeDetailModal";
import type { RecipeDetails } from "../../api";
import * as api from "../../api";

// ========================================================================
// Mock API module
// ========================================================================
vi.mock("../../api", () => ({
  addToShopping: vi.fn(),
}));

// ========================================================================
// Theme for styled-components
// ========================================================================
const theme = {
  colors: {
    bg: "#fcfcfcff" as const,
    panel: "#FAFAFA" as const,
    border: "rgba(255,255,255,0.08)" as const,
    text: "#000000" as const,
    title: "#1FA9E4" as const,
    muted: "#000000" as const,
    active: "#1FA9E4" as const,
    check: "yellow" as const,
  },
  radius: {
    md: "12px" as const,
  },
};

// ========================================================================
// Mock recipe data for testing
// ========================================================================
const mockRecipe: RecipeDetails = {
  id: 1,
  name: "Spaghetti Carbonara",
  description: "A classic Italian pasta dish with eggs, cheese, and bacon.",
  mealType: "Dinner",
  ingredients: [
    {
      name: "Spaghetti",
      quantity: 400,
      unit: "g",
      missing: false,
    },
    {
      name: "Eggs",
      quantity: 4,
      unit: "pcs",
      missing: false,
    },
    {
      name: "Bacon",
      quantity: 200,
      unit: "g",
      missing: true,
    },
    {
      name: "Parmesan",
      quantity: 100,
      unit: "g",
      missing: true,
    },
  ],
  steps: [
    "Boil water and cook spaghetti according to package instructions.",
    "Fry bacon until crispy.",
    "Beat eggs with grated parmesan.",
    "Drain pasta and mix with bacon and egg mixture.",
  ],
  available: 2,
  missing: 2,
};

const mockRecipeWithMarkdown: RecipeDetails = {
  ...mockRecipe,
  description: "## Introduction\nA classic Italian pasta dish.\n## Tips\nUse fresh eggs.",
  steps: [
    "## Step 1\nBoil water and cook spaghetti.",
    "## Step 2\nFry bacon until crispy.",
  ],
};

const mockRecipeNoSteps: RecipeDetails = {
  ...mockRecipe,
  steps: [],
};

const mockRecipeAllAvailable: RecipeDetails = {
  ...mockRecipe,
  ingredients: mockRecipe.ingredients.map((ing) => ({ ...ing, missing: false })),
  available: 4,
  missing: 0,
};

// ========================================================================
// Helper function to render RecipeDetailModal with theme
// ========================================================================
const renderModal = (recipe: RecipeDetails = mockRecipe, onClose = vi.fn()) => {
  return {
    ...render(
      <ThemeProvider theme={theme}>
        <RecipeDetailModal recipe={recipe} onClose={onClose} />
      </ThemeProvider>
    ),
    onClose,
  };
};

describe("RecipeDetailModal Component", () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
    // Mock import.meta.env.BASE_URL
    vi.stubGlobal("import", {
      meta: {
        env: {
          BASE_URL: "/",
        },
      },
    });
  });

  afterEach(() => {
    // Clean up after each test
    cleanup();
  });

  // ======================================================================
  // Recipe Information Tests - Verify basic recipe details display
  // ======================================================================
  describe("Recipe Information Display", () => {
    it("should display recipe name", () => {
      // Test that recipe name appears in the modal
      renderModal();

      expect(screen.getByText("Spaghetti Carbonara")).toBeInTheDocument();
    });

    it("should display recipe description", () => {
      // Test that recipe description is visible
      renderModal();

      expect(
        screen.getByText("A classic Italian pasta dish with eggs, cheese, and bacon.")
      ).toBeInTheDocument();
    });

    it("should display meal type", () => {
      // Test that meal type badge is shown
      renderModal();

      expect(screen.getByText("Dinner")).toBeInTheDocument();
    });

    it("should display recipe image", () => {
      // Test that recipe image is rendered with correct src
      const { container } = renderModal();

      const image = container.querySelector("img[alt='Spaghetti Carbonara']");
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute("src", "/small/1.jpg");
    });

    it("should handle image load error with fallback", () => {
      // Test that image error falls back to default image
      const { container } = renderModal();

      const image = container.querySelector("img[alt='Spaghetti Carbonara']") as HTMLImageElement;
      fireEvent.error(image);

      expect(image.src).toContain("/small/0.png");
    });
  });

  // ======================================================================
  // Ingredients Tests - Verify ingredients list display
  // ======================================================================
  describe("Ingredients Display", () => {
    it("should display all ingredients", () => {
      // Test that all ingredients are listed
      renderModal();

      expect(screen.getByText("Spaghetti")).toBeInTheDocument();
      expect(screen.getByText("Eggs")).toBeInTheDocument();
      expect(screen.getByText("Bacon")).toBeInTheDocument();
      expect(screen.getByText("Parmesan")).toBeInTheDocument();
    });

    it("should display ingredient quantities and units", () => {
      // Test that quantities and units are shown correctly
      renderModal();

      expect(screen.getByText("400 g")).toBeInTheDocument(); // Spaghetti
      expect(screen.getByText("4 pcs")).toBeInTheDocument(); // Eggs
      expect(screen.getByText("200 g")).toBeInTheDocument(); // Bacon
      expect(screen.getByText("100 g")).toBeInTheDocument(); // Parmesan
    });

    it("should show 'Ingredients' section title", () => {
      // Test that ingredients section has title
      renderModal();

      expect(screen.getByText("Ingredients")).toBeInTheDocument();
    });

    it("should display available ingredients count", () => {
      // Test that available count is shown correctly
      const { container } = renderModal();

      // Check that "Available" label exists and there's a "2" near it
      expect(container.textContent).toContain("Available");
      expect(container.textContent).toMatch(/Available.*2/);
    });

    it("should display missing ingredients count", () => {
      // Test that missing count is shown correctly
      const { container } = renderModal();

      // Check that "Missing" label exists and there's a "2" near it
      expect(container.textContent).toContain("Missing");
      expect(container.textContent).toMatch(/Missing.*2/);
    });
  });

  // ======================================================================
  // Steps/Instructions Tests - Verify recipe steps display
  // ======================================================================
  describe("Recipe Steps Display", () => {
    it("should display instructions title when steps exist", () => {
      // Test that Instructions section appears
      renderModal();

      expect(screen.getByText("Instructions")).toBeInTheDocument();
    });

    it("should display all recipe steps", () => {
      // Test that all steps are listed
      renderModal();

      expect(
        screen.getByText("Boil water and cook spaghetti according to package instructions.")
      ).toBeInTheDocument();
      expect(screen.getByText("Fry bacon until crispy.")).toBeInTheDocument();
      expect(screen.getByText("Beat eggs with grated parmesan.")).toBeInTheDocument();
      expect(
        screen.getByText("Drain pasta and mix with bacon and egg mixture.")
      ).toBeInTheDocument();
    });

    it("should not display instructions section when no steps", () => {
      // Test that Instructions section is hidden when steps are empty
      renderModal(mockRecipeNoSteps);

      expect(screen.queryByText("Instructions")).not.toBeInTheDocument();
    });

    it("should clean markdown headers from steps", () => {
      // Test that ## markdown is removed from step text
      const { container } = renderModal(mockRecipeWithMarkdown);

      // The cleaned step text should contain the main content
      expect(container.textContent).toContain("Boil water and cook spaghetti");
      expect(container.textContent).toContain("Fry bacon until crispy");
      
      // But should not contain the markdown headers
      expect(container.textContent).not.toContain("## Step 1");
      expect(container.textContent).not.toContain("## Step 2");
    });

    it("should clean markdown headers from description", () => {
      // Test that ## markdown is removed from description
      renderModal(mockRecipeWithMarkdown);

      expect(screen.getByText(/A classic Italian pasta dish/)).toBeInTheDocument();
      expect(screen.getByText(/Use fresh eggs/)).toBeInTheDocument();
      expect(screen.queryByText("## Introduction")).not.toBeInTheDocument();
      expect(screen.queryByText("## Tips")).not.toBeInTheDocument();
    });
  });

  // ======================================================================
  // Close Modal Tests - Verify modal can be closed
  // ======================================================================
  describe("Modal Closing", () => {
    it("should call onClose when close button is clicked", () => {
      // Test close button (✕) triggers onClose
      const { onClose } = renderModal();

      const closeButton = screen.getByText("✕");
      fireEvent.click(closeButton);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("should call onClose when overlay is clicked", () => {
      // Test clicking outside modal closes it
      const { onClose, container } = renderModal();

      const overlay = container.firstChild as HTMLElement;
      fireEvent.click(overlay);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("should not call onClose when modal content is clicked", () => {
      // Test clicking inside modal doesn't close it
      const { onClose } = renderModal();

      const recipeName = screen.getByText("Spaghetti Carbonara");
      fireEvent.click(recipeName);

      expect(onClose).not.toHaveBeenCalled();
    });
  });

  // ======================================================================
  // Add to Shopping List Tests - Verify button and API interaction
  // ======================================================================
  describe("Add to Shopping List", () => {
    it("should display add to shopping button when there are missing ingredients", () => {
      // Test button appears when ingredients are missing
      renderModal();

      const buttons = screen.getAllByRole("button");
      const addButton = buttons.find((button) =>
        button.textContent?.includes("Add To Shopping List")
      );
      expect(addButton).toBeInTheDocument();
    });

    it("should not display add to shopping button when all ingredients available", () => {
      // Test button is hidden when nothing is missing
      renderModal(mockRecipeAllAvailable);

      const buttons = screen.getAllByRole("button");
      const addButton = buttons.find((button) =>
        button.textContent?.includes("Add To Shopping List")
      );
      expect(addButton).toBeUndefined();
    });

    it("should show loading state when adding to shopping list", async () => {
      // Test button shows "Adding..." during API call
      vi.mocked(api.addToShopping).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      renderModal();

      const buttons = screen.getAllByRole("button");
      const addButton = buttons.find((button) =>
        button.textContent?.includes("Add To Shopping List")
      ) as HTMLButtonElement;
      
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByText("Adding...")).toBeInTheDocument();
      });
    });

    it("should call addToShopping API with missing ingredients", async () => {
      // Test API is called with correct missing ingredients
      vi.mocked(api.addToShopping).mockResolvedValue(undefined);

      renderModal();

      const buttons = screen.getAllByRole("button");
      const addButton = buttons.find((button) =>
        button.textContent?.includes("Add To Shopping List")
      ) as HTMLButtonElement;
      
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(api.addToShopping).toHaveBeenCalledTimes(1);
      });

      const missingIngredients = mockRecipe.ingredients.filter((ing) => ing.missing);
      expect(api.addToShopping).toHaveBeenCalledWith(missingIngredients);
    });

    it("should show success modal after successfully adding to shopping list", async () => {
      // Test success modal appears after successful API call
      vi.mocked(api.addToShopping).mockResolvedValue(undefined);

      renderModal();

      const buttons = screen.getAllByRole("button");
      const addButton = buttons.find((button) =>
        button.textContent?.includes("Add To Shopping List")
      ) as HTMLButtonElement;
      
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(
          screen.getByText("Missing ingredients have been added to your shopping list.")
        ).toBeInTheDocument();
      });

      expect(screen.getByText("Success!")).toBeInTheDocument();
    });

    it("should show error modal when API call fails", async () => {
      // Test error modal appears when API call fails
      vi.mocked(api.addToShopping).mockRejectedValue(new Error("API Error"));

      renderModal();

      const buttons = screen.getAllByRole("button");
      const addButton = buttons.find((button) =>
        button.textContent?.includes("Add To Shopping List")
      ) as HTMLButtonElement;
      
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(
          screen.getByText("Failed to add ingredients to shopping list. Please try again.")
        ).toBeInTheDocument();
      });

      // Check that an Error heading exists
      const errorHeadings = screen.getAllByText("Error");
      expect(errorHeadings.length).toBeGreaterThan(0);
    });

    it("should close main modal when success modal OK is clicked", async () => {
      // Test clicking OK on success modal closes both modals
      vi.mocked(api.addToShopping).mockResolvedValue(undefined);

      const { onClose } = renderModal();

      const buttons = screen.getAllByRole("button");
      const addButton = buttons.find((button) =>
        button.textContent?.includes("Add To Shopping List")
      ) as HTMLButtonElement;
      
      fireEvent.click(addButton);

      await waitFor(() => {
        const successHeadings = screen.queryAllByText("Success!");
        expect(successHeadings.length).toBeGreaterThan(0);
      });

      const allButtons = screen.getAllByRole("button");
      const okButton = allButtons.find((button) => button.textContent === "OK") as HTMLButtonElement;
      fireEvent.click(okButton);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("should not close main modal when error modal OK is clicked", async () => {
      // Test error modal closes but main modal stays open
      vi.mocked(api.addToShopping).mockRejectedValue(new Error("API Error"));

      const { onClose } = renderModal();

      const buttons = screen.getAllByRole("button");
      const addButton = buttons.find((button) =>
        button.textContent?.includes("Add To Shopping List")
      ) as HTMLButtonElement;
      
      fireEvent.click(addButton);

      await waitFor(() => {
        const errorHeadings = screen.queryAllByText("Error");
        expect(errorHeadings.length).toBeGreaterThan(0);
      });

      const allButtons = screen.getAllByRole("button");
      const okButton = allButtons.find((button) => button.textContent === "OK") as HTMLButtonElement;
      fireEvent.click(okButton);

      // Error modal should close, but main modal should stay open
      expect(onClose).not.toHaveBeenCalled();
    });

    it("should disable button while adding to shopping list", async () => {
      // Test button is disabled during API call
      vi.mocked(api.addToShopping).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      renderModal();

      const buttons = screen.getAllByRole("button");
      const addButton = buttons.find((button) =>
        button.textContent?.includes("Add To Shopping List")
      ) as HTMLButtonElement;
      
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(addButton).toBeDisabled();
      });
    });
  });

  // ======================================================================
  // Accessibility Tests - Verify modal is accessible
  // ======================================================================
  describe("Accessibility", () => {
    it("should have close button accessible", () => {
      // Test close button can be accessed by keyboard
      const { container } = renderModal();

      const closeButtons = container.querySelectorAll("button");
      const closeButton = Array.from(closeButtons).find((btn) => btn.textContent === "✕");
      expect(closeButton).toBeInTheDocument();
      expect(closeButton?.tagName).toBe("BUTTON");
    });

    it("should have add to shopping button with proper role", () => {
      // Test add button has button role
      renderModal();

      const buttons = screen.getAllByRole("button");
      const addButton = buttons.find((button) =>
        button.textContent?.includes("Add To Shopping List")
      );
      expect(addButton).toBeInTheDocument();
    });

    it("should have recipe image with alt text", () => {
      // Test image has descriptive alt text
      const { container } = renderModal();

      const image = container.querySelector("img[alt='Spaghetti Carbonara']");
      expect(image).toBeInTheDocument();
    });

    it("should display ingredient information clearly", () => {
      // Test ingredients are clearly labeled
      const { container } = renderModal();

      expect(container.textContent).toContain("Ingredients");
      expect(container.textContent).toContain("Available");
      expect(container.textContent).toContain("Missing");
    });
  });
});
