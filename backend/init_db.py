import sys
import os
sys.path.append(os.path.dirname(__file__))

from database import engine, Base
from models import Employee, PayrollRecord, EmailHistory

def init_db():
    """Create all tables in the database."""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")

if __name__ == "__main__":
    init_db()
