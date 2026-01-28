package engine_test

import (
	"testing"

	"DishDash/src/engine"
	"DishDash/src/models"
)

func TestSearchByName(t *testing.T) {
	recipes := []models.Recipe{
		{ID: 1, Name: "Apple Pie"},
		{ID: 2, Name: "Banana Bread"},
		{ID: 3, Name: "Pie Crust"},
	}

	res := engine.SearchByName(recipes, "pie")
	if len(res) != 2 {
		t.Fatalf("expected 2 matches, got %d", len(res))
	}

	res = engine.SearchByName(recipes, "banana")
	if len(res) != 1 || res[0].ID != 2 {
		t.Fatal("expected Banana Bread")
	}

	res = engine.SearchByName(recipes, "cake")
	if len(res) != 0 {
		t.Fatal("expected no matches")
	}
}

func TestSearchRecipes_FilterAndSuggest(t *testing.T) {
	recipes := []models.Recipe{
		{
			ID: 1, Name: "Salad",
			Ingredients: []models.Ingredient{{Name: "Lettuce", Quantity: 1, Unit: "pcs"}},
		},
		{
			ID: 2, Name: "Soup",
			Ingredients: []models.Ingredient{{Name: "Carrot", Quantity: 2, Unit: "pcs"}},
		},
	}

	fridge := models.Fridge{
		Fresh: []models.Ingredient{{Name: "Lettuce", Quantity: 1, Unit: "pcs"}},
	}

	favs := []models.Favorite{{ID: 2}}
	settings := models.FilterSettings{}

	suggestions := engine.SearchRecipes(recipes, fridge, favs, settings)

	if len(suggestions) != 2 {
		t.Fatalf("expected 2 suggestions, got %d", len(suggestions))
	}

	var salad, soup models.Suggestion
	for _, s := range suggestions {
		if s.Recipe.ID == 1 {
			salad = s
		}
		if s.Recipe.ID == 2 {
			soup = s
		}
	}

	if !soup.IsFavorite {
		t.Fatal("expected Soup to be marked as favorite")
	}

	if soup.FinalScore <= soup.MatchScore {
		t.Fatal("expected favorite to increase FinalScore")
	}

	if salad.FinalScore <= soup.FinalScore {
		t.Fatal("expected Salad to rank higher due to perfect match")
	}
}
