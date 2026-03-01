package main

import (
	"os"
	"log"
	"net/http"
	"github.com/rs/cors"
	"github.com/joho/godotenv"

	"DishDash/internal/api"
	"DishDash/internal/domains/recipes"
	"DishDash/internal/domains/cooking"
	"DishDash/internal/domains/fridge"
	"DishDash/internal/domains/search"
	"DishDash/internal/domains/favorites"
	"DishDash/internal/domains/shopping"
	"DishDash/internal/utils"
)

func main() {

	err := godotenv.Load("../.env")
	if err != nil {
		log.Println("No .env file found")
	}

	utils.SetDataDir("./data")

	mux := http.NewServeMux()

	mux.HandleFunc("/health", api.HealthHandler)

	mux.HandleFunc("/recipes", recipes.GetRecipesHandler)
	mux.HandleFunc("/recipes/", cooking.GetCookHandler)

	mux.HandleFunc("/fridge", fridge.GetFridgeHandler)
	mux.HandleFunc("/fridge/", fridge.GetFridgeSectionHandler)
	mux.HandleFunc("/fridge/add", fridge.AddPositionHandler)
	mux.HandleFunc("/fridge/remove", fridge.DeletePositionHandler)
	mux.HandleFunc("/fridge/increase", fridge.IncreaseHandler)
	mux.HandleFunc("/fridge/decrease", fridge.DecreaseHandler)
	// mux.HandleFunc("/fridge/increase-list", fridge.IncreaseListHandler)
	// mux.HandleFunc("/fridge/decrease-list", fridge.DecreaseListHandler)

	mux.HandleFunc("/search", search.SearchHandler)

	mux.HandleFunc("/favorites/add", favorites.AddFavoriteHandler)
	mux.HandleFunc("/favorites/remove", favorites.RemoveFavoriteHandler)
	mux.HandleFunc("/favorites", favorites.ListFavoritesHandler)

	mux.HandleFunc("/shopping", shopping.ShoppingListHandler)
	mux.HandleFunc("/shopping/add", shopping.AddToShoppingHandler)
	mux.HandleFunc("/shopping/set", shopping.SetShoppingHandler)
	mux.HandleFunc("/shopping/remove", shopping.RemoveFromShoppingHandler)
	mux.HandleFunc("/shopping/clear", shopping.ClearShoppingHandler)
	mux.HandleFunc("/shopping/email", shopping.SendShoppingHandler)


	// authService := auth.NewService()
	// mux.Handle("/shopping", auth.JWTMiddleware(authService, http.HandlerFunc(ShoppingListHandler)))


	c := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:5173",
								"https://mariiazhytnikova.github.io",
								"https://mariiazhytnikova.github.io/DishDash", },
		AllowedMethods: []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders: []string{"Content-Type"},
	})

	handler := c.Handler(mux)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Println("Server started at :" + port)
	log.Fatal(http.ListenAndServe(":"+port, handler))
}
