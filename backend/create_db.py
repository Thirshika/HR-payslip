import sys
import os
sys.path.append(os.path.dirname(__file__))

from sqlalchemy import create_engine, text

# Connect to default postgres database to create the new database
DEFAULT_DB_URL = "postgresql+psycopg2://admin:kbOZpYYBZLfoeQRlBFajBfxi8A2JwPwk@dpg-ctlpcvrqf0us7389o680-a.singapore-postgres.render.com:5432/postgres"

def create_database():
    """Create the hr pay database."""
    print("Connecting to PostgreSQL server...")
    engine = create_engine(DEFAULT_DB_URL, isolation_level="AUTOCOMMIT")
    
    with engine.connect() as conn:
        # Check if database exists
        result = conn.execute(text("SELECT 1 FROM pg_database WHERE datname = 'hr pay'"))
        exists = result.fetchone()
        
        if exists:
            print("Database 'hr pay' already exists.")
        else:
            # Create the database with the exact name including space
            conn.execute(text('CREATE DATABASE "hr pay"'))
            print("Database 'hr pay' created successfully!")
    
    engine.dispose()

if __name__ == "__main__":
    create_database()
