package models

type FilterSettings struct {
	Query        string   `json:"query"`
	MealType     string   `json:"mealType"`
	MainType     string   `json:"mainType"`
	DietType     []string `json:"dietType"`
	Restrictions []string `json:"restrictions"`
	Country      []string `json:"country"`
}
