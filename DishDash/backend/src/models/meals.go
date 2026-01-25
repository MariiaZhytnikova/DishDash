package models

type RecipeResponse struct {
    Meals []Meal `json:"meals"`
}

type Meal struct {
    ID          string `json:"idMeal"`
    Name        string `json:"strMeal"`
    Category    string `json:"strCategory"`
    Area        string `json:"strArea"`
    Instructions string `json:"strInstructions"`
    Image       string `json:"strMealThumb"`
}
