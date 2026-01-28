import type { SearchResult } from "../types/search";

// Empty BASE_URL: Vite proxy forwards all API calls to localhost:8080
// This prevents CORS(Cross-Origin Resource Sharing) issues during development
// const BASE_URL = "http://localhost:8080";
const BASE_URL = "";

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

export async function searchRecipes(): Promise<SearchResult[]> {
  const res = await fetch(`${BASE_URL}/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });

  if (!res.ok) throw new Error(`search failed with ${res.status}`);
  return res.json();
}