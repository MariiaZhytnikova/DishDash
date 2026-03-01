package search_test

import (
	"bytes"
	"context"
	"net/http"
	"net/http/httptest"
	"testing"

	"DishDash/internal/domains/search"
	"DishDash/internal/models"
	"DishDash/internal/utils"
)

// --- helpers ---

func setupSearchTest(t *testing.T) string {
	t.Helper()
	tmp := t.TempDir()
	utils.SetDataDir(tmp)
	return tmp
}

func saveJSON(t *testing.T, filename string, v any) {
	t.Helper()
	dir, err := utils.DataDir()
	if err != nil {
		t.Fatalf("failed to get data dir: %v", err)
	}
	if err := utils.SaveJSON(dir+"/"+filename, v); err != nil {
		t.Fatalf("failed to save %s: %v", filename, err)
	}
}

// --- service tests ---

func TestService_Search_OK(t *testing.T) {
	setupSearchTest(t)

	saveJSON(t, "recipes.json", []models.Recipe{{ID: 1, Name: "Pasta"}})
	saveJSON(t, "favorites.json", []int{})
	saveJSON(t, "fridge.json", models.Fridge{})

	svc := search.NewService()
	req := models.SearchRequest{
		Settings: models.FilterSettings{},
	}

	results, err := svc.Search(context.Background(), req)
	if err != nil {
		t.Fatalf("Search returned error: %v", err)
	}

	if results == nil {
		t.Fatal("expected results slice, got nil")
	}
}

func TestService_Search_UsesRequestFridge(t *testing.T) {
	setupSearchTest(t)

	saveJSON(t, "recipes.json", []models.Recipe{})
	saveJSON(t, "favorites.json", []int{})

	fridge := models.Fridge{
		Fresh:  []models.Ingredient{{Name: "milk", Quantity: 1, Unit: "liter"}},
		Pantry: []models.Ingredient{{Name: "rice", Quantity: 2, Unit: "kg"}},
		Rare:   []models.Ingredient{{Name: "saffron", Quantity: 5, Unit: "g"}},
	}

	svc := search.NewService()
	req := models.SearchRequest{Fridge: &fridge}

	_, err := svc.Search(context.Background(), req)
	if err != nil {
		t.Fatalf("Search returned error: %v", err)
	}
}

// --- handler tests ---

func TestSearchHandler_OK(t *testing.T) {
	setupSearchTest(t)

	saveJSON(t, "recipes.json", []models.Recipe{{ID: 1, Name: "Pasta"}})
	saveJSON(t, "favorites.json", []int{})
	saveJSON(t, "fridge.json", models.Fridge{})

	req := httptest.NewRequest(http.MethodPost, "/search", bytes.NewBufferString(`{}`))
	w := httptest.NewRecorder()

	search.SearchHandler(w, req) // ✅ call real service

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", w.Code)
	}
	if ct := w.Header().Get("Content-Type"); ct != "application/json" {
		t.Fatalf("expected application/json, got %s", ct)
	}
}

func TestSearchHandler_InvalidBody(t *testing.T) {
	req := httptest.NewRequest(http.MethodPost, "/search", bytes.NewBufferString("{invalid"))
	w := httptest.NewRecorder()

	search.SearchHandler(w, req)

	if w.Code != http.StatusBadRequest {
		t.Fatalf("expected 400, got %d", w.Code)
	}
}

func TestSearchHandler_MethodNotAllowed(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/search", nil)
	w := httptest.NewRecorder()

	search.SearchHandler(w, req)

	if w.Code != http.StatusMethodNotAllowed {
		t.Fatalf("expected 405, got %d", w.Code)
	}
}
