from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional, Any
from sqlalchemy.orm import Session
import os
import json
import logging
from datetime import datetime

# Import modules in a way that works both when running as a package
# (e.g. `uvicorn backend.main:app`) and when running from inside the
# `backend` directory as a module (e.g. `uvicorn main:app`). Try package
# imports first, then fall back to direct local imports.
try:
    from backend import models, database
    from backend.email_service import get_email_service
except Exception:
    import models, database
    from email_service import get_email_service

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

app = FastAPI(title="HR Payslip API")

# Add CORS middleware for frontend access
# Read allowed origins from environment variable `ALLOWED_ORIGINS`.
# If not provided, fall back to the explicit default list required by the app.
# The value should be a comma-separated list of origins. We split and clean
# the list to remove any accidental whitespace or empty entries.
allowed_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,"
    "http://localhost:5174,"
    "http://localhost:3000,"
    "https://hr-payslip-self.vercel.app,"
    "https://hr-payslip-zlc8.vercel.app,"
    "https://hr-payslip-frontend.vercel.app,"
    "https://hr-payslip-mh66.onrender.com"
).split(",")

# Trim whitespace and drop empty entries (robust parsing)
allowed_origins = [o.strip() for o in allowed_origins if o and o.strip()]

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

@app.get("/api/payroll/{month}")
async def get_payroll_records(month: str, db: Session = Depends(get_db)) -> dict:
    """Get all payroll records for a given month"""
    try:
        logger.info(f"[PAYROLL] Fetching payroll records for month: {month}")
        try:
            from backend.models import PayrollRecord
        except Exception:
            from models import PayrollRecord
        
        records = db.query(PayrollRecord).filter(
            PayrollRecord.month == month
        ).all()
        
        return {
            "success": True,
            "month": month,
            "records": [
                {
                    "empId": r.empId,
                    "month": r.month,
                    "gross": r.gross,
                    "netPayable": r.netPayable,
                    "paidAmount": r.paidAmount,
                    "balanceAmount": r.balanceAmount
                }
                for r in records
            ]
        }
    except Exception as e:
        error_msg = f"Failed to fetch payroll records: {str(e)}"
        logger.error(f"❌ {error_msg}")
        return {"success": False, "error": error_msg, "records": []}

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
# COMPREHENSIVE DATA API ENDPOINTS
# ═══════════════════════════════════════════════════════════════

