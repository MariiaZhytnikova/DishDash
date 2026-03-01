package search

import (
	"DishDash/internal/models"
)

func SearchRecipes(
	recipes []models.Recipe,
	fridge models.Fridge,
	favorites []models.Favorite,
	settings models.FilterSettings,
) []models.Suggestion {

	// merge fridge
	all := append([]models.Ingredient{}, fridge.Fresh...)
	all = append(all, fridge.Pantry...)
	all = append(all, fridge.Rare...)

	candidates := recipes

	// query + filters
	if hasFilters(settings) {
		candidates = FilterRecipes(candidates, settings)
	}

	// query filtering
	if settings.Query != "" {
		withQuery := []models.Recipe{}

	for _, r := range candidates {
		if QueryScore(r, settings.Query) > 0 {
			withQuery = append(withQuery, r)
		}
	}
		candidates = withQuery
	}

	// empty result (frontend shows "not found")
	if len(candidates) == 0 {
		return []models.Suggestion{}
	}

	return SuggestRecipes(candidates, all, favorites, settings.Query)
}
