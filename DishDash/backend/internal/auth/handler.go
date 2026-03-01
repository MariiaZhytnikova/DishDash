package auth

import (
	"encoding/json"
	"net/http"
)

var users = map[string]struct {
	ID       int
	Password string
}{
	"alice": {ID: 1, Password: "pass123"}, // example only
}

func LoginHandler(s *Service) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req struct {
			Username string `json:"username"`
			Password string `json:"password"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "invalid body", http.StatusBadRequest)
			return
		}

		user, ok := users[req.Username]
		if !ok || user.Password != req.Password {
			http.Error(w, "invalid credentials", http.StatusUnauthorized)
			return
		}

		token, _ := s.GenerateToken(user.ID)
		json.NewEncoder(w).Encode(map[string]string{"token": token})
	}
}