@app.get("/api/data/all")
async def get_all_data(db: Session = Depends(get_db)):
    """Get all application data from database"""
    try:
        # Get all employees
        employees = db.query(models.Employee).all()
        
        # Get all payroll records
        payroll_records = db.query(models.PayrollRecord).all()
        
        # Get leave applications
        leaves = db.query(models.LeaveApplication).all()
        
        # Get expense claims
        expenses = db.query(models.ExpenseClaim).all()
        
        # Get organizations
        orgs = db.query(models.Organization).all()
        
        # Get employee documents
        docs = db.query(models.EmployeeDocument).all()
        
        # Get attendance data
        attendance = db.query(models.AttendanceData).all()
        
        # Get HR password from settings
        hr_pass_setting = db.query(models.SystemSettings).filter(
            models.SystemSettings.key == 'hr_password'
        ).first()
        hr_pass = hr_pass_setting.value if hr_pass_setting else 'HR@Admin2024'
        
        # Structure payroll data by month (matching frontend format)
        payroll_by_month = {}
        for record in payroll_records:
            month = record.month
            if month not in payroll_by_month:
                payroll_by_month[month] = {'records': []}
            payroll_by_month[month]['records'].append({
                'empId': record.empId,
                'month': record.month,
                'gross': record.gross,
                'netPayable': record.netPayable,
                'paidAmount': record.paidAmount,
                'balanceAmount': record.balanceAmount
            })
        
        # Structure attendance data by month and employee
        attendance_data = {}
        for att in attendance:
            month = att.month
            if month not in attendance_data:
                attendance_data[month] = {}
            attendance_data[month][att.empId] = {
                'presentDays': att.presentDays,
                'absentDays': att.absentDays,
                'holidays': att.holidays,
                'halfDays': att.halfDays,
                'overtimeHours': att.overtimeHours,
                'remarks': att.remarks,
                'otherExpenses': att.otherExpenses
            }
        
        return {
            "success": True,
            "data": {
                "EMP": [
                    {
                        'id': e.id,
                        'name': e.name,
                        'org': e.org,
                        'branch': e.branch,
                        'designation': e.designation,
                        'phone': e.phone,
                        'email': e.email,
                        'acct': e.acct,
                        'bank': e.bank,
                        'ifsc': e.ifsc,
                        'doj': e.doj,
                        'gross': e.gross,
                        'travellingAllowance': e.travellingAllowance,
                        'otherConveyance': e.otherConveyance,
                        'telephoneExpenses': e.telephoneExpenses,
                        'otherExpenses': e.otherExpenses,
                        'salaryBatch': e.salaryBatch,
                        'salaryBasis': e.salaryBasis,
                        'lastIncrement': e.lastIncrement,
                        'pass': e.emp_pass,
                        'salaryHistory': e.salaryHistory,
                        'advanceBalance': e.advanceBalance,
                        'advanceHistory': e.advanceHistory,
                        'leaveBalance': e.leaveBalance
                    }
                    for e in employees
                ],
                "PAY": payroll_by_month,
                "LEAVE_APPS": [
                    {
                        'id': l.id,
                        'empId': l.empId,
                        'empName': l.empName,
                        'leaveType': l.leaveType,
                        'fromDate': l.fromDate,
                        'toDate': l.toDate,
                        'days': l.days,
                        'reason': l.reason,
                        'status': l.status,
                        'appliedOn': l.appliedOn.isoformat() if l.appliedOn else None,
                        'approvedBy': l.approvedBy,
                        'approvedOn': l.approvedOn.isoformat() if l.approvedOn else None
                    }
                    for l in leaves
                ],
                "EXPENSE_CLAIMS": [
                    {
                        'id': ex.id,
                        'empId': ex.empId,
                        'empName': ex.empName,
                        'category': ex.category,
                        'amount': ex.amount,
                        'description': ex.description,
                        'claimDate': ex.claimDate,
                        'status': ex.status,
                        'receiptUrl': ex.receiptUrl,
                        'appliedOn': ex.appliedOn.isoformat() if ex.appliedOn else None,
                        'approvedBy': ex.approvedBy,
                        'approvedOn': ex.approvedOn.isoformat() if ex.approvedOn else None,
                        'payrollMonth': ex.payrollMonth
                    }
                    for ex in expenses
                ],
                "ORGS": [
                    {
                        'id': o.id,
                        'name': o.name,
                        'shortName': o.shortName,
                        'color': o.color,
                        'branches': o.branches,
                        'address': o.address,
                        'phone': o.phone,
                        'email': o.email,
                        'website': o.website
                    }
                    for o in orgs
                ],
                "EMP_DOCS": [
                    {
                        'id': d.id,
                        'empId': d.empId,
                        'docType': d.docType,
                        'fileName': d.fileName,
                        'fileUrl': d.fileUrl,
                        'uploadedAt': d.uploadedAt.isoformat() if d.uploadedAt else None,
                        'fileSize': d.fileSize
                    }
                    for d in docs
                ],
                "ATT_DATA": attendance_data,
                "HR_PASS": hr_pass
            }
        }
    except Exception as e:
        logger.error(f"Error fetching all data: {str(e)}")
        return {"success": False, "error": str(e)}

