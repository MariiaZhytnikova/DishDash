package api_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"DishDash/src/api"
	"DishDash/src/models"
	"DishDash/src/storage"
	"DishDash/src/utils"
)

func setupSearchData(t *testing.T) {
	utils.SetDataDir(t.TempDir())

	recipes := []models.Recipe{
		{ID: 1, Name: "Tomato Soup", Description: "Fresh tomato soup", Ingredients: []models.Ingredient{{Name: "Tomato", Quantity: 2, Unit: "pcs"}}},
		{ID: 2, Name: "Pasta", Ingredients: []models.Ingredient{{Name: "Pasta", Quantity: 1, Unit: "kg"}}},
		{ID: 3, Name: "Salad", Ingredients: []models.Ingredient{{Name: "Lettuce", Quantity: 1, Unit: "head"}}},
	}
	if err := storage.SaveRecipes(recipes); err != nil {
		t.Fatal(err)
	}

	favs := []models.Favorite{{ID: 1}}
	if err := storage.SaveFavorites(favs); err != nil {
		t.Fatal(err)
	}

	fridge := models.Fridge{
		Fresh:  []models.Ingredient{{Name: "Tomato", Quantity: 5, Unit: "pcs"}},
		Pantry: []models.Ingredient{{Name: "Pasta", Quantity: 2, Unit: "kg"}},
		Rare:   []models.Ingredient{},
	}
	if err := storage.SaveFridge(fridge); err != nil {
		t.Fatal(err)
	}
}

func TestSearchHandler(t *testing.T) {
	setupSearchData(t)

	// Search by query
	reqBody := map[string]interface{}{
		"settings": map[string]interface{}{"query": "tomato"},
	}
	body, _ := json.Marshal(reqBody)
	req := httptest.NewRequest(http.MethodPost, "/search", bytes.NewReader(body))
	w := httptest.NewRecorder()
	api.SearchHandler(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", w.Code)
	}

	var result []models.Suggestion
	if err := json.NewDecoder(w.Body).Decode(&result); err != nil {
		t.Fatal(err)
	}

	if len(result) != 1 || result[0].Recipe.ID != 1 {
		t.Fatal("expected Tomato Soup to match query")
	}

	// No matches
	reqBody = map[string]interface{}{
		"settings": map[string]interface{}{"query": "pizza"},
	}
	body, _ = json.Marshal(reqBody)
	req = httptest.NewRequest(http.MethodPost, "/search", bytes.NewReader(body))
	w = httptest.NewRecorder()
	api.SearchHandler(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", w.Code)
	}

	if err := json.NewDecoder(w.Body).Decode(&result); err != nil {
		t.Fatal(err)
	}

	if len(result) != 0 {
		t.Fatal("expected no results for pizza")
	}
}
