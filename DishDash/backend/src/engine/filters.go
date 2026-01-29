package engine

import (
	"strings"

	"DishDash/src/models"
	"DishDash/src/utils"
)

func FilterRecipes(recipes []models.Recipe, settings models.FilterSettings) []models.Recipe {
	result := []models.Recipe{}

	for _, r := range recipes {
		// mealType filter
		if settings.MealType != "" && strings.ToLower(r.MealType) != strings.ToLower(settings.MealType) {
			continue
		}

		// mainType filter
		if settings.MainType != "" && strings.ToLower(r.MainType) != strings.ToLower(settings.MainType) {
			continue
		}

		// // query filter
		// if settings.Query != "" &&
		// 	!strings.Contains(strings.ToLower(r.Name), strings.ToLower(settings.Query)) &&
		// 	!strings.Contains(strings.ToLower(r.Description), strings.ToLower(settings.Query)) {
		// 	continue
		// }

		// diet filter
		if len(settings.DietType) > 0 {
			ok := false
			for _, d := range settings.DietType {
				if utils.Contains(r.DietType, d) {
					ok = true
				}
			}
			if !ok {
				continue
			}
		}

		// restrictions filter
		if len(settings.Restrictions) > 0 {
			ok := true
			for _, rstr := range settings.Restrictions {
				if utils.Contains(r.Restrictions, rstr) {
					ok = false
				}
			}
			if !ok {
				continue
			}
		}

		result = append(result, r)
	}

	return result
}
