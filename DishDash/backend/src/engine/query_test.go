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

	expected := 13.0

	if score != expected {
		t.Fatalf("expected %.2f, got %.2f", expected, score)
	}
}
