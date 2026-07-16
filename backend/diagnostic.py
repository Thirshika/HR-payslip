#!/usr/bin/env python
"""
Quick diagnostic to verify backend setup
"""
import os
from pathlib import Path

print("=" * 60)
print("BACKEND DIAGNOSTIC")
print("=" * 60)

# Check if exported_employees.json exists
export_file = Path(__file__).parent / 'exported_employees.json'
print(f"\n1. Exported data file: {export_file}")
print(f"   Exists: {export_file.exists()}")

if export_file.exists():
    import json
    with open(export_file) as f:
        data = json.load(f)
    print(f"   Employees in file: {len(data.get('EMP', []))}")

# Check database connection
try:
    from database import SessionLocal, engine
    from models import Employee
    
    db = SessionLocal()
    count = db.query(Employee).count()
    db.close()
    
    print(f"\n2. Database connection: ✅ OK")
    print(f"   Employees in database: {count}")
except Exception as e:
    print(f"\n2. Database connection: ❌ ERROR")
    print(f"   {str(e)}")

# Check environment
print(f"\n3. Environment:")
print(f"   DATABASE_URL: {'SET' if os.getenv('SQLALCHEMY_DATABASE_URL') else 'NOT SET'}")
print(f"   EMAIL_USER: {'SET' if os.getenv('EMAIL_USER') else 'NOT SET'}")

print("\n" + "=" * 60)
