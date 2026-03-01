package cooking

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	"DishDash/internal/storage/json"
	"DishDash/internal/models"
)

var cookService = NewService()

func GetCookHandler(w http.ResponseWriter, r *http.Request) {
	idStr := strings.TrimPrefix(r.URL.Path, "/recipes/")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "invalid recipe id", http.StatusBadRequest)
		return
	}

	recipes, err := storage.LoadRecipes()
	if err != nil {
		http.Error(w, "failed to load recipes", http.StatusInternalServerError)
		return
	}

	var recipe *models.Recipe
	for i := range recipes {
		if recipes[i].ID == id {
			recipe = &recipes[i]
			break
		}
	}

	if recipe == nil {
		http.Error(w, "recipe not found", http.StatusNotFound)
		return
	}

	fridge, err := storage.LoadFridge()
	if err != nil {
		http.Error(w, "failed to load fridge", http.StatusInternalServerError)
		return
	}

	details := cookService.GetRecipeDetails(r.Context(), *recipe, fridge)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(details)
}
