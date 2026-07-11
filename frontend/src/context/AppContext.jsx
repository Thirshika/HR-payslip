/**
 * ═══════════════════════════════════════════════════════════════
 * HR PAYSLIP SYSTEM - GLOBAL STATE CONTEXT
 * ═══════════════════════════════════════════════════════════════
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  DEFAULT_ORGS,
  STORAGE_KEYS,
  DEFAULT_HR_PASS,
  DOC_TYPES,
  LEAVE_TYPES,
  EXPENSE_CATS,
} from '../utils/constants';
import { saveToStorage, loadFromStorage } from '../utils/helpers';

// Create context
const AppContext = createContext(null);

/**
 * Provider component - wrap your app with this
 */
export function AppProvider({ children }) {
  // Auth state
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null); // 'hr' or 'employee'
  const [hrPassword, setHrPassword] = useState(() =>
    loadFromStorage(STORAGE_KEYS.hrPassword, DEFAULT_HR_PASS)
  );

  // Data state
  const [employees, setEmployees] = useState(() =>
    loadFromStorage(STORAGE_KEYS.employees, [])
  );
  const [payroll, setPayroll] = useState(() =>
    loadFromStorage(STORAGE_KEYS.payroll, {})
  );
  const [organizations, setOrganizations] = useState(() =>
    loadFromStorage(STORAGE_KEYS.organizations, DEFAULT_ORGS)
  );
  const [documents, setDocuments] = useState(() =>
    loadFromStorage(STORAGE_KEYS.documents, [])
  );
  const [leaves, setLeaves] = useState(() =>
    loadFromStorage(STORAGE_KEYS.leaves, [])
  );
  const [expenses, setExpenses] = useState(() =>
    loadFromStorage(STORAGE_KEYS.expenses, [])
  );

  // UI state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Save functions with debounce
  const saveEmployees = useCallback((data) => {
    setEmployees(data);
    saveToStorage(STORAGE_KEYS.employees, data);
  }, []);

  const savePayroll = useCallback((data) => {
    setPayroll(data);
    saveToStorage(STORAGE_KEYS.payroll, data);
  }, []);

  const saveOrganizations = useCallback((data) => {
    setOrganizations(data);
    saveToStorage(STORAGE_KEYS.organizations, data);
  }, []);

  const saveDocuments = useCallback((data) => {
    setDocuments(data);
    try {
      saveToStorage(STORAGE_KEYS.documents, data);
    } catch (e) {
      console.error('Failed to save documents:', e);
    }
  }, []);

  const saveLeaves = useCallback((data) => {
    setLeaves(data);
    saveToStorage(STORAGE_KEYS.leaves, data);
  }, []);

  const saveExpenses = useCallback((data) => {
    setExpenses(data);
    saveToStorage(STORAGE_KEYS.expenses, data);
  }, []);

  const saveHRPassword = useCallback((password) => {
    setHrPassword(password);
    saveToStorage(STORAGE_KEYS.hrPassword, password);
  }, []);

  // Auth functions
  const loginAsHR = useCallback((password) => {
    if (password === hrPassword) {
      setCurrentUser({ id: 'HR', role: 'hr' });
      setUserRole('hr');
      return true;
    }
    return false;
  }, [hrPassword]);

  const loginAsEmployee = useCallback((empId, password) => {
    const emp = employees.find((e) => e.id === empId && e.pass === password);
    if (emp) {
      setCurrentUser(emp);
      setUserRole('employee');
      return true;
    }
    return false;
  }, [employees]);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setUserRole(null);
    setSearchQuery('');
    setSelectedMonth(null);
    setSidebarOpen(false);
  }, []);

  // Employee functions
  const addEmployee = useCallback((empData) => {
    const newEmp = {
      ...empData,
      id: empData.id || `EMP${String(employees.length + 1).padStart(3, '0')}`,
      leaveBalance: empData.leaveBalance || { casual: 12, sick: 12, earned: 15 },
      advanceBalance: empData.advanceBalance || 0,
      advanceHistory: empData.advanceHistory || [],
      salaryHistory: empData.salaryHistory || [],
    };
    const updated = [...employees, newEmp];
    saveEmployees(updated);
    return newEmp;
  }, [employees, saveEmployees]);

  const updateEmployee = useCallback((empId, updates) => {
    const updated = employees.map((e) =>
      e.id === empId ? { ...e, ...updates } : e
    );
    saveEmployees(updated);
  }, [employees, saveEmployees]);

  const deleteEmployee = useCallback((empId) => {
    const updated = employees.filter((e) => e.id !== empId);
    saveEmployees(updated);
  }, [employees, saveEmployees]);

  // Payroll functions
  const addPayrollMonth = useCallback((month, records = []) => {
    const updated = {
      ...payroll,
      [month]: {
        month,
        records,
        locked: false,
        createdAt: new Date().toISOString(),
      },
    };
    savePayroll(updated);
  }, [payroll, savePayroll]);

  const updatePayrollRecord = useCallback((month, empId, recordUpdates) => {
    const updated = {
      ...payroll,
      [month]: {
        ...payroll[month],
        records: (payroll[month]?.records || []).map((r) =>
          r.empId === empId ? { ...r, ...recordUpdates } : r
        ),
      },
    };
    savePayroll(updated);
  }, [payroll, savePayroll]);

  const lockPayrollMonth = useCallback((month) => {
    const updated = {
      ...payroll,
      [month]: {
        ...payroll[month],
        locked: true,
      },
    };
    savePayroll(updated);
  }, [payroll, savePayroll]);

  // Leave functions
  const addLeaveApplication = useCallback((leaveApp) => {
    const updated = [
      ...leaves,
      {
        ...leaveApp,
        id: `LV${Date.now()}`,
        createdAt: new Date().toISOString(),
      },
    ];
    saveLeaves(updated);
  }, [leaves, saveLeaves]);

  const approveLeave = useCallback((leaveId) => {
    const updated = leaves.map((l) =>
      l.id === leaveId ? { ...l, status: 'approved' } : l
    );
    saveLeaves(updated);
  }, [leaves, saveLeaves]);

  const rejectLeave = useCallback((leaveId) => {
    const updated = leaves.map((l) =>
      l.id === leaveId ? { ...l, status: 'rejected' } : l
    );
    saveLeaves(updated);
  }, [leaves, saveLeaves]);

  // Expense functions
  const addExpenseClaim = useCallback((claim) => {
    const updated = [
      ...expenses,
      {
        ...claim,
        id: `EXP${Date.now()}`,
        createdAt: new Date().toISOString(),
      },
    ];
    saveExpenses(updated);
  }, [expenses, saveExpenses]);

  const approveExpense = useCallback((expenseId) => {
    const updated = expenses.map((e) =>
      e.id === expenseId ? { ...e, status: 'approved' } : e
    );
    saveExpenses(updated);
  }, [expenses, saveExpenses]);

  // Document functions
  const addDocument = useCallback((empId, docType, docData) => {
    const updated = [
      ...documents,
      {
        id: `DOC${Date.now()}`,
        empId,
        docType,
        ...docData,
        createdAt: new Date().toISOString(),
      },
    ];
    saveDocuments(updated);
  }, [documents, saveDocuments]);

  const deleteDocument = useCallback((docId) => {
    const updated = documents.filter((d) => d.id !== docId);
    saveDocuments(updated);
  }, [documents, saveDocuments]);

  const value = {
    // Auth
    currentUser,
    userRole,
    loginAsHR,
    loginAsEmployee,
    logout,
    hrPassword,
    saveHRPassword,

    // Employees
    employees,
    addEmployee,
    updateEmployee,
    deleteEmployee,

    // Payroll
    payroll,
    addPayrollMonth,
    updatePayrollRecord,
    lockPayrollMonth,

    // Leaves
    leaves,
    addLeaveApplication,
    approveLeave,
    rejectLeave,

    // Expenses
    expenses,
    addExpenseClaim,
    approveExpense,

    // Organizations
    organizations,
    saveOrganizations,

    // Documents
    documents,
    addDocument,
    deleteDocument,

    // UI
    searchQuery,
    setSearchQuery,
    selectedMonth,
    setSelectedMonth,
    sidebarOpen,
    setSidebarOpen,

    // Constants
    DOC_TYPES,
    LEAVE_TYPES,
    EXPENSE_CATS,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

/**
 * Hook to use the app context
 * @returns {object} App context value
 */
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

/**
 * Hook for employee operations
 */
export function useEmployees() {
  const { employees, addEmployee, updateEmployee, deleteEmployee } = useApp();
  return { employees, addEmployee, updateEmployee, deleteEmployee };
}

/**
 * Hook for payroll operations
 */
export function usePayroll() {
  const { payroll, addPayrollMonth, updatePayrollRecord, lockPayrollMonth } = useApp();
  return { payroll, addPayrollMonth, updatePayrollRecord, lockPayrollMonth };
}

/**
 * Hook for leave operations
 */
export function useLeaves() {
  const { leaves, addLeaveApplication, approveLeave, rejectLeave } = useApp();
  return { leaves, addLeaveApplication, approveLeave, rejectLeave };
}

/**
 * Hook for current user
 */
export function useAuth() {
  const { currentUser, userRole, loginAsHR, loginAsEmployee, logout } = useApp();
  const isAuthenticated = !!currentUser;
  const isHR = userRole === 'hr';
  const isEmployee = userRole === 'employee';
  return { currentUser, userRole, isAuthenticated, isHR, isEmployee, loginAsHR, loginAsEmployee, logout };
}
