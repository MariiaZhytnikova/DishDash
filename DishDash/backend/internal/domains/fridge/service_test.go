package fridge_test

import (
	"context"
	"testing"

	"DishDash/internal/domains/fridge"
	"DishDash/internal/models"
	"DishDash/internal/utils"
)

func setupServiceTest(t *testing.T) *fridge.Service {
	tmp := t.TempDir()
	utils.SetDataDir(tmp)

	return fridge.NewService()
}

func TestFridgeService(t *testing.T) {
	ctx := context.Background()
	s := setupServiceTest(t)

	// Add ingredient
	ing := models.Ingredient{Name: "Carrot", Quantity: 2, Unit: "pcs"}
	if err := s.AddPosition(ctx, "fresh", ing); err != nil {
		t.Fatal(err)
	}

	// GetSection
	sec, found, err := s.GetSection(ctx, "Carrot")
	if err != nil {
		t.Fatal(err)
	}
	if sec != "fresh" || found.Name != "Carrot" {
		t.Fatal("GetSection returned wrong data")
	}

	// Increase
	if err := s.Increase(ctx, "fresh", "Carrot", 3); err != nil {
		t.Fatal(err)
	}
	_, found, _ = s.GetSection(ctx, "Carrot")
	if found.Quantity != 5 {
		t.Fatal("Increase failed")
	}

	// Decrease
	if err := s.Decrease(ctx, "fresh", "Carrot", 2); err != nil {
		t.Fatal(err)
	}
	_, found, _ = s.GetSection(ctx, "Carrot")
	if found.Quantity != 3 {
		t.Fatal("Decrease failed")
	}

	// GetFridge
	fridgeData, err := s.GetFridge(ctx)
	if err != nil {
		t.Fatal(err)
	}
	if len(fridgeData.Fresh) != 1 {
		t.Fatal("GetFridge missing ingredient")
	}

	// GetFridgeSection
	sectionList, err := s.GetFridgeSection(ctx, "fresh")
	if err != nil {
		t.Fatal(err)
	}
	if len(sectionList) != 1 || sectionList[0].Name != "Carrot" {
		t.Fatal("GetFridgeSection returned wrong data")
	}

	// DeletePosition
	if err := s.DeletePosition(ctx, "fresh", "Carrot"); err != nil {
		t.Fatal(err)
	}
	fridgeData, _ = s.GetFridge(ctx)
	if len(fridgeData.Fresh) != 0 {
		t.Fatal("DeletePosition failed")
	}

	// Unknown section for GetFridgeSection
	_, err = s.GetFridgeSection(ctx, "unknown")
	if err == nil {
		t.Fatal("expected error for unknown section")
	}

	// GetSection for missing ingredient
	_, _, err = s.GetSection(ctx, "Missing")
	if err == nil {
		t.Fatal("expected error for missing ingredient")
	}
}
