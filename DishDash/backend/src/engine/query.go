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

	nameText := strings.ToLower(r.Name)
	otherText := recipeText(r) // includes everything
	otherText = strings.ReplaceAll(otherText, nameText, "") // remove name part
	otherText = strings.ReplaceAll(otherText, "-", " ")
	otherText = strings.ReplaceAll(otherText, ",", "")

	matchesInName := 0
	matchesInOther := 0

	for _, w := range words {
		if strings.Contains(nameText, w) {
			matchesInName++
		} else if strings.Contains(otherText, w) {
			matchesInOther++
		}
	}

	// base weights
	weightName := 1.0
	weightOther := 0.2

	score := float64(matchesInName)*weightName + float64(matchesInOther)*weightOther

	// if all query words are found in name, give big bonus
	if matchesInName == len(words) {
		score += 10 // arbitrary big bonus to outrank any other recipe
	}

	return score
}

