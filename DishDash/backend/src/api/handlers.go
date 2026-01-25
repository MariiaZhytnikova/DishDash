package main

import (
	"encoding/json"
	"net/http"

	"DishDash/src/models"
	"DishDash/src/storage"
)

func GetIngredientsHandler(w http.ResponseWriter, r *http.Request) {
	list, err := storage.LoadIngredients()
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	json.NewEncoder(w).Encode(list)
}

func AddIngredientHandler(w http.ResponseWriter, r *http.Request) {
	var ing models.Ingredient
	json.NewDecoder(r.Body).Decode(&ing)

	err := storage.AddIngredient(ing)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	w.WriteHeader(201)
}

func GetFavoritesHandler(w http.ResponseWriter, r *http.Request) {
	list, err := storage.LoadFavorites()
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	json.NewEncoder(w).Encode(list)
}

func AddFavoriteHandler(w http.ResponseWriter, r *http.Request) {
	var fav models.Favorite
	json.NewDecoder(r.Body).Decode(&fav)

	err := storage.AddFavorite(fav)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	w.WriteHeader(201)
}
