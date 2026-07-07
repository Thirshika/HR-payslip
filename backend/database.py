import os
from urllib.parse import quote_plus
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Load .env from the backend directory explicitly.
dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path)

# Set your PostgreSQL connection URL in the environment, or use the local default below.
# Update username, password, host, port, and database name for your PostgreSQL server.
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

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
