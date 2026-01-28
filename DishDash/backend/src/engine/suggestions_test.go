package engine_test

import (
	"testing"
	"math"

	"DishDash/src/engine"
	"DishDash/src/models"
)

func TestSuggestRecipes_Basic(t *testing.T) {
	recipes := []models.Recipe{
		{
			ID:   1,
			Name: "Pancakes",
			Ingredients: []models.Ingredient{
				{Name: "Egg", Quantity: 2, Unit: "pcs"},
				{Name: "Milk", Quantity: 1, Unit: "l"},
				{Name: "Flour", Quantity: 200, Unit: "g"},
			},
		},
	}

	fridge := []models.Ingredient{
		{Name: "Egg", Quantity: 2, Unit: "pcs"},
		{Name: "Flour", Quantity: 200, Unit: "g"},
	}

	favs := []models.Favorite{{ID: 1}}

	suggestions := engine.SuggestRecipes(recipes, fridge, favs)

	if len(suggestions) != 1 {
		t.Fatalf("expected 1 suggestion, got %d", len(suggestions))
	}

	s := suggestions[0]

	if len(s.MissingIngredients) != 1 || s.MissingIngredients[0].Name != "Milk" {
		t.Fatalf("expected missing Milk, got %+v", s.MissingIngredients)
	}

	expectedMatch := 2.0 / 3.0
	if math.Abs(s.MatchScore-expectedMatch) > 0.0001 {
		t.Fatalf("expected match %.2f, got %.2f", expectedMatch, s.MatchScore)
	}

	if !s.IsFavorite {
		t.Fatal("expected recipe to be favorite")
	}

	expectedFinal := expectedMatch + 0.3
	if expectedFinal > 1 {
		expectedFinal = 1
	}

	if math.Abs(s.FinalScore-expectedFinal) > 0.0001 {
		t.Fatalf(
			"expected final score %.2f, got %.2f",
			expectedFinal,
			s.FinalScore,
		)
	}
}

func TestSuggestRecipes_Empty(t *testing.T) {
	res := engine.SuggestRecipes([]models.Recipe{}, []models.Ingredient{}, []models.Favorite{})
	if len(res) != 0 {
		t.Fatal("expected empty suggestions for empty input")
	}
}
