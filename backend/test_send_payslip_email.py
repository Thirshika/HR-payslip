import os
import sys
import unittest
from unittest.mock import patch

sys.path.insert(0, os.path.dirname(__file__))

try:
    from backend.main import app
except Exception:
    from main import app

from fastapi.testclient import TestClient


class SendPayslipEmailTests(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    @patch('backend.main.get_email_service')
    def test_send_payslip_email_returns_400_on_failure(self, mock_get_email_service):
        mock_service = unittest.mock.Mock()
        mock_service.send_payslip_email.return_value = {
            'success': False,
            'error': 'Brevo SMTP account is not activated',
        }
        mock_get_email_service.return_value = mock_service

        payload = {
            'empId': 'TEST001',
            'month': 'January 2024',
            'employee': {
                'id': 'TEST001',
                'name': 'Test User',
                'org': 'HR Test Organization',
                'branch': 'Test Branch',
                'designation': 'Test Designation',
                'email': 'test@example.com',
                'phone': '1234567890'
            },
            'payroll': {
                'month': 'January 2024',
                'gross': 50000.00,
                'netPayable': 45000.00,
                'paidAmount': 45000.00,
                'balanceAmount': 0.00
            }
        }

        response = self.client.post('/api/send-payslip-email', json=payload)

        self.assertEqual(response.status_code, 400)
        data = response.json()
        self.assertFalse(data.get('success'))
        self.assertEqual(data.get('status'), 'failed')
        self.assertEqual(data.get('error'), 'Brevo SMTP account is not activated')

    @patch('backend.main.get_email_service')
    def test_send_payslip_email_returns_200_on_success(self, mock_get_email_service):
        mock_service = unittest.mock.Mock()
        mock_service.send_payslip_email.return_value = {
            'success': True,
            'message': 'Email sent successfully via Brevo',
        }
        mock_get_email_service.return_value = mock_service

        payload = {
            'empId': 'TEST001',
            'month': 'January 2024',
            'employee': {
                'id': 'TEST001',
                'name': 'Test User',
                'org': 'HR Test Organization',
                'branch': 'Test Branch',
                'designation': 'Test Designation',
                'email': 'test@example.com',
                'phone': '1234567890'
            },
            'payroll': {
                'month': 'January 2024',
                'gross': 50000.00,
                'netPayable': 45000.00,
                'paidAmount': 45000.00,
                'balanceAmount': 0.00
            }
        }

        response = self.client.post('/api/send-payslip-email', json=payload)

        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data.get('success'))
        self.assertEqual(data.get('status'), 'sent')
        self.assertEqual(data.get('message'), 'Email sent successfully via Brevo')


if __name__ == '__main__':
    unittest.main()
