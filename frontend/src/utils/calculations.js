/**
 * ═══════════════════════════════════════════════════════════════
 * HR PAYSLIP SYSTEM - SALARY CALCULATION FUNCTIONS
 * ═══════════════════════════════════════════════════════════════
 */

import { MONTHS_LIST } from './constants';

/**
 * Calculate allowances with pro-rata support
 * @param {object} record - Payroll record
 * @returns {object} {ta, oc, te, oe} - Calculated allowances
 */
export const calculateAllowances = (record) => {
  const workingDays = record.workingDays || 30;
  const present = record.present || workingDays;
  const ratio = record.proRataAllowance && workingDays > 0 ? present / workingDays : 1;

  return {
    ta: Math.round((record.travellingAllowance || 0) * ratio * 100) / 100,
    oc: Math.round((record.otherConveyance || 0) * ratio * 100) / 100,
    te: Math.round((record.telephoneExpenses || 0) * ratio * 100) / 100,
    oe: Math.round((record.otherExpenses || 0) * ratio * 100) / 100,
  };
};

/**
 * Calculate total payable (gross + allowances + incentives)
 * @param {object} record - Payroll record
 * @returns {number} Total payable
 */
export const calculateTotalPayable = (record) => {
  const allowances = calculateAllowances(record);
  const incentive = record.incentive || 0;

  // Per-day basis: salary per day × days worked
  if (record.basisType === 'perday') {
    const earned = (record.gross || 0) * (record.present || 0);
    return earned + allowances.ta + allowances.oc + allowances.te + allowances.oe + incentive;
  }

  // Hourly basis: salary per hour × hours worked
  if (record.basisType === 'hours') {
    const earned = (record.gross || 0) * (record.presentHours || 0);
    return earned + allowances.ta + allowances.oc + allowances.te + allowances.oe + incentive;
  }

  // Days basis: gross salary + allowances (standard method)
  return (record.gross || 0) + allowances.ta + allowances.oc + allowances.te + allowances.oe + incentive;
};

/**
 * Calculate automatic Leave of Pay (LOP)
 * LOP = (gross / workingDays) × (absent days + half days × 0.5)
 * Only applies to "days basis" salary type
 * @param {object} record - Payroll record
 * @returns {number} LOP amount
 */
export const calculateAutoLOP = (record) => {
  // Per-day and hourly basis don't have LOP
  if (record.basisType === 'perday' || record.basisType === 'hours') {
    return 0;
  }

  // Days basis: calculate LOP from absent days
  const totalGross = record.gross || 0;
  const workingDays = record.workingDays || 30;
  const absentDays = (record.unpaidUnits || 0) + (record.halfDayUnits || 0) * 0.5;

  return workingDays > 0 ? Math.round((totalGross / workingDays) * absentDays * 100) / 100 : 0;
};

/**
 * Get actual LOP amount (auto or override)
 * @param {object} record - Payroll record
 * @returns {number} LOP amount
 */
export const getLOPAmount = (record) => {
  return record.lopOverride ? (record.lopAmount || 0) : calculateAutoLOP(record);
};

/**
 * Calculate net payable (total - deductions)
 * @param {object} record - Payroll record
 * @returns {number} Net payable amount
 */
export const calculateNetPayable = (record) => {
  const totalPayable = calculateTotalPayable(record);
  const lopAmount = getLOPAmount(record);
  const advanceDeducted = record.advanceDeducted || 0;
  const otherDeduction = record.otherDeduction || 0;
  const halfDayDeduction = record.halfDayDeduction || 0;

  return Math.max(0, totalPayable - lopAmount - advanceDeducted - otherDeduction - halfDayDeduction);
};

/**
 * Get period label (date range) for a payroll batch
 * @param {string} batch - "B1" or "B2"
 * @param {string} month - Month string like "Apr 2026"
 * @returns {string} Period label
 */
export const getPeriodLabel = (batch, month) => {
  const parts = month.split(' ');
  const year = parseInt(parts[1]) || 2026;
  const monthIndex = MONTHS_LIST.findIndex((x) => x.startsWith(parts[0]));

  if (batch === 'B1') {
    // B1: 26th prev month to 25th current month
    const prevMonthIndex = monthIndex === 0 ? 11 : monthIndex - 1;
    const prevYear = monthIndex === 0 ? year - 1 : year;
    return (
      `26 ${MONTHS_LIST[prevMonthIndex].slice(0, 3)} ${prevYear} – ` +
      `25 ${MONTHS_LIST[monthIndex].slice(0, 3)} ${year}`
    );
  } else {
    // B2: 1st to last day of month
    const lastDay = new Date(year, monthIndex + 1, 0).getDate();
    return (
      `01 ${MONTHS_LIST[monthIndex].slice(0, 3)} ${year} – ` +
      `${lastDay} ${MONTHS_LIST[monthIndex].slice(0, 3)} ${year}`
    );
  }
};

