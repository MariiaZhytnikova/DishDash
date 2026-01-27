package engine

import (
	"strings"

	"DishDash/src/models"
)

func SearchRecipes(
	recipes []models.Recipe,
	fridge []models.Ingredient,
	favorites []models.Favorite,
	settings models.FilterSettings,
) []models.Suggestion {

	filtered := FilterRecipes(recipes, settings)

	return SuggestRecipes(filtered, fridge, favorites)
}

func SearchByName(recipes []models.Recipe, q string) []models.Recipe {
	q = strings.ToLower(q)
	result := []models.Recipe{}

	for _, r := range recipes {
		if strings.Contains(strings.ToLower(r.Name), q) {
			result = append(result, r)
		}
	}
	return result
}
