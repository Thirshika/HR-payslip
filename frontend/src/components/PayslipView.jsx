import { useState, useEffect } from 'react';
import Modal from './Modal.jsx';

function PayslipView() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [employeeEmail] = useState('thirshikannan07@gmail.com');
  const [emailHistory, setEmailHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  
  // Get backend API URL from environment
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
    (import.meta.env.DEV ? 'http://localhost:8001' : 'https://hr-payslip-backend.onrender.com');

  // Fetch email history when component mounts or modal opens
  useEffect(() => {
    if (isModalOpen) {
      fetchEmailHistory();
    }
  }, [isModalOpen]);

  const fetchEmailHistory = async () => {
    setHistoryLoading(true);
    try {
      console.log('[Email History] Fetching from backend:', `${API_BASE_URL}/api/email-history/TEST001`);
      const response = await fetch(`${API_BASE_URL}/api/email-history/TEST001`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      console.log('[Email History] Response:', data);

      if (data.success) {
        setEmailHistory(data.history || []);
      } else {
        console.warn('[Email History] Failed to fetch:', data.error);
        setEmailHistory([]);
      }
    } catch (error) {
      console.error('[Email History] Error fetching history:', error);
      setEmailHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  const formatErrorMessage = (error) => {
    if (!error) return 'Failed to send payslip';
    
    // If error is a JSON string, try to parse it
    if (typeof error === 'string' && error.startsWith('{')) {
      try {
        const parsed = JSON.parse(error);
        return parsed.message || JSON.stringify(parsed);
      } catch (e) {
        // Not valid JSON, return as is
        return error;
      }
    }
    
    return error;
  };

  const handleEmailPayslip = async () => {
    console.log('[Email Send] Button clicked');
    setIsLoading(true);
    setMessage('');
    setMessageType('');

    try {
      console.log('[Email Send] Sending email to:', employeeEmail);
      console.log('[Email Send] Backend URL:', `${API_BASE_URL}/api/send-payslip-email`);
      
      const response = await fetch(`${API_BASE_URL}/api/send-payslip-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          empId: 'TEST001',
          month: 'January 2024',
          customEmail: employeeEmail,
          employee: {
            id: 'TEST001',
            name: 'Test User',
            org: 'HR Test Organization',
            branch: 'Test Branch',
            designation: 'Test Designation',
            email: employeeEmail,
            phone: '1234567890'
          },
          payroll: {
            month: 'January 2024',
            gross: 50000.00,
            netPayable: 45000.00,
            paidAmount: 45000.00,
            balanceAmount: 0.00
          }
        }),
      });

      console.log('[Email Send] Response status:', response.status);
      const data = await response.json();
      console.log('[Email Send] Response data:', data);

      if (response.ok && data.success) {
        setMessage(data.message || 'Email sent successfully');
        setMessageType('success');
        console.log('[Email Send] Email sent successfully:', data.message);
      } else {
        const rawError = data.error || data.message || 'Failed to send payslip';
        const formattedError = formatErrorMessage(rawError);
        setMessage(formattedError);
        setMessageType('error');
        console.log('[Email Send] Email send failed:', formattedError);
        console.log('[Email Send] Full response:', data);
      }

      // Fetch history after a small delay to ensure DB is updated
      setTimeout(() => fetchEmailHistory(), 500);
    } catch (error) {
      const errorMsg = `Error sending payslip: ${error.message}`;
      setMessage(errorMsg);
      setMessageType('error');
      console.error('[Email Send] Exception:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // PDF download functionality would be implemented here
    alert('PDF download functionality to be implemented');
  };

  return (
    <section className="page-section">
      <h2>Payslip</h2>
      <button 
        onClick={() => setIsModalOpen(true)}
        style={{
          padding: '10px 20px',
          backgroundColor: '#0d1b2a',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '14px'
        }}
      >
        View Test Payslip
      </button>

      <Modal
        title="Payslip - Thirshika K"
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setMessage('');
          setMessageType('');
        }}
        footer={
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'space-between' }}>
            {message && (
              <div style={{
                padding: '10px 15px',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: '500',
                backgroundColor: messageType === 'success' ? '#d4edda' : '#f8d7da',
                color: messageType === 'success' ? '#155724' : '#721c24',
                border: `1px solid ${messageType === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
                maxWidth: '400px',
                wordBreak: 'break-word'
              }}>
                {messageType === 'success' ? '✓ ' : '✕ '}{message}
              </div>
            )}
            <div style={{ display: 'flex', gap: '10px', marginLeft: 'auto' }}>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setMessage('');
                  setMessageType('');
                }}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Close
              </button>
              <button
                onClick={handleDownloadPDF}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#17a2b8',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                PDF
              </button>
              <button
                onClick={handleEmailPayslip}
                disabled={isLoading}
                style={{
                  padding: '10px 20px',
                  backgroundColor: isLoading ? '#ccc' : '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {isLoading ? (
                  <>
                    <span className="spinner" />
                    Sending...
                  </>
                ) : (
                  'Email'
                )}
              </button>
              <button
                onClick={handlePrint}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#0d1b2a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Print
              </button>
            </div>
          </div>
        }
      >
        <div style={{ padding: '20px', fontSize: '13px' }}>
          {/* Header */}
          <div style={{ marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #0d1b2a' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: '0 0 5px 0', color: '#0d1b2a', fontSize: '18px' }}>Test Organization</h3>
                <p style={{ margin: '0', color: '#666', fontSize: '12px' }}>123 Business Street, City, Country</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: '0', color: '#e8a832', fontWeight: 'bold', fontSize: '16px' }}>PAYSLIP</p>
                <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '12px' }}>January 2024</p>
              </div>
            </div>
          </div>

          {/* Employee Information */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#0d1b2a', fontSize: '14px', borderBottom: '1px solid #e0e0e0', paddingBottom: '5px' }}>Employee Information</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', marginBottom: '2px' }}>Employee ID</div>
                <div style={{ fontSize: '13px', color: '#0d1b2a', fontWeight: '500' }}>TEST001</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', marginBottom: '2px' }}>Employee Name</div>
                <div style={{ fontSize: '13px', color: '#0d1b2a', fontWeight: '500' }}>Thirshika K</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', marginBottom: '2px' }}>Designation</div>
                <div style={{ fontSize: '13px', color: '#0d1b2a', fontWeight: '500' }}>Test Designation</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', marginBottom: '2px' }}>Branch</div>
                <div style={{ fontSize: '13px', color: '#0d1b2a', fontWeight: '500' }}>Test Branch</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', marginBottom: '2px' }}>Email</div>
                <div style={{ fontSize: '13px', color: '#0d1b2a', fontWeight: '500' }}>{employeeEmail}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', marginBottom: '2px' }}>Phone</div>
                <div style={{ fontSize: '13px', color: '#0d1b2a', fontWeight: '500' }}>1234567890</div>
              </div>
            </div>
          </div>

          {/* Attendance Summary */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#0d1b2a', fontSize: '14px', borderBottom: '1px solid #e0e0e0', paddingBottom: '5px' }}>Attendance Summary</h4>
            <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '6px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                <div style={{ textAlign: 'center', padding: '10px', backgroundColor: 'white', borderRadius: '4px' }}>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#28a745' }}>22</div>
                  <div style={{ fontSize: '11px', color: '#666' }}>Days Present</div>
                </div>
                <div style={{ textAlign: 'center', padding: '10px', backgroundColor: 'white', borderRadius: '4px' }}>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#dc3545' }}>1</div>
                  <div style={{ fontSize: '11px', color: '#666' }}>Days Absent</div>
                </div>
                <div style={{ textAlign: 'center', padding: '10px', backgroundColor: 'white', borderRadius: '4px' }}>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffc107' }}>2</div>
                  <div style={{ fontSize: '11px', color: '#666' }}>Leave Days</div>
                </div>
                <div style={{ textAlign: 'center', padding: '10px', backgroundColor: 'white', borderRadius: '4px' }}>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#17a2b8' }}>25</div>
                  <div style={{ fontSize: '11px', color: '#666' }}>Total Days</div>
                </div>
              </div>
            </div>
          </div>

          {/* Earnings */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#0d1b2a', fontSize: '14px', borderBottom: '1px solid #e0e0e0', paddingBottom: '5px' }}>Earnings</h4>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#0d1b2a', color: 'white' }}>
                  <th style={{ padding: '10px', textAlign: 'left', fontSize: '12px' }}>Description</th>
                  <th style={{ padding: '10px', textAlign: 'right', fontSize: '12px' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <td style={{ padding: '10px', borderBottom: '1px solid #e0e0e0' }}>Basic Salary</td>
                  <td style={{ padding: '10px', textAlign: 'right', borderBottom: '1px solid #e0e0e0' }}>₹25,000.00</td>
                </tr>
                <tr>
                  <td style={{ padding: '10px', borderBottom: '1px solid #e0e0e0' }}>House Rent Allowance</td>
                  <td style={{ padding: '10px', textAlign: 'right', borderBottom: '1px solid #e0e0e0' }}>₹10,000.00</td>
                </tr>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <td style={{ padding: '10px', borderBottom: '1px solid #e0e0e0' }}>Dearness Allowance</td>
                  <td style={{ padding: '10px', textAlign: 'right', borderBottom: '1px solid #e0e0e0' }}>₹8,000.00</td>
                </tr>
                <tr>
                  <td style={{ padding: '10px', borderBottom: '1px solid #e0e0e0' }}>Medical Allowance</td>
                  <td style={{ padding: '10px', textAlign: 'right', borderBottom: '1px solid #e0e0e0' }}>₹2,000.00</td>
                </tr>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <td style={{ padding: '10px', borderBottom: '1px solid #e0e0e0' }}>Transport Allowance</td>
                  <td style={{ padding: '10px', textAlign: 'right', borderBottom: '1px solid #e0e0e0' }}>₹3,000.00</td>
                </tr>
                <tr style={{ backgroundColor: '#e8f5e9', fontWeight: 'bold' }}>
                  <td style={{ padding: '10px', borderBottom: '1px solid #e0e0e0' }}>Total Earnings</td>
                  <td style={{ padding: '10px', textAlign: 'right', borderBottom: '1px solid #e0e0e0', color: '#28a745' }}>₹50,000.00</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Deductions */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#0d1b2a', fontSize: '14px', borderBottom: '1px solid #e0e0e0', paddingBottom: '5px' }}>Deductions</h4>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#dc3545', color: 'white' }}>
                  <th style={{ padding: '10px', textAlign: 'left', fontSize: '12px' }}>Description</th>
                  <th style={{ padding: '10px', textAlign: 'right', fontSize: '12px' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <td style={{ padding: '10px', borderBottom: '1px solid #e0e0e0' }}>Provident Fund</td>
                  <td style={{ padding: '10px', textAlign: 'right', borderBottom: '1px solid #e0e0e0' }}>₹2,500.00</td>
                </tr>
                <tr>
                  <td style={{ padding: '10px', borderBottom: '1px solid #e0e0e0' }}>Professional Tax</td>
                  <td style={{ padding: '10px', textAlign: 'right', borderBottom: '1px solid #e0e0e0' }}>₹200.00</td>
                </tr>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <td style={{ padding: '10px', borderBottom: '1px solid #e0e0e0' }}>Income Tax (TDS)</td>
                  <td style={{ padding: '10px', textAlign: 'right', borderBottom: '1px solid #e0e0e0' }}>₹1,500.00</td>
                </tr>
                <tr>
                  <td style={{ padding: '10px', borderBottom: '1px solid #e0e0e0' }}>Health Insurance</td>
                  <td style={{ padding: '10px', textAlign: 'right', borderBottom: '1px solid #e0e0e0' }}>₹800.00</td>
                </tr>
                <tr style={{ backgroundColor: '#ffebee', fontWeight: 'bold' }}>
                  <td style={{ padding: '10px', borderBottom: '1px solid #e0e0e0' }}>Total Deductions</td>
                  <td style={{ padding: '10px', textAlign: 'right', borderBottom: '1px solid #e0e0e0', color: '#dc3545' }}>₹5,000.00</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div style={{ backgroundColor: '#0d1b2a', color: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span>Gross Salary</span>
              <span>₹50,000.00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span>Total Deductions</span>
              <span>₹5,000.00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.3)', paddingTop: '10px', fontSize: '16px', fontWeight: 'bold' }}>
              <span>Net Payable</span>
              <span>₹45,000.00</span>
            </div>
          </div>

          {/* Footer */}
          <div style={{ textAlign: 'center', marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #e0e0e0', color: '#666', fontSize: '11px' }}>
            <p style={{ margin: '0 0 5px 0' }}>This is a computer-generated payslip. For any queries, please contact HR department.</p>
            <p style={{ margin: '0 0 5px 0' }}>Generated on: {new Date().toLocaleDateString()}</p>
            <p style={{ margin: '0' }}>© 2024 Test Organization. All rights reserved.</p>
          </div>

          {/* Email History Section */}
          <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '2px solid #e0e0e0' }}>
            <h4 style={{ margin: '0 0 15px 0', color: '#0d1b2a', fontSize: '14px' }}>
              📧 Email History
              {historyLoading && <span style={{ fontSize: '12px', color: '#666', marginLeft: '10px' }}>(Loading...)</span>}
            </h4>
            {emailHistory.length === 0 ? (
              <p style={{ color: '#666', fontSize: '12px', margin: '0' }}>
                {historyLoading ? 'Fetching email history...' : 'No emails sent yet'}
              </p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #e0e0e0' }}>
                    <th style={{ padding: '8px', textAlign: 'left' }}>Date</th>
                    <th style={{ padding: '8px', textAlign: 'left' }}>Month</th>
                    <th style={{ padding: '8px', textAlign: 'left' }}>Status</th>
                    <th style={{ padding: '8px', textAlign: 'left' }}>Error</th>
                  </tr>
                </thead>
                <tbody>
                  {emailHistory.map((record, index) => {
                    const normalizedStatus = record.status ? record.status.toLowerCase() : 'pending';
                    const badgeStyles = {
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      backgroundColor: normalizedStatus === 'sent' ? '#d4edda' : normalizedStatus === 'failed' ? '#f8d7da' : '#fff3cd',
                      color: normalizedStatus === 'sent' ? '#155724' : normalizedStatus === 'failed' ? '#721c24' : '#856404',
                    };

                    return (
                      <tr key={index} style={{ borderBottom: '1px solid #e0e0e0' }}>
                        <td style={{ padding: '8px' }}>
                          {record.sentAt ? new Date(record.sentAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td style={{ padding: '8px' }}>{record.month || 'N/A'}</td>
                        <td style={{ padding: '8px' }}>
                          <span style={badgeStyles}>
                            {normalizedStatus === 'sent' ? 'Sent' : normalizedStatus === 'failed' ? 'Failed' : 'Pending'}
                          </span>
                        </td>
                        <td style={{ padding: '8px', color: '#dc3545', fontSize: '11px' }}>
                          {record.errorMessage || '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </Modal>
    </section>
  );
}

export default PayslipView;