@app.post("/api/data/save")
async def save_all_data(payload: dict, db: Session = Depends(get_db)):
    """Save all application data to database"""
    try:
        data = payload.get('data', {})
        
        # Save employees
        if 'EMP' in data:
            for emp_data in data['EMP']:
                existing = db.query(models.Employee).filter(
                    models.Employee.id == emp_data['id']
                ).first()
                
                # Map 'pass' to 'emp_pass' for database
                emp_data_copy = emp_data.copy()
                if 'pass' in emp_data_copy:
                    emp_data_copy['emp_pass'] = emp_data_copy.pop('pass')
                
                if existing:
                    # Update existing employee
                    for key, value in emp_data_copy.items():
                        if hasattr(existing, key):
                            setattr(existing, key, value)
                else:
                    # Create new employee
                    employee = models.Employee(**emp_data_copy)
                    db.add(employee)
        
        # Save payroll records
        if 'PAY' in data:
            for month, month_data in data['PAY'].items():
                for record in month_data.get('records', []):
                    existing = db.query(models.PayrollRecord).filter(
                        models.PayrollRecord.empId == record.get('empId'),
                        models.PayrollRecord.month == record.get('month')
                    ).first()
                    
                    if existing:
                        # Update existing record
                        for key, value in record.items():
                            if hasattr(existing, key):
                                setattr(existing, key, value)
                    else:
                        # Create new record
                        payroll_record = models.PayrollRecord(
                            empId=record.get('empId'),
                            month=record.get('month'),
                            gross=record.get('gross', 0),
                            netPayable=record.get('netPayable', 0),
                            paidAmount=record.get('paidAmount', 0),
                            balanceAmount=record.get('balanceAmount', 0)
                        )
                        db.add(payroll_record)
        
        # Save leave applications
        if 'LEAVE_APPS' in data:
            for leave_data in data['LEAVE_APPS']:
                if leave_data.get('id'):
                    existing = db.query(models.LeaveApplication).filter(
                        models.LeaveApplication.id == leave_data['id']
                    ).first()
                    
                    if existing:
                        for key, value in leave_data.items():
                            if key in ['appliedOn', 'approvedOn'] and value:
                                from datetime import datetime
                                setattr(existing, key, datetime.fromisoformat(value))
                            elif hasattr(existing, key):
                                setattr(existing, key, value)
                else:
                    # Create new leave application
                    leave = models.LeaveApplication(
                        empId=leave_data.get('empId'),
                        empName=leave_data.get('empName'),
                        leaveType=leave_data.get('leaveType'),
                        fromDate=leave_data.get('fromDate'),
                        toDate=leave_data.get('toDate'),
                        days=leave_data.get('days', 0),
                        reason=leave_data.get('reason'),
                        status=leave_data.get('status', 'Pending')
                    )
                    db.add(leave)
        
        # Save expense claims
        if 'EXPENSE_CLAIMS' in data:
            for expense_data in data['EXPENSE_CLAIMS']:
                if expense_data.get('id'):
                    existing = db.query(models.ExpenseClaim).filter(
                        models.ExpenseClaim.id == expense_data['id']
                    ).first()
                    
                    if existing:
                        for key, value in expense_data.items():
                            if key in ['appliedOn', 'approvedOn'] and value:
                                from datetime import datetime
                                setattr(existing, key, datetime.fromisoformat(value))
                            elif hasattr(existing, key):
                                setattr(existing, key, value)
                else:
                    # Create new expense claim
                    expense = models.ExpenseClaim(
                        empId=expense_data.get('empId'),
                        empName=expense_data.get('empName'),
                        category=expense_data.get('category'),
                        amount=expense_data.get('amount', 0),
                        description=expense_data.get('description'),
                        claimDate=expense_data.get('claimDate'),
                        status=expense_data.get('status', 'Pending'),
                        payrollMonth=expense_data.get('payrollMonth')
                    )
                    db.add(expense)
        
        # Save organizations
        if 'ORGS' in data:
            for org_data in data['ORGS']:
                existing = db.query(models.Organization).filter(
                    models.Organization.id == org_data['id']
                ).first()
                
                if existing:
                    for key, value in org_data.items():
                        if hasattr(existing, key):
                            setattr(existing, key, value)
                else:
                    org = models.Organization(**org_data)
                    db.add(org)
        
        # Save employee documents
        if 'EMP_DOCS' in data:
            for doc_data in data['EMP_DOCS']:
                if doc_data.get('id'):
                    existing = db.query(models.EmployeeDocument).filter(
                        models.EmployeeDocument.id == doc_data['id']
                    ).first()
                    
                    if existing:
                        for key, value in doc_data.items():
                            if key == 'uploadedAt' and value:
                                from datetime import datetime
                                setattr(existing, key, datetime.fromisoformat(value))
                            elif hasattr(existing, key):
                                setattr(existing, key, value)
                else:
                    # Create new document
                    doc = models.EmployeeDocument(
                        empId=doc_data.get('empId'),
                        docType=doc_data.get('docType'),
                        fileName=doc_data.get('fileName'),
                        fileUrl=doc_data.get('fileUrl'),
                        fileSize=doc_data.get('fileSize')
                    )
                    db.add(doc)
        
        # Save attendance data
        if 'ATT_DATA' in data:
            for month, emp_data in data['ATT_DATA'].items():
                for emp_id, att_data in emp_data.items():
                    existing = db.query(models.AttendanceData).filter(
                        models.AttendanceData.month == month,
                        models.AttendanceData.empId == emp_id
                    ).first()
                    
                    if existing:
                        for key, value in att_data.items():
                            if hasattr(existing, key):
                                setattr(existing, key, value)
                    else:
                        att = models.AttendanceData(
                            month=month,
                            empId=emp_id,
                            presentDays=att_data.get('presentDays', 0),
                            absentDays=att_data.get('absentDays', 0),
                            holidays=att_data.get('holidays', 0),
                            halfDays=att_data.get('halfDays', 0),
                            overtimeHours=att_data.get('overtimeHours', 0),
                            remarks=att_data.get('remarks'),
                            otherExpenses=att_data.get('otherExpenses', 0)
                        )
                        db.add(att)
        
        # Save HR password
        if 'HR_PASS' in data:
            existing = db.query(models.SystemSettings).filter(
                models.SystemSettings.key == 'hr_password'
            ).first()
            
            if existing:
                existing.value = data['HR_PASS']
                existing.updatedAt = datetime.now()
            else:
                setting = models.SystemSettings(
                    key='hr_password',
                    value=data['HR_PASS'],
                    updatedAt=datetime.now()
                )
                db.add(setting)
        
        db.commit()
        return {"success": True, "message": "Data saved successfully"}
        
    except Exception as e:
        db.rollback()
        logger.error(f"Error saving data: {str(e)}")
        return {"success": False, "error": str(e)}

