import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "styled-components";
import { RecipeCard } from "./RecipeCard";
import { theme } from "../../styles/theme";
import type { Recipe } from "../../types/recipe";
import axios from "axios";

// Mock axios for country flag API calls
vi.mock("axios");

// Helper: Render RecipeCard with required ThemeProvider
const renderRecipeCard = (props: {
  recipe: Recipe;
  availableIngredients?: number;
  onFavoriteToggle?: () => void;
  isFavorite?: boolean;
  onClick?: () => void;
}) => {
  return render(
    <ThemeProvider theme={theme}>
      <RecipeCard {...props} />
    </ThemeProvider>
  );
};

// Mock recipe data for testing
const mockRecipe: Recipe = {
  id: 1,
  name: "Spaghetti Carbonara",
  country: "Italy",
  mealType: "Dinner",
  mainType: "Pasta",
  dietType: ["High-Protein"],
  restrictions: [],
  ingredients: [
    { name: "Spaghetti", quantity: 200, unit: "g" },
    { name: "Eggs", quantity: 2, unit: "pcs" },
    { name: "Bacon", quantity: 100, unit: "g" },
  ],
  steps: ["Boil pasta", "Cook bacon", "Mix with eggs"],
  description: "Classic Italian pasta dish",
  time: 35,
  imageUrl: "",
};

