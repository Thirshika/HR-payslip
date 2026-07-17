"""
Email Service Module
Handles SMTP configuration, PDF generation, and email sending.

This version is rewritten to satisfy Render/Gmail SMTP requirements by:
- Using SMTP(host, port, timeout=30)
- Calling ehlo(), starttls(), ehlo() again, then login
- Parsing EMAIL_FROM safely when it contains a display name
- Closing SMTP connections after send
- Writing full traceback logs with logger.exception()
- Returning actual SMTP errors in API responses
- Preventing invalid transporter reuse after failures
"""

import os
import smtplib
import logging
import base64
import json
import traceback
import requests
import socket
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
from email.utils import formataddr, parseaddr
from datetime import datetime
import uuid

try:
    from weasyprint import HTML, CSS
    HAS_WEASYPRINT = True
except ImportError:
    HTML = None
    CSS = None
    HAS_WEASYPRINT = False

logger = logging.getLogger(__name__)

class EmailServiceConfig:
    """Email service configuration from environment variables."""

    def __init__(self):
        self.smtp_host = os.getenv('EMAIL_HOST', 'smtp.gmail.com')
        self.smtp_port = int(os.getenv('EMAIL_PORT', 587))
        self.smtp_secure = os.getenv('EMAIL_SECURE', 'false').lower() == 'true'
        self.email_user = os.getenv('EMAIL_USER')
        self.email_pass = os.getenv('EMAIL_PASS')
        self.email_from_name = os.getenv('EMAIL_FROM_NAME', 'HR Department')
        self.email_from = os.getenv('EMAIL_FROM') or self.email_user
        self.email_reply_to = os.getenv('EMAIL_REPLY_TO') or self.email_from
        self.email_provider = os.getenv('EMAIL_PROVIDER', '').lower()
        self.sendgrid_api_key = os.getenv('SENDGRID_API_KEY')
        self.resend_api_key = os.getenv('RESEND_API_KEY')

    def validate(self):
        """Validate required email configuration.

        SMTP credentials are only required when the app is using real SMTP.
        If the provider is mocked or disabled, delivery can proceed without
        credentials and will be simulated locally.
        """
        if self.email_provider in {'mock', 'simulate', 'disabled'}:
            return True

        if not self.email_user or not self.email_pass:
            logger.warning(
                "SMTP credentials are missing; email delivery will be simulated"
            )
            return True
        return True


