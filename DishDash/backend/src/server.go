package main

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func main() {
	r := mux.NewRouter()

	// routes

	r.HandleFunc("/health", HealthHandler).Methods("GET")

	// CORS
    handler := cors.New(cors.Options{
        AllowedOrigins: []string{"http://localhost:5173"},
        AllowedMethods: []string{"GET", "POST", "PUT", "DELETE"},
        AllowedHeaders: []string{"Content-Type"},
    }).Handler(r)

	log.Println("API running on :8080")
	log.Fatal(http.ListenAndServe(":8080", r))
}
