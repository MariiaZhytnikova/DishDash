package shopping

import (
	"context"
	"fmt"

	"DishDash/internal/package/email"

	"DishDash/internal/storage/json"
	"DishDash/internal/models"
)

type Service struct{}

func NewService() *Service {
	return &Service{}
}

// ---- List management ----

func (s *Service) GetList(ctx context.Context) (models.ShoppingList, error) {
	return storage.LoadShoppingList()
}

func (s *Service) Add(ctx context.Context, ingredients ...models.Ingredient) error {
	return storage.AddToShopping(ingredients...)
}

func (s *Service) Set(ctx context.Context, ing models.Ingredient) error {
	if ing.Quantity <= 0 {
		return storage.RemoveFromShopping(ing.Name)
	}
	return storage.SetShoppingIngredient(ing)
}

func (s *Service) Remove(ctx context.Context, name string) error {
	return storage.RemoveFromShopping(name)
}

func (s *Service) Clear(ctx context.Context) error {
	return storage.ClearShopping()
}

// ---- Email sending ----

func (s *Service) SendEmail(ctx context.Context, to []string) error {
	list, err := storage.LoadShoppingList()
	if err != nil {
		return fmt.Errorf("failed to load shopping list: %w", err)
	}

	if len(list.Items) == 0 {
		return fmt.Errorf("shopping list is empty")
	}

	body := s.formatShoppingList(list)
	return email.Send(to, "Your DishDash Shopping List", body)
}

func (s *Service) formatShoppingList(list models.ShoppingList) string {
	body := "Your shopping list 🛒:\n\n"
	for _, ing := range list.Items {
		body += fmt.Sprintf("- %s: %g %s\n", ing.Name, ing.Quantity, ing.Unit)
	}
	body += "\nHappy cooking! 🍳\n"
	return body
}
