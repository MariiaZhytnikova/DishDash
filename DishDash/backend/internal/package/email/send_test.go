package email_test

import (
    "testing"
    "DishDash/internal/package/email"
)

func TestSendMock(t *testing.T) {
    // override email.Send with a mock
    original := email.Send
    defer func() { email.Send = original }()

    email.Send = func(to []string, subject, body string) error {
        if len(to) == 0 {
            t.Fatal("no recipient")
        }
        if subject == "" || body == "" {
            t.Fatal("empty subject or body")
        }
        return nil
    }

    // call the mocked Send
    err := email.Send([]string{"recipient@example.com"}, "Test subject", "Hello body")
    if err != nil {
        t.Errorf("mock send failed: %v", err)
    }
}
