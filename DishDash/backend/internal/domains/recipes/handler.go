package recipes

import (
	"context"
	"encoding/json"
	"net/http"
)

var recipesService = NewService()

func GetRecipesHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	recipesList, err := recipesService.ListRecipes(context.Background())
	if err != nil {
		http.Error(w, "failed to load recipes", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(recipesList)
}