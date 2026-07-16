from sqlalchemy import Column, String, Float, Integer, DateTime, Text
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
