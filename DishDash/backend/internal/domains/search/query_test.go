package search_test

import (
	"testing"

	"DishDash/internal/models"
	"DishDash/internal/domains/search"
)

func TestQueryScore_MultipleKeywords(t *testing.T) {
	r := models.Recipe{
		Name: "Spicy Chicken Soup",
		Description: "Hot and tasty",
	}

	score := search.QueryScore(r, "chicken spicy soup")

	expected := 13.0

	if score != expected {
		t.Fatalf("expected %.2f, got %.2f", expected, score)
	}
}
