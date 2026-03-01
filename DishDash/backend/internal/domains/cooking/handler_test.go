package cooking_test

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strconv"
	"testing"

	"DishDash/internal/domains/cooking"
	"DishDash/internal/models"
	"DishDash/internal/storage/json"
	"DishDash/internal/utils"
)

func setupCookTest(t *testing.T) {
	tmp := t.TempDir()
	utils.SetDataDir(tmp)

}

func TestGetCookHandler(t *testing.T) {
	setupCookTest(t)

	// Add a recipe
	recipe := models.Recipe{
		ID:          1,
		Name:        "Pasta",
		MealType:    "dinner",
		Description: "Simple pasta",
		Ingredients: []models.Ingredient{
			{Name: "Pasta", Quantity: 100, Unit: "g"},
			{Name: "Tomato", Quantity: 2, Unit: "pcs"},
		},
	}
	if err := storage.AddRecipe(recipe); err != nil {
		t.Fatal(err)
	}

	// Add ingredients to fridge
	fridge := models.Fridge{
		Fresh:  []models.Ingredient{{Name: "Tomato", Quantity: 5, Unit: "pcs"}},
		Pantry: []models.Ingredient{{Name: "Pasta", Quantity: 500, Unit: "g"}},
		Rare:   []models.Ingredient{},
	}
	if err := storage.SaveFridge(fridge); err != nil {
		t.Fatal(err)
	}

	req := httptest.NewRequest(http.MethodGet, "/recipes/"+strconv.Itoa(recipe.ID), nil)
	w := httptest.NewRecorder()

	cooking.GetCookHandler(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200 OK, got %d", w.Code)
	}

	var details models.RecipeDetails
	if err := json.NewDecoder(w.Body).Decode(&details); err != nil {
		t.Fatal(err)
	}

	if details.SummaryAvailable != 2 || details.SummaryMissing != 0 {
		t.Fatalf("unexpected summary: available %d, missing %d", details.SummaryAvailable, details.SummaryMissing)
	}

	if len(details.Ingredients) != 2 {
		t.Fatalf("expected 2 ingredients, got %d", len(details.Ingredients))
	}
}
