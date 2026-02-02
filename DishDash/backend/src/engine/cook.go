package engine

import (
	"DishDash/src/models"
	"DishDash/src/utils"
)

func GetRecipeDetails(recipe models.Recipe, fridge models.Fridge) models.RecipeDetails {
	all := append([]models.Ingredient{}, fridge.Fresh...)
	all = append(all, fridge.Pantry...)
	all = append(all, fridge.Rare...)

	availableCount := 0
	missingIngredients := []models.IngredientWithStatus{}

	for _, ing := range recipe.Ingredients {
		missing := true
		if utils.HasIngredient(all, ing) {
			missing = false
			availableCount++
		}
		missingIngredients = append(missingIngredients, models.IngredientWithStatus{
			Name:     ing.Name,
			Quantity: ing.Quantity,
			Unit:     ing.Unit,
			Missing:  missing,
		})
	}

	return models.RecipeDetails{
		ID:               recipe.ID,
		Name:             recipe.Name,
		MealType:         recipe.MealType,
		Description:      recipe.Description,
		DietType:         recipe.DietType,
		Restrictions:     recipe.Restrictions,
		Time:             recipe.Time,
		Ingredients:      missingIngredients,
		SummaryAvailable: availableCount,
		SummaryMissing:   len(recipe.Ingredients) - availableCount,
	}
}