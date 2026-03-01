package recipes

import (
	"context"
	
	"DishDash/internal/storage/json"
	"DishDash/internal/models"
)

type Service struct {
}

func NewService() *Service {
	return &Service{}
}

func (s *Service) ListRecipes(ctx context.Context) ([]models.Recipe, error) {
	return storage.LoadRecipes()
}

func (s *Service) AddRecipe(ctx context.Context, r models.Recipe) error {
	return storage.AddRecipe(r)
}