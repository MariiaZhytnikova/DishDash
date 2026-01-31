import type { SearchResult } from "../types/search";

// Empty BASE_URL: Vite proxy forwards all API calls to localhost:8080
// This prevents CORS(Cross-Origin Resource Sharing) issues during development
//const BASE_URL = "http://localhost:8080";

// const BASE_URL = "/api";

const BASE_URL = import.meta.env.DEV
  ? "/api"                            // dev uses Vite proxy
  : import.meta.env.VITE_API_URL;     // prod uses Fly.io URL


export type Ingredient = {
  name: string;
  quantity: number;
  unit: string;
};

export type Favorite = {
  id: number;
  name: string;
};

export type FridgeIngredient = Ingredient & {
  expiresAt?: string;
};

export type Fridge = {
  fresh: Ingredient[];
  pantry: Ingredient[];
  rare: Ingredient[];
};

export type FilterSettings = {
  query?: string;
  mealType?: string;
  mainType?: string;
  dietType?: string[];
  restrictions?: string[];
  country?: string[];
};

export type SearchFilters = {
  fridge?: Fridge;
  settings?: FilterSettings;
};

export async function status() {
  const res = await fetch(`${BASE_URL}/health`);
  if (!res.ok) throw new Error(`healthcheck failed with ${res.status}`);
  return res.json();
}

// Get all ingredients on page load
export async function getFridge(): Promise<Fridge> {
  const res = await fetch(`${BASE_URL}/fridge`);
  if (!res.ok) throw new Error(`get ingredients failed with ${res.status}`);
  return res.json();
}

// Add ingredient to fridge
export async function addIngredient(payload: {
  section: string;
  ingredient: Ingredient;
}): Promise<void> {
  const res = await fetch(`${BASE_URL}/fridge/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error(`add ingredient failed with ${res.status}`);
}

// Delete ingredient from fridge
export async function deleteIngredient(name: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/fridge/remove`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });

  if (!res.ok) throw new Error(`delete ingredient failed with ${res.status}`);
}

// Increase ingredient quantity
export async function increaseIngredient(name: string, quantity: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/fridge/increase`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, quantity }),
  });

  if (!res.ok) throw new Error(`increase ingredient failed with ${res.status}`);
}

// Get all recipes on page load
export async function getRecipes(): Promise<SearchResult[]> {
  const res = await fetch(`${BASE_URL}/recipes`);
  if (!res.ok) throw new Error(`get recipes failed with ${res.status}`);
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

export async function getFavorites(): Promise<Favorite[]> {
  const res = await fetch(`${BASE_URL}/favorites`);
  if (!res.ok) throw new Error(`get favorites failed with ${res.status}`);
  return res.json();
}

export async function addFavorite(favorite: Favorite): Promise<void> {
  const res = await fetch(`${BASE_URL}/favorites/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(favorite),
  });

  if (!res.ok) throw new Error(`add favorite failed with ${res.status}`);
}

export async function removeFavorite(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/favorites/remove`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });

  if (!res.ok) throw new Error(`remove favorite failed with ${res.status}`);
}