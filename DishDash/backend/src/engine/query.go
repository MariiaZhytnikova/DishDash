package engine

import (
	"strings"

	"DishDash/src/models"
)

func tokenizeQuery(q string) []string {
	q = strings.ToLower(strings.TrimSpace(q))
	if q == "" {
		return nil
	}
	return strings.Fields(q)
}

func recipeText(r models.Recipe) string {
	var parts []string

	parts = append(parts,
		r.Name,
		r.Description,
		r.MealType,
		r.MainType,
		r.Country,
	)

	parts = append(parts, r.DietType...)
	parts = append(parts, r.Restrictions...)

	for _, ing := range r.Ingredients {
		parts = append(parts, ing.Name)
	}

	parts = append(parts, r.Steps...)

	return strings.ToLower(strings.Join(parts, " "))
}

func QueryScore(r models.Recipe, query string) float64 {
	words := tokenizeQuery(query)
	if len(words) == 0 {
		return 0
	}

	text := recipeText(r)

	matches := 0
	for _, w := range words {
		if strings.Contains(text, w) {
			matches++
		}
	}

	return float64(matches) / float64(len(words))
}


