package favorites

import (
	"context"

	"DishDash/internal/storage/json"
	"DishDash/internal/models"
)

type Service struct{}

func NewService() *Service {
	return &Service{}
}

func (s *Service) List(ctx context.Context) ([]models.Favorite, error) {
	return storage.LoadFavorites()
}

func (s *Service) Add(ctx context.Context, fav models.Favorite) error {
	return storage.AddFavorite(fav)
}

func (s *Service) Remove(ctx context.Context, id int) error {
	return storage.RemoveFavorite(id)
}
