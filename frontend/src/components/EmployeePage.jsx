import { useState } from 'react';
import TopNav from './TopNav.jsx';

const employeeTabs = [
  { id: 'payslips', label: 'Payslips' },
  { id: 'profile', label: 'Profile' },
  { id: 'documents', label: 'Documents' },
];

function EmployeePage() {
  const [currentTab, setCurrentTab] = useState('payslips');

  return (
    <div className="emp-shell">
      <TopNav title="My Payslips" tag="employee" userName="Employee" onSignOut={() => { }} />
      <div className="emp-main">
        <div className="emp-tabs">
          {employeeTabs.map((tab) => (
            <button key={tab.id} className={tab.id === currentTab ? 'emtab active' : 'emtab'} onClick={() => setCurrentTab(tab.id)}>
              {tab.label}
            </button>
          ))}
        </div>
        <section className="page-section">
          <h2>{employeeTabs.find((tab) => tab.id === currentTab)?.label}</h2>
          <p>This is the employee view section from the original UI.</p>
        </section>
      </div>
    </div>
  );
}

export default EmployeePage;
