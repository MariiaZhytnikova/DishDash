package engine_test

import (
	"testing"

	"DishDash/src/engine"
	"DishDash/src/models"
)

func TestFilterRecipes(t *testing.T) {
	recipes := []models.Recipe{
		{ID: 1, Name: "Salad", MealType: "Lunch", MainType: "Veggie", DietType: []string{"vegan"}, Restrictions: []string{}},
		{ID: 2, Name: "Soup", MealType: "Dinner", MainType: "Soup", DietType: []string{"low-carb"}, Restrictions: []string{"gluten-free"}},
		{ID: 3, Name: "Pancakes", MealType: "Breakfast", MainType: "Dessert", DietType: []string{"high-protein"}, Restrictions: []string{}},
	}

	// Filter by MealType
	settings := models.FilterSettings{MealType: "Lunch"}
	res := engine.FilterRecipes(recipes, settings)
	if len(res) != 1 || res[0].ID != 1 {
		t.Fatal("expected only Salad for Lunch filter")
	}

	// Filter by MainType
	settings = models.FilterSettings{MainType: "Soup"}
	res = engine.FilterRecipes(recipes, settings)
	if len(res) != 1 || res[0].ID != 2 {
		t.Fatal("expected only Soup for MainType filter")
	}

	// Filter by DietType
	settings = models.FilterSettings{DietType: []string{"vegan"}}
	res = engine.FilterRecipes(recipes, settings)
	if len(res) != 1 || res[0].ID != 1 {
		t.Fatal("expected only Salad for vegan")
	}

	// Filter by Restrictions
	settings = models.FilterSettings{Restrictions: []string{"gluten-free"}}
	res = engine.FilterRecipes(recipes, settings)
	if len(res) != 2 { 
		// Salad and Pancakes have no gluten restriction
		t.Fatal("expected 2 recipes without gluten-free restriction")
	}
}

