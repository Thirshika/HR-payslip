/**
 * ═══════════════════════════════════════════════════════════════
 * HR PAYSLIP SYSTEM - CONSTANTS & CONFIGURATION
 * ═══════════════════════════════════════════════════════════════
 */

export const COLORS = [
  '#d4a017', '#3a7bd5', '#2eaa6e', '#c0612f', '#7b52c0',
  '#c0297a', '#1a8a8a', '#8a6a1a', '#5a3ac0', '#3a9a3a',
];

export const MONTHS_LIST = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const DEFAULT_ORGS = [
  {
    id: 'ORG001',
    name: 'Tamilnadu Advanced Technical Training Institute',
    shortName: 'TATTI',
    color: '#6b3ac0',
    branches: ['Anna Salai', 'Interns'],
    address: '',
    phone: '',
    email: '',
    website: '',
  },
  {
    id: 'ORG002',
    name: 'R M Educational Trust',
    shortName: 'RM Trust',
    color: '#1a7a4a',
    branches: ['Gee Gee Complex'],
    address: '',
    phone: '',
    email: '',
    website: '',
  },
];

export const DOC_TYPES = [
  { id: 'photo', label: 'Profile Photo', emoji: '📷', accept: 'image/*', color: '#3a7bd5' },
  { id: 'aadhar', label: 'Aadhar Card', emoji: '🪪', accept: 'image/*,.pdf', color: '#1a7a4a' },
  { id: 'id_proof', label: 'ID Proof', emoji: '🪪', accept: 'image/*,.pdf', color: '#7b52c0' },
  { id: 'bank', label: 'Bank Passbook/Cheque', emoji: '🏦', accept: 'image/*,.pdf', color: '#c0297a' },
  { id: 'qualification', label: 'Qualification Cert.', emoji: '🎓', accept: 'image/*,.pdf', color: '#e8a832' },
  { id: 'resume', label: 'Resume / CV', emoji: '📄', accept: '.pdf,.doc,.docx', color: '#c05a0f' },
  { id: 'experience', label: 'Experience Cert.', emoji: '🏅', accept: 'image/*,.pdf', color: '#1a5fa8' },
  { id: 'other', label: 'Other Document', emoji: '📎', accept: '*', color: '#556b84' },
];

export const LEAVE_TYPES = [
  { id: 'CL', label: 'Casual Leave', color: '#3a7bd5', max: 12, emoji: '🌴' },
  { id: 'SL', label: 'Sick Leave', color: '#2eaa6e', max: 12, emoji: '🤒' },
  { id: 'EL', label: 'Earned Leave', color: '#7b52c0', max: 15, emoji: '🏅' },
  { id: 'ML', label: 'Maternity Leave', color: '#c0297a', max: 90, emoji: '👶' },
  { id: 'LWP', label: 'Leave Without Pay (Full Day)', color: '#b83030', max: 999, emoji: '⛔' },
  { id: 'HALFLWP', label: 'Half Day LWP', color: '#e67e22', max: 999, emoji: '🌗' },
];

export const EXPENSE_CATS = [
  { id: 'travel', label: 'Travel', emoji: '🚌' },
  { id: 'food', label: 'Food & Meals', emoji: '🍱' },
  { id: 'stationery', label: 'Stationery', emoji: '📝' },
  { id: 'telephone', label: 'Telephone', emoji: '📞' },
  { id: 'accommodation', label: 'Accommodation', emoji: '🏨' },
  { id: 'medical', label: 'Medical', emoji: '🏥' },
  { id: 'other', label: 'Other', emoji: '📦' },
];

// Default HR password - can be changed by admin
export const DEFAULT_HR_PASS = 'HR@Admin2024';

/**
 * PAYROLL BATCH TYPES
 * B1 = Batch 1 (26th prev month to 25th current month)
 * B2 = Batch 2 (1st to 30th/31st of current month)
 */
export const SALARY_BATCH_TYPES = {
  B1: '26–25',
  B2: '1–30',
};

/**
 * SALARY BASIS TYPES
 * 'days'  = salary per day
 * 'hours' = salary per hour
 * 'perday' = per-day rate (no LOP)
 */
export const SALARY_BASIS_TYPES = {
  days: 'Days Basis',
  hours: 'Hours Basis',
  perday: 'Per Day Rate',
};

// Storage keys for localStorage
export const STORAGE_KEYS = {
  employees: 'tatti_emp_v5',
  payroll: 'tatti_pay_v5',
  leaves: 'tatti_leaves_v1',
  expenses: 'tatti_expenses_v1',
  organizations: 'tatti_orgs_v1',
  documents: 'tatti_docs_v1',
  hrPassword: 'tatti_hrpass_v1',
};
