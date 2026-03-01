package cooking_test

import (
	"context"
	"testing"

	"DishDash/internal/models"
	"DishDash/internal/domains/cooking"
)

func TestGetRecipeDetails_MixedAvailability(t *testing.T) {
	service := cooking.NewService()

	recipe := models.Recipe{
		ID:          1,
		Name:        "Pasta",
		MealType:    "dinner",
		Description: "Simple pasta",
		Ingredients: []models.Ingredient{
			{Name: "Pasta", Quantity: 100, Unit: "g"},
			{Name: "Tomato", Quantity: 2, Unit: "pcs"},
			{Name: "Salt", Quantity: 1, Unit: "tsp"},
		},
	}

	fridge := models.Fridge{
		Fresh: []models.Ingredient{
			{Name: "Tomato", Quantity: 5, Unit: "pcs"},
		},
		Pantry: []models.Ingredient{
			{Name: "Pasta", Quantity: 500, Unit: "g"},
		},
		Rare: []models.Ingredient{},
	}

	details := service.GetRecipeDetails(context.Background(), recipe, fridge)

	if details.SummaryAvailable != 2 {
		t.Fatalf("expected 2 available, got %d", details.SummaryAvailable)
	}

	if details.SummaryMissing != 1 {
		t.Fatalf("expected 1 missing, got %d", details.SummaryMissing)
	}

	if len(details.Ingredients) != 3 {
		t.Fatal("wrong number of ingredients in result")
	}

	if details.Ingredients[0].Missing {
		t.Fatal("Pasta should be available")
	}

	if details.Ingredients[1].Missing {
		t.Fatal("Tomato should be available")
	}

	if !details.Ingredients[2].Missing {
		t.Fatal("Salt should be missing")
	}
}

func TestGetRecipeDetails_EmptyFridge(t *testing.T) {
	service := cooking.NewService()

	recipe := models.Recipe{
		ID:       2,
		Name:     "Omelette",
		MealType: "breakfast",
		Ingredients: []models.Ingredient{
			{Name: "Egg", Quantity: 2, Unit: "pcs"},
		},
	}

	fridge := models.Fridge{}

	details := service.GetRecipeDetails(context.Background(), recipe, fridge)

	if details.SummaryAvailable != 0 {
		t.Fatal("no ingredients should be available")
	}

	if details.SummaryMissing != 1 {
		t.Fatal("ingredient should be missing")
	}

	if !details.Ingredients[0].Missing {
		t.Fatal("ingredient should be marked missing")
	}
}
