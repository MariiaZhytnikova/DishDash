package models

type Ingredient struct {
  Name     string `json:"name"`
  Quantity int    `json:"quantity"`
  Unit     string `json:"unit"`
}

type FridgeIngredient struct {
  Ingredient
  ExpiresAt string `json:"expiresAt"` // ISO date format
}