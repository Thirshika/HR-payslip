from sqlalchemy import Column, String, Float, Integer, DateTime, Text, JSON
try:
    # Prefer package-relative import when running as a package
    from .database import Base
except Exception:
    # Fallback to absolute import when running as a module (uvicorn main:app)
    from database import Base

class Employee(Base):
    __tablename__ = 'employees'

    id = Column(String(64), primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    org = Column(String(255), nullable=False)
    branch = Column(String(255), nullable=False)
    designation = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=False)
    email = Column(String(255), nullable=False)
    # Additional fields from frontend
    acct = Column(String(255), nullable=True)
    bank = Column(String(255), nullable=True)
    ifsc = Column(String(50), nullable=True)
    doj = Column(String(50), nullable=True)
    gross = Column(Float, default=0)
    travellingAllowance = Column(Float, default=0)
    otherConveyance = Column(Float, default=0)
    telephoneExpenses = Column(Float, default=0)
    otherExpenses = Column(Float, default=0)
    salaryBatch = Column(String(50), nullable=True)
    salaryBasis = Column(String(50), nullable=True)
    lastIncrement = Column(String(50), nullable=True)
    emp_pass = Column(String(255), nullable=True)
    salaryHistory = Column(JSON, nullable=True)
    advanceBalance = Column(Float, default=0)
    advanceHistory = Column(JSON, nullable=True)
    leaveBalance = Column(JSON, nullable=True)

class PayrollRecord(Base):
    __tablename__ = 'payroll_records'

    id = Column(Integer, primary_key=True, index=True)
    empId = Column(String(64), nullable=False, index=True)
    month = Column(String(50), nullable=False, index=True)
    gross = Column(Float, default=0)
    netPayable = Column(Float, default=0)
    paidAmount = Column(Float, default=0)
    balanceAmount = Column(Float, default=0)

class EmailHistory(Base):
    __tablename__ = 'email_history'

    id = Column(Integer, primary_key=True, index=True)
    empId = Column(String(64), nullable=False, index=True)
    empName = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    month = Column(String(50), nullable=False, index=True)
    sentAt = Column(DateTime, nullable=True)
    status = Column(String(50), nullable=False, default='Pending')
    errorMessage = Column(Text, nullable=True)

class LeaveApplication(Base):
    __tablename__ = 'leave_applications'

    id = Column(Integer, primary_key=True, index=True)
    empId = Column(String(64), nullable=False, index=True)
    empName = Column(String(255), nullable=False)
    leaveType = Column(String(50), nullable=False)
    fromDate = Column(String(50), nullable=False)
    toDate = Column(String(50), nullable=False)
    days = Column(Integer, default=0)
    reason = Column(Text, nullable=True)
    status = Column(String(50), default='Pending')
    appliedOn = Column(DateTime, nullable=True)
    approvedBy = Column(String(255), nullable=True)
    approvedOn = Column(DateTime, nullable=True)

class ExpenseClaim(Base):
    __tablename__ = 'expense_claims'

    id = Column(Integer, primary_key=True, index=True)
    empId = Column(String(64), nullable=False, index=True)
    empName = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False)
    amount = Column(Float, default=0)
    description = Column(Text, nullable=True)
    claimDate = Column(String(50), nullable=False)
    status = Column(String(50), default='Pending')
    receiptUrl = Column(String(500), nullable=True)
    appliedOn = Column(DateTime, nullable=True)
    approvedBy = Column(String(255), nullable=True)
    approvedOn = Column(DateTime, nullable=True)
    payrollMonth = Column(String(50), nullable=True)

class Organization(Base):
    __tablename__ = 'organizations'

    id = Column(String(64), primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    shortName = Column(String(100), nullable=False)
    color = Column(String(50), nullable=True)
    branches = Column(JSON, nullable=True)
    address = Column(Text, nullable=True)
    phone = Column(String(50), nullable=True)
    email = Column(String(255), nullable=True)
    website = Column(String(255), nullable=True)

class EmployeeDocument(Base):
    __tablename__ = 'employee_documents'

    id = Column(Integer, primary_key=True, index=True)
    empId = Column(String(64), nullable=False, index=True)
    docType = Column(String(50), nullable=False)
    fileName = Column(String(255), nullable=False)
    fileUrl = Column(String(500), nullable=True)
    uploadedAt = Column(DateTime, nullable=True)
    fileSize = Column(Integer, nullable=True)

class AttendanceData(Base):
    __tablename__ = 'attendance_data'

    id = Column(Integer, primary_key=True, index=True)
    month = Column(String(50), nullable=False, index=True)
    empId = Column(String(64), nullable=False, index=True)
    presentDays = Column(Integer, default=0)
    absentDays = Column(Integer, default=0)
    holidays = Column(Integer, default=0)
    halfDays = Column(Integer, default=0)
    overtimeHours = Column(Float, default=0)
    remarks = Column(Text, nullable=True)
    otherExpenses = Column(Float, default=0)

class SystemSettings(Base):
    __tablename__ = 'system_settings'

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String(100), unique=True, nullable=False, index=True)
    value = Column(Text, nullable=True)
    updatedAt = Column(DateTime, nullable=True)
