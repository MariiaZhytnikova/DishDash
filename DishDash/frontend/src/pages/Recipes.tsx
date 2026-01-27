import { useEffect, useState } from "react";
import styled from "styled-components";
import { searchRecipes } from "../api/api";
import { RecipeCard } from "../components/RecipeCard";
import type { SearchResult } from "../types/search";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
`;

export function Recipes() {
  const [data, setData] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

useEffect(() => {
  (async () => {
    console.log("Recipes mounted → calling /search");
    try {
      setError(null);

      const res = await searchRecipes();
      console.log("RAW /search parsed JSON:", res);
      console.log("Is array?", Array.isArray(res));
      console.log("??????searchRecipes() returned:", res[0]);
      console.log("length:", res.length);

      setData(res);
      console.log("!!!!!first recipe:", data?.[0]);
    } catch (e) {
      console.error("Search error:", e);
      setError((e as Error).message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  })();
}, []);

   return (
    <div>
      <h1>Recipes</h1>

      {loading && <p>Loading...</p>}
      {error && <p role="alert">Error: {error}</p>}

      {!loading && !error && data.length === 0 && <p>No recipes found</p>}

      {!loading && !error && data.length > 0 && (
        <Grid>
          {data.map((result, index) => (
            <RecipeCard
              key={`${result.Recipe.id}-${index}`}
              recipe={result.Recipe}
            />
          ))}
        </Grid>
      )}
    </div>
  );
}
