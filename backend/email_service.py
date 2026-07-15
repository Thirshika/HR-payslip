"""
Email Service Module
Handles SMTP configuration, PDF generation, and email sending
"""

import os
import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email.mime.application import MIMEApplication
from email import encoders
from datetime import datetime
import uuid
from io import BytesIO
from pathlib import Path

try:
    from weasyprint import HTML, CSS
    HAS_WEASYPRINT = True
except ImportError:
    HTML = None
    CSS = None
    HAS_WEASYPRINT = False

logger = logging.getLogger(__name__)

class EmailServiceConfig:
    """Email service configuration from environment variables"""
    def __init__(self):
        self.smtp_host = os.getenv('EMAIL_HOST', 'smtp.gmail.com')
        self.smtp_port = int(os.getenv('EMAIL_PORT', 587))
        self.smtp_secure = os.getenv('EMAIL_SECURE', 'false').lower() == 'true'
        self.email_user = os.getenv('EMAIL_USER')
        self.email_pass = os.getenv('EMAIL_PASS')
        self.email_from_name = os.getenv('EMAIL_FROM_NAME', 'HR Department')
        self.email_from = os.getenv('EMAIL_FROM') or self.email_user
        self.email_reply_to = os.getenv('EMAIL_REPLY_TO') or self.email_from
        
    def validate(self):
        """Validate that all required configuration is present"""
        if not self.email_user or not self.email_pass:
            raise ValueError("EMAIL_USER and EMAIL_PASS environment variables are required")
        return True

class EmailService:
    """Email service for sending payslips and managing email history"""
    
    def __init__(self):
        self.config = EmailServiceConfig()
        self.config.validate()
        self.transporter = None
        self._initialize_transporter()
    
    def _initialize_transporter(self):
        """Initialize SMTP transporter and verify connection"""
        try:
            if self.config.smtp_secure:
                self.transporter = smtplib.SMTP_SSL(self.config.smtp_host, self.config.smtp_port, timeout=15)
            else:
                self.transporter = smtplib.SMTP(self.config.smtp_host, self.config.smtp_port, timeout=15)
                self.transporter.starttls()
            
            self.transporter.login(self.config.email_user, self.config.email_pass)
            logger.info(f"✅ SMTP connection verified: {self.config.smtp_host}:{self.config.smtp_port}")
            return True
        except Exception as e:
            logger.error(f"❌ SMTP verification failed: {str(e)}")
            return False
    
    def generate_payslip_html(self, employee, payroll):
        """Generate HTML content for payslip"""
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
        """Generate PDF from HTML using WeasyPrint"""
        try:
            if HTML is None:
                logger.warning("WeasyPrint not available, skipping PDF generation")
                return None
            
            pdf = HTML(string=html_content).write_pdf()
            return pdf
        except Exception as e:
            logger.error(f"Error generating PDF: {str(e)}")
            return None
    
    def send_email(self, to_email, subject, body_text, body_html, attachments=None):
        """Send email with attachments"""
        try:
            # Create message
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = f"{self.config.email_from_name} <{self.config.email_from}>"
            msg['To'] = to_email
            msg['Reply-To'] = self.config.email_reply_to
            msg['Date'] = datetime.now().isoformat()
            msg['Message-ID'] = f"<payslip-{uuid.uuid4()}@{self.config.email_from.split('@')[1]}>"
            msg['X-Priority'] = '3'
            msg['X-Mailer'] = 'HR Department Mailer'
            
            # Add text and HTML parts
            msg.attach(MIMEText(body_text, 'plain'))
            msg.attach(MIMEText(body_html, 'html'))
            
            # Add attachments
            if attachments:
                for attachment in attachments:
                    if isinstance(attachment, dict):
                        filename = attachment.get('filename', 'attachment')
                        content = attachment.get('content')
                        if content:
                            part = MIMEApplication(content)
                            part.add_header('Content-Disposition', 'attachment', filename=filename)
                            msg.attach(part)
            
            # Send email
            if not self.transporter:
                self._initialize_transporter()
            
            self.transporter.send_message(msg)
            
            logger.info(f"✅ Email sent successfully to {to_email}")
            return {
                'success': True,
                'message': f'Email sent successfully to {to_email}',
                'email': to_email,
                'messageId': msg['Message-ID']
            }
        except Exception as e:
            error_msg = f"Failed to send email: {str(e)}"
            logger.error(f"❌ {error_msg}")
            return {
                'success': False,
                'error': error_msg,
                'email': to_email
            }
    
    def send_payslip_email(self, employee, payroll, to_email=None, subject=None, message=None):
        """Send payslip email with PDF attachment"""
        try:
            to_email = to_email or employee.get('email')
            if not to_email:
                return {'success': False, 'error': 'No email address provided'}
            
            # Generate payslip HTML
            html_content = self.generate_payslip_html(employee, payroll)
            
            # Generate PDF
            pdf_content = self.generate_pdf(html_content, f"Payslip_{payroll.get('month', '').replace(' ', '_')}.pdf")
            
            # Prepare email content
            emp_name = employee.get('name', 'Employee')
            month = payroll.get('month', '')
            subject = subject or f"Payslip for {month} - {emp_name}"
            message = message or f"Dear {emp_name},\n\nPlease find attached your payslip for {month}.\n\nIf you have any questions, please contact the HR department.\n\nBest regards,\nHR Department"
            
            body_html = f"""
            <div style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.6;">
              <p>Dear {emp_name},</p>
              <p>Please find attached your payslip for <strong>{month}</strong>.</p>
              <p>If you have any questions, please reply to this email or contact the HR department directly.</p>
              <p>Thank you for your continued contributions.</p>
              <p>Regards,<br/><strong>HR Department</strong></p>
            </div>
            """
            
            # Prepare attachments
            attachments = []
            if pdf_content:
                attachments.append({
                    'filename': f"Payslip_{month.replace(' ', '_')}.pdf",
                    'content': pdf_content
                })
            
            # Send email
            result = self.send_email(to_email, subject, message, body_html, attachments)
            return result
        
        except Exception as e:
            error_msg = f"Error in send_payslip_email: {str(e)}"
            logger.error(f"❌ {error_msg}")
            return {'success': False, 'error': error_msg}

# Global email service instance
email_service = None

def get_email_service():
    """Get or create email service instance"""
    global email_service
    if email_service is None:
        email_service = EmailService()
    return email_service
