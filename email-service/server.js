import express from 'express';
import nodemailer from 'nodemailer';
import puppeteer from 'puppeteer';
import cors from 'cors';
import dotenv from 'dotenv';
import pg from 'pg';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Database connection (PostgreSQL)
const pool = new pg.Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'hr_pay_db',
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Email transporter configuration
let transporter = null;

const createTransporter = async () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    
    console.log('Gmail transport configured');
    console.log('User:', process.env.EMAIL_USER);
    
    // Verify connection
    try {
      await transporter.verify();
      console.log('✅ Gmail SMTP connection verified successfully');
    } catch (error) {
      console.error('❌ Gmail SMTP verification failed:', error.message);
    }
  }
  
  return transporter;
};

// Generate PDF from HTML
const generatePDF = async (htmlContent, empId, month) => {
  const browser = await puppeteer.launch({ 
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu'
    ]
  });
  const page = await browser.newPage();
  
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  
  const pdfPath = path.join(__dirname, 'payslips', `${empId}_${month.replace(/\s+/g, '_')}.pdf`);
  
  // Ensure directory exists
  const fs = await import('fs');
  const dir = path.dirname(pdfPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '20px',
      right: '20px',
      bottom: '20px',
      left: '20px'
    }
  });
  
  await browser.close();
  return pdfPath;
};

// Generate payslip HTML
const generatePayslipHTML = (employee, payroll) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Payslip - ${employee.name} - ${payroll.month}</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      margin: 0;
      padding: 20px;
      background: #f5f5f5;
    }
    .payslip {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      padding: 40px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 3px solid #0d1b2a;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .company-name {
      font-size: 24px;
      font-weight: bold;
      color: #0d1b2a;
    }
    .payslip-title {
      font-size: 18px;
      color: #e8a832;
      font-weight: bold;
    }
    .employee-info {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 30px;
    }
    .info-group {
      margin-bottom: 10px;
    }
    .label {
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
    }
    .value {
      font-size: 14px;
      color: #0d1b2a;
      font-weight: 500;
    }
    .salary-details {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    .salary-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #e0e0e0;
    }
    .salary-row:last-child {
      border-bottom: none;
    }
    .salary-row.total {
      font-weight: bold;
      font-size: 16px;
      border-top: 2px solid #0d1b2a;
      margin-top: 10px;
      padding-top: 15px;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
      color: #666;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="payslip">
    <div class="header">
      <div class="company-name">${employee.org}</div>
      <div class="payslip-title">PAYSLIP</div>
    </div>
    
    <div class="employee-info">
      <div>
        <div class="info-group">
          <div class="label">Employee ID</div>
          <div class="value">${employee.id}</div>
        </div>
        <div class="info-group">
          <div class="label">Employee Name</div>
          <div class="value">${employee.name}</div>
        </div>
        <div class="info-group">
          <div class="label">Designation</div>
          <div class="value">${employee.designation}</div>
        </div>
      </div>
      <div>
        <div class="info-group">
          <div class="label">Branch</div>
          <div class="value">${employee.branch}</div>
        </div>
        <div class="info-group">
          <div class="label">Email</div>
          <div class="value">${employee.email}</div>
        </div>
        <div class="info-group">
          <div class="label">Pay Period</div>
          <div class="value">${payroll.month}</div>
        </div>
      </div>
    </div>
    
    <div class="salary-details">
      <div class="salary-row">
        <span>Gross Salary</span>
        <span>₹${payroll.gross.toFixed(2)}</span>
      </div>
      <div class="salary-row">
        <span>Net Payable</span>
        <span>₹${payroll.netPayable.toFixed(2)}</span>
      </div>
      <div class="salary-row">
        <span>Paid Amount</span>
        <span>₹${payroll.paidAmount.toFixed(2)}</span>
      </div>
      <div class="salary-row total">
        <span>Balance Amount</span>
        <span>₹${payroll.balanceAmount.toFixed(2)}</span>
      </div>
    </div>
    
    <div class="footer">
      <p>This is a computer-generated payslip. For any queries, please contact HR department.</p>
      <p>Generated on: ${new Date().toLocaleDateString()}</p>
    </div>
  </div>
</body>
</html>
  `;
};

// API: Send individual payslip email
app.post('/api/send-payslip-email', async (req, res) => {
  const { empId, month, customEmail, customSubject, customMessage } = req.body;
  
  try {
    // Fetch employee and payroll data
    const employees = await pool.query(
      'SELECT * FROM employees WHERE id = $1',
      [empId]
    );
    
    if (employees.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Employee not found' });
    }
    
    const employee = employees.rows[0];
    
    const payrollRecords = await pool.query(
      'SELECT * FROM payroll_records WHERE empId = $1 AND month = $2',
      [empId, month]
    );
    
    if (payrollRecords.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Payroll record not found' });
    }
    
    const payroll = payrollRecords.rows[0];
    
    // Use custom email if provided, otherwise use employee's email
    const toEmail = customEmail || employee.email;
    
    if (!toEmail) {
      return res.status(400).json({ success: false, error: 'No email address provided' });
    }
    
    // Generate payslip HTML
    const htmlContent = generatePayslipHTML(employee, payroll);
    
    // Generate PDF
    const pdfPath = await generatePDF(htmlContent, empId, month);
    
    // Create email transporter
    const transporter = await createTransporter();
    
    // Send email
    const subject = customSubject || `Payslip for ${month} - ${employee.name}`;
    const message = customMessage || `Dear ${employee.name},\n\nPlease find attached your payslip for ${month}.\n\nIf you have any questions, please contact the HR department.\n\nBest regards,\nHR Department`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject: subject,
      text: message,
      attachments: [
        {
          filename: `Payslip_${month.replace(/\s+/g, '_')}.pdf`,
          path: pdfPath
        }
      ]
    };
    
    await transporter.sendMail(mailOptions);
    
    // Record email history
    await pool.query(
      'INSERT INTO email_history (empId, empName, email, month, sentAt, status, errorMessage) VALUES ($1, $2, $3, $4, NOW(), $5, $6)',
      [empId, employee.name, toEmail, month, 'Sent', null]
    );
    
    res.json({ 
      success: true, 
      message: `Payslip sent successfully to ${toEmail}`,
      email: toEmail
    });
    
  } catch (error) {
    console.error('Error sending email:', error);
    
    // Record failed attempt
    try {
      const employees = await pool.query('SELECT * FROM employees WHERE id = $1', [empId]);
      if (employees.rows.length > 0) {
        await pool.query(
          'INSERT INTO email_history (empId, empName, email, month, sentAt, status, errorMessage) VALUES ($1, $2, $3, $4, NOW(), $5, $6)',
          [empId, employees.rows[0].name, customEmail || employees.rows[0].email, month, 'Failed', error.message]
        );
      }
    } catch (dbError) {
      console.error('Error recording email history:', dbError);
    }
    
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// API: Send bulk payslip emails
app.post('/api/send-bulk-payslips', async (req, res) => {
  const { month } = req.body;
  
  if (!month) {
    return res.status(400).json({ success: false, error: 'Month is required' });
  }
  
  // Start bulk send process (async)
  sendBulkPayslips(month).catch(console.error);
  
  res.json({ 
    success: true, 
    message: 'Bulk email sending started',
    month: month
  });
});

async function sendBulkPayslips(month) {
  try {
    // Fetch all payroll records for the month
    const payrollRecords = await pool.query(
      'SELECT DISTINCT empId FROM payroll_records WHERE month = $1',
      [month]
    );
    
    const total = payrollRecords.rows.length;
    let sent = 0;
    let failed = 0;
    
    for (const record of payrollRecords.rows) {
      try {
        const response = await fetch(`http://localhost:${PORT}/api/send-payslip-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ empId: record.empId, month })
        });
        
        const result = await response.json();
        
        if (result.success) {
          sent++;
        } else {
          failed++;
        }
        
        console.log(`Progress: ${sent + failed}/${total} (Sent: ${sent}, Failed: ${failed})`);
        
      } catch (error) {
        failed++;
        console.error(`Error sending to employee ${record.empId}:`, error);
      }
    }
    
    console.log(`Bulk send complete: ${sent} sent, ${failed} failed out of ${total}`);
    
  } catch (error) {
    console.error('Error in bulk send:', error);
  }
}

