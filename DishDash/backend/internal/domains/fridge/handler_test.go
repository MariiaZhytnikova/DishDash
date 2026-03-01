package fridge_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"DishDash/internal/domains/fridge"
	"DishDash/internal/models"
	"DishDash/internal/storage/json"
	"DishDash/internal/utils"
)

func setupFridgeTest(t *testing.T) {
	tmp := t.TempDir()
	utils.SetDataDir(tmp)
}

func TestAddAndGetFridge(t *testing.T) {
	setupFridgeTest(t)

	// Add ingredient
	ing := models.Ingredient{Name: "Tomato", Quantity: 3, Unit: "pcs"}
	payload := map[string]interface{}{
		"section":    "fresh",
		"ingredient": ing,
	}
	body, _ := json.Marshal(payload)
	req := httptest.NewRequest(http.MethodPost, "/fridge/add", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	fridge.AddPositionHandler(w, req)
	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", w.Code)
	}

	// Get full fridge
	req = httptest.NewRequest(http.MethodGet, "/fridge", nil)
	w = httptest.NewRecorder()
	fridge.GetFridgeHandler(w, req)
	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", w.Code)
	}

	var fr models.Fridge
	if err := json.NewDecoder(w.Body).Decode(&fr); err != nil {
		t.Fatal(err)
	}
	if len(fr.Fresh) != 1 || fr.Fresh[0].Name != "Tomato" {
		t.Fatal("ingredient not added to fridge")
	}

	// Get section
	req = httptest.NewRequest(http.MethodGet, "/fridge/fresh", nil)
	w = httptest.NewRecorder()
	fridge.GetFridgeSectionHandler(w, req)
	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", w.Code)
	}

	var section []models.Ingredient
	if err := json.NewDecoder(w.Body).Decode(&section); err != nil {
		t.Fatal(err)
	}
	if len(section) != 1 || section[0].Name != "Tomato" {
		t.Fatal("ingredient not in section")
	}
}

func TestIncreaseDecreaseDelete(t *testing.T) {
	setupFridgeTest(t)

	// Add ingredient first
	ing := models.Ingredient{Name: "Lettuce", Quantity: 2, Unit: "pcs"}
	payload := map[string]interface{}{"section": "fresh", "ingredient": ing}
	body, _ := json.Marshal(payload)
	req := httptest.NewRequest(http.MethodPost, "/fridge/add", bytes.NewReader(body))
	w := httptest.NewRecorder()
	fridge.AddPositionHandler(w, req)
	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", w.Code)
	}

	// Increase quantity
	inc := map[string]interface{}{"name": "Lettuce", "quantity": 3}
	body, _ = json.Marshal(inc)
	req = httptest.NewRequest(http.MethodPost, "/fridge/increase", bytes.NewReader(body))
	w = httptest.NewRecorder()
	fridge.IncreaseHandler(w, req)
	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", w.Code)
	}

	fridgeData, _ := storage.LoadFridge()
	if fridgeData.Fresh[0].Quantity != 5 {
		t.Fatal("increase did not work")
	}

	// Decrease quantity
	dec := map[string]interface{}{"name": "Lettuce", "quantity": 2}
	body, _ = json.Marshal(dec)
	req = httptest.NewRequest(http.MethodPost, "/fridge/decrease", bytes.NewReader(body))
	w = httptest.NewRecorder()
	fridge.DecreaseHandler(w, req)
	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", w.Code)
	}

	fridgeData, _ = storage.LoadFridge()
	if fridgeData.Fresh[0].Quantity != 3 {
		t.Fatal("decrease did not work")
	}

	// Delete ingredient
	del := map[string]interface{}{"name": "Lettuce"}
	body, _ = json.Marshal(del)
	req = httptest.NewRequest(http.MethodPost, "/fridge/delete", bytes.NewReader(body))
	w = httptest.NewRecorder()
	fridge.DeletePositionHandler(w, req)
	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", w.Code)
	}

	fridgeData, _ = storage.LoadFridge()
	if len(fridgeData.Fresh) != 0 {
		t.Fatal("ingredient not deleted")
	}
}

func TestMethodNotAllowed(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/fridge/add", nil)
	w := httptest.NewRecorder()
	fridge.AddPositionHandler(w, req)
	if w.Code != http.StatusMethodNotAllowed {
		t.Fatalf("expected 405, got %d", w.Code)
	}
}
