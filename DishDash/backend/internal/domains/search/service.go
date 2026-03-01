package search

import (
	"context"

	"DishDash/internal/models"
	"DishDash/internal/storage/json"
)

type Service struct{}

func NewService() *Service { return &Service{} }

func (s *Service) Search(ctx context.Context, req models.SearchRequest) ([]models.Suggestion, error) {
	recipes, err := storage.LoadRecipes()
	if err != nil {
		return nil, err
	}

	favorites, err := storage.LoadFavorites()
	if err != nil {
		return nil, err
	}

	var fridge models.Fridge
	if req.Fridge != nil {
		fridge = *req.Fridge
	} else {
		fridge, err = storage.LoadFridge()
		if err != nil {
			return nil, err
		}
	}

	// call the engine logic (pure functions)
	return SearchRecipes(recipes, fridge, favorites, req.Settings), nil
}
