package api

import (
	"encoding/json"
	"net/http"
	"io"

	"DishDash/src/storage"
	"DishDash/src/models"
)

func ShoppingListHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	list, err := storage.LoadShoppingList()
	if err != nil {
		http.Error(w, "failed to load shopping list", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(list)
}

func AddToShoppingHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	data, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	// try decoding as a list first
	var ingredients []models.Ingredient
	if err := json.Unmarshal(data, &ingredients); err != nil {
		// try single ingredient
		var single models.Ingredient
		if err := json.Unmarshal(data, &single); err != nil {
			http.Error(w, "invalid request body", http.StatusBadRequest)
			return
		}
		ingredients = []models.Ingredient{single}
	}

	if len(ingredients) == 0 {
		http.Error(w, "no ingredients provided", http.StatusBadRequest)
		return
	}

	if err := storage.AddToShopping(ingredients...); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func SetShoppingHandler(w http.ResponseWriter, r *http.Request) {
	var ing models.Ingredient
	if err := json.NewDecoder(r.Body).Decode(&ing); err != nil {
		http.Error(w, "bad request", http.StatusBadRequest)
		return
	}

	if ing.Quantity <= 0 {
		if err := storage.RemoveFromShopping(ing.Name); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusOK)
		return
	}

	err := storage.SetShoppingIngredient(ing)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}


func RemoveFromShoppingHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var payload struct {
		Name string `json:"name"`
	}

	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	if payload.Name == "" {
		http.Error(w, "ingredient name required", http.StatusBadRequest)
		return
	}

	if err := storage.RemoveFromShopping(payload.Name); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func ClearShoppingHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	if err := storage.ClearShopping(); err != nil {
		http.Error(w, "failed to clear shopping", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}
