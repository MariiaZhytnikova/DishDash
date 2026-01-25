package storage

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

func loadJSON(filename string, v any) error {
	dir, err := DataDir()
	if err != nil {
		return err
	}

	path := filepath.Join(dir, filename)

	data, err := os.ReadFile(path)
	if os.IsNotExist(err) {
		return nil
	}
	if err != nil {
		return err
	}

	return json.Unmarshal(data, v)
}

func saveJSON(filename string, v any) error {
	dir, err := DataDir()
	if err != nil {
		return err
	}

	path := filepath.Join(dir, filename)

	data, err := json.MarshalIndent(v, "", "  ")
	if err != nil {
		return err
	}

	return os.WriteFile(path, data, 0644)
}
