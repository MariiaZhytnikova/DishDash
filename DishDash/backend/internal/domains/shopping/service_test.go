package shopping_test

import (
	"context"
	"testing"

	"DishDash/internal/domains/shopping"
	"DishDash/internal/models"
	"DishDash/internal/package/email"
)

func TestShoppingService_ListManagement(t *testing.T) {
	setupShoppingTest(t)

	svc := shopping.NewService()
	ctx := context.Background()

	// initially empty
	list, err := svc.GetList(ctx)
	if err != nil {
		t.Fatalf("GetList failed: %v", err)
	}
	if len(list.Items) != 0 {
		t.Fatalf("expected empty list, got %v", list.Items)
	}

	// Add ingredient
	ing := models.Ingredient{Name: "Tomato", Quantity: 2, Unit: "pcs"}
	if err := svc.Add(ctx, ing); err != nil {
		t.Fatalf("Add failed: %v", err)
	}

	list, _ = svc.GetList(ctx)
	if len(list.Items) != 1 || list.Items[0].Name != "Tomato" {
		t.Fatalf("ingredient not added correctly: %v", list.Items)
	}

	// Set ingredient quantity
	ing.Quantity = 5
	if err := svc.Set(ctx, ing); err != nil {
		t.Fatalf("Set failed: %v", err)
	}

	list, _ = svc.GetList(ctx)
	if list.Items[0].Quantity != 5 {
		t.Fatalf("quantity not updated, got %v", list.Items[0].Quantity)
	}

	// Remove ingredient
	if err := svc.Remove(ctx, "Tomato"); err != nil {
		t.Fatalf("Remove failed: %v", err)
	}

	list, _ = svc.GetList(ctx)
	if len(list.Items) != 0 {
		t.Fatalf("ingredient not removed: %v", list.Items)
	}

	// Clear list
	_ = svc.Add(ctx, models.Ingredient{Name: "Apple", Quantity: 3, Unit: "pcs"})
	if err := svc.Clear(ctx); err != nil {
		t.Fatalf("Clear failed: %v", err)
	}
	list, _ = svc.GetList(ctx)
	if len(list.Items) != 0 {
		t.Fatalf("list not cleared: %v", list.Items)
	}
}

func TestShoppingService_SendEmail(t *testing.T) {
	setupShoppingTest(t)

	svc := shopping.NewService()
	ctx := context.Background()

	sent := struct {
		To   []string
		Body string
	}{}

	// override email.Send
	original := email.Send
	defer func() { email.Send = original }()
	email.Send = func(to []string, subject, body string) error {
		sent.To = to
		sent.Body = body
		return nil
	}

	// empty list -> should fail
	if err := svc.SendEmail(ctx, []string{"test@example.com"}); err == nil {
		t.Fatal("expected error sending email for empty list")
	}

	// add item
	_ = svc.Add(ctx, models.Ingredient{Name: "Cheese", Quantity: 1, Unit: "kg"})

	// send email
	if err := svc.SendEmail(ctx, []string{"test@example.com"}); err != nil {
		t.Fatalf("SendEmail failed: %v", err)
	}

	if len(sent.To) != 1 || sent.To[0] != "test@example.com" {
		t.Fatalf("email sent to wrong recipient: %v", sent.To)
	}

	expectedBody := "Your shopping list 🛒:\n\n- Cheese: 1 kg\n\nHappy cooking! 🍳\n"
	if sent.Body != expectedBody {
		t.Fatalf("email body incorrect:\nexpected:\n%s\nactual:\n%s", expectedBody, sent.Body)
	}
}