@app.get("/api/import-employees")
def import_employees_endpoint(db: Session = Depends(get_db)):
    """Manual endpoint to import employees from exported_employees.json"""
    try:
        # Check if employees already exist
        existing_count = db.query(models.Employee).count()
        
        if existing_count > 0:
            return {
                "status": "ok",
                "message": f"Database already has {existing_count} employees",
                "imported": 0
            }
        
        # Try to load from exported_employees.json
        import_file = os.path.join(os.path.dirname(__file__), 'exported_employees.json')
        
        if not os.path.exists(import_file):
            return {
                "status": "error",
                "message": f"Import file not found: {import_file}"
            }
        
        with open(import_file, 'r', encoding='utf-8') as f:
            backup_data = json.load(f)
        
        employees_data = backup_data.get('EMP', [])
        
        if not employees_data:
            return {
                "status": "error",
                "message": "No employees found in import file"
            }
        
        # Import employees
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
        
        logger.info(f"✅ Imported {len(employees_data)} employees via API endpoint")
        
        return {
            "status": "ok",
            "message": f"Successfully imported {len(employees_data)} employees",
            "imported": len(employees_data)
        }
        
    except Exception as e:
        db.rollback()
        logger.error(f"Error during import: {str(e)}")
        return {
            "status": "error",
            "message": str(e)
        }



# ═══════════════════════════════════════════════════════════════
# EMAIL SERVICE ENDPOINTS (Integrated)
# ═══════════════════════════════════════════════════════════════

logger.info("📧 Email Service integrated into FastAPI backend")


