# HR Payslip System

This workspace now has a structured layout for frontend and backend development.

## Project structure

- `frontend/index.html` — current HTML/CSS/JS app copied from the original file.
- `backend/main.py` — sample FastAPI backend scaffold.
- `backend/requirements.txt` — backend Python dependencies.
- `hr_tatti_v7_Final_29.5.26.html` — original file kept in the root for backup.

## Next step

Use the frontend file as the UI reference and connect it to the backend via API calls.

For a minimal run:

1. Install backend dependencies in a Python environment.
2. Start the backend with:
   ```bash
   uvicorn backend.main:app --reload
   ```
3. Point the frontend `fetch` calls to `http://localhost:8000/api/...`.