/**
 * Get date range for a payroll period
 * @param {string} batch - "B1" or "B2"
 * @param {string} month - Month string
 * @returns {object} {from, to} - Date objects
 */
export const getPeriodDates = (batch, month) => {
  const parts = month.split(' ');
  const year = parseInt(parts[1]) || 2026;
  const monthIndex = MONTHS_LIST.findIndex((x) => x.startsWith(parts[0]));

  if (batch === 'B1') {
    const prevMonthIndex = monthIndex === 0 ? 11 : monthIndex - 1;
    const prevYear = monthIndex === 0 ? year - 1 : year;
    return {
      from: new Date(prevYear, prevMonthIndex, 26),
      to: new Date(year, monthIndex, 25),
    };
  } else {
    const lastDay = new Date(year, monthIndex + 1, 0).getDate();
    return {
      from: new Date(year, monthIndex, 1),
      to: new Date(year, monthIndex, lastDay),
    };
  }
};

/**
 * Convert date range to string format for comparison
 * @param {object} period - {from, to} with Date objects
 * @returns {object} {fromStr, toStr} with YYYY-MM-DD format
 */
export const periodToStrings = (period) => {
  const dateToStr = (date) => {
    return (
      date.getFullYear() +
      '-' +
      String(date.getMonth() + 1).padStart(2, '0') +
      '-' +
      String(date.getDate()).padStart(2, '0')
    );
  };

  return {
    fromStr: dateToStr(period.from),
    toStr: dateToStr(period.to),
  };
};

/**
 * Count leave days that fall within a payroll period
 * @param {object} leave - Leave record with fromDate, toDate (YYYY-MM-DD)
 * @param {object} periodStr - {fromStr, toStr} from periodToStrings()
 * @returns {number} Days of leave in period
 */
export const countLeaveDaysInPeriod = (leave, periodStr) => {
  const leaveFrom = leave.fromDate || '';
  const leaveTo = leave.toDate || leave.fromDate || '';

  if (!leaveFrom) return 0;

  // Check if leave overlaps with period
  if (leaveFrom > periodStr.toStr || leaveTo < periodStr.fromStr) {
    return 0;
  }

  // Clamp leave dates to period
  const clampFrom = leaveFrom < periodStr.fromStr ? periodStr.fromStr : leaveFrom;
  const clampTo = leaveTo > periodStr.toStr ? periodStr.toStr : leaveTo;

  // Count days (inclusive)
  const milliseconds = new Date(clampTo) - new Date(clampFrom);
  return Math.round(milliseconds / 86400000) + 1;
};

/**
 * Get default working days for a payroll period
 * @param {string} batch - "B1" or "B2"
 * @param {string} month - Month string
 * @returns {number} Total working days in period
 */
export const getWorkingDaysDefault = (batch, month) => {
  const parts = month.split(' ');
  const year = parseInt(parts[1]) || 2026;
  const monthIndex = MONTHS_LIST.findIndex((x) => x.startsWith(parts[0]));

  if (batch === 'B1') {
    // B1: 26th prev month to 25th current month
    const prevMonthIndex = monthIndex === 0 ? 11 : monthIndex - 1;
    const prevYear = monthIndex === 0 ? year - 1 : year;

    // Days from 26th to end of prev month
    const lastDayOfPrevMonth = new Date(prevYear, prevMonthIndex + 1, 0).getDate();
    const daysFromPrev = lastDayOfPrevMonth - 26 + 1;

    // Days from 1st to 25th of current month
    const daysInCurrent = 25;

    return daysFromPrev + daysInCurrent;
  } else {
    // B2: Full month
    return new Date(year, monthIndex + 1, 0).getDate();
  }
};

/**
 * Calculate salary breakdown for display
 * @param {object} record - Payroll record
 * @returns {object} Breakdown with earnings and deductions
 */
export const calculatePayrollBreakdown = (record) => {
  const allowances = calculateAllowances(record);
  const totalPayable = calculateTotalPayable(record);
  const lopAmount = getLOPAmount(record);

  return {
    gross: record.gross || 0,
    travellingAllowance: allowances.ta,
    otherConveyance: allowances.oc,
    telephoneExpenses: allowances.te,
    otherExpenses: allowances.oe,
    incentive: record.incentive || 0,
    totalEarnings: totalPayable,
    lopDeduction: lopAmount,
    advanceDeducted: record.advanceDeducted || 0,
    otherDeduction: record.otherDeduction || 0,
    halfDayDeduction: record.halfDayDeduction || 0,
    totalDeductions: lopAmount + (record.advanceDeducted || 0) + (record.otherDeduction || 0) + (record.halfDayDeduction || 0),
    netPayable: calculateNetPayable(record),
  };
};
