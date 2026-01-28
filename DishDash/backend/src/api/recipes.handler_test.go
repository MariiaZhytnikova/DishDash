package api_test

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"DishDash/src/api"
	"DishDash/src/models"
	"DishDash/src/storage"
)

func TestGetRecipesHandler(t *testing.T) {
	setupTempDataDir(t)

	// Prepare some recipes
	sample := []models.Recipe{
		{ID: 1, Name: "Pizza"},
		{ID: 2, Name: "Pasta"},
	}
	if err := storage.SaveRecipes(sample); err != nil {
		t.Fatal(err)
	}

	// Create request and recorder
	req := httptest.NewRequest(http.MethodGet, "/recipes", nil)
	rr := httptest.NewRecorder()

	// Call handler
	api.GetRecipesHandler(rr, req)

	// Check HTTP status
	if rr.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d", rr.Code)
	}

	// Check Content-Type header
	if ct := rr.Header().Get("Content-Type"); ct != "application/json" {
		t.Fatalf("expected Content-Type application/json, got %s", ct)
	}

	// Decode response
	var resp []models.Recipe
	if err := json.NewDecoder(rr.Body).Decode(&resp); err != nil {
		t.Fatal("failed to decode response:", err)
	}

	// Check length
	if len(resp) != len(sample) {
		t.Fatalf("expected %d recipes, got %d", len(sample), len(resp))
	}

	// Optional: check first recipe name
	if resp[0].Name != "Pizza" {
		t.Fatalf("expected first recipe to be Pizza, got %s", resp[0].Name)
	}
}

// Also test method not allowed
func TestGetRecipesHandler_MethodNotAllowed(t *testing.T) {
	setupTempDataDir(t)

	req := httptest.NewRequest(http.MethodPost, "/recipes", strings.NewReader(""))
	rr := httptest.NewRecorder()

	api.GetRecipesHandler(rr, req)

	if rr.Code != http.StatusMethodNotAllowed {
		t.Fatalf("expected 405, got %d", rr.Code)
	}
}
