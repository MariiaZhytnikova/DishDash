package api_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"DishDash/src/api"
	"DishDash/src/models"
	"DishDash/src/utils"
	"DishDash/src/storage"
)

func setupTempData(t *testing.T) {
	utils.SetDataDir(t.TempDir())
	// start with empty fridge
	err := storage.SaveFridge(models.Fridge{
		Fresh:  []models.Ingredient{},
		Pantry: []models.Ingredient{},
		Rare:   []models.Ingredient{},
	})
	if err != nil {
		t.Fatal(err)
	}
}

func TestAddPositionHandler(t *testing.T) {
	setupTempData(t)

	ing := models.Ingredient{Name: "Milk", Quantity: 2, Unit: "l"}
	payload := map[string]interface{}{
		"section":    "fresh",
		"ingredient": ing,
	}
	body, _ := json.Marshal(payload)

	req := httptest.NewRequest(http.MethodPost, "/fridge/add", bytes.NewReader(body))
	w := httptest.NewRecorder()

	api.AddPositionHandler(w, req)
	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", w.Code)
	}

	fridge, _ := storage.LoadFridge()
	if len(fridge.Fresh) != 1 || fridge.Fresh[0].Name != "Milk" {
		t.Fatal("ingredient not added to fridge")
	}

	// test duplicate
	req2 := httptest.NewRequest(http.MethodPost, "/fridge/add", bytes.NewReader(body))
	w2 := httptest.NewRecorder()
	api.AddPositionHandler(w2, req2)
	if w2.Code != http.StatusBadRequest {
		t.Fatalf("expected 400 for duplicate, got %d", w2.Code)
	}

	// test wrong method
	req3 := httptest.NewRequest(http.MethodGet, "/fridge/add", nil)
	w3 := httptest.NewRecorder()
	api.AddPositionHandler(w3, req3)
	if w3.Code != http.StatusMethodNotAllowed {
		t.Fatalf("expected 405 for wrong method, got %d", w3.Code)
	}
}

func TestDeletePositionHandler(t *testing.T) {
	setupTempData(t)
	_ = storage.AddPosition("fresh", models.Ingredient{Name: "Eggs", Quantity: 12, Unit: "pcs"})

	payload := map[string]string{"name": "Eggs"}
	body, _ := json.Marshal(payload)

	req := httptest.NewRequest(http.MethodPost, "/fridge/remove", bytes.NewReader(body))
	w := httptest.NewRecorder()
	api.DeletePositionHandler(w, req)
	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", w.Code)
	}

	fridge, _ := storage.LoadFridge()
	if len(fridge.Fresh) != 0 {
		t.Fatal("ingredient not deleted")
	}

	// delete non-existent
	req2 := httptest.NewRequest(http.MethodPost, "/fridge/remove", bytes.NewReader(body))
	w2 := httptest.NewRecorder()
	api.DeletePositionHandler(w2, req2)
	if w2.Code != http.StatusBadRequest {
		t.Fatalf("expected 400 for missing ingredient, got %d", w2.Code)
	}

	// wrong method
	req3 := httptest.NewRequest(http.MethodGet, "/fridge/remove", nil)
	w3 := httptest.NewRecorder()
	api.DeletePositionHandler(w3, req3)
	if w3.Code != http.StatusMethodNotAllowed {
		t.Fatalf("expected 405 for wrong method, got %d", w3.Code)
	}
}

func TestIncreaseDecreaseHandler(t *testing.T) {
	setupTempData(t)
	_ = storage.AddPosition("fresh", models.Ingredient{Name: "Butter", Quantity: 1, Unit: "kg"})

	// increase
	payload := map[string]interface{}{"name": "Butter", "quantity": 2}
	body, _ := json.Marshal(payload)
	req := httptest.NewRequest(http.MethodPost, "/fridge/increase", bytes.NewReader(body))
	w := httptest.NewRecorder()
	api.IncreaseHandler(w, req)
	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", w.Code)
	}
	fridge, _ := storage.LoadFridge()
	if fridge.Fresh[0].Quantity != 3 {
		t.Fatal("increase failed")
	}

	// decrease
	payload2 := map[string]interface{}{"name": "Butter", "quantity": 1.5}
	body2, _ := json.Marshal(payload2)
	req2 := httptest.NewRequest(http.MethodPost, "/fridge/decrease", bytes.NewReader(body2))
	w2 := httptest.NewRecorder()
	api.DecreaseHandler(w2, req2)
	if w2.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", w2.Code)
	}
	fridge, _ = storage.LoadFridge()
	if fridge.Fresh[0].Quantity != 1.5 {
		t.Fatal("decrease failed")
	}

	// decrease below zero
	payload3 := map[string]interface{}{"name": "Butter", "quantity": 5}
	body3, _ := json.Marshal(payload3)
	req3 := httptest.NewRequest(http.MethodPost, "/fridge/decrease", bytes.NewReader(body3))
	w3 := httptest.NewRecorder()
	api.DecreaseHandler(w3, req3)
	fridge, _ = storage.LoadFridge()
	if fridge.Fresh[0].Quantity != 0 {
		t.Fatal("quantity should not be negative")
	}

	// wrong method
	req4 := httptest.NewRequest(http.MethodGet, "/fridge/increase", nil)
	w4 := httptest.NewRecorder()
	api.IncreaseHandler(w4, req4)
	if w4.Code != http.StatusMethodNotAllowed {
		t.Fatalf("expected 405 for wrong method, got %d", w4.Code)
	}
}

func TestGetFridgeHandlers(t *testing.T) {
	setupTempData(t)
	_ = storage.AddPosition("fresh", models.Ingredient{Name: "Tomato", Quantity: 5, Unit: "pcs"})
	_ = storage.AddPosition("pantry", models.Ingredient{Name: "Rice", Quantity: 2, Unit: "kg"})

	// Get full fridge
	req := httptest.NewRequest(http.MethodGet, "/fridge", nil)
	w := httptest.NewRecorder()
	api.GetFridgeHandler(w, req)
	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", w.Code)
	}

	var fridge models.Fridge
	json.NewDecoder(w.Body).Decode(&fridge)
	if len(fridge.Fresh) != 1 || len(fridge.Pantry) != 1 {
		t.Fatal("fridge content mismatch")
	}

	// Get section
	req2 := httptest.NewRequest(http.MethodGet, "/fridge/fresh", nil)
	w2 := httptest.NewRecorder()
	api.GetFridgeSectionHandler(w2, req2)
	if w2.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", w2.Code)
	}
	var fresh []models.Ingredient
	json.NewDecoder(w2.Body).Decode(&fresh)
	if len(fresh) != 1 || fresh[0].Name != "Tomato" {
		t.Fatal("section content mismatch")
	}

	// unknown section
	req3 := httptest.NewRequest(http.MethodGet, "/fridge/unknown", nil)
	w3 := httptest.NewRecorder()
	api.GetFridgeSectionHandler(w3, req3)
	if w3.Code != http.StatusBadRequest {
		t.Fatalf("expected 400 for unknown section, got %d", w3.Code)
	}

	// wrong method
	req4 := httptest.NewRequest(http.MethodPost, "/fridge", nil)
	w4 := httptest.NewRecorder()
	api.GetFridgeHandler(w4, req4)
	if w4.Code != http.StatusMethodNotAllowed {
		t.Fatalf("expected 405 for wrong method, got %d", w4.Code)
	}
}
