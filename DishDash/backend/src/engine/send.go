package engine

import (
	"os"
	"net/smtp"
	"fmt"
)

func SendShoppingListEmail(to []string, subject, body string) error {

	from := os.Getenv("SMTP_FROM")
	user := os.Getenv("SMTP_USER")
	pass := os.Getenv("SMTP_PASS")
	host := os.Getenv("SMTP_HOST")
	addr := os.Getenv("SMTP_ADDR")

	if from == "" || user == "" || pass == "" || addr == "" || host == "" {
		return fmt.Errorf("SMTP config missing")
	}

	auth := smtp.PlainAuth("", user, pass, host)

	c, err := smtp.Dial(addr)
	if err != nil {
		return err
	}
	defer c.Close()

	tlsConfig := &tls.Config{
		ServerName:         host,
		InsecureSkipVerify: true, // ✅ IMPORTANT
	}

	if err = c.StartTLS(tlsConfig); err != nil {
		return err
	}

	if err = c.Auth(auth); err != nil {
		return err
	}

	if err = c.Mail(from); err != nil {
		return err
	}

	for _, addr := range to {
		if err = c.Rcpt(addr); err != nil {
			return err
		}
	}

	w, err := c.Data()
	if err != nil {
		return err
	}

	msg := (fmt.Sprintf(
		"From: %s\r\nTo: %s\r\nSubject: %s\r\n\r\n%s",
		from, to[0], subject, body,
	))

	_, err = w.Write([]byte(msg))
	if err != nil {
		return err
	}

	return w.Close()
}
