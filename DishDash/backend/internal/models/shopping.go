package models

type ShoppingList struct {
	Items []Ingredient `json:"items"`
}

type SendShoppingRequest struct {
	Email string `json:"email"`
}