@app.post("/api/send-payslip-email")
async def send_payslip_email(payload: dict, db: Session = Depends(get_db)) -> dict:
    """Send payslip email with PDF attachment"""
    
    def format_error_message(error_raw):
        """Format error message, handling JSON strings from providers."""
        if not error_raw:
            return "Email sending failed"
        
        if isinstance(error_raw, str):
            if error_raw.startswith('{'):
                try:
                    error_json = json.loads(error_raw)
                    return error_json.get('message', error_raw)
                except json.JSONDecodeError:
                    pass
        
        return str(error_raw)
    
    # Initialize response variables
    final_status = 'Failed'
    final_error = None
    payroll_record_updated = False
    
    try:
        emp_id = payload.get('empId')
        month = payload.get('month')
        custom_email = payload.get('customEmail')
        custom_subject = payload.get('customSubject')
        custom_message = payload.get('customMessage')
        req_employee = payload.get('employee')
        req_payroll = payload.get('payroll')
        
        logger.info(f"[EMAIL] API request started - empId: {emp_id}, month: {month}")
        
        # Get employee and payroll data from request or database
        employee = req_employee
        payroll = req_payroll
        
        if not employee or not payroll:
            # Fetch from database
            logger.info(f"[EMAIL] Fetching employee and payroll data from database")
            emp_record = db.query(models.Employee).filter(models.Employee.id == emp_id).first()
            if not emp_record:
                logger.error(f"[EMAIL] Employee not found: {emp_id}")
                raise HTTPException(status_code=404, detail="Employee not found")
            
            payroll_record = db.query(models.PayrollRecord).filter(
                models.PayrollRecord.empId == emp_id,
                models.PayrollRecord.month == month
            ).first()
            if not payroll_record:
                logger.error(f"[EMAIL] Payroll record not found for empId: {emp_id}, month: {month}")
                raise HTTPException(status_code=404, detail="Payroll record not found")
            
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
        logger.info(f"[EMAIL] Getting email service and preparing to send")
        email_service = get_email_service()
        to_email = custom_email or employee.get('email')
        
        logger.info(f"[EMAIL] Calling email service send_payslip_email for {to_email}")
        result = email_service.send_payslip_email(
            employee=employee,
            payroll=payroll,
            to_email=to_email,
            subject=custom_subject,
            message=custom_message
        )
        logger.info(f"[EMAIL] Email service returned - success: {result.get('success')}")
        
        # Determine final status
        final_status = 'Sent' if result.get('success') else 'Failed'
        final_error = result.get('error') or result.get('details') if not result.get('success') else None
        
        # Store in email history
        sent_at_timestamp = None
        try:
            logger.info(f"[EMAIL] Recording email history")
            emp_name = employee.get('name', 'Employee')
            sent_at_timestamp = datetime.now()
            try:
                from backend.models import EmailHistory
            except Exception:
                from models import EmailHistory
            
            email_history = EmailHistory(
                empId=emp_id,
                empName=emp_name,
                email=to_email,
                month=month,
                sentAt=sent_at_timestamp,
                status=final_status,
                errorMessage=final_error
            )
            db.add(email_history)
            db.commit()
            logger.info(f"[EMAIL HISTORY] Database updated - empId: {emp_id}, status: {final_status}, sentAt: {sent_at_timestamp}")
        except Exception as db_error:
            logger.error(f"[EMAIL HISTORY] Could not record email history: {str(db_error)}")
            db.rollback()

        # Format the error message for better display
        formatted_error = None if final_status == 'Sent' else format_error_message(final_error)

        status_code = 200 if final_status == 'Sent' else 502
        response_body = {
            'success': (final_status == 'Sent'),
            'status': final_status.lower(),
            'sent_at': sent_at_timestamp.isoformat() if sent_at_timestamp else None,
            'message': result.get('message') or ('Email sent successfully' if final_status == 'Sent' else 'Email sending failed'),
            'error': formatted_error,
            'provider': result.get('provider'),
            'email': to_email,
            'employee_id': emp_id,
            'month': month,
        }
        
        logger.info(f"[EMAIL] Final status returned to frontend - success: {response_body['success']}, status: {response_body['status']}, sent_at: {response_body['sent_at']}")
        return JSONResponse(status_code=status_code, content=response_body)
    
    except HTTPException as http_exc:
        # Handle HTTP exceptions (404, etc.)
        logger.error(f"[EMAIL] HTTP Exception: {http_exc.detail}")
        final_error = str(http_exc.detail)
        
        return JSONResponse(status_code=http_exc.status_code, content={
            'success': False,
            'status': 'failed',
            'message': 'Email sending failed',
            'error': final_error,
        })
    
    except Exception as e:
        # Handle all other exceptions
        error_msg = f"Error sending payslip email: {str(e)}"
        logger.error(f"[EMAIL] Unexpected exception: {error_msg}", exc_info=True)
        
        return JSONResponse(status_code=500, content={
            'success': False,
            'status': 'failed',
            'message': 'Email sending failed due to server error',
            'error': error_msg,
        })


@app.get("/api/email-history/{empId}")
async def get_email_history(empId: str, db: Session = Depends(get_db)) -> dict:
    """Get email history for an employee"""
    try:
        logger.info(f"[EMAIL HISTORY] Fetching history for employee: {empId}")
        try:
            from backend.models import EmailHistory
        except Exception:
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
        try:
            from backend.models import EmailHistory
        except Exception:
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


@app.get("/api/email-history/{empId}/{month}")
async def get_email_history_for_emp_month(empId: str, month: str, db: Session = Depends(get_db)) -> dict:
    """Get email history for a specific employee and month"""
    try:
        logger.info(f"[EMAIL HISTORY] Fetching history for empId: {empId}, month: {month}")
        try:
            from backend.models import EmailHistory
        except Exception:
            from models import EmailHistory
        
        history = db.query(EmailHistory).filter(
            EmailHistory.empId == empId,
            EmailHistory.month == month
        ).order_by(EmailHistory.sentAt.desc()).first()
        
        if history:
            return {
                "success": True,
                "emailStatus": {
                    "id": history.id,
                    "empId": history.empId,
                    "empName": history.empName,
                    "email": history.email,
                    "month": history.month,
                    "sentAt": history.sentAt.isoformat() if history.sentAt else None,
                    "status": history.status.lower(),
                    "errorMessage": history.errorMessage
                }
            }
        else:
            return {
                "success": True,
                "emailStatus": None
            }
    except Exception as e:
        error_msg = f"Failed to fetch email history: {str(e)}"
        logger.error(f"❌ {error_msg}")
        return {"success": False, "error": error_msg, "emailStatus": None}


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


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)


