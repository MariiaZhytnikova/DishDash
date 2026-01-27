package api

import (
	"encoding/json"
	"net/http"

	"DishDash/src/engine"
	"DishDash/src/models"
	"DishDash/src/storage"
)

type SearchRequest struct {
    Fridge   *models.Fridge       `json:"fridge,omitempty"`
    Settings models.FilterSettings `json:"settings"`
}

func SearchHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req SearchRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	// load recipes
	recipes, err := storage.LoadRecipes()
	if err != nil {
		http.Error(w, "failed to load recipes", http.StatusInternalServerError)
		return
	}

	// load favorites
	favorites, err := storage.LoadFavorites()
	if err != nil {
		http.Error(w, "failed to load favorites", http.StatusInternalServerError)
		return
	}

	// load fridge (use request fridge if provided)
	var fridge models.Fridge

	if req.Fridge != nil {
		fridge = *req.Fridge
	} else {
		fridge, err = storage.LoadFridge()
		if err != nil {
			http.Error(w, "failed to load fridge", http.StatusInternalServerError)
			return
		}
	}

	// search
	result := engine.SearchRecipes(
		recipes,
		fridge,
		favorites,
		req.Settings,
	)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}