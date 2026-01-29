package engine_test

import (
	"testing"

	"DishDash/src/engine"
	"DishDash/src/models"
)

func TestSearchRecipes_BasicQuery(t *testing.T) {
	recipes := []models.Recipe{
		{
			ID: 1, Name: "Salad", Description: "Fresh healthy salad",
			Ingredients: []models.Ingredient{{Name: "Lettuce", Quantity: 1, Unit: "pcs"}},
		},
		{
			ID: 2, Name: "Soup", Description: "Warm carrot soup",
			Ingredients: []models.Ingredient{{Name: "Carrot", Quantity: 2, Unit: "pcs"}},
		},
	}

	fridge := models.Fridge{
		Fresh: []models.Ingredient{{Name: "Lettuce", Quantity: 1, Unit: "pcs"}},
	}

	favs := []models.Favorite{{ID: 2}}

	// Query search only
	settings := models.FilterSettings{Query: "carrot"}
	suggestions := engine.SearchRecipes(recipes, fridge, favs, settings)

	if len(suggestions) != 1 {
		t.Fatalf("expected 1 suggestion, got %d", len(suggestions))
	}

	s := suggestions[0]
	if s.Recipe.ID != 2 {
		t.Fatal("expected Soup recipe")
	}

	if !s.IsFavorite {
		t.Fatal("expected Soup to be favorite")
	}

	if s.FinalScore <= s.MatchScore {
		t.Fatal("expected FinalScore > MatchScore due to favorite boost")
	}

	// Query with no match
	settings = models.FilterSettings{Query: "pizza"}
	suggestions = engine.SearchRecipes(recipes, fridge, favs, settings)
	if len(suggestions) != 0 {
		t.Fatal("expected empty suggestions for unmatched query")
	}
}

func TestSearchRecipes_WithFilters(t *testing.T) {
	recipes := []models.Recipe{
		{
			ID: 1, Name: "Salad", MealType: "Lunch",
			Ingredients: []models.Ingredient{{Name: "Lettuce", Quantity: 1, Unit: "pcs"}},
		},
		{
			ID: 2, Name: "Soup", MealType: "Dinner",
			Ingredients: []models.Ingredient{{Name: "Carrot", Quantity: 2, Unit: "pcs"}},
		},
		{
			ID: 3, Name: "Pancakes", MealType: "Breakfast",
			Ingredients: []models.Ingredient{{Name: "Flour", Quantity: 200, Unit: "g"}},
		},
	}

	fridge := models.Fridge{}
	favs := []models.Favorite{}

	// Filter only by MealType
	settings := models.FilterSettings{MealType: "Lunch"}
	suggestions := engine.SearchRecipes(recipes, fridge, favs, settings)

	if len(suggestions) != 1 || suggestions[0].Recipe.ID != 1 {
		t.Fatal("expected only Salad for Lunch filter")
	}

	// Filter + query that doesn’t match
	settings = models.FilterSettings{MealType: "Dinner", Query: "lettuce"}
	suggestions = engine.SearchRecipes(recipes, fridge, favs, settings)

	// Soup is Dinner but has no 'lettuce' → should be empty
	if len(suggestions) != 0 {
		t.Fatal("expected no recipes to match Dinner + 'lettuce'")
	}

	// Filter + query that matches
	settings = models.FilterSettings{MealType: "Dinner", Query: "carrot"}
	suggestions = engine.SearchRecipes(recipes, fridge, favs, settings)

	if len(suggestions) != 1 || suggestions[0].Recipe.ID != 2 {
		t.Fatal("expected Soup for Dinner + 'carrot'")
	}
}

func TestSearchRecipes_MultipleFilters(t *testing.T) {
	recipes := []models.Recipe{
		{
			ID: 1, Name: "Vegan Salad", MealType: "Lunch", DietType: []string{"vegan"},
			Ingredients: []models.Ingredient{{Name: "Lettuce", Quantity: 1, Unit: "pcs"}},
		},
		{
			ID: 2, Name: "Chicken Salad", MealType: "Lunch", DietType: []string{"high-protein"},
			Ingredients: []models.Ingredient{{Name: "Chicken", Quantity: 200, Unit: "g"}},
		},
	}

	fridge := models.Fridge{}
	favs := []models.Favorite{}

	// Filter by MealType + DietType
	settings := models.FilterSettings{
		MealType: "Lunch",
		DietType: []string{"vegan"},
	}
	suggestions := engine.SearchRecipes(recipes, fridge, favs, settings)

	if len(suggestions) != 1 || suggestions[0].Recipe.ID != 1 {
		t.Fatal("expected only Vegan Salad for Lunch + vegan filter")
	}
}