class EmailService:
    """Email service for sending payslips and managing SMTP/SendGrid delivery."""

    def __init__(self):
        self.config = EmailServiceConfig()
        try:
            self.config.validate()
        except Exception as exc:
            logger.warning("Email configuration validation skipped: %s", exc)
        self.transporter = None
        self.last_smtp_error = None
        self._initialize_transporter()

    def _parse_address(self, address):
        """Parse a raw email address string safely."""
        name, email = parseaddr(address or '')
        return name.strip(), email.strip()

    def _format_from_header(self):
        """Construct a safe From header using parseaddr/formataddr."""
        name, email = self._parse_address(self.config.email_from)
        if not email:
            name, email = self._parse_address(self.config.email_user or '')
        if not name:
            name = self.config.email_from_name
        if email:
            return formataddr((name, email))
        return self.config.email_from_name

    def _get_message_id_domain(self):
        """Get a safe domain for the Message-ID from configured addresses."""
        _, email = self._parse_address(self.config.email_from)
        if not email:
            _, email = self._parse_address(self.config.email_user or '')
        if email and '@' in email:
            return email.split('@', 1)[1]
        return 'localhost'

    def _close_transporter(self):
        """Close and dispose of any active SMTP transporter."""
        if self.transporter == 'simulated':
            self.transporter = None
            return

        if self.transporter:
            try:
                # always attempt graceful shutdown
                try:
                    self.transporter.quit()
                except Exception:
                    # some transports (e.g. mocks) may not implement quit
                    logger.exception("Error while calling quit() on transporter")
                logger.debug("SMTP transporter closed cleanly")
            except Exception:
                logger.exception("Error while closing SMTP transporter")
            finally:
                self.transporter = None

    def _initialize_transporter(self):
        """Initialize SMTP transporter with explicit STARTTLS or SSL flow."""
        self.last_smtp_error = None
        self._close_transporter()

        if self.config.email_provider == 'resend':
            logger.info("Using Resend provider; skipping SMTP initialization")
            self.transporter = 'resend'
            return True

        if self.config.email_provider in {'mock', 'simulate', 'disabled'}:
            logger.info("Email provider is %s; skipping SMTP initialization", self.config.email_provider)
            self.transporter = 'simulated'
            return True

        # Detailed diagnostics prior to SMTP creation
        host = self.config.smtp_host
        port = self.config.smtp_port
        secure = self.config.smtp_secure

        logger.info("SMTP init: host=%s port=%s secure=%s provider=%s", host, port, secure, self.config.email_provider)

        # DNS resolution
        try:
            logger.debug("Resolving SMTP host %s", host)
            infos = socket.getaddrinfo(host, port, proto=socket.IPPROTO_TCP)
            logger.debug("DNS resolution for %s succeeded: %s", host, [i[4][0] for i in infos])
        except socket.gaierror as e:
            err = f"DNS resolution failed for {host}: {e}"
            self.last_smtp_error = err
            logger.exception(err)
            self._close_transporter()
            return False
        except Exception:
            err = f"Unexpected DNS resolution error for {host}: {traceback.format_exc()}"
            self.last_smtp_error = err
            logger.exception(err)
            self._close_transporter()
            return False

        # TCP connectivity test
        try:
            logger.debug("Testing TCP connectivity to %s:%s", host, port)
            sock = socket.create_connection((host, port), timeout=10)
            sock.close()
            logger.debug("TCP connectivity to %s:%s OK", host, port)
        except socket.timeout as e:
            err = f"Connection to {host}:{port} timed out: {e}"
            self.last_smtp_error = err
            logger.exception(err)
            self._close_transporter()
            return False
        except OSError as e:
            # Distinguish common OS errors
            if getattr(e, 'errno', None) == 101:
                err = f"Network unreachable when connecting to {host}:{port}: {e}"
            else:
                err = f"OS error when connecting to {host}:{port}: {e}"
            self.last_smtp_error = err
            logger.exception(err)
            self._close_transporter()
            return False
        except Exception:
            err = f"Unexpected error testing TCP to {host}:{port}: {traceback.format_exc()}"
            self.last_smtp_error = err
            logger.exception(err)
            self._close_transporter()
            return False

        # Create SMTP client and perform STARTTLS/login sequence with detailed errors
        try:
            if secure:
                logger.debug("Creating SMTP_SSL transport to %s:%s", host, port)
                smtp = smtplib.SMTP_SSL(host, port, timeout=30)
                logger.debug("SMTP SSL transporter created")
            else:
                logger.debug("Creating SMTP transport to %s:%s", host, port)
                smtp = smtplib.SMTP(host, port, timeout=30)
                logger.debug("SMTP instance created; sending EHLO")
                smtp.ehlo()

                logger.debug("Attempting STARTTLS")
                try:
                    smtp.starttls()
                    smtp.ehlo()
                    logger.debug("STARTTLS completed successfully")
                except smtplib.SMTPException as e:
                    err = f"STARTTLS failed for {host}:{port}: {e}"
                    self.last_smtp_error = err
                    logger.exception(err)
                    try:
                        smtp.quit()
                    except Exception:
                        logger.debug("Error while quitting SMTP after STARTTLS failure")
                    self._close_transporter()
                    return False

            # Login
            try:
                smtp.login(self.config.email_user, self.config.email_pass)
                logger.info("SMTP login succeeded for user %s", self.config.email_user)
            except smtplib.SMTPAuthenticationError as e:
                err = f"SMTP authentication failed for user {self.config.email_user}: {e}"
                self.last_smtp_error = err
                logger.exception(err)
                try:
                    smtp.quit()
                except Exception:
                    logger.debug("Error while quitting SMTP after auth failure")
                self._close_transporter()
                return False
            except Exception as e:
                err = f"Unexpected error during SMTP login: {traceback.format_exc()}"
                self.last_smtp_error = err
                logger.exception(err)
                try:
                    smtp.quit()
                except Exception:
                    logger.debug("Error while quitting SMTP after login exception")
                self._close_transporter()
                return False

            # Success
            self.transporter = smtp
            return True
        except Exception:
            self.last_smtp_error = traceback.format_exc()
            logger.exception("Unexpected error during SMTP initialization: %s", self.last_smtp_error)
            self._close_transporter()
            return False

    def generate_payslip_html(self, employee, payroll):
        """Generate HTML content for the payslip."""
        html = f"""
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Payslip - {employee.get('name', 'Employee')} - {payroll.get('month', '')}</title>
  <style>
    body {{
      font-family: 'Arial', sans-serif;
      margin: 0;
      padding: 20px;
      background: #f5f5f5;
    }}
    .payslip {{
      max-width: 800px;
      margin: 0 auto;
      background: white;
      padding: 40px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }}
    .header {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 3px solid #0d1b2a;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }}
    .company-name {{
      font-size: 24px;
      font-weight: bold;
      color: #0d1b2a;
    }}
    .payslip-title {{
      font-size: 18px;
      color: #e8a832;
      font-weight: bold;
    }}
    .employee-info {{
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 30px;
    }}
    .info-group {{
      margin-bottom: 10px;
    }}
    .label {{
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
    }}
    .value {{
      font-size: 14px;
      color: #0d1b2a;
      font-weight: 500;
    }}
    .salary-details {{
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
    }}
    .salary-row {{
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #e0e0e0;
    }}
    .salary-row:last-child {{
      border-bottom: none;
    }}
    .salary-row.total {{
      font-weight: bold;
      font-size: 16px;
      border-top: 2px solid #0d1b2a;
      margin-top: 10px;
      padding-top: 15px;
    }}
    .footer {{
      text-align: center;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
      color: #666;
      font-size: 12px;
    }}
  </style>
</head>
<body>
  <div class="payslip">
    <div class="header">
      <div class="company-name">{employee.get('org', 'Organization')}</div>
      <div class="payslip-title">PAYSLIP</div>
    </div>
    <div class="employee-info">
      <div>
        <div class="info-group">
          <div class="label">Employee ID</div>
          <div class="value">{employee.get('id', '')}</div>
        </div>
        <div class="info-group">
          <div class="label">Employee Name</div>
          <div class="value">{employee.get('name', '')}</div>
        </div>
        <div class="info-group">
          <div class="label">Designation</div>
          <div class="value">{employee.get('designation', '')}</div>
        </div>
      </div>
      <div>
        <div class="info-group">
          <div class="label">Branch</div>
          <div class="value">{employee.get('branch', '')}</div>
        </div>
        <div class="info-group">
          <div class="label">Email</div>
          <div class="value">{employee.get('email', '')}</div>
        </div>
        <div class="info-group">
          <div class="label">Pay Period</div>
          <div class="value">{payroll.get('month', '')}</div>
        </div>
      </div>
    </div>
    <div class="salary-details">
      <div class="salary-row">
        <span>Gross Salary</span>
        <span>₹{payroll.get('gross', 0):.2f}</span>
      </div>
      <div class="salary-row">
        <span>Net Payable</span>
        <span>₹{payroll.get('netPayable', 0):.2f}</span>
      </div>
      <div class="salary-row">
        <span>Paid Amount</span>
        <span>₹{payroll.get('paidAmount', 0):.2f}</span>
      </div>
      <div class="salary-row total">
        <span>Balance Amount</span>
        <span>₹{payroll.get('balanceAmount', 0):.2f}</span>
      </div>
    </div>
    <div class="footer">
      <p>This is a computer-generated payslip. For any queries, please contact HR department.</p>
      <p>Generated on: {datetime.now().strftime('%Y-%m-%d')}</p>
    </div>
  </div>
</body>
</html>
        """
        return html

    def generate_pdf(self, html_content, filename):
        """Generate PDF from HTML using WeasyPrint."""
        try:
            if HTML is None:
                logger.warning("WeasyPrint not available, skipping PDF generation")
                return None

            pdf = HTML(string=html_content).write_pdf()
            return pdf
        except Exception:
            logger.exception("Error generating PDF")
            return None

    def _send_via_sendgrid(self, to_email, subject, body_text, body_html, attachments=None):
        """Send email via SendGrid HTTP API as a fallback."""
        if not self.config.sendgrid_api_key:
            return {'success': False, 'error': 'SENDGRID_API_KEY not configured', 'email': to_email}

        url = 'https://api.sendgrid.com/v3/mail/send'
        headers = {
            'Authorization': f'Bearer {self.config.sendgrid_api_key}',
            'Content-Type': 'application/json'
        }

        personalizations = [{
            'to': [{'email': to_email}],
            'subject': subject
        }]

        from_email = {
            'email': self.config.email_from or self.config.email_user,
            'name': self.config.email_from_name
        }

        content = [
            {'type': 'text/plain', 'value': body_text},
            {'type': 'text/html', 'value': body_html}
        ]

        data = {
            'personalizations': personalizations,
            'from': from_email,
            'content': content
        }

        if attachments:
            sg_attachments = []
            for att in attachments:
                fname = att.get('filename', 'attachment')
                content_bytes = att.get('content')
                if content_bytes:
                    b64 = base64.b64encode(content_bytes).decode('utf-8')
                    sg_attachments.append({
                        'content': b64,
                        'type': 'application/pdf',
                        'filename': fname
                    })
            if sg_attachments:
                data['attachments'] = sg_attachments

        try:
            resp = requests.post(url, headers=headers, data=json.dumps(data), timeout=15)
            if resp.status_code in (200, 202):
                logger.info("✅ SendGrid accepted email to %s", to_email)
                return {'success': True, 'message': 'Sent via SendGrid', 'email': to_email}
            logger.error("❌ SendGrid error %s: %s", resp.status_code, resp.text)
            return {'success': False, 'error': f'SendGrid error {resp.status_code}', 'details': resp.text, 'email': to_email}
        except Exception:
            logger.exception("SendGrid request failed")
            return {'success': False, 'error': 'SendGrid request failed', 'details': traceback.format_exc(), 'email': to_email}

    def _send_via_resend(self, to_email, subject, body_text, body_html, attachments=None):
        """Send email via Resend REST API."""
        if not self.config.resend_api_key:
            logger.error("Resend provider selected but RESEND_API_KEY is not configured")
            return {'success': False, 'provider': 'resend', 'error': 'RESEND_API_KEY not configured', 'email': to_email}

        sender_name = self.config.email_from_name or 'HR Department'
        sender_name_parsed, sender_email = self._parse_address(self.config.email_from)
        if sender_email:
            sender_name = sender_name_parsed or sender_name
        else:
            sender_email = self.config.email_from

        if not sender_email:
            logger.error("Resend sender email could not be determined from EMAIL_FROM")
            return {'success': False, 'provider': 'resend', 'error': 'Sender email is not configured', 'email': to_email}

        # Build the email payload
        payload = {
            'from': f"{sender_name} <{sender_email}>" if sender_name else sender_email,
            'to': to_email,
            'subject': subject,
            'html': body_html,
            'text': body_text,
        }

        # Handle attachments
        if attachments:
            resend_attachments = []
            for attachment in attachments:
                if not isinstance(attachment, dict):
                    continue
                content = attachment.get('content')
                filename = attachment.get('filename') or 'attachment'
                if not content:
                    continue
                # Resend expects base64-encoded content
                encoded = base64.b64encode(content).decode('utf-8')
                resend_attachments.append({
                    'filename': filename,
                    'content': encoded,
                })
            if resend_attachments:
                payload['attachments'] = resend_attachments

        headers = {
            'Authorization': f'Bearer {self.config.resend_api_key}',
            'Content-Type': 'application/json',
        }

        logger.info("Sending email via Resend to %s", to_email)
        logger.debug("Resend payload from=%s to=%s subject=%s attachments=%s", sender_email, to_email, subject, bool(payload.get('attachments')))

        try:
            resp = requests.post(
                'https://api.resend.com/emails',
                headers=headers,
                data=json.dumps(payload),
                timeout=15,
            )
            logger.info("Resend response status code: %s", resp.status_code)
            if resp.status_code in (200, 201):
                response_data = resp.json()
                message_id = response_data.get('id', '')
                logger.info("Email successfully sent via Resend for %s (message_id=%s)", to_email, message_id)
                return {
                    'success': True,
                    'provider': 'resend',
                    'email': to_email,
                    'message': 'Email sent successfully via Resend',
                    'messageId': message_id
                }
            logger.error("Resend request failed with status %s: %s", resp.status_code, resp.text)
            return {
                'success': False,
                'provider': 'resend',
                'error': resp.text or f'Resend error {resp.status_code}',
                'status_code': resp.status_code,
                'email': to_email,
            }
        except Exception:
            resend_exc = traceback.format_exc()
            logger.exception("Resend request failed")
            return {
                'success': False,
                'provider': 'resend',
                'error': 'Resend request failed',
                'details': resend_exc,
                'email': to_email,
            }

    def send_email(self, to_email, subject, body_text, body_html, attachments=None):
        """Send email with attachments using SMTP or fallback provider."""
        try:
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = self._format_from_header()
            msg['To'] = to_email
            msg['Reply-To'] = self.config.email_reply_to
            msg['Date'] = datetime.now().isoformat()
            msg['Message-ID'] = f"<payslip-{uuid.uuid4()}@{self._get_message_id_domain()}>"
            msg['X-Priority'] = '3'
            msg['X-Mailer'] = 'HR Department Mailer'

            msg.attach(MIMEText(body_text, 'plain'))
            msg.attach(MIMEText(body_html, 'html'))

            if attachments:
                for attachment in attachments:
                    if isinstance(attachment, dict):
                        filename = attachment.get('filename', 'attachment')
                        content = attachment.get('content')
                        if content:
                            part = MIMEApplication(content)
                            part.add_header('Content-Disposition', 'attachment', filename=filename)
                            msg.attach(part)

            if self.config.email_provider == 'sendgrid':
                return self._send_via_sendgrid(to_email, subject, body_text, body_html, attachments)

            if self.config.email_provider == 'resend':
                return self._send_via_resend(to_email, subject, body_text, body_html, attachments)

            if not self.transporter:
                # Attempt to initialize transporter and provide detailed failure info
                ok = self._initialize_transporter()
                if not ok:
                    # If SendGrid configured, use it as fallback
                    if self.config.sendgrid_api_key:
                        logger.info('SMTP unavailable; falling back to SendGrid for %s', to_email)
                        return self._send_via_sendgrid(to_email, subject, body_text, body_html, attachments)

                    # If running on Render, do not simulate success; return explicit failure and recommendation
                    is_render = bool(os.getenv('RENDER') or os.getenv('RENDER_SERVICE_ID') or os.getenv('RENDER_REGION') or os.getenv('RENDER_INTERNAL_HOSTNAME'))
                    if is_render:
                        err = self.last_smtp_error or 'SMTP transporter could not be initialized (unknown error)'
                        logger.error('Render environment cannot reach SMTP for %s: %s', to_email, err)
                        recommendation = 'If running on Render, enable SendGrid and set SENDGRID_API_KEY, or enable SMTP egress with your host.'
                        return {'success': False, 'error': err, 'recommendation': recommendation}

                    # For non-Render environments, if provider explicitly set to simulate/mock, allow simulated response
                    if self.config.email_provider in {'mock', 'simulate', 'disabled'}:
                        logger.warning('SMTP unavailable; returning simulated success for %s (provider=%s)', to_email, self.config.email_provider)
                        return {
                            'success': True,
                            'message': 'Email delivery simulated because SMTP is unavailable',
                            'mode': 'simulated',
                            'email': to_email,
                        }

                    # Otherwise return explicit failure
                    err = self.last_smtp_error or 'SMTP transporter could not be initialized'
                    logger.error('SMTP initialization failed for %s: %s', to_email, err)
                    return {'success': False, 'error': err}

            if self.transporter == 'simulated':
                logger.info("Simulated email delivery for %s", to_email)
                return {
                    'success': True,
                    'message': 'Email delivery simulated because SMTP provider is set to simulate',
                    'mode': 'simulated',
                    'email': to_email,
                }

            try:
                logger.info('Sending SMTP message to %s', to_email)
                self.transporter.send_message(msg)
                logger.info('SMTP email sent successfully to %s (message-id=%s)', to_email, msg.get('Message-ID'))
                return {
                    'success': True,
                    'message': f'Email sent successfully to {to_email}',
                    'email': to_email,
                    'messageId': msg['Message-ID'],
                }
            except smtplib.SMTPRecipientsRefused as e:
                err = f"Recipients refused: {e.recipients if hasattr(e, 'recipients') else str(e)}"
                logger.exception('SMTP recipients refused for %s: %s', to_email, err)
                self._close_transporter()
                if self.config.sendgrid_api_key:
                    logger.info('Falling back to SendGrid after recipients refused for %s', to_email)
                    return self._send_via_sendgrid(to_email, subject, body_text, body_html, attachments)
                return {'success': False, 'error': err}
            except smtplib.SMTPAuthenticationError as e:
                err = f"SMTP authentication error: {e}"
                logger.exception('SMTP authentication error while sending to %s: %s', to_email, err)
                self._close_transporter()
                return {'success': False, 'error': err}
            except smtplib.SMTPException as e:
                err = f"SMTP error while sending: {e}"
                logger.exception('SMTP exception while sending to %s: %s', to_email, err)
                self._close_transporter()
                if self.config.sendgrid_api_key:
                    logger.info('Falling back to SendGrid after SMTPException for %s', to_email)
                    return self._send_via_sendgrid(to_email, subject, body_text, body_html, attachments)
                return {'success': False, 'error': err}
            except OSError as e:
                err = f"Network/OS error while sending SMTP message: {e}"
                logger.exception('Network/OS error while sending to %s: %s', to_email, err)
                self._close_transporter()
                return {'success': False, 'error': err}
            except Exception:
                smtp_error = traceback.format_exc()
                logger.exception('Unexpected error while sending SMTP message to %s: %s', to_email, smtp_error)
                self._close_transporter()
                if self.config.sendgrid_api_key:
                    logger.info('Falling back to SendGrid after unexpected SMTP error for %s', to_email)
                    return self._send_via_sendgrid(to_email, subject, body_text, body_html, attachments)
                return {'success': False, 'error': smtp_error}
            finally:
                # ensure transporter always closed
                self._close_transporter()
        except Exception:
            logger.exception("Unexpected error in send_email for %s", to_email)
            return {'success': False, 'error': 'Unexpected email error', 'details': traceback.format_exc(), 'email': to_email}

    def send_payslip_email(self, employee, payroll, to_email=None, subject=None, message=None):
        """Send payslip email with optional PDF attachment."""
        try:
            to_email = to_email or employee.get('email')
            if not to_email:
                return {'success': False, 'error': 'No email address provided'}

            emp_id = employee.get('id', 'UNKNOWN')

            logger.info('Preparing payslip email for emp=%s recipient=%s month=%s', emp_id, to_email, payroll.get('month'))

            html_content = self.generate_payslip_html(employee, payroll)
            pdf_content = self.generate_pdf(html_content, f"Payslip_{payroll.get('month', '').replace(' ', '_')}.pdf")

            emp_name = employee.get('name', 'Employee')
            month = payroll.get('month', '')
            subject = subject or f"Payslip for {month} - {emp_name}"
            message = message or (
                f"Dear {emp_name},\n\n"
                f"Please find attached your payslip for {month}.\n\n"
                f"If you have any questions, please contact the HR department.\n\n"
                f"Best regards,\nHR Department"
            )

            body_html = f"""
            <div style=\"font-family: Arial, sans-serif; color: #1f2937; line-height: 1.6;\">
              <p>Dear {emp_name},</p>
              <p>Please find attached your payslip for <strong>{month}</strong>.</p>
              <p>If you have any questions, please reply to this email or contact the HR department directly.</p>
              <p>Thank you for your continued contributions.</p>
              <p>Regards,<br/><strong>HR Department</strong></p>
            </div>
            """

            attachments = []
            if pdf_content:
                attachments.append({
                    'filename': f"Payslip_{month.replace(' ', '_')}.pdf",
                    'content': pdf_content,
                })

            logger.debug('Calling send_email for emp=%s recipient=%s', emp_id, to_email)
            result = self.send_email(to_email, subject, message, body_html, attachments)

            # Ensure we return failure explicitly if send failed
            if not result.get('success'):
                logger.error('Failed to send payslip for emp=%s to %s: %s', emp_id, to_email, result.get('error'))
                return {
                    'success': False,
                    'error': result.get('error'),
                    'details': result.get('details') or result.get('recommendation')
                }

            logger.info('Payslip email sent for emp=%s to %s; messageId=%s', emp_id, to_email, result.get('messageId'))
            return result

        except Exception:
            logger.exception("Error in send_payslip_email")
            return {'success': False, 'error': 'Error in send_payslip_email', 'details': traceback.format_exc()}


email_service = None


def get_email_service():
    """Get or create the global email service instance."""
    global email_service
    if email_service is None:
        email_service = EmailService()
    return email_service
