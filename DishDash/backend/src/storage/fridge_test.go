package storage_test

import (
	"testing"

	"DishDash/src/models"
	"DishDash/src/storage"
	"DishDash/src/utils"
)

func TestSaveAndLoadFridge(t *testing.T) {
	tmp := t.TempDir()
	utils.SetDataDir(tmp)

	fridge := models.Fridge{
		Fresh:  []models.Ingredient{{Name: "Milk", Quantity: 1}},
		Pantry: []models.Ingredient{{Name: "Rice", Quantity: 500}},
		Rare:   []models.Ingredient{},
	}

	if err := storage.SaveFridge(fridge); err != nil {
		t.Fatal(err)
	}

	loaded, err := storage.LoadFridge()
	if err != nil {
		t.Fatal(err)
	}

	if len(loaded.Fresh) != 1 || loaded.Fresh[0].Name != "Milk" {
		t.Errorf("unexpected fridge fresh items: %+v", loaded.Fresh)
	}

	if len(loaded.Pantry) != 1 || loaded.Pantry[0].Quantity != 500 {
		t.Errorf("unexpected fridge pantry items: %+v", loaded.Pantry)
	}
}

func TestGetSection(t *testing.T) {
	tmp := t.TempDir()
	utils.SetDataDir(tmp)

	fridge := models.Fridge{
		Fresh:  []models.Ingredient{{Name: "Egg", Quantity: 6}},
		Pantry: []models.Ingredient{{Name: "Rice", Quantity: 1}},
		Rare:   []models.Ingredient{{Name: "Truffle", Quantity: 1}},
	}
	if err := storage.SaveFridge(fridge); err != nil {
		t.Fatal(err)
	}

	if section := storage.GetSection("egg"); section != "fresh" {
		t.Errorf("expected fresh, got %s", section)
	}
	if section := storage.GetSection("Rice"); section != "pantry" {
		t.Errorf("expected pantry, got %s", section)
	}
	if section := storage.GetSection("truffle"); section != "rare" {
		t.Errorf("expected rare, got %s", section)
	}
	if section := storage.GetSection("unknown"); section != "rare" {
		t.Errorf("expected rare for unknown, got %s", section)
	}
}
