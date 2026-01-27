package engine

import (
	"strings"

	"DishDash/src/models"
)

func SearchRecipes(
	recipes []models.Recipe,
	fridge models.Fridge,
	favorites []models.Favorite,
	settings models.FilterSettings,
) []models.Suggestion {
	filtered := FilterRecipes(recipes, settings)

	// merge all sections
	all := append([]models.Ingredient{}, fridge.Fresh...)
	all = append(all, fridge.Pantry...)
	all = append(all, fridge.Rare...)

	return SuggestRecipes(filtered, all, favorites)
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
