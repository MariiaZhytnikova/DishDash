import type { Recipe, Ingredient } from "./recipe";

export type SearchResult = {
  Recipe: Recipe;
  MatchScore: number;
  FinalScore: number;
  MissingIngredients: Ingredient[];
  IsFavorite: boolean;
};