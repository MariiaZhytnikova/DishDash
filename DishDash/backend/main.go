package main

import (
	"log"
	"net/http"
	"github.com/rs/cors"

	"DishDash/src/api"
)

func main() {
	mux := http.NewServeMux()

	mux.HandleFunc("/health", api.HealthHandler)

	mux.HandleFunc("/recipes", api.GetRecipesHandler)

	mux.HandleFunc("/fridge", api.GetFridgeHandler)
	mux.HandleFunc("/fridge/", api.GetFridgeSectionHandler)
	mux.HandleFunc("/fridge/add", api.AddPositionHandler)
	mux.HandleFunc("/fridge/remove", api.DeletePositionHandler)
	mux.HandleFunc("/fridge/increase", api.IncreaseHandler)
	mux.HandleFunc("/fridge/decrease", api.DecreaseHandler)

	mux.HandleFunc("/search", api.SearchHandler)

	mux.HandleFunc("/favorites/add", api.AddFavoriteHandler)
	mux.HandleFunc("/favorites/remove", api.RemoveFavoriteHandler)
	mux.HandleFunc("/favorites", api.ListFavoritesHandler)

	mux.HandleFunc("/shopping", api.ShoppingListHandler)
	mux.HandleFunc("/shopping/add", api.AddToShoppingHandler)
	mux.HandleFunc("/shopping/set", api.SetShoppingHandler)
	mux.HandleFunc("/shopping/remove", api.RemoveFromShoppingHandler)
	mux.HandleFunc("/shopping/clear", api.ClearShoppingHandler)

	c := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:5173"},
		AllowedMethods: []string{"GET", "POST", "OPTIONS"},
	})

	handler := c.Handler(mux)

	log.Println("Server started at :8080")
	log.Fatal(http.ListenAndServe(":8080", handler))
}
