package engine

import (
	"sort"

	"DishDash/src/models"
	"DishDash/src/utils"
)

func SuggestRecipes(
	recipes []models.Recipe,
	fridge []models.Ingredient,
	favorites []models.Favorite,
) []models.Suggestion {

	suggestions := []models.Suggestion{}

	for _, r := range recipes {
		total := len(r.Ingredients)
		if total == 0 {
			continue
		}

		available := 0
		missing := []models.Ingredient{}

		for _, ing := range r.Ingredients {
			if utils.HasIngredient(fridge, ing) {
				available++
			} else {
				missing = append(missing, ing)
			}
		}

		matchScore := float64(available) / float64(total)

		fav := utils.IsFavorite(r.ID, favorites)

		finalScore := matchScore
		if fav {
			finalScore += 0.3
		}
		if finalScore > 1 {
			finalScore = 1
		}

		suggestions = append(suggestions, models.Suggestion{
			Recipe:             r,
			MatchScore:         matchScore,
			FinalScore:         finalScore,
			MissingIngredients: missing,
			IsFavorite:         fav,
		})
	}

	sort.Slice(suggestions, func(i, j int) bool {
		return suggestions[i].FinalScore > suggestions[j].FinalScore
	})

	return suggestions
}
