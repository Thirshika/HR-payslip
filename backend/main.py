from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from sqlalchemy.orm import Session
import os

from . import models
from . import database

app = FastAPI(title="HR Payslip API")

# Add CORS middleware for frontend access
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

database.Base.metadata.create_all(bind=database.engine)

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
