package fridge

import (
	"context"
	"encoding/json"
	"net/http"
	"strings"

	"DishDash/internal/models"
)

var fridgeService = NewService()

func AddPositionHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var payload struct {
		Section    string          `json:"section"`
		Ingredient models.Ingredient `json:"ingredient"`
	}

	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	if err := fridgeService.AddPosition(context.Background(), payload.Section, payload.Ingredient); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func DeletePositionHandler(w http.ResponseWriter, r *http.Request) {
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

	section, _, err := fridgeService.GetSection(context.Background(), payload.Name)
	if err != nil {
		http.Error(w, "failed to get fridge section", http.StatusInternalServerError)
		return
	}

	if err := fridgeService.DeletePosition(context.Background(), section, payload.Name); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func IncreaseHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var payload struct {
		Name     string  `json:"name"`
		Quantity float64 `json:"quantity"`
	}

	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	section, _, err := fridgeService.GetSection(context.Background(), payload.Name)
	if err != nil {
		http.Error(w, "failed to get fridge section", http.StatusInternalServerError)
		return
	}

	if err := fridgeService.Increase(context.Background(), section, payload.Name, payload.Quantity); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func DecreaseHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var payload struct {
		Name     string  `json:"name"`
		Quantity float64 `json:"quantity"`
	}

	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	section, _, err := fridgeService.GetSection(context.Background(), payload.Name)
	if err != nil {
		http.Error(w, "failed to get fridge section", http.StatusInternalServerError)
		return
	}

	if err := fridgeService.Decrease(context.Background(), section, payload.Name, payload.Quantity); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func GetFridgeHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	fridge, err := fridgeService.GetFridge(context.Background())
	if err != nil {
		http.Error(w, "failed to load fridge", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(fridge)
}

func GetFridgeSectionHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	sectionName := strings.TrimPrefix(r.URL.Path, "/fridge/")
	fridgeSection, err := fridgeService.GetFridgeSection(context.Background(), sectionName)
	if err != nil {
		http.Error(w, "failed to get fridge section", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(fridgeSection)
}
