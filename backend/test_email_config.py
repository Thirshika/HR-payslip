#!/usr/bin/env python
import os
import sys
from dotenv import load_dotenv

# Load environment variables
dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path)

print("=" * 60)
print("EMAIL SERVICE CONFIGURATION TEST")
print("=" * 60)

# Check email config
email_user = os.getenv('EMAIL_USER')
email_pass = os.getenv('EMAIL_PASS')
email_host = os.getenv('EMAIL_HOST')
email_port = os.getenv('EMAIL_PORT')
email_secure = os.getenv('EMAIL_SECURE')
email_from_name = os.getenv('EMAIL_FROM_NAME')

print(f"\n📧 EMAIL CONFIGURATION:")
print(f"  EMAIL_USER: {'✅' if email_user else '❌'} {email_user or 'NOT SET'}")
print(f"  EMAIL_PASS: {'✅' if email_pass else '❌'} {'*' * len(email_pass) if email_pass else 'NOT SET'}")
print(f"  EMAIL_HOST: {'✅' if email_host else '❌'} {email_host or 'NOT SET'}")
print(f"  EMAIL_PORT: {'✅' if email_port else '❌'} {email_port or 'NOT SET'}")
print(f"  EMAIL_SECURE: {'✅' if email_secure else '❌'} {email_secure or 'NOT SET'}")
print(f"  EMAIL_FROM_NAME: {'✅' if email_from_name else '❌'} {email_from_name or 'NOT SET'}")

# Check database config
db_host = os.getenv('DB_HOST')
db_port = os.getenv('DB_PORT')
db_name = os.getenv('DB_NAME')
db_user = os.getenv('DB_USER')
db_password = os.getenv('DB_PASSWORD')

print(f"\n🗄️  DATABASE CONFIGURATION:")
print(f"  DB_HOST: {'✅' if db_host else '❌'} {db_host or 'NOT SET'}")
print(f"  DB_PORT: {'✅' if db_port else '❌'} {db_port or 'NOT SET'}")
print(f"  DB_NAME: {'✅' if db_name else '❌'} {db_name or 'NOT SET'}")
print(f"  DB_USER: {'✅' if db_user else '❌'} {db_user or 'NOT SET'}")
print(f"  DB_PASSWORD: {'✅' if db_password else '❌'} {'*' * len(db_password) if db_password else 'NOT SET'}")

# Test email service initialization
print(f"\n🔌 EMAIL SERVICE INITIALIZATION:")
try:
    from email_service import get_email_service
    service = get_email_service()
    print(f"  ✅ Email service initialized successfully")
    print(f"     SMTP: {service.config.smtp_host}:{service.config.smtp_port}")
    print(f"     From: {service.config.email_from_name} <{service.config.email_from}>")
except Exception as e:
    print(f"  ❌ Error: {str(e)}")
    sys.exit(1)

print("\n" + "=" * 60)
print("✅ ALL CHECKS PASSED - Email service is ready!")
print("=" * 60)
