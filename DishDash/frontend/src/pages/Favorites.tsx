import { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import { addFavorite, getFavorites,getRecipes,removeFavorite, getRecipeDetails, getFridge } from "../api";
import { RecipeCard } from "../components/Recipes/RecipeCard";
import { SearchBar } from "../components/Search/SearchBar";
import type { SearchResult } from "../types/search";
import type { Recipe } from "../types/recipe";
import type { RecipeDetails, Ingredient } from "../api";
import { RecipeDetailModal } from "../components/Recipes/RecipeDetailModal";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
`;

export function Favorites() {
  console.log("Favorites component rendered");
  
  const [data, setData] = useState<(Recipe | SearchResult)[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeDetails | null>(null);
  const [fridgeIngredients, setFridgeIngredients] = useState<Ingredient[]>([]);

  // Helper function to calculate available ingredients
  const calculateAvailableIngredients = (recipeIngredients: Ingredient[]): number => {
    if (!recipeIngredients || recipeIngredients.length === 0) return 0;
    
    return recipeIngredients.filter(recipeIng =>
      fridgeIngredients.some(fridgeIng =>
        fridgeIng.name.toLowerCase() === recipeIng.name.toLowerCase()
      )
    ).length;
  };

  // Load all recipes on page mount
  useEffect(() => {
    (async () => {
      try {
        setError(null);
        const favs = await getFavorites();
        const favoriteIds = new Set(favs.map(f => f.id));
        const allRecipes = await getRecipes();
        const favoriteRecipes: (Recipe | SearchResult)[] = allRecipes.filter(item => {
          const recipeId = 'Recipe' in item ? (item as SearchResult).Recipe.id : (item as Recipe).id;
          return favoriteIds.has(recipeId);
        });
        setData(favoriteRecipes);
      } catch (e) {
        console.error("Load fav recipes error:", e);
        setError((e as Error).message ?? "Unknown error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const favs = await getFavorites();
        setFavorites(new Set(favs.map((fav) => fav.id)));
      } catch (e) {
        console.error("Load favorites error:", e);
      }
    })();
  }, []);

  // Load fridge ingredients
  useEffect(() => {
    (async () => {
      try {
        const fridge = await getFridge();
        const allIngredients = [
          ...fridge.fresh,
          ...fridge.pantry,
          ...fridge.rare,
        ];
        setFridgeIngredients(allIngredients);
      } catch (e) {
        console.error("Load fridge error:", e);
      }
    })();
  }, []);

  // Handle recipe card click
  const handleRecipeClick = async (recipe: Recipe) => {
    try {
      const details = await getRecipeDetails(recipe.id);
      setSelectedRecipe(details);
    } catch (e) {
      console.error("Failed to load recipe details:", e);
    }
  };

  // Handle search - filter favorites list only
  const handleSearch = useCallback(() => {
    console.log("handleSearch called with query:", searchQuery);
    
    if (!searchQuery.trim()) {
      // Reload favorites if search is cleared
      (async () => {
        try {
          setError(null);
          const favs = await getFavorites();
          const favoriteIds = new Set(favs.map(f => f.id));
          const allRecipes = await getRecipes();
          const favoriteRecipes: (Recipe | SearchResult)[] = allRecipes.filter(item => {
            const recipeId = 'Recipe' in item ? (item as SearchResult).Recipe.id : (item as Recipe).id;
            return favoriteIds.has(recipeId);
          });
          setData(favoriteRecipes);
        } catch (e) {
          console.error("Load fav recipes error:", e);
        }
      })();
      return;
    }

    // Filter current favorites by name
    const filtered = data.filter(item => {
      const recipe = 'Recipe' in item ? (item as SearchResult).Recipe : (item as Recipe);
      return recipe.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
    setData(filtered);
  }, [searchQuery, data]);

  // Auto-search when query changes (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch();
    }, 300); // Wait 300ms after user stops typing

    return () => clearTimeout(timeoutId);
  }, [searchQuery, handleSearch]);

  // Handle favorite toggle
  const handleFavoriteToggle = async (item: Recipe | SearchResult) => {
    const recipe = 'Recipe' in item ? (item as SearchResult).Recipe : (item as Recipe);
    const isFav = favorites.has(recipe.id);
    const next = new Set(favorites);
    
    try {
      if (isFav) {
        await removeFavorite(recipe.id);
        next.delete(recipe.id);
        const updatedData = data.filter(item => {
          const r = 'Recipe' in item ? (item as SearchResult).Recipe : (item as Recipe);
          return r.id !== recipe.id;
        });
        setData(updatedData);
      } else {
        await addFavorite({ id: recipe.id, name: recipe.name });
        next.add(recipe.id);
      }
      setFavorites(next);
    } catch (e) {
      console.error("Favorite toggle error:", e);
    }
  };

  return (
    <div>
      <h1>My Favorite Recipes</h1>
      
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        onSearch={handleSearch}
        placeholder="Search favorite recipes..."
      />

      {loading && <p>Loading...</p>}
      {error && <p role="alert">Error: {error}</p>}

      {!loading && !error && data.length === 0 && <p>No favorite recipes found</p>}

      {!loading && !error && data.length > 0 && (
        <Grid>
          {data.map((item, index) => {
            const recipe = 'Recipe' in item ? item.Recipe : item;
            const isFavorite = favorites.has(recipe.id);
            const availableIngredients = calculateAvailableIngredients(recipe.ingredients);
            return (
              <RecipeCard
                key={`${recipe.id}-${index}`}
                recipe={recipe}
                availableIngredients={availableIngredients}
                isFavorite={isFavorite}
                onClick={() => handleRecipeClick(recipe)}
                onFavoriteToggle={() => handleFavoriteToggle(item)}
              />
            );
          })}
        </Grid>
      )}
      {selectedRecipe && (
              <RecipeDetailModal
                recipe={selectedRecipe}
                onClose={() => setSelectedRecipe(null)}
              />
      )}
    </div>
  );
}
