import type { SearchResult } from "../types/search";

const BASE_URL = "http://localhost:8080";

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