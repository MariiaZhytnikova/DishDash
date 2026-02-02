package models

type Ingredient struct {
	Name       string  `json:"name"`
	Quantity   float64 `json:"quantity"`
	Unit       string  `json:"unit"`
	ExpiresAt string  `json:"expires_at"`
}
