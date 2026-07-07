import sys
import os
sys.path.append(os.path.dirname(__file__))

from database import engine
from sqlalchemy import text

def test_connection():
    """Test database connection and list tables."""
    try:
        print("Testing database connection...")
        with engine.connect() as conn:
            # Test basic connection
            result = conn.execute(text("SELECT version()"))
            version = result.fetchone()
            print(f"✓ Connected to PostgreSQL: {version[0]}")
            
            # List all tables
            result = conn.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
                ORDER BY table_name
            """))
            tables = [row[0] for row in result.fetchall()]
            print(f"✓ Tables in database: {tables}")
            
            # Check if our tables exist
            expected_tables = ['employees', 'payroll_records', 'email_history']
            for table in expected_tables:
                if table in tables:
                    print(f"✓ Table '{table}' exists")
                else:
                    print(f"✗ Table '{table}' NOT found")
                    
        print("\n✓ Database is live and accessible!")
        return True
        
    except Exception as e:
        print(f"\n✗ Database connection failed: {e}")
        return False

if __name__ == "__main__":
    test_connection()
