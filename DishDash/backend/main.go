package main

import (
	"os"
	"log"
	"net/http"
	"github.com/rs/cors"

	"DishDash/src/api"
	"DishDash/src/utils"
)

func main() {

	utils.SetDataDir("./data")

	mux := http.NewServeMux()

	mux.HandleFunc("/health", api.HealthHandler)

	mux.HandleFunc("/recipes", api.GetRecipesHandler)
	mux.HandleFunc("/recipes/", api.GetCookHandler)

	mux.HandleFunc("/fridge", api.GetFridgeHandler)
	mux.HandleFunc("/fridge/", api.GetFridgeSectionHandler)
	mux.HandleFunc("/fridge/add", api.AddPositionHandler)
	mux.HandleFunc("/fridge/remove", api.DeletePositionHandler)
	mux.HandleFunc("/fridge/increase", api.IncreaseHandler)
	mux.HandleFunc("/fridge/decrease", api.DecreaseHandler)
	mux.HandleFunc("/fridge/increase-list", api.IncreaseListHandler)
	mux.HandleFunc("/fridge/decrease-list", api.DecreaseListHandler)

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
		AllowedOrigins: []string{"http://localhost:5173",
								"https://mariiazhytnikova.github.io", },
		AllowedMethods: []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders: []string{"Content-Type"},
	})

	handler := c.Handler(mux)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Println("Server started at :8080")
	log.Fatal(http.ListenAndServe(":8080", handler))
}
