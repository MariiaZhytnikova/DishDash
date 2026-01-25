package main

import (
	"context"
	"fmt"

	"DishDash/backend/models"
	"DishDash/backend/storage"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

func (a *App) GetIngredients() ([]models.Ingredient, error) {
	return storage.LoadIngredients()
}

func (a *App) AddIngredient(name string, quantity int, unit string) error {
	list, err := storage.LoadIngredients()
	if err != nil {
		return err
	}

	list = append(list, models.Ingredient{
		Name:     name,
		Quantity: quantity,
		Unit:     unit,
	})

	return storage.SaveIngredients(list)
}