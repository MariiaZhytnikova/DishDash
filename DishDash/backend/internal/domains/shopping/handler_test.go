package shopping_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"DishDash/internal/package/email"
	"DishDash/internal/domains/shopping"
	"DishDash/internal/models"
	"DishDash/internal/utils"
	"DishDash/internal/storage/json"
)

// Setup temp data dir and clear shopping list
func setupShoppingTest(t *testing.T) {
	t.Helper()
	tmp := t.TempDir()
	utils.SetDataDir(tmp)

	// Clear shopping list
	if err := storage.ClearShopping(); err != nil {
		t.Fatal(err)
	}
}

// --- Mock email sender ---
func mockSendEmail(to []string, subject, body string) error {
	// Just succeed, can store values if needed
	return nil
}

// --- Helper to marshal request body ---
func marshalBody(t *testing.T, v any) *bytes.Reader {
	data, err := json.Marshal(v)
	if err != nil {
		t.Fatal(err)
	}
	return bytes.NewReader(data)
}

func TestShoppingHandlers(t *testing.T) {
	setupShoppingTest(t)

	// --- Mock email ---
	originalSend := email.Send
	defer func() { email.Send = originalSend }()
	email.Send = mockSendEmail

	// --- GET empty shopping list ---
	req := httptest.NewRequest(http.MethodGet, "/shopping", nil)
	w := httptest.NewRecorder()
	shopping.ShoppingListHandler(w, req)

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

	// --- Add single ingredient ---
	ing := models.Ingredient{Name: "Milk", Quantity: 2, Unit: "l"}
	req = httptest.NewRequest(http.MethodPost, "/shopping/add", marshalBody(t, ing))
	req.Header.Set("Content-Type", "application/json")
	w = httptest.NewRecorder()
	shopping.AddToShoppingHandler(w, req)
	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", w.Code)
	}

	// --- Add multiple ingredients ---
	ings := []models.Ingredient{
		{Name: "Eggs", Quantity: 12, Unit: "pcs"},
		{Name: "Butter", Quantity: 100, Unit: "g"},
	}
	req = httptest.NewRequest(http.MethodPost, "/shopping/add", marshalBody(t, ings))
	req.Header.Set("Content-Type", "application/json")
	w = httptest.NewRecorder()
	shopping.AddToShoppingHandler(w, req)
	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", w.Code)
	}

	// --- Check storage has 3 items ---
	list2, _ := storage.LoadShoppingList()
	if len(list2.Items) != 3 {
		t.Fatalf("expected 3 items, got %d", len(list2.Items))
	}

	// --- Set ingredient quantity ---
	setIng := models.Ingredient{Name: "Milk", Quantity: 5, Unit: "l"}
	req = httptest.NewRequest(http.MethodPost, "/shopping/set", marshalBody(t, setIng))
	req.Header.Set("Content-Type", "application/json")
	w = httptest.NewRecorder()
	shopping.SetShoppingHandler(w, req)
	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", w.Code)
	}

	list3, _ := storage.LoadShoppingList()
	for _, i := range list3.Items {
		if i.Name == "Milk" && i.Quantity != 5 {
			t.Fatal("quantity not updated")
		}
	}

	// --- Set ingredient to 0 (removes it) ---
	setIng = models.Ingredient{Name: "Eggs", Quantity: 0, Unit: "pcs"}
	req = httptest.NewRequest(http.MethodPost, "/shopping/set", marshalBody(t, setIng))
	req.Header.Set("Content-Type", "application/json")
	w = httptest.NewRecorder()
	shopping.SetShoppingHandler(w, req)
	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", w.Code)
	}

	list4, _ := storage.LoadShoppingList()
	for _, i := range list4.Items {
		if i.Name == "Eggs" {
			t.Fatal("ingredient not removed")
		}
	}

	// --- Remove ingredient via handler ---
	body := marshalBody(t, map[string]string{"name": "Butter"})
	req = httptest.NewRequest(http.MethodPost, "/shopping/remove", body)
	req.Header.Set("Content-Type", "application/json")
	w = httptest.NewRecorder()
	shopping.RemoveFromShoppingHandler(w, req)
	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", w.Code)
	}

	list5, _ := storage.LoadShoppingList()
	for _, i := range list5.Items {
		if i.Name == "Butter" {
			t.Fatal("ingredient not removed via handler")
		}
	}

	// --- Clear shopping list ---
	req = httptest.NewRequest(http.MethodPost, "/shopping/clear", nil)
	w = httptest.NewRecorder()
	shopping.ClearShoppingHandler(w, req)
	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", w.Code)
	}

	list6, _ := storage.LoadShoppingList()
	if len(list6.Items) != 0 {
		t.Fatal("shopping list not cleared")
	}

	// --- Send shopping email ---
	// Add one ingredient to send
	_ = storage.AddToShopping(models.Ingredient{Name: "Cheese", Quantity: 1, Unit: "kg"})
	req = httptest.NewRequest(http.MethodPost, "/shopping/send", marshalBody(t, map[string]string{"email": "test@example.com"}))
	req.Header.Set("Content-Type", "application/json")
	w = httptest.NewRecorder()
	shopping.SendShoppingHandler(w, req)
	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", w.Code)
	}

	// --- Wrong method check ---
	req = httptest.NewRequest(http.MethodGet, "/shopping/add", nil)
	w = httptest.NewRecorder()
	shopping.AddToShoppingHandler(w, req)
	if w.Code != http.StatusMethodNotAllowed {
		t.Fatalf("expected 405, got %d", w.Code)
	}
}
