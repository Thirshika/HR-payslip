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

    @patch('email_service.requests.post')
    def test_send_email_uses_brevo_provider_with_api_payload(self, mock_post):
        os.environ["EMAIL_PROVIDER"] = "brevo"
        os.environ["BREVO_API_KEY"] = "test-brevo-key"
        os.environ["EMAIL_FROM"] = "TATTI HR Department <pr.tatti2026@gmail.com>"
        os.environ["EMAIL_FROM_NAME"] = "TATTI HR Department"
        os.environ["EMAIL_USER"] = "pr.tatti2026@gmail.com"
        os.environ["EMAIL_PASS"] = "not-used"

        mock_response = unittest.mock.Mock()
        mock_response.status_code = 202
        mock_response.text = 'Accepted'
        mock_post.return_value = mock_response

        service = EmailService()
        result = service.send_email(
            "employee@example.com",
            "Payslip Test",
            "Please find attached",
            "<p>Please find attached</p>",
            attachments=[{
                'filename': 'Payslip_test.pdf',
                'content': b'PDFBYTES'
            }]
        )

        self.assertTrue(result["success"])
        self.assertEqual(result["provider"], "brevo")
        self.assertEqual(result["email"], "employee@example.com")
        mock_post.assert_called_once()
        payload = json.loads(mock_post.call_args.kwargs['data'])
        self.assertEqual(payload['sender']['name'], 'TATTI HR Department')
        self.assertEqual(payload['sender']['email'], 'pr.tatti2026@gmail.com')
        self.assertEqual(payload['to'][0]['email'], 'employee@example.com')
        self.assertEqual(payload['subject'], 'Payslip Test')
        self.assertIn('attachment', payload)
        self.assertEqual(payload['attachment'][0]['name'], 'Payslip_test.pdf')


if __name__ == "__main__":
    unittest.main()
