# Backend SQL Database Setup

This backend is now configured to use SQLAlchemy with a MySQL database by default.

## How it connects

- `backend/database.py` creates a SQLAlchemy engine:
  - default: `mysql+pymysql://root:password@localhost:3306/hr_pay_db`
- `backend/models.py` defines the ORM tables:
  - `Employee`
  - `PayrollRecord`
- `backend/main.py` uses `Depends(get_db)` to inject a database session into API routes.

## Using .env

The backend can read the database URL from `backend/.env`.

Example `backend/.env`:

```env
SQLALCHEMY_DATABASE_URL=mysql+pymysql://hruser:MyPassword@localhost:3306/hr_pay_db
```

## Running the backend

1. Install dependencies:
   ```bash
   cd backend
   python -m pip install -r requirements.txt
   ```
2. Start the API:
   ```bash
   uvicorn backend.main:app --reload
   ```

## Notes

- If you do not set `SQLALCHEMY_DATABASE_URL`, the backend uses the default MySQL URL shown above.
- The new SQL-backed routes are:
  - `GET /api/employees`
  - `GET /api/payroll/{month}`
  - `POST /api/employee`
- The login route is still hardcoded in `backend/main.py` and should be replaced with proper auth later.
