package models

type Recipe struct {
	ID           int          `json:"id"`
	Name         string       `json:"name"`
	MealType     string       `json:"mealType"`
	MainType     string       `json:"mainType"`
	Country      string       `json:"country"`
	DietType     []string     `json:"dietType"`     // vegan, low-carb, high-protein
	Restrictions []string     `json:"restrictions"` // gluten-free, lactose-free, diabetic-friendly
	Ingredients  []Ingredient `json:"ingredients"`
	Steps        []string     `json:"steps"`
	Description  string       `json:"description"`
	Time         int          `json:"time"`
	ImageURL     string       `json:"imageUrl"`
}