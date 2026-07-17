import os
import sys
import json
import unittest
from unittest.mock import patch

sys.path.insert(0, os.path.dirname(__file__))

from email_service import EmailService, EmailServiceConfig


class EmailServiceFallbackTests(unittest.TestCase):
    def test_mock_provider_does_not_require_smtp_credentials(self):
        os.environ["EMAIL_PROVIDER"] = "mock"
        os.environ.pop("EMAIL_USER", None)
        os.environ.pop("EMAIL_PASS", None)

        config = EmailServiceConfig()
        self.assertTrue(config.validate())

    def test_send_email_falls_back_to_simulated_delivery_when_smtp_unavailable(self):
        os.environ["EMAIL_PROVIDER"] = "mock"
        os.environ.pop("EMAIL_USER", None)
        os.environ.pop("EMAIL_PASS", None)

        service = EmailService()
        result = service.send_email("test@example.com", "Subject", "Body", "<p>Body</p>")

        self.assertTrue(result["success"])
        self.assertEqual(result.get("mode"), "simulated")

    @patch('email_service.EmailService._initialize_transporter')
    def test_send_email_returns_error_when_smtp_initialization_fails(self, mock_init):
        os.environ["EMAIL_PROVIDER"] = "smtp"
        os.environ["EMAIL_USER"] = "pr.tatti2026@gmail.com"
        os.environ["EMAIL_PASS"] = "bad-password"
        os.environ["EMAIL_FROM"] = "HR Department <pr.tatti2026@gmail.com>"
        os.environ["EMAIL_FROM_NAME"] = "HR Department"

        mock_init.return_value = False

        service = EmailService()
        service.last_smtp_error = "SMTP authentication failed"

        result = service.send_email(
            "employee@example.com",
            "Payslip Test",
            "Please find attached",
            "<p>Please find attached</p>",
        )

        self.assertFalse(result["success"])
        self.assertIn("SMTP authentication failed", result["error"])
        self.assertEqual(result["email"], "employee@example.com")


if __name__ == "__main__":
    unittest.main()
