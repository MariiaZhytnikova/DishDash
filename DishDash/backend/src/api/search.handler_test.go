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

	// Sample recipes
	recipes := []models.Recipe{
		{ID: 1, Name: "Tomato Soup", Ingredients: []models.Ingredient{{Name: "Tomato", Quantity: 2, Unit: "pcs"}}},
		{ID: 2, Name: "Pasta", Ingredients: []models.Ingredient{{Name: "Pasta", Quantity: 1, Unit: "kg"}}},
		{ID: 3, Name: "Salad", Ingredients: []models.Ingredient{{Name: "Lettuce", Quantity: 1, Unit: "head"}}},
	}
	if err := storage.SaveRecipes(recipes); err != nil {
		t.Fatal(err)
	}

	// Favorites
	favs := []models.Favorite{{ID: 1}}
	if err := storage.SaveFavorites(favs); err != nil {
		t.Fatal(err)
	}

	// Fridge
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

	// Search without providing fridge (should use storage fridge)
	reqBody := map[string]interface{}{
		"settings": map[string]interface{}{},
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

	if len(result) != 3 {
		t.Fatalf("expected 3 suggestions, got %d", len(result))
	}

	// The favorite recipe (ID: 1) should have IsFavorite = true
	found := false
	for _, s := range result {
		if s.Recipe.ID == 1 && s.IsFavorite {
			found = true
		}
	}
	if !found {
		t.Fatal("favorite recipe not marked")
	}

	// Search with empty fridge (override)
	emptyFridge := models.Fridge{}
	reqBody2 := map[string]interface{}{
		"fridge":   emptyFridge,
		"settings": map[string]interface{}{},
	}
	body2, _ := json.Marshal(reqBody2)
	req2 := httptest.NewRequest(http.MethodPost, "/search", bytes.NewReader(body2))
	w2 := httptest.NewRecorder()
	api.SearchHandler(w2, req2)

	if w2.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", w2.Code)
	}

	var result2 []models.Suggestion
	if err := json.NewDecoder(w2.Body).Decode(&result2); err != nil {
		t.Fatal(err)
	}

	// All recipes should have MatchScore = 0
	for _, s := range result2 {
		if s.MatchScore != 0 {
			t.Fatal("expected match score 0 with empty fridge")
		}
	}

	// Wrong method
	req3 := httptest.NewRequest(http.MethodGet, "/search", nil)
	w3 := httptest.NewRecorder()
	api.SearchHandler(w3, req3)
	if w3.Code != http.StatusMethodNotAllowed {
		t.Fatalf("expected 405 for wrong method, got %d", w3.Code)
	}

	// Invalid body
	req4 := httptest.NewRequest(http.MethodPost, "/search", bytes.NewReader([]byte("{invalid}")))
	w4 := httptest.NewRecorder()
	api.SearchHandler(w4, req4)
	if w4.Code != http.StatusBadRequest {
		t.Fatalf("expected 400 for invalid body, got %d", w4.Code)
	}
}
