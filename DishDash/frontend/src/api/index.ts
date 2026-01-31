// Re-export all types
export type {
  Ingredient,
  Favorite,
  FridgeIngredient,
  Fridge,
  FilterSettings,
  SearchFilters,
  IngredientWithStatus,
  RecipeDetails,
} from "./types";

// Re-export all API functions
export * from "./fridgeApi";
export * from "./recipesApi";
export * from "./favoritesApi";
export * from "./shoppingApi";

// Health check
import { BASE_URL } from "./config";

export async function status() {
  const res = await fetch(`${BASE_URL}/health`);
  if (!res.ok) throw new Error(`healthcheck failed with ${res.status}`);
  return res.json();
}
