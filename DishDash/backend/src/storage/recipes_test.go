package storage_test

import (
	"testing"

	"DishDash/src/models"
	"DishDash/src/storage"
	"DishDash/src/utils"
)

func TestLoadRecipes_CreatesFileIfMissing(t *testing.T) {
	setupTempDataDir(t)

	path, err := utils.RecipesPath()
	if err != nil {
		t.Fatal(err)
	}

	var recipes []models.Recipe
	if err := utils.LoadJSON(path, &recipes); err != nil {
		t.Fatal(err)
	}

	if len(recipes) != 0 {
		t.Fatalf("expected empty slice, got %d items", len(recipes))
	}
}

func TestSaveAndLoadRecipes(t *testing.T) {
	setupTempDataDir(t)

	input := []models.Recipe{
		{ID: 1, Name: "Pizza"},
		{ID: 2, Name: "Pasta"},
	}

	if err := storage.SaveRecipes(input); err != nil {
		t.Fatal(err)
	}

	output, err := storage.LoadRecipes()
	if err != nil {
		t.Fatal(err)
	}

	if len(output) != len(input) {
		t.Fatalf("expected %d recipes, got %d", len(input), len(output))
	}

	for i, r := range input {
		if output[i].Name != r.Name {
			t.Fatalf("expected recipe %q, got %q", r.Name, output[i].Name)
		}
	}
}

func TestAddRecipe(t *testing.T) {
	setupTempDataDir(t)

	recipe := models.Recipe{ID: 1, Name: "Salad"}

	if err := storage.AddRecipe(recipe); err != nil {
		t.Fatal(err)
	}

	recipes, err := storage.LoadRecipes()
	if err != nil {
		t.Fatal(err)
	}

	if len(recipes) != 1 {
		t.Fatalf("expected 1 recipe, got %d", len(recipes))
	}

	if recipes[0].Name != recipe.Name {
		t.Fatalf("expected %q, got %q", recipe.Name, recipes[0].Name)
	}
}
