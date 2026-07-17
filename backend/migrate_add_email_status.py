"""
Migration script to add email status columns to payroll_records table.
Run this script to update existing PostgreSQL databases with the new email tracking fields.
"""

import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from urllib.parse import quote_plus

# Load .env from the backend directory
dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path)

def get_database_url():
    """Get the database URL from environment variables."""
    SQLALCHEMY_DATABASE_URL = os.getenv(
        "SQLALCHEMY_DATABASE_URL",
        "postgresql+psycopg2://admin:password@localhost:5432/hr_pay_db"
    )
    
    # If individual DB credentials are provided, construct the URL
    if not os.getenv("SQLALCHEMY_DATABASE_URL") and os.getenv("DB_HOST"):
        DB_HOST = os.getenv("DB_HOST")
        DB_PORT = os.getenv("DB_PORT", "5432")
        DB_NAME = quote_plus(os.getenv("DB_NAME", ""))
        DB_USER = quote_plus(os.getenv("DB_USER", ""))
        DB_PASSWORD = quote_plus(os.getenv("DB_PASSWORD", ""))
        SQLALCHEMY_DATABASE_URL = f"postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    
    return SQLALCHEMY_DATABASE_URL

def migrate_database():
    """Add email_status, email_sent_at, and email_error columns to payroll_records table."""
    
    db_url = get_database_url()
    print(f"📦 Migrating database: {db_url}")
    
    try:
        engine = create_engine(db_url)
        
        with engine.connect() as conn:
            # Check if columns already exist
            result = conn.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'payroll_records'
            """))
            existing_columns = [row[0] for row in result]
            
            # Add email_status column if it doesn't exist
            if 'email_status' not in existing_columns:
                print("➕ Adding email_status column...")
                conn.execute(text("ALTER TABLE payroll_records ADD COLUMN email_status VARCHAR(50) DEFAULT 'Pending'"))
                conn.commit()
                print("✅ email_status column added")
            else:
                print("⏭️  email_status column already exists")
            
            # Add email_sent_at column if it doesn't exist
            if 'email_sent_at' not in existing_columns:
                print("➕ Adding email_sent_at column...")
                conn.execute(text("ALTER TABLE payroll_records ADD COLUMN email_sent_at TIMESTAMP"))
                conn.commit()
                print("✅ email_sent_at column added")
            else:
                print("⏭️  email_sent_at column already exists")
            
            # Add email_error column if it doesn't exist
            if 'email_error' not in existing_columns:
                print("➕ Adding email_error column...")
                conn.execute(text("ALTER TABLE payroll_records ADD COLUMN email_error TEXT"))
                conn.commit()
                print("✅ email_error column added")
            else:
                print("⏭️  email_error column already exists")
        
        print("\n✅ Migration completed successfully!")
        print("📝 The following columns are now available in payroll_records:")
        print("   - email_status (VARCHAR(50), default: 'Pending')")
        print("   - email_sent_at (TIMESTAMP)")
        print("   - email_error (TEXT)")
        
        return True
        
    except Exception as e:
        print(f"❌ Migration failed: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    migrate_database()
