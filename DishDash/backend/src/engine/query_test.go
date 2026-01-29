package engine_test

import (
	"testing"

	"DishDash/src/engine"
	"DishDash/src/models"
)

func TestQueryScore_MultipleKeywords(t *testing.T) {
	r := models.Recipe{
		Name: "Spicy Chicken Soup",
		Description: "Hot and tasty",
	}

	score := engine.QueryScore(r, "chicken spicy soup")
	if score != 1.0 {
		t.Fatalf("expected 1.0, got %.2f", score)
	}
}
