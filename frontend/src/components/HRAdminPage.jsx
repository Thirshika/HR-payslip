import { useState } from 'react';
import TopNav from './TopNav.jsx';
import Toast from './Toast.jsx';
import PayslipView from './PayslipView.jsx';

const hrPages = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'employees', label: 'Employees' },
  { id: 'attendance', label: 'Attendance Entry' },
  { id: 'generate', label: 'Generate Payroll' },
  { id: 'history', label: 'Payroll History' },
  { id: 'payslip', label: 'Test Payslip Email' },
  { id: 'hrportal', label: 'HR Portal' },
  { id: 'leaves', label: 'Leave Management' },
  { id: 'expenses', label: 'Expenses' },
  { id: 'increments', label: 'Increments' },
  { id: 'advances', label: 'Advances' },
  { id: 'reports', label: 'Reports' },
  { id: 'organizations', label: 'Organizations' },
  { id: 'documents', label: 'Documents' },
  { id: 'credentials', label: 'Credentials' },
  { id: 'backup', label: 'Backup & Restore' },
];

function HRAdminPage() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' });

  return (
    <div className="hr-shell">
      <TopNav title="HR Payslip System" tag="hr" userName="HR" onSignOut={() => {}} />
      <div className="hr-layout">
        <aside className="hr-sidebar">
          <div className="snav">
            {hrPages.map((item) => (
              <button
                key={item.id}
                className={item.id === currentPage ? 'snav-item active' : 'snav-item'}
                onClick={() => setCurrentPage(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </aside>
        <main className="hr-main">
          {currentPage === 'payslip' ? (
            <PayslipView />
          ) : (
            <>
              <h2>{hrPages.find((page) => page.id === currentPage)?.label}</h2>
              <p>This is the {currentPage} section from the original HR admin UI.</p>
            </>
          )}
        </main>
      </div>
      <Toast visible={toast.visible} message={toast.message} type={toast.type} />
    </div>
  );
}

export default HRAdminPage;
