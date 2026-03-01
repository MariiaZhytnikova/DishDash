package models

type IngredientWithStatus struct {
	Name     string  `json:"name"`
	Quantity float64 `json:"quantity"`
	Unit     string  `json:"unit"`
	Missing  bool    `json:"missing"`
}

type RecipeDetails struct {
	ID               int                     `json:"id"`
	Name             string                  `json:"name"`
	MealType         string                  `json:"mealType"`
	Description      string                  `json:"description"`
	DietType         []string               `json:"dietType"`
	Restrictions     []string               `json:"restrictions"`
	Time             int                    `json:"time"`
	Ingredients      []IngredientWithStatus  `json:"ingredients"`
	SummaryAvailable int                     `json:"available"`
	SummaryMissing   int                     `json:"missing"`
}
