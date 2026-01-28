package storage_test

import (
	"os"
	"path/filepath"
	"testing"

	"DishDash/src/models"
	"DishDash/src/storage"
	"DishDash/src/utils"
)

// set utils.DataDir to temp folder
func setupTempDataDir(t *testing.T) string {
	tmp := t.TempDir()
	utils.SetDataDir(tmp)
	return tmp
}

func TestLoadFavorites_EmptyFile(t *testing.T) {
	setupTempDataDir(t)

	favs, err := storage.LoadFavorites()
	if err != nil {
		t.Fatal(err)
	}

	if len(favs) != 0 {
		t.Fatalf("expected empty favorites, got %d", len(favs))
	}
}

func TestAddFavorite(t *testing.T) {
	setupTempDataDir(t)

	fav := models.Favorite{ID: 1}
	if err := storage.AddFavorite(fav); err != nil {
		t.Fatal(err)
	}

	favs, _ := storage.LoadFavorites()
	if len(favs) != 1 {
		t.Fatalf("expected 1 favorite, got %d", len(favs))
	}
	if favs[0].ID != 1 {
		t.Fatalf("expected ID 1, got %d", favs[0].ID)
	}
}

func TestAddFavorite_PreventDuplicate(t *testing.T) {
	setupTempDataDir(t)

	fav := models.Favorite{ID: 2}
	_ = storage.AddFavorite(fav)
	_ = storage.AddFavorite(fav) // duplicate

	favs, _ := storage.LoadFavorites()
	if len(favs) != 1 {
		t.Fatalf("expected 1 favorite after duplicate, got %d", len(favs))
	}
}

func TestRemoveFavorite(t *testing.T) {
	setupTempDataDir(t)

	f1 := models.Favorite{ID: 10}
	f2 := models.Favorite{ID: 20}
	_ = storage.AddFavorite(f1)
	_ = storage.AddFavorite(f2)

	if err := storage.RemoveFavorite(10); err != nil {
		t.Fatal(err)
	}

	favs, _ := storage.LoadFavorites()
	if len(favs) != 1 {
		t.Fatalf("expected 1 favorite after remove, got %d", len(favs))
	}
	if favs[0].ID != 20 {
		t.Fatalf("expected remaining ID 20, got %d", favs[0].ID)
	}
}

func TestRemoveFavorite_NonExisting(t *testing.T) {
	setupTempDataDir(t)

	f := models.Favorite{ID: 30}
	_ = storage.AddFavorite(f)

	if err := storage.RemoveFavorite(99); err != nil {
		t.Fatal(err) // should not fail if ID doesn't exist
	}

	favs, _ := storage.LoadFavorites()
	if len(favs) != 1 || favs[0].ID != 30 {
		t.Fatalf("expected ID 30 to remain, got %+v", favs)
	}
}

func TestFavoritesFileCreated(t *testing.T) {
	tmp := setupTempDataDir(t)

	path := filepath.Join(tmp, "favorites.json")
	_, err := os.Stat(path)
	if !os.IsNotExist(err) {
		t.Fatalf("expected favorites.json to not exist yet")
	}

	// load triggers creation
	_, err = storage.LoadFavorites()
	if err != nil {
		t.Fatal(err)
	}

	if _, err := os.Stat(path); err != nil {
		t.Fatalf("expected favorites.json to be created")
	}
}
