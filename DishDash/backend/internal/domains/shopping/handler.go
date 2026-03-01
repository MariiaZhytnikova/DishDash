package shopping

import (
	"encoding/json"
	"io"
	"net/http"
	"os"

	"DishDash/internal/models"
)

var shoppingService = NewService()

func ShoppingListHandler(w http.ResponseWriter, r *http.Request) {
	list, err := shoppingService.GetList(r.Context())
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

	var ingredients []models.Ingredient
	if err := json.Unmarshal(data, &ingredients); err != nil {
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

	if err := shoppingService.Add(r.Context(), ingredients...); err != nil {
		http.Error(w, "failed to add ingredients", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func SetShoppingHandler(w http.ResponseWriter, r *http.Request) {
	var ing models.Ingredient
	if err := json.NewDecoder(r.Body).Decode(&ing); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	if err := shoppingService.Set(r.Context(), ing); err != nil {
		http.Error(w, "failed to update ingredient", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func RemoveFromShoppingHandler(w http.ResponseWriter, r *http.Request) {
	var payload struct {
		Name string `json:"name"`
	}
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil || payload.Name == "" {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	if err := shoppingService.Remove(r.Context(), payload.Name); err != nil {
		http.Error(w, "failed to remove ingredient", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func ClearShoppingHandler(w http.ResponseWriter, r *http.Request) {
	if err := shoppingService.Clear(r.Context()); err != nil {
		http.Error(w, "failed to clear shopping list", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func SendShoppingHandler(w http.ResponseWriter, r *http.Request) {
	var req models.SendShoppingRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.Email == "" {
		http.Error(w, "invalid request body or missing email", http.StatusBadRequest)
		return
	}

	to := []string{req.Email, os.Getenv("SMTP_USER")}
	if err := shoppingService.SendEmail(r.Context(), to); err != nil {
		http.Error(w, "send email failed", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}
