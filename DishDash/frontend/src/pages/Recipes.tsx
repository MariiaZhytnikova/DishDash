import { useEffect, useState } from "react";
import styled from "styled-components";
import { getAllRecipes, searchRecipes } from "../api/recipesApi";
import { RecipeCard } from "../components/Recipes/RecipeCard";
import type { Recipe } from "../types/recipe";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
`;

export function Recipes() {
  //const [data, setData] = useState<SearchResult[]>([]);
  const [data, setData] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

useEffect(() => {
  (async () => {
    try {
      setError(null);
      //const res = await searchRecipes();
      const res = await getAllRecipes();
      console.log("RAW /search parsed JSON:", res);
      console.log("length:", res.length);
      console.log("!!!!!first recipe:", res[0]);
      setData(res);
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
          {/* {data.map((result, index) => (
            <RecipeCard
              key={`${result.R}-${index}`}
              recipe={result.Recipe}
            />
          ))} */}
          {data.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
            />
          ))}
        </Grid>
      )}
    </div>
  );
}
