package storage

import (
	"DishDash/backend/models"
)

func LoadIngredients() ([]models.Ingredient, error) {
	var list []models.Ingredient
	if err := loadJSON("ingredients.json", &list); err != nil {
		return nil, err
	}
	return list, nil
}

func SaveIngredients(list []models.Ingredient) error {
	return saveJSON("ingredients.json", list)
}
