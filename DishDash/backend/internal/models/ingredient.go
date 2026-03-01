package models

type Ingredient struct {
	Name       string  `json:"name"`
	Quantity   float64 `json:"quantity"`
	Unit       string  `json:"unit"`
	ExpiresAt string   `json:"expires_at"`
	Type      string   `json:"type,omitempty"` // "vegetable", "meat", "sauce", etc.
}
