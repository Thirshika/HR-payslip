# Component Mapping for React Migration

This document maps the original `frontend/index.html` UI sections to React components in the scaffold.

## Top-level pages

- `Login.jsx`
  - original login screen and login tabs (`HR Admin` / `Employee`)
  - maps to the original `#loginScreen` section

- `HRAdminPage.jsx`
  - entire HR admin interface
  - maps to original `#hrScreen` including navigation, sidebar, topnav, and content area

- `EmployeePage.jsx`
  - employee portal interface
  - maps to original `#empScreen`

## Shared layout components

- `TopNav.jsx`
  - top navigation bar shared by HR and employee screens
  - maps to original `.topnav`

- `Sidebar.jsx`
  - left-side HR navigation menu
  - maps to original `.sidebar` and `.snav`

- `Modal.jsx`
  - modal dialog scaffold
  - maps to original `.modal-ov`, `.modal`, `.modal-head`, `.modal-body`, `.modal-foot`

- `Toast.jsx`
  - toast notification UI
  - maps to original `.toast`

## Content pages and placeholders

- `Dashboard.jsx`
  - HR dashboard placeholder for summary cards and dashboard widgets
  - maps to original HR dashboard landing content

- `EmployeeList.jsx`
  - employee table page
  - maps to original `Employees` page layout and records table

- `PayrollGenerator.jsx`
  - payroll generation page stub
  - maps to original `Generate Payroll` section

- `PayslipView.jsx`
  - payslip preview page stub
  - maps to original employee payslip output and print area

## API layer

- `api/apiClient.js`
  - generic fetch helper

- `api/auth.js`
  - authentication API calls

- `api/employees.js`
  - employee data API calls

## Notes

- Keep the original `frontend/index.html` as a reference file while migrating.
- Use this scaffold to gradually migrate specific page content from the original HTML into React components.
- The current React app is intentionally minimal and can be expanded page-by-page.
