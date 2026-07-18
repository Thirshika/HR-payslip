import { useEffect, useRef } from 'react';
import { useNavigate, useLocation, matchPath } from 'react-router-dom';

// The entire original body HTML from frontend_index_original.html
// Verbatim copy of the recovered body section.
const ORIGINAL_BODY_HTML = `<!-- LOGIN -->
<div id="loginScreen" class="screen active">
  <div class="login-box">
    <div class="lb-logo">
      <div class="lb-icon">T</div>
      <div><div class="lb-name">HR Payslip System</div><div class="lb-org">TATTI / RM Educational Trust</div></div>
    </div>
    <h2 class="lb-h">Welcome Back</h2>
    <p class="lb-p">Sign in to manage payroll or view your payslips.</p>
    <div class="tab-row">
      <button class="tab-btn active" id="tabHR" onclick="switchTab('hr')">HR Admin</button>
      <button class="tab-btn" id="tabEmp" onclick="switchTab('emp')">Employee</button>
    </div>
    <div id="loginFields"></div>
    <div class="err" id="loginErr">Invalid credentials. Please try again.</div>
  </div>
</div>

<!-- HR -->
<div id="hrScreen" class="screen">
  <nav class="topnav">
    <div class="tn-logo">
      <button class="mob-menu-btn" onclick="toggleMobSidebar()">☰</button>
      <div class="tn-icon">T</div><div><div class="tn-name">HR Payslip System</div><div class="tn-org">TATTI / RM Educational Trust</div></div></div>
    <div class="tn-right">
      <span class="tn-badge hr">HR Admin</span>
      <div class="tn-av" style="background:rgba(232,168,50,.2);color:var(--gold);font-size:13px;font-weight:700;">HR</div>
      <button class="signout" onclick="signOut()">Sign Out</button>
    </div>
  </nav>
  <div class="hr-body">
    <div class="sidebar-overlay" id="sidebarOverlay" onclick="toggleMobSidebar()"></div>
    <aside class="sidebar" id="hrSidebar">
      <div class="snav">
        <div class="snav-grp">Main</div>
        <div class="snav-item active" id="sn-dashboard" onclick="gotoPage('dashboard')"><span class="snav-ic">📊</span>Dashboard</div>
        <div class="snav-item" id="sn-employees" onclick="gotoPage('employees')"><span class="snav-ic">👥</span>Employees</div>
        <div class="snav-grp">Payroll</div>
        <div class="snav-item" id="sn-attendance" onclick="gotoPage('attendance')"><span class="snav-ic">📝</span>Attendance Entry</div>
        <div class="snav-item" id="sn-generate" onclick="gotoPage('generate')"><span class="snav-ic">⚡</span>Generate Payroll</div>
        <div class="snav-item" id="sn-history" onclick="gotoPage('history')"><span class="snav-ic">🗂️</span>Payroll History</div>
        <div class="snav-item" id="sn-hrportal" onclick="gotoPage('hrportal')"><span class="snav-ic">👁️</span>HR Portal – All Payslips</div>
        <div class="snav-grp">HR Modules</div>
        <div class="snav-item" id="sn-leaves" onclick="gotoPage('leaves')"><span class="snav-ic">🏖️</span>Leave Management</div>
        <div class="snav-item" id="sn-expenses" onclick="gotoPage('expenses')"><span class="snav-ic">💸</span>Expenses</div>
        <div class="snav-item" id="sn-increments" onclick="gotoPage('increments')"><span class="snav-ic">📈</span>Increments</div>
        <div class="snav-item" id="sn-advances" onclick="gotoPage('advances')"><span class="snav-ic">💳</span>Advances</div>
        <div class="snav-grp">Analytics</div>
        <div class="snav-item" id="sn-reports" onclick="gotoPage('reports')"><span class="snav-ic">📊</span>Reports</div>
        <div class="snav-grp">Settings</div>
        <div class="snav-item" id="sn-organizations" onclick="gotoPage('organizations')"><span class="snav-ic">🏛️</span>Organizations</div>
        <div class="snav-item" id="sn-documents" onclick="gotoPage('documents')"><span class="snav-ic">📁</span>Documents</div>
        <div class="snav-item" id="sn-credentials" onclick="gotoPage('credentials')"><span class="snav-ic">🔑</span>Credentials</div>
        <div class="snav-item" id="sn-backup" onclick="gotoPage('backup')"><span class="snav-ic">💾</span>Backup & Restore</div>
      </div>
    </aside>
    <div class="hr-main" id="hrMain"></div>
  </div>
</div>

<!-- EMPLOYEE -->
<div id="empScreen" class="screen">
  <nav class="topnav">
    <div class="tn-logo"><div class="tn-icon">T</div><div><div class="tn-name">My Payslips</div><div class="tn-org">TATTI / RM Educational Trust</div></div></div>
    <div class="tn-right">
      <span class="tn-badge emp">Employee</span>
      <div class="tn-av" id="empAv"></div>
      <span class="tn-uname" id="empNm"></span>
      <button class="signout" onclick="signOut()">Sign Out</button>
    </div>
  </nav>
  <div class="emp-main" id="empMain"></div>
</div>

<!-- MODAL -->
<div class="modal-ov" id="mOv" onclick="mOut(event)">
  <div class="modal" id="mBox">
    <div class="modal-head"><h3 id="mTitle"></h3><button class="modal-close" onclick="mClose()">✕</button></div>
    <div class="modal-body" id="mBody"></div>
    <div class="modal-foot" id="mFoot"></div>
  </div>
</div>
<div class="toast" id="toast"></div>`;

