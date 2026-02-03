import { useEffect, useState, useCallback, useRef } from "react";
import styled from "styled-components";
import { addFavorite, getFavorites, getRecipes, removeFavorite, searchRecipes, getRecipeDetails, getFridge } from "../api";
import { RecipeCard } from "../components/Recipes/RecipeCard";
import { RecipeDetailModal } from "../components/Recipes/RecipeDetailModal";
import { SearchBar } from "../components/Search/SearchBar";
import type { SearchResult } from "../types/search";
import type { Recipe } from "../types/recipe";
import type { RecipeDetails, Ingredient } from "../api";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
`;

export function Recipes() {
  console.log("🔄 Recipes component rendered");
  
  const [data, setData] = useState<Recipe[] | SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeDetails | null>(null);
  const [fridgeIngredients, setFridgeIngredients] = useState<Ingredient[]>([]);
  
  // Use ref to track if initial load is complete (doesn't cause re-renders)
  const isInitialLoadRef = useRef(true);
  
  console.log("📊 Current state:", { 
    loading, 
    dataCount: data.length, 
    searchQuery,
    isInitialLoad: isInitialLoadRef.current 
  });

  // Helper function to calculate available ingredients
  const calculateAvailableIngredients = (recipeIngredients: Ingredient[]): number => {
    if (!recipeIngredients || recipeIngredients.length === 0) return 0;
    
    return recipeIngredients.filter(recipeIng =>
      fridgeIngredients.some(fridgeIng =>
        fridgeIng.name.toLowerCase() === recipeIng.name.toLowerCase()
      )
    ).length;
  };

  // Load all initial data on mount (recipes, fridge, favorites)
  useEffect(() => {
    console.log("⚡ Initial load useEffect triggered");
    (async () => {
      try {
        setError(null);
        
        // Load all data in parallel
        const [recipesRes, fridgeRes, favoritesRes] = await Promise.all([
          getRecipes(),
          getFridge(),
          getFavorites(),
        ]);
        
        console.log("✅ Initial data loaded:", { recipes: recipesRes.length });
        setData(recipesRes);
        setFridgeIngredients([
          ...fridgeRes.fresh,
          ...fridgeRes.pantry,
          ...fridgeRes.rare,
        ]);
        setFavorites(new Set(favoritesRes.map((fav) => fav.id)));
      } catch (e) {
        console.error("❌ Load initial data error:", e);
        setError((e as Error).message ?? "Unknown error");
      } finally {
        setLoading(false);
        isInitialLoadRef.current = false; // Mark initial load as complete
        console.log("✅ Initial load complete");
      }
    })();
  }, []); // Only run once on mount

  // Handle search
  const handleSearch = useCallback(async (query: string) => {
    console.log("handleSearch called with query:", query);
    
    setLoading(true);
    try {
      setError(null);
      
      // If search query is empty, load all recipes
      if (!query.trim()) {
        const res = await getRecipes();
        setData(res);
      } else {
        // Otherwise, search for recipes
        const res = await searchRecipes({ settings: { query } });
        console.log("Search results:", res);
        setData(res);
      }
    } catch (e) {
      console.error("Search error:", e);
      setError((e as Error).message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-search when query changes (debounced) - skip initial mount
  useEffect(() => {
    console.log("🔍 Auto-search useEffect triggered, isInitial:", isInitialLoadRef.current, "query:", searchQuery);
    
    // Skip if this is the initial load
    if (isInitialLoadRef.current) {
      console.log("⏭️  Skipping auto-search (initial load)");
      return;
    }
    
    const timeoutId = setTimeout(() => {
      console.log("🔍 Executing search after debounce");
      handleSearch(searchQuery);
    }, 300); // Wait 300ms after user stops typing

    return () => {
      console.log("🧹 Cleanup debounce timer");
      clearTimeout(timeoutId);
    };
  }, [searchQuery, handleSearch]); // No need to include ref in dependencies

  // Handle recipe card click
  const handleRecipeClick = async (recipe: Recipe) => {
    try {
      const details = await getRecipeDetails(recipe.id);
      setSelectedRecipe(details);
    } catch (e) {
      console.error("Failed to load recipe details:", e);
    }
  };

  return (
    <div>
      <h1>Recipes</h1>

      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        onSearch={() => handleSearch(searchQuery)}
        placeholder="Search recipes..."
      />

      {loading && <p>Loading...</p>}
      {error && <p role="alert">Error: {error}</p>}

      {!loading && !error && data.length === 0 && <p>No recipes found</p>}

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
                onFavoriteToggle={async () => {
                  const next = new Set(favorites);
                  try {
                    if (isFavorite) {
                      await removeFavorite(recipe.id);
                      next.delete(recipe.id);
                    } else {
                      await addFavorite({ id: recipe.id, name: recipe.name });
                      next.add(recipe.id);
                    }
                    setFavorites(next);
                  } catch (e) {
                    console.error("Favorite toggle error:", e);
                  }
                }}
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
