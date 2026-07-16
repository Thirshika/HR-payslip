#!/usr/bin/env python
"""
Export employees from database to backup file
"""

import json
from database import SessionLocal
from models import Employee

def export_employees():
    """Export all employees to JSON"""
    db = SessionLocal()
    
    try:
        employees = db.query(Employee).all()
        print(f"Found {len(employees)} employees")
        
        # Convert to dictionaries
        emp_list = []
        for emp in employees:
            emp_dict = {
                'id': emp.id,
                'name': emp.name,
                'org': emp.org,
                'branch': emp.branch,
                'designation': emp.designation,
                'phone': emp.phone,
                'email': emp.email,
            }
            emp_list.append(emp_dict)
        
        # Create backup
        backup = {
            'version': 'v7',
            'exportedOn': str(__import__('datetime').datetime.now()),
            'EMP': emp_list
        }
        
        # Save to file
        output_file = 'exported_employees.json'
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(backup, f, indent=2)
        
        print(f"✅ Exported to {output_file}")
        return output_file
        
    finally:
        db.close()

if __name__ == "__main__":
    export_employees()
