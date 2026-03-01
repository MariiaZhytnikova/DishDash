package models

type Fridge struct {
	Fresh  []Ingredient `json:"fresh"`
	Pantry []Ingredient `json:"pantry"`
	Rare   []Ingredient `json:"rare"`
}
 