package utils

import (
	"strings"

	"DishDash/src/models"
)


func Normalize(s string) string {
	s = strings.ToLower(strings.TrimSpace(s))
	if strings.HasSuffix(s, "s") {
		s = strings.TrimSuffix(s, "s")
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

// check name + quantity
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

