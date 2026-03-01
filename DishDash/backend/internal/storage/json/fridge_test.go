package storage_test

import (
	"testing"

	"DishDash/internal/models"
	"DishDash/internal/utils"
	"DishDash/internal/storage/json"
)

func setupFridgeTest(t *testing.T) {
	tmp := t.TempDir()
	utils.SetDataDir(tmp) // Make storage use temp dir
}

// Test Load/Save, Add/Delete, Increase/Decrease
func TestFridgeStorage(t *testing.T) {
	setupFridgeTest(t)

	// Start with empty fridge
	fridge, err := storage.LoadFridge()
	if err != nil {
		t.Fatal(err)
	}
	if len(fridge.Fresh) != 0 || len(fridge.Pantry) != 0 || len(fridge.Rare) != 0 {
		t.Fatal("fridge should be empty")
	}

	// Add ingredient to fresh
	ing := models.Ingredient{Name: "Tomato", Quantity: 3, Unit: "pcs"}
	if err := storage.AddPosition("fresh", ing); err != nil {
		t.Fatal(err)
	}

	// Check section
	section, err := storage.GetSection("Tomato")
	if err != nil {
		t.Fatal(err)
	}
	if section != "fresh" {
		t.Fatalf("expected fresh, got %s", section)
	}

	// Increase ingredient
	if err := storage.Increase("fresh", "Tomato", 2); err != nil {
		t.Fatal(err)
	}
	fridge, _ = storage.LoadFridge()
	if fridge.Fresh[0].Quantity != 5 {
		t.Fatalf("expected quantity 5, got %g", fridge.Fresh[0].Quantity)
	}

	// Decrease ingredient
	if err := storage.Decrease("fresh", "Tomato", 1); err != nil {
		t.Fatal(err)
	}
	fridge, _ = storage.LoadFridge()
	if fridge.Fresh[0].Quantity != 4 {
		t.Fatalf("expected quantity 4, got %g", fridge.Fresh[0].Quantity)
	}

	// Delete ingredient
	if err := storage.DeletePosition("fresh", "Tomato"); err != nil {
		t.Fatal(err)
	}
	fridge, _ = storage.LoadFridge()
	if len(fridge.Fresh) != 0 {
		t.Fatal("ingredient not deleted")
	}

	// IncreaseList adds new ingredients to rare if not exist
	ings := []models.Ingredient{
		{Name: "Salt", Quantity: 1, Unit: "tsp"},
		{Name: "Pepper", Quantity: 2, Unit: "g"},
	}
	if err := storage.IncreaseList(ings); err != nil {
		t.Fatal(err)
	}
	fridge, _ = storage.LoadFridge()
	if len(fridge.Rare) != 2 {
		t.Fatal("IncreaseList should add to rare")
	}

	// DecreaseList reduces quantities correctly
	decrease := []models.Ingredient{
		{Name: "Salt", Quantity: 1, Unit: "tsp"},
		{Name: "Pepper", Quantity: 3, Unit: "g"}, // over decrease → set 0
	}
	if err := storage.DecreaseList(decrease); err != nil {
		t.Fatal(err)
	}
	fridge, _ = storage.LoadFridge()
	for _, f := range fridge.Rare {
		if f.Name == "Salt" && f.Quantity != 0 {
			t.Fatal("Salt should be 0")
		}
		if f.Name == "Pepper" && f.Quantity != 0 {
			t.Fatal("Pepper should be 0")
		}
	}
}
