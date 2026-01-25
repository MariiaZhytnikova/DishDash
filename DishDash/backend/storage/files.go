package storage

import (
	"encoding/json"
	"os"
	"path/filepath"
)

func dataDir() (string, error) {
	home, err := os.UserHomeDir()
	if err != nil {
		return "", err
	}

	dir := filepath.Join(home, ".dishdash")
	err = os.MkdirAll(dir, 0755)
	if err != nil {
		return "", err
	}

	return dir, nil
}

func loadJSON(filename string, v any) error {
	dir, err := dataDir()
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
	dir, err := dataDir()
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
