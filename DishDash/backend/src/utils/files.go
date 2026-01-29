package utils

import (
	"encoding/json"
	"os"
	"path/filepath"
)

var dataDir = "./data"

func SetDataDir(dir string) {
	dataDir = dir
}

func DataDir() (string, error) {
	if err := os.MkdirAll(dataDir, 0755); err != nil {
		return "", err
	}
	return dataDir, nil
}

func DataFile(name string) (string, error) {
	dir, err := DataDir()
	if err != nil {
		return "", err
	}
	return filepath.Join(dir, name), nil
}

func LoadJSON(path string, v any) error {
	data, err := os.ReadFile(path)
	if os.IsNotExist(err) {
		return nil // empty struct, caller decides
	}
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

func ShoppingPath() (string, error) {
	return DataFile("shopping.json")
}