package engine_test

import (
	"testing"

	"DishDash/src/engine"
	"DishDash/src/models"
)

func TestFilterRecipes(t *testing.T) {
	recipes := []models.Recipe{
		{
			ID: 1, Name: "Salad", Description: "Fresh veggie salad",
			MealType: "lunch", MainType: "vegetarian", DietType: []string{"vegan"}, Restrictions: []string{"nuts"},
		},
		{
			ID: 2, Name: "Chicken Soup", Description: "Warm chicken soup",
			MealType: "dinner", MainType: "meat", DietType: []string{}, Restrictions: []string{},
		},
		{
			ID: 3, Name: "Vegan Pie", Description: "Delicious pie",
			MealType: "dessert", MainType: "vegan", DietType: []string{"vegan"}, Restrictions: []string{},
		},
	}

	tests := []struct {
		name     string
		settings models.FilterSettings
		wantIDs  []int
	}{
		{
			name:     "filter by mealType",
			settings: models.FilterSettings{MealType: "lunch"},
			wantIDs:  []int{1},
		},
		{
			name:     "filter by mainType",
			settings: models.FilterSettings{MainType: "vegan"},
			wantIDs:  []int{3},
		},
		{
			name:     "filter by query in name",
			settings: models.FilterSettings{Query: "pie"},
			wantIDs:  []int{3},
		},
		{
			name:     "filter by query in description",
			settings: models.FilterSettings{Query: "veggie"},
			wantIDs:  []int{1},
		},
		{
			name:     "filter by dietType",
			settings: models.FilterSettings{DietType: []string{"vegan"}},
			wantIDs:  []int{1, 3},
		},
		{
			name:     "filter by restriction",
			settings: models.FilterSettings{Restrictions: []string{"nuts"}},
			wantIDs:  []int{2, 3},
		},
		{
			name:     "filter by multiple settings",
			settings: models.FilterSettings{MealType: "dessert", DietType: []string{"vegan"}},
			wantIDs:  []int{3},
		},
		{
			name:     "no match",
			settings: models.FilterSettings{MealType: "breakfast"},
			wantIDs:  []int{},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := engine.FilterRecipes(recipes, tt.settings)
			if len(got) != len(tt.wantIDs) {
				t.Fatalf("expected %d recipes, got %d", len(tt.wantIDs), len(got))
			}

			for i, r := range got {
				if r.ID != tt.wantIDs[i] {
					t.Errorf("expected recipe ID %d, got %d", tt.wantIDs[i], r.ID)
				}
			}
		})
	}
}
