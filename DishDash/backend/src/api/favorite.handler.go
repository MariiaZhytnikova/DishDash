package api

import (
	"encoding/json"
	"net/http"

	"DishDash/src/models"
	"DishDash/src/storage"
)

func AddFavoriteHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	var fav models.Favorite
	if err := json.NewDecoder(r.Body).Decode(&fav); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	if err := storage.AddFavorite(fav); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func RemoveFavoriteHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	var body struct {
		ID int `json:"id"`
	}

	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	if err := storage.RemoveFavorite(body.ID); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func ListFavoritesHandler(w http.ResponseWriter, r *http.Request) {
	favs, err := storage.LoadFavorites()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(favs)
}
