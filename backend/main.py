from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Any
from sqlalchemy.orm import Session
import os
import json
import logging
from datetime import datetime

import models
import database
from email_service import get_email_service

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

app = FastAPI(title="HR Payslip API")

# Add CORS middleware for frontend access
allowed_origins = os.getenv(
    "ALLOWED_ORIGINS", 
    "http://localhost:5173,http://localhost:3000,https://hr-payslip-frontend.vercel.app,https://hr-payslip-backend.onrender.com"
).split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

database.Base.metadata.create_all(bind=database.engine)

# ── AUTO-IMPORT EMPLOYEES IF DATABASE IS EMPTY ──
def auto_import_employees_if_empty():
    """Import employees from exported_employees.json if database is empty"""
    db = database.SessionLocal()
    try:
        # Check if employees table is empty
        employee_count = db.query(models.Employee).count()
        
        if employee_count == 0:
            logger.info("Database is empty. Attempting to import employees...")
            
            # Try to load from exported_employees.json
            import_file = os.path.join(os.path.dirname(__file__), 'exported_employees.json')
            
            if os.path.exists(import_file):
                with open(import_file, 'r', encoding='utf-8') as f:
                    backup_data = json.load(f)
                
                employees_data = backup_data.get('EMP', [])
                
                for emp_data in employees_data:
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
                
                db.commit()
                logger.info(f"✅ Auto-imported {len(employees_data)} employees!")
            else:
                logger.warning(f"Could not find {import_file} for auto-import")
        else:
            logger.info(f"Database already has {employee_count} employees")
    except Exception as e:
        logger.error(f"Error during auto-import: {str(e)}")
        db.rollback()
    finally:
        db.close()

# Call on startup
auto_import_employees_if_empty()

class LoginRequest(BaseModel):
    username: str
    password: str

class EmployeeCreate(BaseModel):
    id: str
    name: str
    org: str
    branch: str
    designation: str
    phone: str
    email: str

class PayrollRecordCreate(BaseModel):
    empId: str
    month: str
    gross: float
    netPayable: float
    paidAmount: float
    balanceAmount: float


def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/api/employees", response_model=List[EmployeeCreate])
def list_employees(db: Session = Depends(get_db)):
    return db.query(models.Employee).all()

@app.get("/api/payroll/{month}", response_model=List[PayrollRecordCreate])
def list_payroll(month: str, db: Session = Depends(get_db)):
    return db.query(models.PayrollRecord).filter(models.PayrollRecord.month == month).all()

@app.post("/api/login")
def login(payload: LoginRequest):
    # Example login route. Replace with secure auth later.
    if payload.username == "hr" and payload.password == "HR@Admin2024":
        return {"success": True, "role": "hr"}
    if payload.username == "employee" and payload.password == "Emp@123":
        return {"success": True, "role": "employee"}
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.post("/api/employee", response_model=EmployeeCreate)
def add_employee(employee: EmployeeCreate, db: Session = Depends(get_db)):
    existing = db.query(models.Employee).filter(models.Employee.id == employee.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Employee already exists")

    db_employee = models.Employee(**employee.dict())
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)
    return db_employee

@app.get("/api/health")
def health_check():
    return {"status": "ok"}


# ═══════════════════════════════════════════════════════════════
# EMAIL SERVICE ENDPOINTS (Integrated)
# ═══════════════════════════════════════════════════════════════

logger.info("📧 Email Service integrated into FastAPI backend")


