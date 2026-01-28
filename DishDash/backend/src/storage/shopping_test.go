package storage_test

import (
	"testing"

	"DishDash/src/models"
	"DishDash/src/storage"
)

func TestLoadAndSaveShopping(t *testing.T) {
	setupTempDataDir(t)

	list := models.ShoppingList{
		Items: []models.Ingredient{
			{Name: "Milk", Quantity: 2, Unit: "l"},
			{Name: "Eggs", Quantity: 6, Unit: "pcs"},
		},
	}

	if err := storage.SaveShopping(list); err != nil {
		t.Fatal(err)
	}

	out, err := storage.LoadShopping()
	if err != nil {
		t.Fatal(err)
	}

	if len(out.Items) != 2 {
		t.Fatalf("expected 2 items, got %d", len(out.Items))
	}
}

func TestAddToShopping(t *testing.T) {
	setupTempDataDir(t)

	ing1 := models.Ingredient{Name: "Milk", Quantity: 2, Unit: "l"}
	ing2 := models.Ingredient{Name: "Milk", Quantity: 1, Unit: "l"} // should merge

	if err := storage.AddToShopping(ing1); err != nil {
		t.Fatal(err)
	}

	if err := storage.AddToShopping(ing2); err != nil {
		t.Fatal(err)
	}

	list, _ := storage.LoadShopping()
	if len(list.Items) != 1 || list.Items[0].Quantity != 3 {
		t.Fatalf("expected 1 item with qty 3, got %+v", list.Items)
	}
}

func TestSetShoppingIngredient(t *testing.T) {
	setupTempDataDir(t)

	ing := models.Ingredient{Name: "Eggs", Quantity: 6, Unit: "pcs"}
	if err := storage.SetShoppingIngredient(ing); err != nil {
		t.Fatal(err)
	}

	// overwrite quantity
	ing.Quantity = 12
	if err := storage.SetShoppingIngredient(ing); err != nil {
		t.Fatal(err)
	}

	list, _ := storage.LoadShopping()
	if len(list.Items) != 1 || list.Items[0].Quantity != 12 {
		t.Fatalf("expected 12 eggs, got %+v", list.Items)
	}
}

func TestRemoveFromShopping(t *testing.T) {
	setupTempDataDir(t)

	ing := models.Ingredient{Name: "Butter", Quantity: 1, Unit: "kg"}
	storage.AddToShopping(ing)

	if err := storage.RemoveFromShopping("Butter"); err != nil {
		t.Fatal(err)
	}

	list, _ := storage.LoadShopping()
	if len(list.Items) != 0 {
		t.Fatalf("expected empty list, got %+v", list.Items)
	}
}

func TestClearShopping(t *testing.T) {
	setupTempDataDir(t)

	storage.AddToShopping(models.Ingredient{Name: "Tomato", Quantity: 5, Unit: "pcs"})
	if err := storage.ClearShopping(); err != nil {
		t.Fatal(err)
	}

	list, _ := storage.LoadShopping()
	if len(list.Items) != 0 {
		t.Fatalf("expected empty list after clear, got %+v", list.Items)
	}
}

func TestCreateShopping(t *testing.T) {
	setupTempDataDir(t)

	newList := models.ShoppingList{
		Items: []models.Ingredient{
			{Name: "Cheese", Quantity: 1, Unit: "kg"},
		},
	}

	if err := storage.CreateShopping(newList); err != nil {
		t.Fatal(err)
	}

	list, _ := storage.LoadShopping()
	if len(list.Items) != 1 || list.Items[0].Name != "Cheese" {
		t.Fatalf("expected Cheese in list, got %+v", list.Items)
	}
}

func TestLoadShoppingList(t *testing.T) {
	setupTempDataDir(t)

	storage.CreateShopping(models.ShoppingList{
		Items: []models.Ingredient{{Name: "Onion", Quantity: 3, Unit: "pcs"}},
	})

	list, err := storage.LoadShoppingList()
	if err != nil {
		t.Fatal(err)
	}

	if len(list.Items) != 1 || list.Items[0].Name != "Onion" {
		t.Fatalf("expected Onion, got %+v", list.Items)
	}
}
