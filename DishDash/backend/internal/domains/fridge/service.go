package fridge

import (
	"context"
	"fmt"
	"strings"

	"DishDash/internal/models"
	"DishDash/internal/storage/json"
	"DishDash/internal/utils"
)

type Service struct{}

func NewService() *Service {
	return &Service{}
}

// AddPosition adds an ingredient to a specific section
func (s *Service) AddPosition(ctx context.Context, section string, ing models.Ingredient) error {
	return storage.AddPosition(section, ing)
}

// DeletePosition removes an ingredient from a section
func (s *Service) DeletePosition(ctx context.Context, section, name string) error {
	return storage.DeletePosition(section, name)
}

// Increase quantity of an ingredient in a section
func (s *Service) Increase(ctx context.Context, section, name string, qty float64) error {
	return storage.Increase(section, name, qty)
}

// Decrease quantity of an ingredient in a section
func (s *Service) Decrease(ctx context.Context, section, name string, qty float64) error {
	return storage.Decrease(section, name, qty)
}

// IncreaseList increases multiple ingredients at once
func (s *Service) IncreaseList(ctx context.Context, list []models.Ingredient) error {
	return storage.IncreaseList(list)
}

// DecreaseList decreases multiple ingredients at once
func (s *Service) DecreaseList(ctx context.Context, list []models.Ingredient) error {
	return storage.DecreaseList(list)
}

// GetSection returns the section name and ingredient by name
func (s *Service) GetSection(ctx context.Context, name string) (section string, ing *models.Ingredient, err error) {
	fridge, err := s.GetFridge(ctx)
	if err != nil {
		return "", nil, err
	}

	normalized := utils.Normalize(name)

	for _, sec := range []struct {
		Name string
		List *[]models.Ingredient
	}{
		{"fresh", &fridge.Fresh},
		{"pantry", &fridge.Pantry},
		{"rare", &fridge.Rare},
	} {
		for i := range *sec.List {
			if utils.Normalize((*sec.List)[i].Name) == normalized {
				return sec.Name, &(*sec.List)[i], nil
			}
		}
	}

	return "", nil, fmt.Errorf("ingredient not found: %s", name)
}

// GetFridge returns the full fridge
func (s *Service) GetFridge(ctx context.Context) (models.Fridge, error) {
	return storage.LoadFridge()
}

// GetFridgeSection returns all ingredients from a specific section
func (s *Service) GetFridgeSection(ctx context.Context, section string) ([]models.Ingredient, error) {
	fridge, err := s.GetFridge(ctx)
	if err != nil {
		return nil, err
	}

	switch strings.ToLower(section) {
	case "fresh":
		return fridge.Fresh, nil
	case "pantry":
		return fridge.Pantry, nil
	case "rare":
		return fridge.Rare, nil
	default:
		return nil, fmt.Errorf("unknown section: %s", section)
	}
}
