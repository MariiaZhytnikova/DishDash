import { BASE_URL } from "./config";
import type { Ingredient } from "./types";

export async function addToShopping(ingredients: Ingredient[]): Promise<void> {
  const res = await fetch(`${BASE_URL}/shopping/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ingredients),
  });

  if (!res.ok) throw new Error(`add to shopping failed with ${res.status}`);
}

export async function getShoppingList(): Promise<Ingredient[]> {
  const res = await fetch(`${BASE_URL}/shopping`);
  if (!res.ok) throw new Error(`get shopping list failed with ${res.status}`);
  const data = await res.json();
  return data.items || [];
}

export async function removeFromShopping(name: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/shopping/remove`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });

  if (!res.ok) throw new Error(`remove from shopping failed with ${res.status}`);
}

export async function clearShopping(): Promise<void> {
  const res = await fetch(`${BASE_URL}/shopping/clear`, {
    method: "POST",
  });

  if (!res.ok) throw new Error(`clear shopping failed with ${res.status}`);
}

export async function sendShoppingListToEmail(email: string, items: Ingredient[]): Promise<void> {
  const res = await fetch(`${BASE_URL}/shopping/email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, items }),
  });

  if (!res.ok) throw new Error(`send email failed with ${res.status}`);
}

export async function createWoltOrder(items: Ingredient[]): Promise<{ orderId: string; url: string }> {
  const res = await fetch(`${BASE_URL}/shopping/wolt`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  });

  if (!res.ok) throw new Error(`create wolt order failed with ${res.status}`);
  return res.json();
}
