import { useState } from 'react';
import Login from './components/Login.jsx';
import HRAdminPage from './components/HRAdminPage.jsx';
import EmployeePage from './components/EmployeePage.jsx';

function App() {
  const [user, setUser] = useState(null);

  if (!user) {
    return <Login onLogin={(userData) => setUser(userData)} />;
  }

  return (
    <div className="app-shell">
      {user.role === 'hr' ? <HRAdminPage /> : <EmployeePage />}
    </div>
  );
}

export default App;
