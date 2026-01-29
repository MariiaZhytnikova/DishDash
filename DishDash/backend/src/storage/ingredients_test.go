package storage_test

import (
	"testing"

	"DishDash/src/models"
	"DishDash/src/storage"
	"DishDash/src/utils"
)

func TestAddPosition(t *testing.T) {
	tmp := t.TempDir()
	utils.SetDataDir(tmp)

	ing := models.Ingredient{Name: "Egg", Quantity: 6, Unit: "pcs"}

	// Add to fresh section
	if err := storage.AddPosition("fresh", ing); err != nil {
		t.Fatal(err)
	}

	fridge, _ := storage.LoadFridge()
	if len(fridge.Fresh) != 1 || fridge.Fresh[0].Name != "Egg" {
		t.Fatalf("ingredient not added correctly")
	}

	// Add same ingredient → should fail
	if err := storage.AddPosition("fresh", ing); err == nil {
		t.Fatal("expected error for duplicate ingredient")
	}

	// Add unknown section → should fail
	if err := storage.AddPosition("unknown", ing); err == nil {
		t.Fatal("expected error for unknown section")
	}
}

func TestDeletePosition(t *testing.T) {
	tmp := t.TempDir()
	utils.SetDataDir(tmp)

	ing := models.Ingredient{Name: "Milk", Quantity: 1, Unit: "l"}
	storage.AddPosition("fresh", ing)

	// Delete existing
	if err := storage.DeletePosition("fresh", "Milk"); err != nil {
		t.Fatal(err)
	}

	fridge, _ := storage.LoadFridge()
	if len(fridge.Fresh) != 0 {
		t.Fatal("ingredient not deleted")
	}

	// Delete non-existing → error
	if err := storage.DeletePosition("fresh", "Milk"); err == nil {
		t.Fatal("expected error for non-existing ingredient")
	}

	// Delete unknown section → error
	if err := storage.DeletePosition("unknown", "Milk"); err == nil {
		t.Fatal("expected error for unknown section")
	}
}

func TestIncreaseDecrease(t *testing.T) {
	tmp := t.TempDir()
	utils.SetDataDir(tmp)

	ing := models.Ingredient{Name: "Tomato", Quantity: 2, Unit: "pcs"}
	storage.AddPosition("fresh", ing)

	// Increase
	if err := storage.Increase("fresh", "Tomato", 3); err != nil {
		t.Fatal(err)
	}

	fridge, _ := storage.LoadFridge()
	if fridge.Fresh[0].Quantity != 5 {
		t.Fatal("quantity not increased correctly")
	}

	// Decrease
	if err := storage.Decrease("fresh", "Tomato", 4); err != nil {
		t.Fatal(err)
	}
	fridge, _ = storage.LoadFridge()
	if fridge.Fresh[0].Quantity != 1 {
		t.Fatal("quantity not decreased correctly")
	}

	// Decrease below 0 → should cap at 0
	if err := storage.Decrease("fresh", "Tomato", 10); err != nil {
		t.Fatal(err)
	}
	fridge, _ = storage.LoadFridge()
	if fridge.Fresh[0].Quantity != 0 {
		t.Fatal("quantity should not go below 0")
	}

	// Unknown section → error
	if err := storage.Increase("unknown", "Tomato", 1); err == nil {
		t.Fatal("expected error for unknown section")
	}
}

func TestIncreaseList(t *testing.T) {
	tmp := t.TempDir()
	utils.SetDataDir(tmp)

	// initial fridge
	storage.AddPosition("fresh", models.Ingredient{
		Name: "Tomato", Quantity: 2, Unit: "pcs",
	})
	storage.AddPosition("pantry", models.Ingredient{
		Name: "Rice", Quantity: 1, Unit: "kg",
	})

	err := storage.IncreaseList([]models.Ingredient{
		{Name: "Tomato", Quantity: 3},
		{Name: "Rice", Quantity: 2},
		{Name: "Salt", Quantity: 1},
	})
	if err != nil {
		t.Fatal(err)
	}

	fridge, _ := storage.LoadFridge()

	// fresh updated
	if fridge.Fresh[0].Quantity != 5 {
		t.Fatalf("expected Tomato = 5, got %v", fridge.Fresh[0].Quantity)
	}

	// pantry updated
	if fridge.Pantry[0].Quantity != 3 {
		t.Fatalf("expected Rice = 3, got %v", fridge.Pantry[0].Quantity)
	}

	// new ingredient → rare
	if len(fridge.Rare) != 1 || fridge.Rare[0].Name != "Salt" {
		t.Fatal("ingredient not added to rare section")
	}
}

func TestDecreaseList(t *testing.T) {
	tmp := t.TempDir()
	utils.SetDataDir(tmp)

	storage.AddPosition("fresh", models.Ingredient{
		Name: "Milk", Quantity: 2, Unit: "l",
	})
	storage.AddPosition("pantry", models.Ingredient{
		Name: "Sugar", Quantity: 5, Unit: "g",
	})
	storage.AddPosition("rare", models.Ingredient{
		Name: "Vanilla", Quantity: 1, Unit: "pcs",
	})

	err := storage.DecreaseList([]models.Ingredient{
		{Name: "Milk", Quantity: 1},
		{Name: "Sugar", Quantity: 10},
		{Name: "Vanilla", Quantity: 1},
		{Name: "Ghost", Quantity: 5},
	})
	if err != nil {
		t.Fatal(err)
	}

	fridge, _ := storage.LoadFridge()

	if fridge.Fresh[0].Quantity != 1 {
		t.Fatal("Milk quantity incorrect after decrease")
	}

	if fridge.Pantry[0].Quantity != 0 {
		t.Fatal("Sugar should be clamped to 0")
	}

	if fridge.Rare[0].Quantity != 0 {
		t.Fatal("Vanilla should be clamped to 0")
	}
}
