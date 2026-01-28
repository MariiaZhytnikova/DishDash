package utils_test

import (
	"testing"

	"DishDash/src/models"
	"DishDash/src/utils"
)

func TestNormalize(t *testing.T) {
	tests := []struct{
		input, expected string
	}{
		{"Milk", "milk"},
		{" Eggs ", "egg"},
		{"Tomatoes", "tomato"},
		{" sugar ", "sugar"},
	}
	for _, tt := range tests {
		got := utils.Normalize(tt.input)
		if got != tt.expected {
			t.Errorf("Normalize(%q) = %q, want %q", tt.input, got, tt.expected)
		}
	}
}

func TestHasIngredientByName(t *testing.T) {
	list := []models.Ingredient{
		{Name: "Milk", Quantity: 1},
		{Name: "Egg", Quantity: 6},
	}

	if !utils.HasIngredientByName(list, "milk") {
		t.Error("expected true for 'milk'")
	}
	if !utils.HasIngredientByName(list, "  EGG ") {
		t.Error("expected true for '  EGG '")
	}
	if utils.HasIngredientByName(list, "bread") {
		t.Error("expected false for 'bread'")
	}
}

func TestHasIngredient(t *testing.T) {
	list := []models.Ingredient{
		{Name: "Milk", Quantity: 2},
		{Name: "Egg", Quantity: 6},
	}

	if !utils.HasIngredient(list, models.Ingredient{Name: "milk", Quantity: 1}) {
		t.Error("expected true for milk 1")
	}
	if utils.HasIngredient(list, models.Ingredient{Name: "milk", Quantity: 3}) {
		t.Error("expected false for milk 3")
	}
	if utils.HasIngredient(list, models.Ingredient{Name: "bread", Quantity: 1}) {
		t.Error("expected false for bread")
	}
}

func TestIsFavorite(t *testing.T) {
	favs := []models.Favorite{{ID: 1}, {ID: 2}}
	if !utils.IsFavorite(1, favs) || utils.IsFavorite(3, favs) {
		t.Error("IsFavorite logic failed")
	}
}

func TestContains(t *testing.T) {
	list := []string{"rice", "Milk", "Eggs"}
	if !utils.Contains(list, "milk") || !utils.Contains(list, "EGGS") || utils.Contains(list, "bread") {
		t.Error("Contains logic failed")
	}
}
