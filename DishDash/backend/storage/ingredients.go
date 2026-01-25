package storage

import "DishDash/backend/models"

const ingredientsFile = "ingredients.json"

func LoadIngredients() ([]models.Ingredient, error) {
	var list []models.Ingredient
	err := loadJSON(ingredientsFile, &list)
	return list, err
}

func SaveIngredients(list []models.Ingredient) error {
	return saveJSON(ingredientsFile, list)
}
