package favorites_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"DishDash/internal/domains/favorites"
	"DishDash/internal/models"
	"DishDash/internal/utils"
)

// setup resets favorites for each test
func setupFavoritesHandlerTest(t *testing.T) {
	tmp := t.TempDir()
	utils.SetDataDir(tmp)
}

func TestFavoritesHandlers(t *testing.T) {
	setupFavoritesHandlerTest(t)

	// --- Add Favorite ---
	fav := models.Favorite{ID: 1, Name: "Pizza"}
	body, _ := json.Marshal(fav)
	req := httptest.NewRequest(http.MethodPost, "/favorites/add", bytes.NewReader(body))
	w := httptest.NewRecorder()
	favorites.AddFavoriteHandler(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", w.Code)
	}

	// --- List Favorites ---
	req = httptest.NewRequest(http.MethodGet, "/favorites", nil)
	w = httptest.NewRecorder()
	favorites.ListFavoritesHandler(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", w.Code)
	}

	var list []models.Favorite
	if err := json.NewDecoder(w.Body).Decode(&list); err != nil {
		t.Fatal(err)
	}

	if len(list) != 1 || list[0].Name != "Pizza" {
		t.Fatal("favorite not added correctly")
	}

	// --- Remove Favorite ---
	removeBody, _ := json.Marshal(map[string]int{"id": 1})
	req = httptest.NewRequest(http.MethodPost, "/favorites/remove", bytes.NewReader(removeBody))
	w = httptest.NewRecorder()
	favorites.RemoveFavoriteHandler(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", w.Code)
	}

	// --- List again to confirm removal ---
	req = httptest.NewRequest(http.MethodGet, "/favorites", nil)
	w = httptest.NewRecorder()
	favorites.ListFavoritesHandler(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", w.Code)
	}

	if err := json.NewDecoder(w.Body).Decode(&list); err != nil {
		t.Fatal(err)
	}
	if len(list) != 0 {
		t.Fatal("favorite not removed")
	}

	// --- Invalid method test ---
	req = httptest.NewRequest(http.MethodGet, "/favorites/add", nil)
	w = httptest.NewRecorder()
	favorites.AddFavoriteHandler(w, req)
	if w.Code != http.StatusMethodNotAllowed {
		t.Fatalf("expected 405, got %d", w.Code)
	}
}
