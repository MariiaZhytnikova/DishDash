package utils

import (
	"strings"

	"DishDash/internal/models"
)

func Normalize(s string) string {
	s = strings.ToLower(strings.TrimSpace(s))

	if strings.HasSuffix(s, "ies") {
		return strings.TrimSuffix(s, "ies") + "y"
	}

	if strings.HasSuffix(s, "oes") {
		return strings.TrimSuffix(s, "oes") + "o"
	}

	if strings.HasSuffix(s, "s") {
		return strings.TrimSuffix(s, "s")
	}

	return s
}

func HasIngredientByName(list []models.Ingredient, name string) bool {
	for _, f := range list {
		if Normalize(f.Name) == Normalize(name) {
			return true
		}
	}
	return false
}

func HasIngredient(fridge []models.Ingredient, ing models.Ingredient) bool {
	for _, f := range fridge {
		if Normalize(f.Name) == Normalize(ing.Name) &&
			f.Quantity >= ing.Quantity {
			return true
		}
	}
	return false
}

func IsFavorite(id int, favs []models.Favorite) bool {
	for _, f := range favs {
		if f.ID == id {
			return true
		}
	}
	return false
}

func Contains(list []string, item string) bool {
	item = strings.ToLower(item)
	for _, v := range list {
		if strings.ToLower(v) == item {
			return true
		}
	}
	return false
}

