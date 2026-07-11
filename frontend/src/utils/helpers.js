/**
 * ═══════════════════════════════════════════════════════════════
 * HR PAYSLIP SYSTEM - HELPER UTILITIES
 * ═══════════════════════════════════════════════════════════════
 */

import { MONTHS_LIST, COLORS, STORAGE_KEYS } from './constants';

/**
 * Generate initials from a name
 * @param {string} name - Full name
 * @returns {string} Two-letter initials
 */
export const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('');
};

/**
 * Get color from COLORS array by index
 * @param {number} index
 * @returns {string} Color hex code
 */
export const getColor = (index) => {
  return COLORS[index % COLORS.length];
};

/**
 * Get employee color by ID
 * @param {string} empId - Employee ID
 * @param {array} employees - List of employees
 * @returns {string} Color hex code
 */
export const getEmpColor = (empId, employees) => {
  const idx = employees.findIndex((e) => e.id === empId);
  return getColor(idx < 0 ? 0 : idx);
};

/**
 * Find employee index by ID
 * @param {string} id - Employee ID
 * @param {array} employees
 * @returns {number} Index or -1
 */
export const findEmpIndex = (id, employees) => {
  return employees.findIndex((e) => e.id === id);
};

/**
 * Find employee by ID
 * @param {string} id - Employee ID
 * @param {array} employees
 * @returns {object|null} Employee or null
 */
export const findEmp = (id, employees) => {
  return employees.find((e) => e.id === id) || null;
};

/**
 * Format number as Indian currency
 * @param {number} n - Number to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (n) => {
  return (
    '₹' +
    Number(n || 0).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
};

/**
 * Format number as compact currency (K/L)
 * @param {number} n - Number to format
 * @returns {string} Formatted currency string
 */
export const formatCompactCurrency = (n) => {
  if (n >= 100000) return '₹' + (n / 100000).toFixed(2) + 'L';
  if (n >= 1000) return '₹' + (n / 1000).toFixed(1) + 'K';
  return formatCurrency(n);
};

/**
 * Get today's date in DD-MMM-YYYY format
 * @returns {string} Today's date
 */
export const getToday = () => {
  return new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Get all payroll months from records
 * @param {object} payrollRecords - Payroll object with month keys
 * @returns {array} Array of month strings sorted newest first
 */
export const getPayrollMonths = (payrollRecords) => {
  return Object.keys(payrollRecords).sort((a, b) => monthToNumber(b) - monthToNumber(a));
};

/**
 * Convert month string to numeric value for sorting
 * @param {string} month - Month string like "Apr 2026"
 * @returns {number} Numeric value for sorting
 */
export const monthToNumber = (month) => {
  if (!month) return 0;
  const parts = month.split(' ');
  const yearNum = (parseInt(parts[1]) || 0) * 100;
  const monthIdx = MONTHS_LIST.findIndex((x) => x.startsWith(parts[0].replace('.', '')));
  return yearNum + monthIdx;
};

/**
 * Check if payroll month is locked
 * @param {string} month
 * @param {object} payrollRecords
 * @returns {boolean}
 */
export const isPayrollLocked = (month, payrollRecords) => {
  return payrollRecords[month]?.locked === true;
};

/**
 * Get payroll record for specific employee and month
 * @param {string} month
 * @param {string} empId
 * @param {object} payrollRecords
 * @returns {object|null} Record or null
 */
export const getPayrollRecord = (month, empId, payrollRecords) => {
  return payrollRecords[month]?.records?.find((r) => r.empId === empId) || null;
};

/**
 * Get all months with records for specific employee
 * @param {string} empId
 * @param {object} payrollRecords
 * @returns {array} Array of month strings
 */
export const getEmpMonths = (empId, payrollRecords) => {
  return getPayrollMonths(payrollRecords).filter((m) => getPayrollRecord(m, empId, payrollRecords));
};

/**
 * Get next employee ID
 * @param {array} employees
 * @returns {string} Next ID like "EMP011"
 */
export const getNextEmpId = (employees) => {
  const numbers = employees.map((e) => parseInt(e.id.replace('EMP', '')) || 0);
  const maxNum = numbers.length ? Math.max(...numbers) : 0;
  return 'EMP' + String(maxNum + 1).padStart(3, '0');
};

/**
 * Get label for salary batch
 * @param {string} batch - "B1" or "B2"
 * @returns {string} Label
 */
export const getBatchLabel = (batch) => {
  return batch === 'B1' ? 'Batch 1 (26–25)' : 'Batch 2 (1–30)';
};

/**
 * Get label for salary basis
 * @param {string} basis - "days", "hours", or "perday"
 * @returns {string} Label
 */
export const getBasisLabel = (basis) => {
  if (basis === 'hours') return 'Hours Basis';
  if (basis === 'perday') return 'Per Day Rate';
  return 'Days Basis';
};

/**
 * Show toast notification
 * @param {string} message
 * @param {string} type - "ok", "err", or "inf"
 */
export const showToast = (message, type = 'ok') => {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.className = 'toast show ' + type;
  setTimeout(() => (toast.className = 'toast'), 3000);
};

/**
 * Convert number to words (for check writing)
 * @param {number} n
 * @returns {string} Number in words
 */
export const numberToWords = (n) => {
  const ones = [
    '',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen',
  ];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function convertUnder1000(x) {
    if (!x) return '';
    if (x < 20) return ones[x] + ' ';
    if (x < 100)
      return tens[Math.floor(x / 10)] + ' ' + (ones[x % 10] ? ones[x % 10] + ' ' : '');
    return ones[Math.floor(x / 100)] + ' Hundred ' + (x % 100 ? convertUnder1000(x % 100) : '');
  }

  const i = Math.floor(n);
  let result = '';

  if (i >= 10000000) result += convertUnder1000(Math.floor(i / 10000000)) + ' Crore ';
  if ((i % 10000000) >= 100000) result += convertUnder1000(Math.floor((i % 10000000) / 100000)) + ' Lakh ';
  if ((i % 100000) >= 1000) result += convertUnder1000(Math.floor((i % 100000) / 1000)) + ' Thousand ';
  result += convertUnder1000(i % 1000);

  return (result.trim() || 'Zero') + ' Only';
};

/**
 * Save data to localStorage
 * @param {string} key - Storage key from STORAGE_KEYS
 * @param {any} data - Data to save
 */
export const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    showToast('Storage full — try removing old data', 'err');
  }
};

/**
 * Load data from localStorage
 * @param {string} key - Storage key from STORAGE_KEYS
 * @param {any} defaultValue - Value if not found
 * @returns {any}
 */
export const loadFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
};
