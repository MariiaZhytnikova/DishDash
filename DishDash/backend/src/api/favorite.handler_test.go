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

// Setup temp folder for utils
func setupTempDataDir(t *testing.T) {
	tmp := t.TempDir()
	utils.SetDataDir(tmp)
}

func TestAddFavoriteHandler(t *testing.T) {
	setupTempDataDir(t)

	// JSON body for adding favorite
	body := models.Favorite{ID: 42, Name: "Pizza"}
	data, _ := json.Marshal(body)

	req := httptest.NewRequest(http.MethodPost, "/favorites/add", bytes.NewReader(data))
	rr := httptest.NewRecorder()

	api.AddFavoriteHandler(rr, req)

	if rr.Code != http.StatusOK {
		t.Fatalf("expected 200 OK, got %d", rr.Code)
	}

	// Check that favorite is actually saved
	favs, err := storage.LoadFavorites()
	if err != nil {
		t.Fatal(err)
	}

	if len(favs) != 1 || favs[0].ID != 42 {
		t.Fatalf("favorite not saved correctly: %+v", favs)
	}
}

func TestAddFavoriteHandler_InvalidMethod(t *testing.T) {
	setupTempDataDir(t)

	req := httptest.NewRequest(http.MethodGet, "/favorites/add", nil)
	rr := httptest.NewRecorder()

	api.AddFavoriteHandler(rr, req)

	if rr.Code != http.StatusMethodNotAllowed {
		t.Fatalf("expected 405, got %d", rr.Code)
	}
}

func TestRemoveFavoriteHandler(t *testing.T) {
	setupTempDataDir(t)

	// Add a favorite first
	storage.AddFavorite(models.Favorite{ID: 100, Name: "Burger"})

	payload := struct {
		ID int `json:"id"`
	}{ID: 100}
	data, _ := json.Marshal(payload)

	req := httptest.NewRequest(http.MethodPost, "/favorites/remove", bytes.NewReader(data))
	rr := httptest.NewRecorder()

	api.RemoveFavoriteHandler(rr, req)

	if rr.Code != http.StatusOK {
		t.Fatalf("expected 200 OK, got %d", rr.Code)
	}

	// Check that favorite is removed
	favs, err := storage.LoadFavorites()
	if err != nil {
		t.Fatal(err)
	}
	if len(favs) != 0 {
		t.Fatalf("expected empty favorites, got %+v", favs)
	}
}

func TestRemoveFavoriteHandler_BadRequest(t *testing.T) {
	setupTempDataDir(t)

	req := httptest.NewRequest(http.MethodPost, "/favorites/remove", bytes.NewReader([]byte("invalid json")))
	rr := httptest.NewRecorder()

	api.RemoveFavoriteHandler(rr, req)

	if rr.Code != http.StatusBadRequest {
		t.Fatalf("expected 400, got %d", rr.Code)
	}
}

func TestListFavoritesHandler(t *testing.T) {
	setupTempDataDir(t)

	// Add some favorites
	storage.AddFavorite(models.Favorite{ID: 1, Name: "Pizza"})
	storage.AddFavorite(models.Favorite{ID: 2, Name: "Pasta"})

	req := httptest.NewRequest(http.MethodGet, "/favorites/list", nil)
	rr := httptest.NewRecorder()

	api.ListFavoritesHandler(rr, req)

	if rr.Code != http.StatusOK {
		t.Fatalf("expected 200 OK, got %d", rr.Code)
	}

	var favs []models.Favorite
	if err := json.NewDecoder(rr.Body).Decode(&favs); err != nil {
		t.Fatal("failed to decode response:", err)
	}

	if len(favs) != 2 {
		t.Fatalf("expected 2 favorites, got %d", len(favs))
	}
}
