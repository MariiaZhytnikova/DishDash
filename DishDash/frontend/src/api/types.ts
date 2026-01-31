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

export type IngredientWithStatus = {
  name: string;
  quantity: number;
  unit: string;
  missing: boolean;
};

export type RecipeDetails = {
  id: number;
  name: string;
  mealType: string;
  description: string;
  ingredients: IngredientWithStatus[];
  available: number;
  missing: number;
  steps?: string[];
};
