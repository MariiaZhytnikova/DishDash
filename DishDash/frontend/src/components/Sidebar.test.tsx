import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { Sidebar } from "./Sidebar";
import * as api from "../api";
import { theme } from "../styles/theme";

// Mock the API module
vi.mock("../api", () => ({
  status: vi.fn(),
}));

// Helper: Render sidebar with required providers (Router + Theme)
// Accepts initial route to test active states on different pages
const renderSidebar = (initialRoute = "/") => {
  window.history.pushState({}, "", initialRoute);
  return render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Sidebar />
      </ThemeProvider>
    </BrowserRouter>
  );
};

// ============================================================================
// Component Tests: Sidebar
// Tests navigation sidebar with brand, links, active states, icons, and backend status
// ============================================================================
describe("Sidebar Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  // --------------------------------------------------------------------------
  // Branding: Logo and brand text display
  // --------------------------------------------------------------------------
  describe("Branding", () => {
    // Test: DishDash logo image renders with correct source path
    it("renders the DishDash logo", () => {
      renderSidebar();
      const logo = screen.getByAltText("DishDash");
      expect(logo).toBeInTheDocument();
      expect(logo.getAttribute("src")).toContain("dishdash.svg");
    });

    // Test: DishDash brand text is visible
    it("renders the DishDash brand text", () => {
      renderSidebar();
      expect(screen.getByText("DishDash")).toBeInTheDocument();
    });
  });

  // --------------------------------------------------------------------------
  // Navigation Items: Links, icons, and href attributes
  // --------------------------------------------------------------------------
  describe("Navigation Items", () => {
    // Test: All four navigation link texts are rendered
    it("renders all navigation links", () => {
      renderSidebar();
      expect(screen.getByText("Ingredients")).toBeInTheDocument();
      expect(screen.getByText("Recipes")).toBeInTheDocument();
      expect(screen.getByText("Favorites")).toBeInTheDocument();
      expect(screen.getByText("Shopping List")).toBeInTheDocument();
    });

    // Test: All navigation icons are present with proper alt text
    it("renders navigation icons", () => {
      renderSidebar();
      expect(screen.getByAltText("Ingredients")).toBeInTheDocument();
      expect(screen.getByAltText("Recipes")).toBeInTheDocument();
      expect(screen.getByAltText("Favorites")).toBeInTheDocument();
      expect(screen.getByAltText("Shopping List")).toBeInTheDocument();
    });

    // Test: Navigation links have correct href attributes for routing
    it("renders correct href for each navigation item", () => {
      renderSidebar();
      expect(screen.getByText("Ingredients").closest("a")).toHaveAttribute("href", "/ingredients");
      expect(screen.getByText("Recipes").closest("a")).toHaveAttribute("href", "/recipes");
      expect(screen.getByText("Favorites").closest("a")).toHaveAttribute("href", "/favorites");
      expect(screen.getByText("Shopping List").closest("a")).toHaveAttribute("href", "/shopping-list");
    });
  });

  // --------------------------------------------------------------------------
  // Active State Icons: Icon switching based on current route
  // --------------------------------------------------------------------------
  describe("Active State Icons", () => {
    // Test: Non-active navigation items show default icon (not _active.svg)
    it("shows default icon when not active", () => {
      renderSidebar("/recipes");
      const ingredientsIcon = screen.getByAltText("Ingredients");
      expect(ingredientsIcon.getAttribute("src")).toContain("ingredients.svg");
      expect(ingredientsIcon.getAttribute("src")).not.toContain("_active");
    });

    // Test: Ingredients icon switches to active version on /ingredients route
    it("shows active icon for ingredients when on ingredients page", () => {
      renderSidebar("/ingredients");
      const ingredientsIcon = screen.getByAltText("Ingredients");
      expect(ingredientsIcon.getAttribute("src")).toContain("ingredients_active.svg");
    });

    // Test: Recipes icon switches to active version on /recipes route
    it("shows active icon for recipes when on recipes page", () => {
      renderSidebar("/recipes");
      const recipesIcon = screen.getByAltText("Recipes");
      expect(recipesIcon.getAttribute("src")).toContain("hat_active.svg");
    });

    // Test: Favorites icon switches to active version on /favorites route
    it("shows active icon for favorites when on favorites page", () => {
      renderSidebar("/favorites");
      const favoritesIcon = screen.getByAltText("Favorites");
      expect(favoritesIcon.getAttribute("src")).toContain("like_active.svg");
    });

    // Test: Shopping list icon switches to active version on /shopping-list route
    it("shows active icon for shopping list when on shopping list page", () => {
      renderSidebar("/shopping-list");
      const shoppingIcon = screen.getByAltText("Shopping List");
      expect(shoppingIcon.getAttribute("src")).toContain("cart_active.svg");
    });
  });

  // --------------------------------------------------------------------------
  // Backend Status Indicator: API health status display
  // --------------------------------------------------------------------------
  describe("Backend Status Indicator", () => {
    // Test: Status shows "checking..." while API call is pending
    it("shows checking status initially", () => {
      vi.mocked(api.status).mockImplementation(() => new Promise(() => {})); // Never resolves
      renderSidebar();
      expect(screen.getByText(/Backend: checking\.\.\./i)).toBeInTheDocument();
    });

    // Test: Status updates to "ok" when backend API responds successfully
    it("shows ok status when backend is healthy", async () => {
      vi.mocked(api.status).mockResolvedValue({ status: "ok" });
      renderSidebar();
      
      await waitFor(() => {
        expect(screen.getByText(/Backend: ok/i)).toBeInTheDocument();
      });
    });

    // Test: Status displays custom message returned from backend API
    it("shows custom status message from backend", async () => {
      vi.mocked(api.status).mockResolvedValue({ status: "running" });
      renderSidebar();
      
      await waitFor(() => {
        expect(screen.getByText(/Backend: running/i)).toBeInTheDocument();
      });
    });

    // Test: Status shows "offline" when API call fails or rejects
    it("shows offline status when backend fails", async () => {
      vi.mocked(api.status).mockRejectedValue(new Error("Network error"));
      renderSidebar();
      
      await waitFor(() => {
        expect(screen.getByText(/Backend: offline/i)).toBeInTheDocument();
      });
    });

    // Test: Backend status API is called once on component mount
    it("calls status API on mount", () => {
      vi.mocked(api.status).mockResolvedValue({ status: "ok" });
      renderSidebar();
      expect(api.status).toHaveBeenCalledTimes(1);
    });
  });

  // --------------------------------------------------------------------------
  // Active Link Styling: CSS class application for current route
  // --------------------------------------------------------------------------
  describe("Active Link Styling", () => {
    // Test: Current page link receives "active" CSS class from React Router
    it("applies active class to current page link", () => {
      renderSidebar("/recipes");
      const recipesLink = screen.getByText("Recipes").closest("a");
      expect(recipesLink).toHaveClass("active");
    });

    // Test: Non-current page links do not have "active" class
    it("does not apply active class to non-current links", () => {
      renderSidebar("/recipes");
      const ingredientsLink = screen.getByText("Ingredients").closest("a");
      expect(ingredientsLink).not.toHaveClass("active");
    });
  });

  // --------------------------------------------------------------------------
  // Accessibility: Alt text and keyboard navigation
  // --------------------------------------------------------------------------
  describe("Accessibility", () => {
    // Test: All images have descriptive alt text for screen readers
    it("has proper alt text for all icons", () => {
      renderSidebar();
      expect(screen.getByAltText("DishDash")).toBeInTheDocument();
      expect(screen.getByAltText("Ingredients")).toBeInTheDocument();
      expect(screen.getByAltText("Recipes")).toBeInTheDocument();
      expect(screen.getByAltText("Favorites")).toBeInTheDocument();
      expect(screen.getByAltText("Shopping List")).toBeInTheDocument();
    });

    // Test: All navigation links are visible and keyboard accessible
    it("navigation links are keyboard accessible", () => {
      renderSidebar();
      const links = screen.getAllByRole("link");
      links.forEach(link => {
        expect(link).toBeVisible();
      });
    });
  });

  // --------------------------------------------------------------------------
  // Layout Structure: Semantic HTML and component organization
  // --------------------------------------------------------------------------
  describe("Layout Structure", () => {
    // Test: Sidebar contains semantic <nav> element for navigation
    it("renders sidebar with navigation element", () => {
      renderSidebar();
      const navElements = screen.getAllByRole("navigation");
      expect(navElements.length).toBeGreaterThan(0);
    });

    // Test: Status indicator is present in the DOM with backend text
    it("renders status indicator", () => {
      vi.mocked(api.status).mockResolvedValue({ status: "ok" });
      const { container } = renderSidebar();
      const statusText = container.querySelector('[class*="StatusIndicator"]');
      expect(statusText).toBeInTheDocument();
      expect(statusText?.textContent).toContain("Backend:");
    });
  });
});
