import type { SearchResult } from "../types/search";

// Empty BASE_URL: Vite proxy forwards all API calls to localhost:8080
// This prevents CORS(Cross-Origin Resource Sharing) issues during development
//const BASE_URL = "http://localhost:8080";
const BASE_URL = "/api";

export type Ingredient = {
  name: string;
  quantity: number;
  unit: string;
};

export type FridgeIngredient = Ingredient & {
  expiresAt?: string;
};

export async function status() {
  const res = await fetch(`${BASE_URL}/health`);
  if (!res.ok) throw new Error(`healthcheck failed with ${res.status}`);
  return res.json();
}

// Get all recipes on page load
export async function getRecipes(): Promise<SearchResult[]> {
  const res = await fetch(`${BASE_URL}/recipes`);
  if (!res.ok) throw new Error(`get recipes failed with ${res.status}`);
  return res.json();
}

// Search/filter recipes with filters (from search bar or advanced search)
export async function searchRecipes(filters?: Record<string, unknown>): Promise<SearchResult[]> {
  const res = await fetch(`${BASE_URL}/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(filters || {}),
  });

  if (!res.ok) throw new Error(`search failed with ${res.status}`);
  return res.json();
}