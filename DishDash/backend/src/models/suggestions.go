package models

type Suggestion struct {
	Recipe             Recipe
	MatchScore         float64
	FinalScore         float64
	MissingIngredients []Ingredient
	IsFavorite         bool
}