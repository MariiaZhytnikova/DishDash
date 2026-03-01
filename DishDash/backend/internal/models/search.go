package models

type FilterSettings struct {
	Query        string   `json:"query"`
	MealType     string   `json:"mealType"`
	MainType     string   `json:"mainType"`
	DietType     []string `json:"dietType"`
	Restrictions []string `json:"restrictions"`
	Country      []string `json:"country"`
}

type Suggestion struct {
	Recipe             Recipe
	MatchScore         float64
	FinalScore         float64
	MissingIngredients []Ingredient
	IsFavorite         bool
}

type SearchRequest struct {
    Fridge   *Fridge        `json:"fridge,omitempty"`
    Settings FilterSettings `json:"settings"`
}