@app.post("/api/send-payslip-email")
async def send_payslip_email(payload: dict, db: Session = Depends(get_db)) -> dict:
    """Send payslip email with PDF attachment"""
    try:
        emp_id = payload.get('empId')
        month = payload.get('month')
        custom_email = payload.get('customEmail')
        custom_subject = payload.get('customSubject')
        custom_message = payload.get('customMessage')
        req_employee = payload.get('employee')
        req_payroll = payload.get('payroll')
        
        logger.info(f"[EMAIL] Sending payslip for employee: {emp_id}, month: {month}")
        
        # Get employee and payroll data from request or database
        employee = req_employee
        payroll = req_payroll
        
        if not employee or not payroll:
            # Fetch from database
            emp_record = db.query(models.Employee).filter(models.Employee.id == emp_id).first()
            if not emp_record:
                return {"success": False, "error": "Employee not found"}
            
            payroll_record = db.query(models.PayrollRecord).filter(
                models.PayrollRecord.empId == emp_id,
                models.PayrollRecord.month == month
            ).first()
            if not payroll_record:
                return {"success": False, "error": "Payroll record not found"}
            
            employee = {
                'id': emp_record.id,
                'name': emp_record.name,
                'org': emp_record.org,
                'branch': emp_record.branch,
                'designation': emp_record.designation,
                'email': emp_record.email,
                'phone': emp_record.phone
            }
            
            payroll = {
                'month': payroll_record.month,
                'gross': payroll_record.gross,
                'netPayable': payroll_record.netPayable,
                'paidAmount': payroll_record.paidAmount,
                'balanceAmount': payroll_record.balanceAmount
            }
        
        # Get email service and send
        email_service = get_email_service()
        to_email = custom_email or employee.get('email')
        
        result = email_service.send_payslip_email(
            employee=employee,
            payroll=payroll,
            to_email=to_email,
            subject=custom_subject,
            message=custom_message
        )
        
        # Store in email history
        try:
            emp_name = employee.get('name', 'Employee')
            from models import EmailHistory
            email_history = EmailHistory(
                empId=emp_id,
                empName=emp_name,
                email=to_email,
                month=month,
                sentAt=datetime.now(),
                status='Sent' if result['success'] else 'Failed',
                errorMessage=None if result['success'] else result.get('error')
            )
            db.add(email_history)
            db.commit()
            logger.info(f"[EMAIL HISTORY] Recorded email send attempt for {emp_id}")
        except Exception as db_error:
            logger.warning(f"[EMAIL HISTORY] Could not record email history: {str(db_error)}")
            db.rollback()
        
        return result
    
    except Exception as e:
        error_msg = f"Error sending payslip email: {str(e)}"
        logger.error(f"❌ {error_msg}")
        return {"success": False, "error": error_msg}


@app.get("/api/email-history/{empId}")
async def get_email_history(empId: str, db: Session = Depends(get_db)) -> dict:
    """Get email history for an employee"""
    try:
        logger.info(f"[EMAIL HISTORY] Fetching history for employee: {empId}")
        from models import EmailHistory
        
        history = db.query(EmailHistory).filter(
            EmailHistory.empId == empId
        ).order_by(EmailHistory.sentAt.desc()).all()
        
        return {
            "success": True,
            "history": [
                {
                    "id": h.id,
                    "empId": h.empId,
                    "empName": h.empName,
                    "email": h.email,
                    "month": h.month,
                    "sentAt": h.sentAt.isoformat() if h.sentAt else None,
                    "status": h.status,
                    "errorMessage": h.errorMessage
                }
                for h in history
            ]
        }
    except Exception as e:
        error_msg = f"Failed to fetch email history: {str(e)}"
        logger.error(f"❌ {error_msg}")
        return {"success": False, "error": error_msg, "history": []}


@app.get("/api/email-history-month/{month}")
async def get_email_history_month(month: str, db: Session = Depends(get_db)) -> dict:
    """Get email history for a month"""
    try:
        logger.info(f"[EMAIL HISTORY] Fetching history for month: {month}")
        from models import EmailHistory
        
        history = db.query(EmailHistory).filter(
            EmailHistory.month == month
        ).order_by(EmailHistory.sentAt.desc()).all()
        
        return {
            "success": True,
            "history": [
                {
                    "id": h.id,
                    "empId": h.empId,
                    "empName": h.empName,
                    "email": h.email,
                    "month": h.month,
                    "sentAt": h.sentAt.isoformat() if h.sentAt else None,
                    "status": h.status,
                    "errorMessage": h.errorMessage
                }
                for h in history
            ]
        }
    except Exception as e:
        error_msg = f"Failed to fetch email history: {str(e)}"
        logger.error(f"❌ {error_msg}")
        return {"success": False, "error": error_msg, "history": []}


@app.post("/api/test-email-payslip")
async def test_email_payslip(payload: dict) -> dict:
    """Test email sending with sample payslip"""
    try:
        test_email = payload.get('email', 'thirshikannan07@gmail.com')
        logger.info(f"[TEST EMAIL] Sending test email to: {test_email}")
        
        # Test employee and payroll data
        test_employee = {
            'id': 'TEST001',
            'name': 'Test User',
            'org': 'HR Test Organization',
            'branch': 'Test Branch',
            'designation': 'Test Designation',
            'email': test_email,
            'phone': '1234567890'
        }
        
        test_payroll = {
            'month': 'January 2024',
            'gross': 50000.00,
            'netPayable': 45000.00,
            'paidAmount': 45000.00,
            'balanceAmount': 0.00
        }
        
        email_service = get_email_service()
        result = email_service.send_payslip_email(
            employee=test_employee,
            payroll=test_payroll,
            to_email=test_email
        )
        
        return result
    
    except Exception as e:
        error_msg = f"Error sending test email: {str(e)}"
        logger.error(f"❌ {error_msg}")
        return {"success": False, "error": error_msg}

