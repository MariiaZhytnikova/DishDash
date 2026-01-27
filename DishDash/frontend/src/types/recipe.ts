export type Ingredient = {
  name: string;
  quantity: number;
  unit: string;
};

export type Recipe = {
  id: number;
  name: string;
  mealType: string;
  mainType: string;
  country: string;
  dietType: string[];
  restrictions: string[];
  ingredients: Ingredient[];
  steps: string[];
  description: string;
  time: number;
  imageUrl?: string;
};
