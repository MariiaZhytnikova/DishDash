import { BASE_URL } from "./config";
import type { Favorite } from "./types";

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
