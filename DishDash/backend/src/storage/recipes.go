package storage

import (
	"log"

	"DishDash/src/models"
	"DishDash/src/utils"
)

func LoadRecipes() ([]models.Recipe, error) {
	path, err := utils.RecipesPath()
	if err != nil {
		return nil, err
	}

	var recipes []models.Recipe
	if err := utils.LoadJSON(path, &recipes); err != nil {
		return nil, err
	}

	if recipes == nil {
		recipes = []models.Recipe{}
		if err := SaveRecipes(recipes); err != nil {
			log.Println("failed to save recipes:", err)
		}
	}

	return recipes, nil
}

func SaveRecipes(recipes []models.Recipe) error {
	path, err := utils.RecipesPath()
	if err != nil {
		return err
	}
	return utils.SaveJSON(path, recipes)
}

func AddRecipe(recipe models.Recipe) error {
	recipes, err := LoadRecipes()
	if err != nil {
		return err
	}

	recipes = append(recipes, recipe)
	return SaveRecipes(recipes)
}