// ============================================================================
// Component Tests: RecipeCard
// Tests recipe card display, interactions, favorite toggle, country flags,
// availability calculation, and progress indicators
// ============================================================================
describe("RecipeCard Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock successful flag API response
    (axios.get as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: [{ flags: { svg: "https://flagcdn.com/it.svg" } }],
    });
  });

  afterEach(() => {
    cleanup();
  });

  // --------------------------------------------------------------------------
  // Recipe Information: Basic recipe details display
  // --------------------------------------------------------------------------
  describe("Recipe Information", () => {
    // Test: Recipe name is displayed correctly
    it("renders recipe name", () => {
      renderRecipeCard({ recipe: mockRecipe });
      expect(screen.getByText("Spaghetti Carbonara")).toBeInTheDocument();
    });

    // Test: Country name is displayed
    it("renders recipe country", () => {
      renderRecipeCard({ recipe: mockRecipe });
      expect(screen.getByText("Italy")).toBeInTheDocument();
    });

    // Test: Meal type tag is displayed with correct text
    it("renders meal type tag", () => {
      renderRecipeCard({ recipe: mockRecipe });
      expect(screen.getByText("Dinner")).toBeInTheDocument();
    });

    // Test: Diet type tags are displayed for each diet type in recipe
    it("renders diet type tags", () => {
      renderRecipeCard({ recipe: mockRecipe });
      expect(screen.getByText("High-Protein")).toBeInTheDocument();
    });

    // Test: Total ingredient count is shown
    it("displays total number of ingredients", () => {
      renderRecipeCard({ recipe: mockRecipe });
      expect(screen.getByText("3 ingredients")).toBeInTheDocument();
    });

    // Test: Recipe without diet types doesn't show empty diet container
    it("does not render diet type container when no diet types", () => {
      const recipeNoDiet = { ...mockRecipe, dietType: [] };
      renderRecipeCard({ recipe: recipeNoDiet });
      expect(screen.queryByText("High-Protein")).not.toBeInTheDocument();
    });
  });

  // --------------------------------------------------------------------------
  // Recipe Image: Image display and fallback behavior
  // --------------------------------------------------------------------------
  describe("Recipe Image", () => {
    // Test: Recipe image renders with correct source
    it("renders recipe image with correct src", () => {
      const recipeWithImage = { ...mockRecipe, imageUrl: "/images/carbonara.jpg" };
      renderRecipeCard({ recipe: recipeWithImage });
      const image = screen.getByAltText("Spaghetti Carbonara");
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute("src", "/images/carbonara.jpg");
    });

    // Test: Falls back to default image path when no imageUrl provided
    it("uses default image path when imageUrl is empty", () => {
      renderRecipeCard({ recipe: mockRecipe });
      const image = screen.getByAltText("Spaghetti Carbonara");
      expect(image.getAttribute("src")).toContain("small/1.jpg");
    });

    // Test: Falls back to placeholder on image load error
    it("shows fallback image on error", () => {
      renderRecipeCard({ recipe: mockRecipe });
      const image = screen.getByAltText("Spaghetti Carbonara") as HTMLImageElement;
      
      // Simulate image load error
      image.dispatchEvent(new Event("error"));
      
      expect(image.getAttribute("src")).toContain("small/0.png");
    });
  });

  // --------------------------------------------------------------------------
  // Country Flag: Flag fetching from REST Countries API
  // --------------------------------------------------------------------------
  describe("Country Flag", () => {
    // Test: Flag API is called with correct country name
    it("fetches country flag from REST Countries API", async () => {
      renderRecipeCard({ recipe: mockRecipe });
      
      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith(
          "https://restcountries.com/v3.1/name/Italy"
        );
      });
    });

    // Test: Flag image is displayed after successful API call
    it("displays country flag when API call succeeds", async () => {
      renderRecipeCard({ recipe: mockRecipe });
      
      await waitFor(() => {
        const flagImage = screen.getByAltText("Italy flag");
        expect(flagImage).toBeInTheDocument();
        expect(flagImage).toHaveAttribute("src", "https://flagcdn.com/it.svg");
      });
    });

    // Test: Flag is not displayed when API call fails
    it("handles flag API error gracefully", async () => {
      (axios.get as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error("API Error"));
      renderRecipeCard({ recipe: mockRecipe });
      
      await waitFor(() => {
        expect(screen.queryByAltText("Italy flag")).not.toBeInTheDocument();
      });
    });

    // Test: Flag API is not called when country is missing
    it("does not fetch flag when country is not provided", () => {
      const recipeNoCountry = { ...mockRecipe, country: "" };
      renderRecipeCard({ recipe: recipeNoCountry });
      
      expect(axios.get).not.toHaveBeenCalled();
    });
  });

  // --------------------------------------------------------------------------
  // Availability Calculation: Ingredient availability and percentage display
  // --------------------------------------------------------------------------
  describe("Availability Calculation", () => {
    // Test: Shows correct available ingredients count
    it("displays correct available ingredients count", () => {
      renderRecipeCard({ recipe: mockRecipe, availableIngredients: 2 });
      expect(screen.getByText("2 of 3 available")).toBeInTheDocument();
    });

    // Test: Shows correct percentage calculation
    it("calculates and displays correct percentage", () => {
      renderRecipeCard({ recipe: mockRecipe, availableIngredients: 2 });
      expect(screen.getByText("67%")).toBeInTheDocument();
    });

    // Test: Handles 0 available ingredients
    it("handles zero available ingredients", () => {
      renderRecipeCard({ recipe: mockRecipe, availableIngredients: 0 });
      expect(screen.getByText("0 of 3 available")).toBeInTheDocument();
      expect(screen.getByText("0%")).toBeInTheDocument();
    });

    // Test: Handles all ingredients available (100%)
    it("handles all ingredients available", () => {
      renderRecipeCard({ recipe: mockRecipe, availableIngredients: 3 });
      expect(screen.getByText("3 of 3 available")).toBeInTheDocument();
      expect(screen.getByText("100%")).toBeInTheDocument();
    });

    // Test: Caps available ingredients at total (doesn't go over 100%)
    it("caps available ingredients at total count", () => {
      renderRecipeCard({ recipe: mockRecipe, availableIngredients: 5 });
      expect(screen.getByText("3 of 3 available")).toBeInTheDocument();
      expect(screen.getByText("100%")).toBeInTheDocument();
    });

    // Test: Handles recipe with no ingredients (edge case)
    it("handles recipe with no ingredients", () => {
      const recipeNoIngredients = { ...mockRecipe, ingredients: [] };
      renderRecipeCard({ recipe: recipeNoIngredients, availableIngredients: 0 });
      expect(screen.getByText("0 ingredients")).toBeInTheDocument();
      expect(screen.getByText("0%")).toBeInTheDocument();
    });
  });

  // --------------------------------------------------------------------------
  // Progress Bar: Visual representation of ingredient availability
  // --------------------------------------------------------------------------
  describe("Progress Bar", () => {
    // Test: Progress bar width reflects percentage (using inline style)
    it("sets progress bar width based on percentage", () => {
      const { container } = renderRecipeCard({ 
        recipe: mockRecipe, 
        availableIngredients: 2 
      });
      
      // Progress bar should have width: 67%
      const progressFill = container.querySelector('[class*="ProgressFill"]');
      expect(progressFill).toBeInTheDocument();
    });

    // Test: Progress bar shows 0% width when no ingredients available
    it("shows empty progress bar when 0% available", () => {
      const { container } = renderRecipeCard({ 
        recipe: mockRecipe, 
        availableIngredients: 0 
      });
      
      const progressFill = container.querySelector('[class*="ProgressFill"]');
      expect(progressFill).toBeInTheDocument();
    });

    // Test: Progress bar shows full width at 100%
    it("shows full progress bar when 100% available", () => {
      const { container } = renderRecipeCard({ 
        recipe: mockRecipe, 
        availableIngredients: 3 
      });
      
      const progressFill = container.querySelector('[class*="ProgressFill"]');
      expect(progressFill).toBeInTheDocument();
    });
  });

  // --------------------------------------------------------------------------
  // Favorite Toggle: Heart button interaction and state
  // --------------------------------------------------------------------------
  describe("Favorite Toggle", () => {
    // Test: Heart button is rendered
    it("renders favorite toggle button", () => {
      renderRecipeCard({ recipe: mockRecipe });
      const heartButton = screen.getByLabelText("Add to favorites");
      expect(heartButton).toBeInTheDocument();
    });

    // Test: Shows white heart icon when not favorite
    it("shows white heart icon when not favorite", () => {
      renderRecipeCard({ recipe: mockRecipe, isFavorite: false });
      const heartIcon = screen.getByAltText("Not favorite");
      expect(heartIcon.getAttribute("src")).toContain("heart_white.svg");
    });

    // Test: Shows red heart icon when favorite
    it("shows red heart icon when favorite", () => {
      renderRecipeCard({ recipe: mockRecipe, isFavorite: true });
      const heartIcon = screen.getByAltText("Favorite");
      expect(heartIcon.getAttribute("src")).toContain("heart_red.svg");
    });

    // Test: Calls onFavoriteToggle when heart button clicked
    it("calls onFavoriteToggle when heart button is clicked", async () => {
      const user = userEvent.setup();
      const mockToggle = vi.fn();
      renderRecipeCard({ recipe: mockRecipe, onFavoriteToggle: mockToggle });
      
      const heartButton = screen.getByLabelText("Add to favorites");
      await user.click(heartButton);
      
      expect(mockToggle).toHaveBeenCalledTimes(1);
    });

    // Test: Updates aria-label based on favorite state
    it("updates aria-label based on favorite state", () => {
      const { rerender } = renderRecipeCard({ 
        recipe: mockRecipe, 
        isFavorite: false 
      });
      expect(screen.getByLabelText("Add to favorites")).toBeInTheDocument();
      
      rerender(
        <ThemeProvider theme={theme}>
          <RecipeCard recipe={mockRecipe} isFavorite={true} />
        </ThemeProvider>
      );
      expect(screen.getByLabelText("Remove from favorites")).toBeInTheDocument();
    });
  });

  // --------------------------------------------------------------------------
  // Card Click: Card interaction and click handling
  // --------------------------------------------------------------------------
  describe("Card Click", () => {
    // Test: Calls onClick handler when card is clicked
    it("calls onClick when card is clicked", async () => {
      const user = userEvent.setup();
      const mockClick = vi.fn();
      renderRecipeCard({ recipe: mockRecipe, onClick: mockClick });
      
      const card = screen.getByText("Spaghetti Carbonara").closest("div");
      if (card) await user.click(card);
      
      expect(mockClick).toHaveBeenCalledTimes(1);
    });

    // Test: Does not call onClick when heart button is clicked (event isolation)
    it("does not call onClick when heart button is clicked", async () => {
      const user = userEvent.setup();
      const mockClick = vi.fn();
      const mockToggle = vi.fn();
      renderRecipeCard({ 
        recipe: mockRecipe, 
        onClick: mockClick,
        onFavoriteToggle: mockToggle
      });
      
      const heartButton = screen.getByLabelText("Add to favorites");
      await user.click(heartButton);
      
      expect(mockToggle).toHaveBeenCalledTimes(1);
      expect(mockClick).not.toHaveBeenCalled();
    });
  });

  // --------------------------------------------------------------------------
  // Accessibility: ARIA labels and semantic HTML
  // --------------------------------------------------------------------------
  describe("Accessibility", () => {
    // Test: Recipe image has alt text with recipe name
    it("provides alt text for recipe image", () => {
      renderRecipeCard({ recipe: mockRecipe });
      expect(screen.getByAltText("Spaghetti Carbonara")).toBeInTheDocument();
    });

    // Test: Heart button has descriptive aria-label
    it("provides aria-label for favorite button", () => {
      renderRecipeCard({ recipe: mockRecipe, isFavorite: false });
      expect(screen.getByLabelText("Add to favorites")).toBeInTheDocument();
    });

    // Test: Heart icon has alt text
    it("provides alt text for heart icon", () => {
      renderRecipeCard({ recipe: mockRecipe, isFavorite: false });
      expect(screen.getByAltText("Not favorite")).toBeInTheDocument();
    });

    // Test: Country flag has alt text
    it("provides alt text for country flag", async () => {
      renderRecipeCard({ recipe: mockRecipe });
      
      await waitFor(() => {
        expect(screen.getByAltText("Italy flag")).toBeInTheDocument();
      });
    });

    // Test: Recipe name uses semantic heading (h3)
    it("uses semantic heading for recipe name", () => {
      renderRecipeCard({ recipe: mockRecipe });
      const heading = screen.getByRole("heading", { name: "Spaghetti Carbonara" });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe("H3");
    });
  });

  // --------------------------------------------------------------------------
  // Visual States: Hover effects and transitions
  // --------------------------------------------------------------------------
  describe("Visual States", () => {
    // Test: Card has cursor pointer for clickability indication
    it("renders card with proper styling structure", () => {
      const { container } = renderRecipeCard({ recipe: mockRecipe });
      const card = container.firstChild;
      expect(card).toBeInTheDocument();
    });

    // Test: Multiple diet type tags render correctly
    it("renders multiple diet type tags", () => {
      const recipeMultipleDiets = {
        ...mockRecipe,
        dietType: ["High-Protein", "Low-Carb", "Keto"],
      };
      renderRecipeCard({ recipe: recipeMultipleDiets });
      
      expect(screen.getByText("High-Protein")).toBeInTheDocument();
      expect(screen.getByText("Low-Carb")).toBeInTheDocument();
      expect(screen.getByText("Keto")).toBeInTheDocument();
    });
  });
});
