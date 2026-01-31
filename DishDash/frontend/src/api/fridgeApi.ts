import { BASE_URL } from "./config";
import type { Ingredient, Fridge } from "./types";

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