// API: Get email history for an employee
app.get('/api/email-history/:empId', async (req, res) => {
  const { empId } = req.params;
  
  try {
    const history = await pool.query(
      'SELECT * FROM email_history WHERE empId = $1 ORDER BY sentAt DESC',
      [empId]
    );
    
    res.json({ success: true, history: history.rows });
  } catch (error) {
    console.error('Error fetching email history:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: Get email history for a month
app.get('/api/email-history-month/:month', async (req, res) => {
  const { month } = req.params;
  
  try {
    const history = await pool.query(
      'SELECT * FROM email_history WHERE month = $1 ORDER BY sentAt DESC',
      [month]
    );
    
    res.json({ success: true, history: history.rows });
  } catch (error) {
    console.error('Error fetching email history:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: Test email payslip (hardcoded test data)
app.post('/api/test-email-payslip', async (req, res) => {
  const { email } = req.body;
  
  // Hardcoded test employee data
  const testEmployee = {
    id: 'TEST001',
    name: 'Thirshika K',
    org: 'Test Organization',
    branch: 'Test Branch',
    designation: 'Test Designation',
    phone: '1234567890',
    email: email || 'thirshikannan07@gmail.com'
  };

  // Hardcoded test payroll data
  const testPayroll = {
    month: 'January 2024',
    gross: 50000.00,
    netPayable: 45000.00,
    paidAmount: 45000.00,
    balanceAmount: 0.00
  };

  const testRecipientEmail = email || 'thirshikannan07@gmail.com';

  try {
    console.log(`[TEST EMAIL] Generating PDF for employee: ${testEmployee.name}`);
    console.log(`[TEST EMAIL] Recipient email: ${testRecipientEmail}`);

    // Generate payslip HTML
    const htmlContent = generatePayslipHTML(testEmployee, testPayroll);

    // Generate PDF
    const pdfPath = await generatePDF(htmlContent, testEmployee.id, testPayroll.month);
    console.log(`[TEST EMAIL] PDF generated at: ${pdfPath}`);

    // Create email transporter
    const transporter = await createTransporter();

    // Send email with hardcoded subject and body
    const subject = 'Salary Payslip - Thirshika K';
    const message = `Dear Thirshika K,\n\nPlease find attached your salary payslip.\n\nThis is a test email generated from the HR Payroll System.\n\nRegards,\nHR Payroll Team`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: testRecipientEmail,
      subject: subject,
      text: message,
      attachments: [
        {
          filename: 'Payslip_Thirshika_K.pdf',
          path: pdfPath
        }
      ]
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[TEST EMAIL] Email sent successfully to ${testRecipientEmail}`);

    res.json({
      success: true,
      message: `Payslip sent successfully to ${testRecipientEmail}`,
      email: testRecipientEmail
    });

  } catch (error) {
    console.error('[TEST EMAIL] Error sending email:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// API: Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'email-service' });
});

app.listen(PORT, () => {
  console.log(`Email service running on port ${PORT}`);
});
