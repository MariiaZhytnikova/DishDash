package search

import (
	"bytes"
	"net/http"
	"net/http/httptest"
	"testing"

	"DishDash/internal/utils"
)

func setupSearchHandlerTest(t *testing.T) {
	t.Helper()
	tmp := t.TempDir()
	utils.SetDataDir(tmp)
}

func TestSearchHandler_OK(t *testing.T) {
	setupSearchHandlerTest(t)

	// save & restore real service
	orig := service
	defer func() { service = orig }()

	// use real service (no mock)
	service = NewService()

	req := httptest.NewRequest(
		http.MethodPost,
		"/search",
		bytes.NewBufferString(`{}`),
	)
	w := httptest.NewRecorder()

	SearchHandler(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", w.Code)
	}

	if ct := w.Header().Get("Content-Type"); ct != "application/json" {
		t.Fatalf("expected application/json, got %s", ct)
	}
}

func TestSearchHandler_MethodNotAllowed(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/search", nil)
	w := httptest.NewRecorder()

	SearchHandler(w, req)

	if w.Code != http.StatusMethodNotAllowed {
		t.Fatalf("expected 405, got %d", w.Code)
	}
}

func TestSearchHandler_InvalidBody(t *testing.T) {
	req := httptest.NewRequest(
		http.MethodPost,
		"/search",
		bytes.NewBufferString("{invalid"),
	)
	w := httptest.NewRecorder()

	SearchHandler(w, req)

	if w.Code != http.StatusBadRequest {
		t.Fatalf("expected 400, got %d", w.Code)
	}
}
