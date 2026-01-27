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
	mux.HandleFunc("/fridge/add", api.AddPositionHandler)
	mux.HandleFunc("/fridge/remove", api.DeletePositionHandler)
	mux.HandleFunc("/fridge/increase", api.IncreaseHandler)
	mux.HandleFunc("/fridge/decrease", api.DecreaseHandler)
	mux.HandleFunc("/search", api.SearchHandler)
	mux.HandleFunc("/favorites/add", api.AddFavoriteHandler)
	mux.HandleFunc("/favorites/remove", api.RemoveFavoriteHandler)
	mux.HandleFunc("/favorites", api.ListFavoritesHandler)

	c := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:5173"},
		AllowedMethods: []string{"GET", "POST", "OPTIONS"},
	})

	handler := c.Handler(mux)

	log.Println("Server started at :8080")
	log.Fatal(http.ListenAndServe(":8080", handler))
}