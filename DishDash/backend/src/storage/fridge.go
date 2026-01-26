package storage

import (
	"DishDash/src/models"
)

func LoadFridge() ([]models.Ingredient, error) {
	var list []models.Ingredient

	path, err := DataFile("fridge.json")
	if err != nil {
		return nil, err
	}

	if err := loadJSON(path, &list); err != nil {
		return nil, err
	}

	return list, nil
}

func SaveFridge(list []models.Ingredient) error {
	path, err := DataFile("fridge.json")
	if err != nil {
		return err
	}
	return saveJSON(path, list)
}

