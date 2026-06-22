import { useEffect, useState } from 'react';
import { fetchEmployees } from '../api/employees.js';

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees()
      .then((data) => setEmployees(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="page-section">
      <h2>Employees</h2>
      {loading ? (
        <p>Loading employees...</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Branch</th>
              <th>Designation</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.id}</td>
                <td>{employee.name}</td>
                <td>{employee.branch}</td>
                <td>{employee.designation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

export default EmployeeList;
