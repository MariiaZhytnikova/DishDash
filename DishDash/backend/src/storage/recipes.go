package storage

import "DishDash/src/models"

func RecipesPath() (string, error) {
	return DataFile("recipes.json")
}

func LoadRecipes() ([]models.Recipe, error) {
	path, err := RecipesPath()
	if err != nil {
		return nil, err
	}

	var recipes []models.Recipe
	if err := loadJSON(path, &recipes); err != nil {
		return nil, err
	}
	return recipes, nil
}

func SaveRecipes(recipes []models.Recipe) error {
	path, err := RecipesPath()
	if err != nil {
		return err
	}
	return saveJSON(path, recipes)
}

func AddRecipe(recipe models.Recipe) error {
	recipes, err := LoadRecipes()
	if err != nil {
		return err
	}

	recipes = append(recipes, recipe)
	return SaveRecipes(recipes)
}
