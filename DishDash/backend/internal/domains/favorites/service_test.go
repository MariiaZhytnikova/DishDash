package favorites_test

import (
	"context"
	"testing"

	"DishDash/internal/domains/favorites"
	"DishDash/internal/models"
	"DishDash/internal/utils"
)

func setupFavoritesTest(t *testing.T) *favorites.Service {
	tmp := t.TempDir()
	utils.SetDataDir(tmp)

	return favorites.NewService()
}

func TestFavoritesService(t *testing.T) {
	ctx := context.Background()
	s := setupFavoritesTest(t)

	// Add favorite
	fav := models.Favorite{ID: 1, Name: "Pancakes"}
	if err := s.Add(ctx, fav); err != nil {
		t.Fatal(err)
	}

	// List favorites
	list, err := s.List(ctx)
	if err != nil {
		t.Fatal(err)
	}
	if len(list) != 1 || list[0].Name != "Pancakes" {
		t.Fatal("favorite not added correctly")
	}

	// Remove favorite
	if err := s.Remove(ctx, 1); err != nil {
		t.Fatal(err)
	}
	list, _ = s.List(ctx)
	if len(list) != 0 {
		t.Fatal("favorite not removed")
	}

	// Remove non-existing favorite (should not panic)
	if err := s.Remove(ctx, 999); err != nil {
		t.Fatal("removing non-existing favorite returned error")
	}
}
