# React Frontend Scaffold

This folder now contains a React frontend scaffold for the HR Payslip System.

## Structure

- `public/index.html` — React app shell and entry point.
- `src/index.jsx` — React runtime bootstrap.
- `src/App.jsx` — top-level app state and page routing.
- `src/components/` — reusable view components.
- `src/api/` — API helper functions for backend communication.
- `src/styles/globals.css` — app styles.

## Usage

1. Install dependencies in `frontend`:
   ```bash
   cd frontend
   npm install
   ```
2. Start the local React app:
   ```bash
   npm run dev
   ```
3. The app will run using Vite at `http://localhost:5173` by default.

## Notes

- The original `frontend/index.html` file is kept as a reference copy and should not be edited.
- Use the current scaffold to gradually migrate UI sections into React components.
- See `COMPONENT_MAP.md` for a direct mapping from the original HTML sections into the new React component structure.
- Connect the React components to the backend API using `src/api/*` functions.
