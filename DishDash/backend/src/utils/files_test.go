package utils_test

import (
	"os"
	"testing"

	"DishDash/src/utils"
)

func TestLoadJSON_CreatesFileIfMissing(t *testing.T) {
	tmp := t.TempDir()
	utils.SetDataDir(tmp)

	path, err := utils.FavoritesPath()
	if err != nil {
		t.Fatal(err)
	}

	var data []any
	if err := utils.LoadJSON(path, &data); err != nil {
		t.Fatal(err)
	}

	if _, err := os.Stat(path); err != nil {
		t.Fatalf("expected file to be created")
	}
}

func TestSaveAndLoadJSON(t *testing.T) {
	tmp := t.TempDir()
	utils.SetDataDir(tmp)

	path, _ := utils.FavoritesPath()

	input := []string{"pizza", "pasta"}
	if err := utils.SaveJSON(path, input); err != nil {
		t.Fatal(err)
	}

	var output []string
	if err := utils.LoadJSON(path, &output); err != nil {
		t.Fatal(err)
	}

	if len(output) != 2 {
		t.Fatalf("expected 2 items, got %d", len(output))
	}
}

