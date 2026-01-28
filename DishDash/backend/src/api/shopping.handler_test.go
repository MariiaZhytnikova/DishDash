package api_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"DishDash/src/api"
	"DishDash/src/models"
	"DishDash/src/storage"
	"DishDash/src/utils"
)

func setupShoppingTest(t *testing.T) {
	tmp := t.TempDir()
	utils.SetDataDir(tmp)

	// Start with empty shopping list
	if err := storage.ClearShopping(); err != nil {
		t.Fatal(err)
	}
}

func TestShoppingHandlers(t *testing.T) {
	setupShoppingTest(t)

	// GET empty shopping list
	req := httptest.NewRequest(http.MethodGet, "/shopping", nil)
	w := httptest.NewRecorder()
	api.ShoppingListHandler(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", w.Code)
	}

	var list models.ShoppingList
	if err := json.NewDecoder(w.Body).Decode(&list); err != nil {
		t.Fatal(err)
	}
	if len(list.Items) != 0 {
		t.Fatal("expected empty shopping list")
	}

	// Add single ingredient
	ing := models.Ingredient{Name: "Milk", Quantity: 2, Unit: "l"}
	body, _ := json.Marshal(ing)
	req = httptest.NewRequest(http.MethodPost, "/shopping/add", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w = httptest.NewRecorder()
	api.AddToShoppingHandler(w, req)
	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", w.Code)
	}

	// Check list has ingredient
	list2, _ := storage.LoadShoppingList()
	if len(list2.Items) != 1 || list2.Items[0].Name != "Milk" {
		t.Fatal("ingredient not added")
	}

	// Add multiple ingredients
	ings := []models.Ingredient{
		{Name: "Eggs", Quantity: 12, Unit: "pcs"},
		{Name: "Butter", Quantity: 100, Unit: "g"},
	}
	body, _ = json.Marshal(ings)
	req = httptest.NewRequest(http.MethodPost, "/shopping/add", bytes.NewReader(body))
	w = httptest.NewRecorder()
	api.AddToShoppingHandler(w, req)
	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", w.Code)
	}

	list3, _ := storage.LoadShoppingList()
	if len(list3.Items) != 3 {
		t.Fatalf("expected 3 items, got %d", len(list3.Items))
	}

	// Set ingredient (update quantity)
	setIng := models.Ingredient{Name: "Milk", Quantity: 5, Unit: "l"}
	body, _ = json.Marshal(setIng)
	req = httptest.NewRequest(http.MethodPost, "/shopping/set", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w = httptest.NewRecorder()
	api.SetShoppingHandler(w, req)
	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", w.Code)
	}

	list4, _ := storage.LoadShoppingList()
	if list4.Items[0].Quantity != 5 {
		t.Fatal("quantity not updated")
	}

	// Set ingredient with 0 qty (should remove)
	setIng = models.Ingredient{Name: "Eggs", Quantity: 0, Unit: "pcs"}
	body, _ = json.Marshal(setIng)
	req = httptest.NewRequest(http.MethodPost, "/shopping/set", bytes.NewReader(body))
	w = httptest.NewRecorder()
	api.SetShoppingHandler(w, req)
	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", w.Code)
	}

	list5, _ := storage.LoadShoppingList()
	for _, i := range list5.Items {
		if i.Name == "Eggs" {
			t.Fatal("ingredient not removed")
		}
	}

	// Remove ingredient
	body, _ = json.Marshal(map[string]string{"name": "Butter"})
	req = httptest.NewRequest(http.MethodPost, "/shopping/remove", bytes.NewReader(body))
	w = httptest.NewRecorder()
	api.RemoveFromShoppingHandler(w, req)
	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", w.Code)
	}

	list6, _ := storage.LoadShoppingList()
	for _, i := range list6.Items {
		if i.Name == "Butter" {
			t.Fatal("ingredient not removed via handler")
		}
	}

	// Clear shopping list
	req = httptest.NewRequest(http.MethodPost, "/shopping/clear", nil)
	w = httptest.NewRecorder()
	api.ClearShoppingHandler(w, req)
	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", w.Code)
	}

	list7, _ := storage.LoadShoppingList()
	if len(list7.Items) != 0 {
		t.Fatal("shopping list not cleared")
	}

	// Wrong method
	req = httptest.NewRequest(http.MethodGet, "/shopping/add", nil)
	w = httptest.NewRecorder()
	api.AddToShoppingHandler(w, req)
	if w.Code != http.StatusMethodNotAllowed {
		t.Fatalf("expected 405, got %d", w.Code)
	}
}
