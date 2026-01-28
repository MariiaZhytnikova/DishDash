package main

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

func main() {
	r := mux.NewRouter()

	log.Println("API running on :8080")
	log.Fatal(http.ListenAndServe(":8080", r))
}
