#!/usr/bin/env python
"""
Migration script to add new columns to existing database
"""
import os
from dotenv import load_dotenv
from sqlalchemy import text
import database

load_dotenv()

def migrate_database():
    """Add new columns to existing database tables"""
    
    db = database.SessionLocal()
    
    try:
        # Get database connection
        connection = db.connection()
        
        print("🔄 Starting database migration...")
        
        # Check and add new columns to employees table (use quoted identifiers for PostgreSQL)
        employee_columns = [
            ('acct', 'VARCHAR(255)'),
            ('bank', 'VARCHAR(255)'),
            ('ifsc', 'VARCHAR(50)'),
            ('doj', 'VARCHAR(50)'),
            ('gross', 'FLOAT DEFAULT 0'),
            ('travellingAllowance', 'FLOAT DEFAULT 0'),
            ('otherConveyance', 'FLOAT DEFAULT 0'),
            ('telephoneExpenses', 'FLOAT DEFAULT 0'),
            ('otherExpenses', 'FLOAT DEFAULT 0'),
            ('salaryBatch', 'VARCHAR(50)'),
            ('salaryBasis', 'VARCHAR(50)'),
            ('lastIncrement', 'VARCHAR(50)'),
            ('emp_pass', 'VARCHAR(255)'),
            ('salaryHistory', 'JSONB'),
            ('advanceBalance', 'FLOAT DEFAULT 0'),
            ('advanceHistory', 'JSONB'),
            ('leaveBalance', 'JSONB')
        ]
        
        for column_name, column_type in employee_columns:
            try:
                # Check if column exists
                check_query = text(f"""
                    SELECT column_name 
                    FROM information_schema.columns 
                    WHERE table_name = 'employees' 
                    AND column_name = '{column_name}'
                """)
                result = connection.execute(check_query).fetchone()
                
                if not result:
                    # Add column if it doesn't exist (use quoted identifier for PostgreSQL)
                    alter_query = text(f'ALTER TABLE employees ADD COLUMN "{column_name}" {column_type}')
                    connection.execute(alter_query)
                    print(f"✅ Added column: {column_name}")
                else:
                    print(f"⏭️  Column already exists: {column_name}")
                    
            except Exception as e:
                print(f"❌ Error adding column {column_name}: {str(e)}")
        
        # Create new tables if they don't exist
        new_tables = [
            """
            CREATE TABLE IF NOT EXISTS leave_applications (
                id SERIAL PRIMARY KEY,
                empId VARCHAR(64) NOT NULL,
                empName VARCHAR(255) NOT NULL,
                leaveType VARCHAR(50) NOT NULL,
                fromDate VARCHAR(50) NOT NULL,
                toDate VARCHAR(50) NOT NULL,
                days INTEGER DEFAULT 0,
                reason TEXT,
                status VARCHAR(50) DEFAULT 'Pending',
                appliedOn TIMESTAMP,
                approvedBy VARCHAR(255),
                approvedOn TIMESTAMP
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS expense_claims (
                id SERIAL PRIMARY KEY,
                empId VARCHAR(64) NOT NULL,
                empName VARCHAR(255) NOT NULL,
                category VARCHAR(100) NOT NULL,
                amount FLOAT DEFAULT 0,
                description TEXT,
                claimDate VARCHAR(50) NOT NULL,
                status VARCHAR(50) DEFAULT 'Pending',
                receiptUrl VARCHAR(500),
                appliedOn TIMESTAMP,
                approvedBy VARCHAR(255),
                approvedOn TIMESTAMP,
                payrollMonth VARCHAR(50)
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS organizations (
                id VARCHAR(64) PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                shortName VARCHAR(100) NOT NULL,
                color VARCHAR(50),
                branches JSON,
                address TEXT,
                phone VARCHAR(50),
                email VARCHAR(255),
                website VARCHAR(255)
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS employee_documents (
                id SERIAL PRIMARY KEY,
                empId VARCHAR(64) NOT NULL,
                docType VARCHAR(50) NOT NULL,
                fileName VARCHAR(255) NOT NULL,
                fileUrl VARCHAR(500),
                uploadedAt TIMESTAMP,
                fileSize INTEGER
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS attendance_data (
                id SERIAL PRIMARY KEY,
                month VARCHAR(50) NOT NULL,
                empId VARCHAR(64) NOT NULL,
                presentDays INTEGER DEFAULT 0,
                absentDays INTEGER DEFAULT 0,
                holidays INTEGER DEFAULT 0,
                halfDays INTEGER DEFAULT 0,
                overtimeHours FLOAT DEFAULT 0,
                remarks TEXT,
                otherExpenses FLOAT DEFAULT 0
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS system_settings (
                id SERIAL PRIMARY KEY,
                key VARCHAR(100) UNIQUE NOT NULL,
                value TEXT,
                updatedAt TIMESTAMP
            )
            """
        ]
        
        for table_sql in new_tables:
            try:
                connection.execute(text(table_sql))
                print("✅ Created/verified table")
            except Exception as e:
                print(f"⚠️ Table creation warning: {str(e)}")
        
        # Create indexes for better performance (use quoted identifiers for case sensitivity)
        indexes = [
            'CREATE INDEX IF NOT EXISTS idx_leave_applications_empId ON leave_applications("empId")',
            'CREATE INDEX IF NOT EXISTS idx_expense_claims_empId ON expense_claims("empId")',
            'CREATE INDEX IF NOT EXISTS idx_attendance_data_month ON attendance_data("month")',
            'CREATE INDEX IF NOT EXISTS idx_attendance_data_empId ON attendance_data("empId")',
            'CREATE INDEX IF NOT EXISTS idx_system_settings_key ON system_settings("key")'
        ]
        
        for index_sql in indexes:
            try:
                connection.execute(text(index_sql))
                print("✅ Created/verified index")
            except Exception as e:
                print(f"⚠️ Index creation warning: {str(e)}")
        
        connection.commit()
        print("\n" + "="*50)
        print("✅ DATABASE MIGRATION COMPLETED SUCCESSFULLY!")
        print("="*50)
        
    except Exception as e:
        connection.rollback()
        print(f"\n❌ Migration failed: {str(e)}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    migrate_database()
