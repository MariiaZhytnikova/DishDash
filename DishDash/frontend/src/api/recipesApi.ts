import { BASE_URL } from "./config";
import type { SearchResult } from "../types/search";
import type { RecipeDetails, SearchFilters } from "./types";

// Get all recipes on page load
export async function getRecipes(): Promise<SearchResult[]> {
  const res = await fetch(`${BASE_URL}/recipes`);
  if (!res.ok) throw new Error(`get recipes failed with ${res.status}`);
  return res.json();
}

// Get recipe details by ID
export async function getRecipeDetails(id: number): Promise<RecipeDetails> {
  const res = await fetch(`${BASE_URL}/recipes/${id}`);
  if (!res.ok) throw new Error(`get recipe details failed with ${res.status}`);
  return res.json();
}

// Search/filter recipes with filters (from search bar or advanced search)
export async function searchRecipes(filters?: SearchFilters): Promise<SearchResult[]> {
  const res = await fetch(`${BASE_URL}/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(filters || {}),
  });

  if (!res.ok) throw new Error(`search failed with ${res.status}`);
  return res.json();
}
