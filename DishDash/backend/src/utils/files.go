package utils

import (
	"encoding/json"
	"os"
	"path/filepath"
)

func DataDir() (string, error) {
	dir := filepath.Join(".", "data")
	if err := os.MkdirAll(dir, 0755); err != nil {
		return "", err
	}
	return dir, nil
}

func DataFile(name string) (string, error) {
	dir, err := DataDir()
	if err != nil {
		return "", err
	}
	return filepath.Join(dir, name), nil
}

func LoadJSON(path string, v any) error {
	// create file if missing
	if _, err := os.Stat(path); os.IsNotExist(err) {
		if err := os.WriteFile(path, []byte("[]"), 0644); err != nil {
			return err
		}
	}

	data, err := os.ReadFile(path)
	if err != nil {
		return err
	}

	return json.Unmarshal(data, v)
}

func SaveJSON(path string, v any) error {
	data, err := json.MarshalIndent(v, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(path, data, 0644)
}

func FridgePath() (string, error) {
	return DataFile("fridge.json")
}

func FavoritesPath() (string, error) {
	return DataFile("favorites.json")
}

func RecipesPath() (string, error) {
	return DataFile("recipes.json")
}
