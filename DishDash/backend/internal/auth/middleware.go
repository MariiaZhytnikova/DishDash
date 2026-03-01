package auth

import (
	"context"
	"net/http"
	"strings"
)

type key string

const UserKey key = "user_id"

func JWTMiddleware(s *Service, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "missing authorization", http.StatusUnauthorized)
			return
		}

		parts := strings.Split(authHeader, "Bearer ")
		if len(parts) != 2 {
			http.Error(w, "invalid token format", http.StatusUnauthorized)
			return
		}

		claims, err := s.VerifyToken(parts[1])
		if err != nil {
			http.Error(w, "invalid token", http.StatusUnauthorized)
			return
		}

		ctx := context.WithValue(r.Context(), UserKey, claims.UserID)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
