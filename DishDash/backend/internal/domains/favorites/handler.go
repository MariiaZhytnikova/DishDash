package favorites

import (
	"context"
	"encoding/json"
	"net/http"

	"DishDash/internal/models"
)

var favoritesService = NewService()

func AddFavoriteHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var fav models.Favorite
	if err := json.NewDecoder(r.Body).Decode(&fav); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	if err := favoritesService.Add(context.Background(), fav); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func RemoveFavoriteHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var body struct {
		ID int `json:"id"`
	}

	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	if err := favoritesService.Remove(context.Background(), body.ID); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func ListFavoritesHandler(w http.ResponseWriter, r *http.Request) {
	favs, err := favoritesService.List(context.Background())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(favs)
}