function App() {
  const containerRef = useRef(null);
  const scriptLoadedRef = useRef(false);
  const navigate = useNavigate();
  const location = useLocation();

  const syncRouteWithJS = (pathname) => {
    const hrScreen = document.getElementById('hrScreen');
    const empScreen = document.getElementById('empScreen');
    const loginScreen = document.getElementById('loginScreen');

    const isHRActive = hrScreen && hrScreen.classList.contains('active');
    const isEmpActive = empScreen && empScreen.classList.contains('active');

    const matchHR = matchPath('/hr/:page', pathname);
    const matchHRBase = matchPath('/hr', pathname);
    const matchEmp = matchPath('/employee', pathname);
    const matchLogin = matchPath('/login', pathname);
    const matchRoot = matchPath('/', pathname);

    if (matchHR) {
      const page = matchHR.params.page;
      if (isHRActive) {
        if (window.curPage !== page) {
          const originalGotoPage = window.originalGotoPage || window.gotoPage;
          if (typeof originalGotoPage === 'function') {
            originalGotoPage(page);
          }
        }
      } else {
        navigate('/login', { replace: true });
      }
    } else if (matchHRBase) {
      if (isHRActive) {
        navigate('/hr/dashboard', { replace: true });
      } else {
        navigate('/login', { replace: true });
      }
    } else if (matchEmp) {
      if (!isEmpActive) {
        navigate('/login', { replace: true });
      }
    } else if (matchLogin) {
      if (isHRActive || isEmpActive) {
        const originalSignOut = window.originalSignOut || window.signOut;
        if (typeof originalSignOut === 'function') {
          originalSignOut();
        }
      }
    } else if (matchRoot) {
      if (isHRActive) {
        navigate('/hr/dashboard', { replace: true });
      } else if (isEmpActive) {
        navigate('/employee', { replace: true });
      } else {
        navigate('/login', { replace: true });
      }
    }
  };

  useEffect(() => {
    if (scriptLoadedRef.current) return;
    scriptLoadedRef.current = true;

    const script = document.createElement('script');
    script.src = '/originalScript.js?v=' + Date.now();
    script.async = false;
    script.onload = () => {
      window.originalGotoPage = window.gotoPage;
      window.originalShowHR = window.showHR;
      window.originalShowEmpScreen = window.showEmpScreen;
      window.originalSignOut = window.signOut;
      window.originalSwitchTab = window.switchTab;

      window.gotoPage = (page) => {
        if (typeof window.originalGotoPage === 'function') {
          window.originalGotoPage(page);
        }
        navigate(`/hr/${page}`);
      };

      window.showHR = () => {
        if (typeof window.originalShowHR === 'function') {
          window.originalShowHR();
        }
        navigate('/hr/dashboard');
      };

      window.showEmpScreen = (emp) => {
        if (typeof window.originalShowEmpScreen === 'function') {
          window.originalShowEmpScreen(emp);
        }
        navigate('/employee');
      };

      window.signOut = () => {
        if (typeof window.originalSignOut === 'function') {
          window.originalSignOut();
        }
        navigate('/login');
      };

      window.switchTab = (tab) => {
        if (typeof window.originalSwitchTab === 'function') {
          window.originalSwitchTab(tab);
        }
        navigate('/login');
      };

      if (typeof window.init === 'function') {
        window.init();
      } else if (typeof window.switchTab === 'function') {
        window.switchTab('hr');
      }

      syncRouteWithJS(location.pathname);
    };

    script.onerror = (e) => {
      console.error('Failed to load originalScript.js', e);
    };
    document.body.appendChild(script);

    return () => {
      try { document.body.removeChild(script); } catch (_) {}
    };
  }, []);

  useEffect(() => {
    if (!scriptLoadedRef.current || !window.gotoPage) return;
    syncRouteWithJS(location.pathname);
  }, [location.pathname]);

  return (
    <div
      ref={containerRef}
      dangerouslySetInnerHTML={{ __html: ORIGINAL_BODY_HTML }}
    />
  );
}

export default App;
