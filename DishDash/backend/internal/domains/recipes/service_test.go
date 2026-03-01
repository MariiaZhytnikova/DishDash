package recipes_test

import (
	"context"
	"testing"

	"DishDash/internal/models"
	"DishDash/internal/utils"
	"DishDash/internal/domains/recipes"
)

func setupRecipesTest(t *testing.T) {
	tmp := t.TempDir()
	utils.SetDataDir(tmp)
}

func TestListRecipes(t *testing.T) {
	setupRecipesTest(t)

	svc := recipes.NewService()

	recipes, err := svc.ListRecipes(context.Background())
	if err != nil {
		t.Fatalf("ListRecipes error: %v", err)
	}

	if len(recipes) != 0 {
		t.Fatalf("expected empty recipes list, got %d", len(recipes))
	}
}

func TestAddRecipe(t *testing.T) {
	setupRecipesTest(t)

	svc := recipes.NewService()

	r := models.Recipe{
		ID:   1,
		Name: "Test Recipe",
	}

	err := svc.AddRecipe(context.Background(), r)
	if err != nil {
		t.Fatalf("AddRecipe error: %v", err)
	}

	list, err := svc.ListRecipes(context.Background())
	if err != nil {
		t.Fatalf("ListRecipes error: %v", err)
	}

	if len(list) != 1 {
		t.Fatalf("expected 1 recipe, got %d", len(list))
	}

	if list[0].Name != "Test Recipe" {
		t.Fatalf("unexpected recipe name: %s", list[0].Name)
	}
}

