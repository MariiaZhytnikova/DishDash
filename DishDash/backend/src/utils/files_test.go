package utils_test

import (
	"testing"
	"path/filepath"

	"DishDash/src/utils"
)

func TestLoadJSON_MissingFile(t *testing.T) {
	tmp := t.TempDir()
	path := filepath.Join(tmp, "missing.json")
	var data []string
	err := utils.LoadJSON(path, &data)
	if err != nil {
		t.Fatal(err)
	}
	if data != nil {
		t.Log("slice loaded:", data)
	}
}

func TestSaveAndLoadJSON(t *testing.T) {
	tmp := t.TempDir()
	path := filepath.Join(tmp, "data.json")

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


