#!/usr/bin/env python
"""
Import backup data into the database
"""

import json
import os
from dotenv import load_dotenv
from sqlalchemy.orm import Session
import database
import models

# Load environment variables
load_dotenv()

def import_backup(backup_file_path):
    """Import backup JSON file into database"""
    
    print(f"📁 Loading backup from: {backup_file_path}")
    
    # Read backup file
    with open(backup_file_path, 'r', encoding='utf-8') as f:
        backup_data = json.load(f)
    
    print(f"✅ Backup loaded - Version: {backup_data.get('version')}")
    print(f"📅 Exported on: {backup_data.get('exportedOn')}")
    
    # Create database tables
    database.Base.metadata.create_all(bind=database.engine)
    db = database.SessionLocal()
    
    try:
        # Import employees
        employees_data = backup_data.get('EMP', [])
        print(f"\n👥 Importing {len(employees_data)} employees...")
        
        for emp_data in employees_data:
            # Check if employee already exists
            existing = db.query(models.Employee).filter(
                models.Employee.id == emp_data['id']
            ).first()
            
            if existing:
                print(f"⏭️  Skipping {emp_data['id']} - already exists")
                continue
            
            # Create employee record (only use fields in the model)
            employee = models.Employee(
                id=emp_data['id'],
                name=emp_data.get('name'),
                org=emp_data.get('org'),
                branch=emp_data.get('branch'),
                designation=emp_data.get('designation'),
                phone=emp_data.get('phone'),
                email=emp_data.get('email'),
            )
            db.add(employee)
            print(f"✅ Added: {emp_data['id']} - {emp_data.get('name')}")
        
        # Commit employees
        db.commit()
        print(f"✅ All employees imported successfully!")
        
        # Import payroll records if available
        payroll_data = backup_data.get('PAY', {})
        if payroll_data:
            print(f"\n💰 Importing payroll records...")
            total_imported = 0
            
            # PAY structure: { "May 2026": { "records": [...] } }
            for month, month_data in payroll_data.items():
                records = month_data.get('records', [])
                print(f"  📅 Processing month: {month} ({len(records)} records)")
                
                for pr in records:
                    existing = db.query(models.PayrollRecord).filter(
                        models.PayrollRecord.empId == pr.get('empId'),
                        models.PayrollRecord.month == pr.get('month')
                    ).first()
                    
                    if existing:
                        print(f"  ⏭️  Skipping {pr.get('empId')} - {pr.get('month')} - already exists")
                        continue
                    
                    payroll = models.PayrollRecord(
                        empId=pr.get('empId'),
                        month=pr.get('month'),
                        gross=pr.get('gross', 0),
                        netPayable=pr.get('netPayable', 0),
                        paidAmount=pr.get('paidAmount', 0),
                        balanceAmount=pr.get('balanceAmount', 0),
                        email_status='Pending'
                    )
                    db.add(payroll)
                    total_imported += 1
                    print(f"  ✅ Added payroll: {pr.get('empId')} - {pr.get('month')}")
            
            db.commit()
            print(f"✅ All payroll records imported! Total: {total_imported}")
        
        print("\n" + "="*50)
        print("✅ BACKUP IMPORT COMPLETED SUCCESSFULLY!")
        print("="*50)
        
    except Exception as e:
        db.rollback()
        print(f"\n❌ Error during import: {str(e)}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    backup_path = "../TATTI_Backup_2026-06-08 (1).json"
    
    if os.path.exists(backup_path):
        import_backup(backup_path)
    else:
        print(f"❌ Backup file not found: {backup_path}")
        print(f"📍 Looking in: {os.getcwd()}")
        print(f"📍 Parent directory: {os.listdir('..')}")
