package main

import (
	"encoding/json"
	"net/http"
)

func main() {
	http.HandleFunc("/api/hello", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		json.NewEncoder(w).Encode(map[string]string{
			"message": "hello from backend",
		})
	})

	http.ListenAndServe(":8080", nil)
}