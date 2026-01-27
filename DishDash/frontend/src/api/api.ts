const BASE_URL = "http://localhost:8080";


export type Ingredient = {
  name: string;
  quantity: number;
  unit: string;
};

export type FridgeIngredient = Ingredient & {
  expiresAt?: string;
};

export type Recipe = {
  id?: string;
  title: string;
  description?: string;
  ingredients?: string[];
};

export async function status() {
  const res = await fetch(`${BASE_URL}/health`);
  if (!res.ok) throw new Error(`healthcheck failed with ${res.status}`);
  return res.json();
}

// временно: просто получить данные с бэка через POST /search
export async function searchRecipes(): Promise<any> {
  const res = await fetch(`${BASE_URL}/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}), // пустой SearchRequest
  });

  const text = await res.text();
  console.log("RAW /search text:", text.slice(0, 200));

  if (!res.ok) throw new Error(`search failed with ${res.status}: ${text.slice(0, 200)}`);

  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Backend returned non-JSON for /search");
  }
}