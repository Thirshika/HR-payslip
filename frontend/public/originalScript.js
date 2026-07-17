// ═══════════════════════════════════════════════════════════════
//  CONSTANTS
// ═══════════════════════════════════════════════════════════════
let HR_PASS = localStorage.getItem('tatti_hrpass_v1') || 'HR@Admin2024';
const COLORS = ['#d4a017','#3a7bd5','#2eaa6e','#c0612f','#7b52c0','#c0297a','#1a8a8a','#8a6a1a','#5a3ac0','#3a9a3a'];
const MONTHS_LIST = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const LOCAL_HOSTNAMES = ['localhost', '127.0.0.1', '0.0.0.0'];
const API_BASE_URL = LOCAL_HOSTNAMES.includes(window.location.hostname)
  ? 'http://127.0.0.1:8000'
  : localStorage.getItem('tatti_api_url') || 'https://hr-payslip-mh66.onrender.com';

// ── FETCH EMPLOYEES FROM BACKEND API ──
async function fetchEmployeesFromAPI() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/employees`);
    if (response.ok) {
      const employees = await response.json();
      if (Array.isArray(employees) && employees.length > 0) {
        localStorage.setItem('tatti_emp_v5', JSON.stringify(employees));
        return employees;
      }
    }
  } catch (error) {
    console.log('Could not fetch from API, using local data:', error);
  }
  return null;
}

/*
  salaryBatch:
    'B1' = Batch 1 (26th prev month to 25th current month)
    'B2' = Batch 2 (1st to 30th/31st of current month)

  salaryBasis:
    'days'  = salary per day
    'hours' = salary per hour

  Payroll record per employee per month:
    { empId, month, periodLabel,
      gross, travellingAllowance, otherConveyance, telephoneExpenses, otherExpenses,
      totalPayable,
      workingDays (or workingHours for hours-basis),
      present (or presentHours),
      paidLeave (or paidLeaveHours),
      unpaidUnits,     ← absent days or absent hours
      lopAuto, lopOverride, lopAmount,
      totalAdvReceived, carriedForward, deduction, yetToDeduct,
      advanceDeducted, otherDeduction, halfDaySalaryDeduction,
      netPayable, paidAmount, balanceAmount,
      remarks
    }
*/

// ── SEED EMPLOYEES from uploaded Excel data ──
function seedEmployees(){
  return [
    // ── TATTI / Anna Salai ──
    {
      id:'EMP001', name:'Shanthi J', org:'Tamilnadu Advanced Technical Training Institute',
      branch:'Anna Salai', designation:'Staff', phone:'+916369131128',
      email:'shanthijagan16@gmail.com', acct:'6072001166', bank:'INDIAN BANK', ifsc:'IDIB000A089',
      doj:'2011-03-18', gross:15500, travellingAllowance:0, otherConveyance:0, telephoneExpenses:0, otherExpenses:0,
      salaryBatch:'B1', salaryBasis:'days',
      lastIncrement:'2025-04-30', pass:'Shanthi@001',
      salaryHistory:[
        {fromMonth:'Apr 2025',basic:12500,revised:15500,pct:24,note:'Annual increment'},
        {fromMonth:'—',basic:12500,revised:12500,pct:0,note:'Joining salary'}
      ],
      advanceBalance:0, advanceHistory:[], leaveBalance:{casual:12,sick:12,earned:15}
    },
    {
      id:'EMP002', name:'Mareeswari.P', org:'Tamilnadu Advanced Technical Training Institute',
      branch:'Anna Salai', designation:'Staff', phone:'+919698392701',
      email:'sharmi.shanthi@gmail.com', acct:'6151309692', bank:'INDIAN BANK', ifsc:'IDIB000A089',
      doj:'2019-06-16', gross:27000, travellingAllowance:0, otherConveyance:0, telephoneExpenses:0, otherExpenses:589,
      salaryBatch:'B1', salaryBasis:'days',
      lastIncrement:'2025-11-30', pass:'Maree@002',
      salaryHistory:[
        {fromMonth:'Nov 2025',basic:25000,revised:27000,pct:8,note:'Annual increment'},
        {fromMonth:'Apr 2024',basic:20000,revised:25000,pct:25,note:'Increment'},
        {fromMonth:'Mar 2023',basic:15000,revised:20000,pct:33.33,note:'Increment'}
      ],
      advanceBalance:0, advanceHistory:[], leaveBalance:{casual:12,sick:12,earned:15}
    },
    {
      id:'EMP003', name:'Sheeba Rani S', org:'Tamilnadu Advanced Technical Training Institute',
      branch:'Anna Salai', designation:'Staff', phone:'+916383151521',
      email:'mis@tatti.in', acct:'922010014766921', bank:'Axis Bank', ifsc:'UTIB0000345',
      doj:'2023-03-15', gross:22000, travellingAllowance:0, otherConveyance:0, telephoneExpenses:0, otherExpenses:0,
      salaryBatch:'B2', salaryBasis:'days',
      lastIncrement:'2025-06-30', pass:'Sheeba@003',
      salaryHistory:[
        {fromMonth:'Jun 2025',basic:18000,revised:22000,pct:22.22,note:'Annual increment'},
        {fromMonth:'Jul 2023',basic:15000,revised:18000,pct:20,note:'Increment'}
      ],
      advanceBalance:0, advanceHistory:[], leaveBalance:{casual:12,sick:12,earned:15}
    },
    {
      id:'EMP004', name:'V.MURUGA LAKSHMI', org:'Tamilnadu Advanced Technical Training Institute',
      branch:'Anna Salai', designation:'Staff', phone:'+919345039665',
      email:'darunmaha19@gmail.com', acct:'44830100016630', bank:'BANK OF BARODA', ifsc:'BARB0SAIDAP',
      doj:'2025-01-13', gross:13000, travellingAllowance:0, otherConveyance:0, telephoneExpenses:0, otherExpenses:0,
      salaryBatch:'B2', salaryBasis:'days',
      lastIncrement:'2026-03-25', pass:'Muruga@004',
      salaryHistory:[
        {fromMonth:'Mar 2026',basic:12000,revised:13000,pct:8.33,note:'Annual increment'},
        {fromMonth:'Jun 2025',basic:8000,revised:12000,pct:50,note:'Increment'}
      ],
      advanceBalance:0, advanceHistory:[], leaveBalance:{casual:12,sick:12,earned:15}
    },
    {
      id:'EMP005', name:'GAYATHRI GOPAL', org:'Tamilnadu Advanced Technical Training Institute',
      branch:'Anna Salai', designation:'Staff', phone:'+919344530463',
      email:'be.gayathrigopal@gmail.com', acct:'850214152', bank:'INDIAN BANK', ifsc:'IDIB000J019',
      doj:'2025-11-09', gross:8000, travellingAllowance:0, otherConveyance:0, telephoneExpenses:0, otherExpenses:0,
      salaryBatch:'B2', salaryBasis:'days',
      lastIncrement:'', pass:'Gayathri@005',
      salaryHistory:[],
      advanceBalance:0, advanceHistory:[], leaveBalance:{casual:12,sick:12,earned:15}
    },
    {
      id:'EMP006', name:'Presitha J', org:'Tamilnadu Advanced Technical Training Institute',
      branch:'Anna Salai', designation:'Staff', phone:'+919884785887',
      email:'tatti.projects.user4@gmail.com', acct:'3568048571', bank:'Central Bank of India', ifsc:'CBIN0281267',
      doj:'2025-11-09', gross:12000, travellingAllowance:0, otherConveyance:0, telephoneExpenses:0, otherExpenses:0,
      salaryBatch:'B2', salaryBasis:'hours',
      lastIncrement:'', pass:'Presitha@006',
      salaryHistory:[],
      advanceBalance:0, advanceHistory:[], leaveBalance:{casual:12,sick:12,earned:15}
    },
    // ── RM Educational Trust / Gee Gee Complex ──
    {
      id:'EMP007', name:'Mohammed Haniffa A', org:'R M Educational Trust',
      branch:'Gee Gee Complex', designation:'Manager', phone:'+919790804455',
      email:'haniffa.tatti@gmail.com', acct:'875371402', bank:'INDIAN BANK', ifsc:'IDIB000A089',
      doj:'2011-01-15', gross:32000, travellingAllowance:2000, otherConveyance:0, telephoneExpenses:0, otherExpenses:0,
      salaryBatch:'B1', salaryBasis:'days',
      lastIncrement:'2024-03-07', pass:'Haniffa@007',
      salaryHistory:[
        {fromMonth:'Mar 2024',basic:30000,revised:32000,pct:6.67,note:'Annual increment'},
        {fromMonth:'Oct 2023',basic:28000,revised:30000,pct:7.14,note:'Increment'},
        {fromMonth:'Mar 2023',basic:26500,revised:28000,pct:5.66,note:'Increment'},
        {fromMonth:'Nov 2022',basic:25000,revised:26500,pct:6,note:'Increment'}
      ],
      advanceBalance:0, advanceHistory:[], leaveBalance:{casual:12,sick:12,earned:15}
    },
    {
      id:'EMP008', name:'Shanthi.J', org:'R M Educational Trust',
      branch:'Gee Gee Complex', designation:'Staff', phone:'+918754515316',
      email:'shanthijagan16@gmail.com', acct:'6072001166', bank:'INDIAN BANK', ifsc:'IDIB000A089',
      doj:'2011-03-18', gross:16000, travellingAllowance:2000, otherConveyance:0, telephoneExpenses:0, otherExpenses:0,
      salaryBatch:'B1', salaryBasis:'days',
      lastIncrement:'2024-04-08', pass:'ShanthiJ@008',
      salaryHistory:[
        {fromMonth:'Apr 2024',basic:13000,revised:16000,pct:23.08,note:'Annual increment'},
        {fromMonth:'Mar 2023',basic:10000,revised:13000,pct:30,note:'Increment'}
      ],
      advanceBalance:0, advanceHistory:[], leaveBalance:{casual:12,sick:12,earned:15}
    },
    {
      id:'EMP009', name:'Sridevi M', org:'R M Educational Trust',
      branch:'Gee Gee Complex', designation:'Staff', phone:'+918939773699',
      email:'test@gmail.com', acct:'610283199', bank:'INDIAN BANK', ifsc:'IDIB000A089',
      doj:'2017-06-01', gross:4500, travellingAllowance:0, otherConveyance:0, telephoneExpenses:0, otherExpenses:0,
      salaryBatch:'B2', salaryBasis:'hours',
      lastIncrement:'2023-01-07', pass:'Sridevi@009',
      salaryHistory:[
        {fromMonth:'Jan 2023',basic:4000,revised:4500,pct:12.5,note:'Increment'}
      ],
      advanceBalance:0, advanceHistory:[], leaveBalance:{casual:12,sick:12,earned:15}
    },
    {
      id:'EMP010', name:'Murugesan.P', org:'R M Educational Trust',
      branch:'Gee Gee Complex', designation:'Staff', phone:'+916383080464',
      email:'muruskendra@yahoo.com', acct:'6609595618', bank:'INDIAN BANK', ifsc:'IDIB000A089',
      doj:'2017-06-07', gross:15000, travellingAllowance:1000, otherConveyance:0, telephoneExpenses:0, otherExpenses:0,
      salaryBatch:'B1', salaryBasis:'days',
      lastIncrement:'2024-04-08', pass:'Murugesan@010',
      salaryHistory:[
        {fromMonth:'Apr 2024',basic:13000,revised:15000,pct:15.38,note:'Annual increment'}
      ],
      advanceBalance:0, advanceHistory:[], leaveBalance:{casual:12,sick:12,earned:15}
    },
  ];
}

// ── LOAD DATA ──
let EMP = JSON.parse(localStorage.getItem('tatti_emp_v5') || 'null') || seedEmployees();
let PAY = JSON.parse(localStorage.getItem('tatti_pay_v5') || 'null') || {};

// ── INITIALIZE: Fetch fresh data from backend ──
async function initializeAppData() {
  try {
    const apiEmployees = await fetchEmployeesFromAPI();
    if (apiEmployees && apiEmployees.length > 0) {
      EMP = apiEmployees;
      console.log(`✅ Loaded ${EMP.length} employees from backend`);
    }
  } catch (error) {
    console.log('Error during initialization:', error);
  }
}
// Call on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeAppData);
} else {
  initializeAppData();
}

let curTab='hr', curPage='dashboard', curEmpId=null, srchQ='', selMonth=null, empViewMon=null;

// ── NEW MODULE DATA ──
let LEAVE_APPS  = JSON.parse(localStorage.getItem('tatti_leaves_v1') || '[]');
let EXPENSE_CLAIMS = JSON.parse(localStorage.getItem('tatti_expenses_v1') || '[]');

// ── ORGANIZATIONS & BRANCHES ──
const DEFAULT_ORGS = [
  {id:'ORG001', name:'Tamilnadu Advanced Technical Training Institute', shortName:'TATTI', color:'#6b3ac0',
   branches:['Anna Salai','Interns'], address:'', phone:'', email:'', website:''},
  {id:'ORG002', name:'R M Educational Trust', shortName:'RM Trust', color:'#1a7a4a',
   branches:['Gee Gee Complex'], address:'', phone:'', email:'', website:''},
];
let ORGS = JSON.parse(localStorage.getItem('tatti_orgs_v1') || 'null') || DEFAULT_ORGS;

// ── EMPLOYEE DOCUMENTS ──
let EMP_DOCS = JSON.parse(localStorage.getItem('tatti_docs_v1') || '[]');

const DOC_TYPES = [
  {id:'photo',      label:'Profile Photo',        emoji:'📷', accept:'image/*',         color:'#3a7bd5'},
  {id:'aadhar',     label:'Aadhar Card',           emoji:'🪪', accept:'image/*,.pdf',    color:'#1a7a4a'},
  {id:'id_proof',   label:'ID Proof',              emoji:'🪪', accept:'image/*,.pdf',    color:'#7b52c0'},
  {id:'bank',       label:'Bank Passbook/Cheque',  emoji:'🏦', accept:'image/*,.pdf',    color:'#c0297a'},
  {id:'qualification',label:'Qualification Cert.', emoji:'🎓', accept:'image/*,.pdf',    color:'#e8a832'},
  {id:'resume',     label:'Resume / CV',           emoji:'📄', accept:'.pdf,.doc,.docx', color:'#c05a0f'},
  {id:'experience', label:'Experience Cert.',      emoji:'🏅', accept:'image/*,.pdf',    color:'#1a5fa8'},
  {id:'other',      label:'Other Document',        emoji:'📎', accept:'*',               color:'#556b84'},
];

const LEAVE_TYPES = [
  {id:'CL',label:'Casual Leave',color:'#3a7bd5',max:12,emoji:'🌴'},
  {id:'SL',label:'Sick Leave',color:'#2eaa6e',max:12,emoji:'🤒'},
  {id:'EL',label:'Earned Leave',color:'#7b52c0',max:15,emoji:'🏅'},
  {id:'ML',label:'Maternity Leave',color:'#c0297a',max:90,emoji:'👶'},
  {id:'LWP',label:'Leave Without Pay (Full Day)',color:'#b83030',max:999,emoji:'⛔'},
  {id:'HALFLWP',label:'Half Day LWP',color:'#e67e22',max:999,emoji:'🌗'},
];
const EXPENSE_CATS = [
  {id:'travel',label:'Travel',emoji:'🚌'},{id:'food',label:'Food & Meals',emoji:'🍱'},
  {id:'stationery',label:'Stationery',emoji:'📝'},{id:'telephone',label:'Telephone',emoji:'📞'},
  {id:'accommodation',label:'Accommodation',emoji:'🏨'},{id:'medical',label:'Medical',emoji:'🏥'},
  {id:'other',label:'Other',emoji:'📦'},
];

function saveAll(){
  localStorage.setItem('tatti_emp_v5',JSON.stringify(EMP));
  localStorage.setItem('tatti_pay_v5',JSON.stringify(PAY));
  localStorage.setItem('tatti_leaves_v1',JSON.stringify(LEAVE_APPS));
  localStorage.setItem('tatti_expenses_v1',JSON.stringify(EXPENSE_CLAIMS));
  localStorage.setItem('tatti_orgs_v1',JSON.stringify(ORGS));
  // Don't save EMP_DOCS in saveAll - handled separately (large files)
}

let _rptTab='org', _rptMonth='', _leaveFilter='all', _expFilter='all';


function saveDocs(){ try{ localStorage.setItem('tatti_docs_v1',JSON.stringify(EMP_DOCS)); }catch(e){ toast('Storage full — try removing old docs','err'); } }
function save(){ saveAll(); }

// ── Helpers ──
const ini  = n => n.split(' ').filter(Boolean).slice(0,2).map(p=>p[0].toUpperCase()).join('');
const clr  = i => COLORS[i%COLORS.length];
const idx  = id => EMP.findIndex(e=>e.id===id);
const byId = id => EMP.find(e=>e.id===id);
const ec   = id => { const i=idx(id); return clr(i<0?0:i); };
const fmt  = n => '₹'+Number(n||0).toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2});
const fmtK = n => { if(n>=100000) return '₹'+(n/100000).toFixed(2)+'L'; if(n>=1000) return '₹'+(n/1000).toFixed(1)+'K'; return fmt(n); };
const today= ()=> new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'});
const mList= ()=> Object.keys(PAY).sort((a,b)=>mNum(b)-mNum(a));
const mNum = m  => { if(!m) return 0; const p=m.split(' '); return (parseInt(p[1])||0)*100+MONTHS_LIST.findIndex(x=>x.startsWith(p[0].replace('.',''))); };
const isLocked = m => PAY[m]?.locked===true;
const getRec   = (m,id) => PAY[m]?.records?.find(r=>r.empId===id)||null;
const empMons  = id => mList().filter(m=>getRec(m,id));
const nextId   = () => { const n=EMP.map(e=>parseInt(e.id.replace('EMP',''))||0); return 'EMP'+String((n.length?Math.max(...n):0)+1).padStart(3,'0'); };
const batchLabel = b => b==='B1'?'Batch 1 (26–25)':'Batch 2 (1–30)';
const basisLabel = b => b==='hours'?'Hours Basis':b==='perday'?'Per Day Rate':'Days Basis';

// Net calculation
function calcAllowances(r){
  // Pro-rata: allowance × (present / workingDays) if proRata flag set
  const wd=r.workingDays||30;
  const present=r.present||wd;
  const ratio=r.proRataAllowance&&wd>0?(present/wd):1;
  return {
    ta:  Math.round((r.travellingAllowance||0)*ratio*100)/100,
    oc:  Math.round((r.otherConveyance||0)*ratio*100)/100,
    te:  Math.round((r.telephoneExpenses||0)*ratio*100)/100,
    oe:  Math.round((r.otherExpenses||0)*ratio*100)/100,
  };
}
function recTotalPayable(r){
  const a=calcAllowances(r);
  const incentive=r.incentive||0;
  if(r.basisType==='perday'){
    const earned=(r.gross||0)*(r.present||0);
    return earned+a.ta+a.oc+a.te+a.oe+incentive;
  }
  if(r.basisType==='hours'){
    const earned=(r.gross||0)*(r.presentHours||0);
    return earned+a.ta+a.oc+a.te+a.oe+incentive;
  }
  return (r.gross||0)+a.ta+a.oc+a.te+a.oe+incentive;
}
function calcAutoLOP(r){
  if(r.basisType==='perday') return 0; // Per-day: no LOP, salary = rate × present days
  if(r.basisType==='hours')  return 0; // Hours: no LOP, salary = perHourRate × present hours
  // Days basis: LOP = (gross / workingDays) × (absent days + halfDays×0.5)
  const tp = r.gross || 0;
  const wd = r.workingDays||30;
  const absent = (r.unpaidUnits||0) + (r.halfDayUnits||0)*0.5;
  return wd>0 ? Math.round((tp/wd)*absent*100)/100 : 0;
}
function lopAmt(r){ return r.lopOverride?(r.lopAmount||0):calcAutoLOP(r); }
function netPay(r){
  const tp=recTotalPayable(r);
  return Math.max(0, tp - lopAmt(r) - (r.advanceDeducted||0) - (r.otherDeduction||0) - (r.halfDayDeduction||0));
}

// Period label helper
function periodLabel(batch, month){
  // month like "Apr 2026"
  const parts = month.split(' ');
  const yr = parseInt(parts[1])||2026;
  const moIdx = MONTHS_LIST.findIndex(x=>x.startsWith(parts[0]));
  if(batch==='B1'){
    const prevMo = moIdx===0?MONTHS_LIST[11]:MONTHS_LIST[moIdx-1];
    const prevYr = moIdx===0?yr-1:yr;
    return `26 ${prevMo.slice(0,3)} ${prevYr} – 25 ${MONTHS_LIST[moIdx].slice(0,3)} ${yr}`;
  } else {
    const lastDay = new Date(yr, moIdx+1, 0).getDate();
    return `01 ${MONTHS_LIST[moIdx].slice(0,3)} ${yr} – ${lastDay} ${MONTHS_LIST[moIdx].slice(0,3)} ${yr}`;
  }
}
// Returns JS Date range for a payroll period
function getPeriodDates(batch, month){
  const parts=month.split(' ');
  const yr=parseInt(parts[1])||2026;
  const moIdx=MONTHS_LIST.findIndex(x=>x.startsWith(parts[0]));
  if(batch==='B1'){
    const pMo=moIdx===0?11:moIdx-1;
    const pYr=moIdx===0?yr-1:yr;
    return {from:new Date(pYr,pMo,26), to:new Date(yr,moIdx,25)};
  } else {
    const lastDay=new Date(yr,moIdx+1,0).getDate();
    return {from:new Date(yr,moIdx,1), to:new Date(yr,moIdx,lastDay)};
  }
}

// Convert a period {from,to} to YYYY-MM-DD strings for timezone-safe comparison
function periodToStrings(period){
  function toStr(d){ return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
  return {fromStr:toStr(period.from), toStr:toStr(period.to)};
}

// Count how many leave days fall within a payroll period (handles partial overlaps)
function leaveDaysInPeriod(leave, periodStr){
  // leave.fromDate and leave.toDate are YYYY-MM-DD strings
  const lFrom=leave.fromDate||'';
  const lTo=leave.toDate||leave.fromDate||'';
  if(!lFrom) return 0;
  // Overlap: leave starts before period ends AND leave ends after period starts
  if(lFrom > periodStr.toStr || lTo < periodStr.fromStr) return 0;
  // Clamp to period
  const clampFrom=lFrom < periodStr.fromStr ? periodStr.fromStr : lFrom;
  const clampTo  =lTo   > periodStr.toStr   ? periodStr.toStr   : lTo;
  // Count calendar days in clamped range
  const ms=new Date(clampTo)-new Date(clampFrom);
  return Math.round(ms/86400000)+1;
}
function workingDaysDefault(batch, month){
  const parts=month.split(' ');
  const yr=parseInt(parts[1])||2026;
  const moIdx=MONTHS_LIST.findIndex(x=>x.startsWith(parts[0]));
  if(batch==='B1'){
    // B1: 26th prev month to 25th current month
    // Calculate exact days: days remaining in prev month (26 to end) + days in current month (1 to 25)
    const pMo=moIdx===0?11:moIdx-1;
    const pYr=moIdx===0?yr-1:yr;
    const daysInPrevMonth=new Date(pYr,pMo+1,0).getDate(); // last day of prev month
    const daysFromPrev=daysInPrevMonth-26+1; // 26th to end of prev month
    const daysInCurrent=25; // 1st to 25th of current month
    return daysFromPrev+daysInCurrent;
  }
  return new Date(yr,moIdx+1,0).getDate(); // B2: full month days
}

function toWords(n){
  const on=['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'];
  const tn=['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];
  function h(x){if(!x)return'';if(x<20)return on[x]+' ';if(x<100)return tn[Math.floor(x/10)]+' '+(on[x%10]?on[x%10]+' ':'');return on[Math.floor(x/100)]+' Hundred '+(x%100?h(x%100):'')}
  const i=Math.floor(n);let r='';
  if(i>=10000000){r+=h(Math.floor(i/10000000))+' Crore ';}
  if(i%10000000>=100000){r+=h(Math.floor((i%10000000)/100000))+' Lakh ';}
  if(i%100000>=1000){r+=h(Math.floor((i%100000)/1000))+' Thousand ';}
  r+=h(i%1000);
  return (r.trim()||'Zero')+' Only';
}

function toast(msg,type='ok'){
  const t=document.getElementById('toast');
  t.textContent=msg; t.className='toast show '+type;
  setTimeout(()=>t.className='toast',3000);
}

// ── MONTH-YEAR SELECTOR WIDGET ──
function monthYearWidget(currentVal, onchangeFn){
  const now = new Date();
  const years = [];
  for(let y=2020;y<=now.getFullYear()+5;y++) years.push(y);
  const parts = (currentVal||'').split(' ');
  const curMo = MONTHS_LIST.findIndex(x=>x.startsWith(parts[0]));
  const curYr = parseInt(parts[1])||now.getFullYear();
  return `<div class="mon-year-row">
    <div class="f fi" style="margin:0;flex:1;">
      <label>Month</label>
      <select id="selMo" onchange="${onchangeFn}">
        ${MONTHS_LIST.map((m,i)=>`<option value="${i}" ${i===curMo?'selected':''}>${m}</option>`).join('')}
      </select>
    </div>
    <div class="f fi" style="margin:0;flex:1;">
      <label>Year</label>
      <select id="selYr" onchange="${onchangeFn}">
        ${years.map(y=>`<option value="${y}" ${y===curYr?'selected':''}>${y}</option>`).join('')}
      </select>
    </div>
  </div>`;
}
function getMonYrValue(){
  const mo=document.getElementById('selMo')?.value;
  const yr=document.getElementById('selYr')?.value;
  if(mo===undefined||!yr) return null;
  return MONTHS_LIST[parseInt(mo)].slice(0,3)+' '+yr;
}

// ═══════════════════════════════════════════
//  LOGIN
// ═══════════════════════════════════════════
function switchTab(t){
  curTab=t;
  document.getElementById('tabHR').className='tab-btn'+(t==='hr'?' active':'');
  document.getElementById('tabEmp').className='tab-btn'+(t==='emp'?' active':'');
  renderLogin();
  document.getElementById('loginErr').style.display='none';
}
function renderLogin(){
  document.getElementById('loginFields').innerHTML = curTab==='hr'
    ? `<div class="f"><label>HR Password</label><input type="password" id="lf1" placeholder="HR admin password" onkeydown="if(event.key==='Enter')doLogin()"/></div>`
    : `<div class="f"><label>Employee ID</label><input type="text" id="lf1" placeholder="EMP001"/></div>
       <div class="f"><label>Password</label><input type="password" id="lf2" placeholder="Your password" onkeydown="if(event.key==='Enter')doLogin()"/></div>`;
  document.getElementById('loginFields').insertAdjacentHTML('beforeend',
    `<button class="login-btn" onclick="doLogin()" style="margin-top:4px;">${curTab==='hr'?'Sign In as HR Admin':'Sign In'}</button>`);
}
function doLogin(){
  const err=document.getElementById('loginErr');
  if(curTab==='hr'){
    if(document.getElementById('lf1').value===HR_PASS){ err.style.display='none'; showHR(); }
    else err.style.display='block';
  } else {
    const id=(document.getElementById('lf1').value||'').trim().toUpperCase();
    const p=document.getElementById('lf2').value||'';
    const e=EMP.find(x=>x.id===id&&x.pass===p);
    if(e){ err.style.display='none'; showEmpScreen(e); }
    else err.style.display='block';
  }
}
function signOut(){
  curEmpId=null; empViewMon=null;
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById('loginScreen').classList.add('active');
}

// ═══════════════════════════════════════════
//  HR NAVIGATION
// ═══════════════════════════════════════════
function showHR(){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById('hrScreen').classList.add('active');
  gotoPage('dashboard');
}
function gotoPage(p){
  curPage=p;
  document.querySelectorAll('.snav-item').forEach(el=>el.className='snav-item'+(el.id==='sn-'+p?' active':''));
  const pages={dashboard:pgDashboard,employees:pgEmployees,attendance:pgAttendance,generate:pgGenerate,history:pgHistory,hrportal:pgHRPortal,credentials:pgCredentials,leaves:pgLeave,expenses:pgExpenses,increments:pgIncrements,advances:pgAdvances,reports:pgReports,organizations:pgOrganizations,documents:pgDocuments,backup:pgBackup};
  (pages[p]||pgDashboard)(document.getElementById('hrMain'));
}

// ── DASHBOARD ──
function pgDashboard(m){
  const mons=mList(); const lat=mons[0]||'';
  const recs=lat?(PAY[lat]?.records||[]):[];
  const tP=recs.reduce((s,r)=>s+recTotalPayable(r),0);
  const tN=recs.reduce((s,r)=>s+netPay(r),0);
  const tL=recs.reduce((s,r)=>s+lopAmt(r),0);
  const tAdv=EMP.reduce((s,e)=>s+(e.advanceBalance||0),0);
  const b1=EMP.filter(e=>e.salaryBatch==='B1').length;
  const b2=EMP.filter(e=>e.salaryBatch==='B2').length;
  const hrsEmp=EMP.filter(e=>e.salaryBasis==='hours').length;
  const dayEmp=EMP.filter(e=>e.salaryBasis==='days'||!e.salaryBasis).length;
  const pdEmp=EMP.filter(e=>e.salaryBasis==='perday').length;

  m.innerHTML=`
  <div class="page-hd"><div><h1>Dashboard</h1><p>Latest payroll: ${lat||'None yet'}</p></div></div>
  <div class="stat-strip" style="grid-template-columns:repeat(4,1fr);">
    <div class="sc gold"><div class="sc-l">Total Employees</div><div class="sc-v">${EMP.length}</div><div class="sc-s">B1: ${b1} · B2: ${b2}</div></div>
    <div class="sc blue"><div class="sc-l">Salary Basis</div><div class="sc-v">${dayEmp}D / ${hrsEmp}H${pdEmp?` / ${pdEmp}PD`:''}</div><div class="sc-s">Days / Hours${pdEmp?' / Per Day':''}</div></div>
    <div class="sc green"><div class="sc-l">Total Payable</div><div class="sc-v">${fmtK(tP)}</div><div class="sc-s">${lat||'—'}</div></div>
    <div class="sc blue"><div class="sc-l">Net Disbursed</div><div class="sc-v">${fmtK(tN)}</div><div class="sc-s">after deductions</div></div>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.25rem;">
    <div class="card">
      <div class="card-h"><h3>Branches</h3></div>
      ${[...new Set(ORGS.flatMap(o=>o.branches||[]))].map(br=>{
        const cnt=EMP.filter(e=>e.branch===br).length;
        if(!cnt) return '';
        const orgs=[...new Set(EMP.filter(e=>e.branch===br).map(e=>e.org.split(' ').slice(0,3).join(' ')))];
        return `<div style="padding:10px 16px;border-bottom:1px solid var(--cream2);">
          <div style="font-weight:500;font-size:13px;">${br}</div>
          <div style="font-size:11px;color:var(--muted);">${orgs.join(' / ')} · ${cnt} staff</div>
        </div>`;
      }).join('')}
    </div>
    <div class="card">
      <div class="card-h"><h3>Recent Payroll</h3></div>
      ${mons.length===0?'<div style="padding:1rem;font-size:13px;color:var(--muted);">No payrolls yet.</div>':
        mons.slice(0,6).map(mo=>{
          const rc=PAY[mo]?.records||[];
          const n=rc.reduce((s,r)=>s+netPay(r),0);
          return `<div style="display:flex;align-items:center;gap:10px;padding:9px 16px;border-bottom:1px solid var(--cream2);cursor:pointer;" onclick="selMonth='${mo}';gotoPage('history')">
            <span>${isLocked(mo)?'🔒':'📝'}</span>
            <div style="flex:1;font-size:13px;font-weight:500;">${mo}</div>
            <span class="badge ${isLocked(mo)?'b-lock':'b-blue'}">${isLocked(mo)?'Locked':'Draft'}</span>
            <span style="font-size:13px;font-weight:600;color:var(--green);">${fmtK(n)}</span>
          </div>`;
        }).join('')}
    </div>
  </div>
  <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">
    <button class="btn btn-p" onclick="gotoPage('generate')">⚡ Generate Payroll</button>
    <button class="btn btn-g" onclick="gotoPage('history')">🗂️ Payroll History</button>
    <button class="btn btn-o" onclick="gotoPage('employees')">👥 Employees</button>
  </div>`;
}

// ── HR PORTAL — ALL PAYSLIPS ──
function pgHRPortal(m){
  const mons=mList();
  const sel=window._hrpMon||(mons[0]||'');
  window._hrpMon=sel;
  const recs=sel?(PAY[sel]?.records||[]):[];
  const locked=isLocked(sel);

  const srch=(window._hrpSrch||'').toLowerCase();
  const fl=recs.filter(r=>{
    const e=byId(r.empId); if(!e) return false;
    if(srch&&!e.name.toLowerCase().includes(srch)&&!e.id.toLowerCase().includes(srch)&&!e.branch.toLowerCase().includes(srch)) return false;
    return true;
  }).sort((a,b)=>{const ea=byId(a.empId),eb=byId(b.empId);return (ea?.name||'').localeCompare(eb?.name||'');});

  const tN=recs.reduce((s,r)=>s+netPay(r),0);
  const tP=recs.reduce((s,r)=>s+recTotalPayable(r),0);

  m.innerHTML=`
  <div class="page-hd">
    <div><h1>HR Portal — All Payslips</h1><p>View any employee payslip for any month</p></div>
    <div class="pha">
      <button class="btn btn-grn btn-sm" onclick="exportExcel('${sel}')">⬇ Excel</button>
      <button class="btn btn-o btn-sm" onclick="exportCSV('${sel}')">⬇ CSV</button>
    </div>
  </div>

  <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:flex-end;margin-bottom:1.1rem;">
    <div>
      <div style="font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);font-weight:600;margin-bottom:5px;">Payroll Month</div>
      <select style="padding:9px 14px;border:1.5px solid #ddd;border-radius:var(--rs);font-size:13px;font-family:'DM Sans',sans-serif;background:white;outline:none;min-width:160px;" onchange="window._hrpMon=this.value;pgHRPortal(document.getElementById('hrMain'))">
        ${mons.map(mo=>`<option value="${mo}" ${mo===sel?'selected':''}>${mo}${isLocked(mo)?' 🔒':''}</option>`).join('')}
      </select>
    </div>
    <div style="flex:1;min-width:180px;">
      <div style="font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);font-weight:600;margin-bottom:5px;">Search Employee</div>
      <input class="search-inp" type="text" placeholder="Name, ID, branch…" value="${window._hrpSrch||''}" 
        oninput="window._hrpSrch=this.value;pgHRPortal(document.getElementById('hrMain'))"/>
    </div>
  </div>

  ${!sel?`<div class="empty"><div class="ei">📋</div><h3>No payroll data yet</h3><p>Generate payroll first from Generate Payroll.</p></div>`:`
  ${locked?`<div class="banner bn-warn" style="margin-bottom:1rem;">🔒 <strong>${sel}</strong> is finalized.</div>`:'<div class="banner bn-info" style="margin-bottom:1rem;">📝 <strong>'+sel+'</strong> is a draft — not yet finalized.</div>'}

  <div class="stat-strip" style="grid-template-columns:repeat(3,1fr);margin-bottom:1.25rem;">
    <div class="sc gold"><div class="sc-l">Employees</div><div class="sc-v">${recs.length}</div><div class="sc-s">${sel}</div></div>
    <div class="sc green"><div class="sc-l">Total Payable</div><div class="sc-v">${fmtK(tP)}</div></div>
    <div class="sc blue"><div class="sc-l">Net Disbursed</div><div class="sc-v">${fmtK(tN)}</div></div>
  </div>

  ${fl.length===0?`<div class="empty"><div class="ei">🔍</div><h3>No results</h3></div>`:`
  <div style="display:grid;gap:10px;">
    ${fl.map(r=>{
      const e=byId(r.empId); if(!e) return '';
      const ci=idx(r.empId);
      const net=netPay(r), tp=recTotalPayable(r), lop=lopAmt(r);
      const isH=r.basisType==='hours', isPD=r.basisType==='perday';
      const photoDoc=EMP_DOCS.find(d=>d.empId===e.id&&d.type==='photo');
      const avatarHtml=photoDoc
        ? `<img src="${photoDoc.fileData}" style="width:44px;height:44px;border-radius:50%;object-fit:cover;border:2px solid ${clr(ci)};"/>`
        : `<div class="pav" style="background:${clr(ci)}22;color:${clr(ci)}">${ini(e.name)}</div>`;
      return `<div style="background:white;border-radius:var(--r);box-shadow:var(--sh);padding:14px 18px;display:flex;align-items:center;gap:14px;flex-wrap:wrap;border-left:4px solid ${clr(ci)};">
        ${avatarHtml}
        <div style="flex:1;min-width:180px;">
          <div style="font-weight:600;font-size:14px;color:var(--navy);">${e.name}</div>
          <div style="font-size:11px;color:var(--muted);margin-top:2px;">${e.id} · ${e.branch} · ${e.designation||'Staff'}</div>
          <div style="display:flex;gap:5px;margin-top:5px;flex-wrap:wrap;">
            <span class="type-chip ${r.batchType==='B1'?'chip-b1':'chip-b2'}" style="font-size:9px;">${r.batchType}</span>
            <span class="type-chip ${isH?'chip-hours':isPD?'chip-hours':'chip-days'}" style="font-size:9px;">${basisLabel(r.basisType)}</span>
          </div>
        </div>
        <div style="display:flex;gap:20px;flex-wrap:wrap;align-items:center;">
          <div style="text-align:center;">
            <div style="font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);">Total Payable</div>
            <div style="font-size:14px;font-weight:600;color:var(--navy);">${fmt(tp)}</div>
          </div>
          ${lop>0?`<div style="text-align:center;">
            <div style="font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);">LOP</div>
            <div style="font-size:14px;font-weight:600;color:var(--red);">− ${fmt(lop)}</div>
          </div>`:''}
          <div style="text-align:center;">
            <div style="font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);">Net Pay</div>
            <div style="font-family:'DM Serif Display',serif;font-size:20px;color:var(--green);">${fmt(net)}</div>
          </div>
          <div>
            <button class="btn btn-p btn-sm" onclick="openSlip('${e.id}','${sel}')">👁 View Payslip</button>
          </div>
        </div>
      </div>`;
    }).join('')}
  </div>`}
  `}`;
}

// ── EMPLOYEES ──
function pgEmployees(m){
  // Build filter list
  let fl=[...EMP];
  if(srchQ) fl=fl.filter(e=>e.name.toLowerCase().includes(srchQ)||e.branch.toLowerCase().includes(srchQ)||e.id.toLowerCase().includes(srchQ)||e.org.toLowerCase().includes(srchQ)||(e.designation||'').toLowerCase().includes(srchQ));
  if(window._empBrF) fl=fl.filter(e=>e.branch===window._empBrF);
  if(window._empDesigF) fl=fl.filter(e=>(e.designation||'')=== window._empDesigF);
  if(window._empBatchF) fl=fl.filter(e=>e.salaryBatch===window._empBatchF);
  const activeCount=EMP.filter(e=>!e.inactive).length;
  const inactiveCount=EMP.filter(e=>e.inactive).length;
  const designations=[...new Set(EMP.map(e=>e.designation||'').filter(Boolean))].sort();
  m.innerHTML=`
  <div class="page-hd"><div><h1>Employees</h1><p>${EMP.length} total · ${activeCount} active · ${inactiveCount} inactive · ${fl.length} shown</p></div>
    <div class="pha">
      <button class="btn btn-p" onclick="openAddEmp()">+ Add Employee</button>
    </div>
  </div>
  <div class="filter-row" style="margin-bottom:1rem;">
    <div><label class="filter-label">Search</label>
    <input class="search-inp" type="text" placeholder="Name / ID / branch…" value="${srchQ}" oninput="srchQ=this.value.toLowerCase();pgEmployees(document.getElementById('hrMain'))"/></div>
    <div><label class="filter-label">Branch</label>
    <select onchange="window._empBrF=this.value;pgEmployees(document.getElementById('hrMain'))">
      <option value="">All Branches</option>
      ${[...new Set(EMP.map(e=>e.branch).filter(Boolean))].sort().map(b=>`<option value="${b}" ${window._empBrF===b?'selected':''}>${b}</option>`).join('')}
    </select></div>
    <div><label class="filter-label">Designation</label>
    <select onchange="window._empDesigF=this.value;pgEmployees(document.getElementById('hrMain'))">
      <option value="">All Designations</option>
      ${designations.map(d=>`<option value="${d}" ${window._empDesigF===d?'selected':''}>${d}</option>`).join('')}
    </select></div>
    <div><label class="filter-label">Batch</label>
    <select onchange="window._empBatchF=this.value;pgEmployees(document.getElementById('hrMain'))">
      <option value="">All Batches</option>
      <option value="B1" ${window._empBatchF==='B1'?'selected':''}>Batch 1 (B1)</option>
      <option value="B2" ${window._empBatchF==='B2'?'selected':''}>Batch 2 (B2)</option>
    </select></div>
    ${(srchQ||window._empBrF||window._empDesigF||window._empBatchF)?`<div style="display:flex;align-items:flex-end;"><button class="btn btn-o btn-sm" onclick="srchQ='';window._empBrF='';window._empDesigF='';window._empBatchF='';pgEmployees(document.getElementById('hrMain'))">✕ Clear</button></div>`:''}
  </div>
  <div class="tbl-wrap">
    <table class="tbl">
      <thead><tr>
        <th>Employee</th><th>ID</th><th>Org</th><th>Branch</th><th>Gross</th>
        <th>TA</th><th>Batch</th><th>Basis</th><th>Last Increment</th><th>Advance</th><th>Status</th><th>Actions</th>
      </tr></thead>
      <tbody>
        ${fl.length===0?`<tr><td colspan="11" style="text-align:center;padding:2rem;color:var(--muted);">No results</td></tr>`:
          fl.map(e=>{
            const ci=idx(e.id);
            const photoDoc=EMP_DOCS.find(d=>d.empId===e.id&&d.type==='photo');
            const docCount=EMP_DOCS.filter(d=>d.empId===e.id).length;
            const avatarCell=photoDoc
              ? `<img src="${photoDoc.fileData}" style="width:30px;height:30px;border-radius:50%;object-fit:cover;border:2px solid ${clr(ci)};"/>`
              : `<div class="row-av" style="background:${clr(ci)}22;color:${clr(ci)}">${ini(e.name)}</div>`;
            return `<tr>
              <td><div class="nc">
                ${avatarCell}
                <div><div class="nm">${e.name}</div><div class="ns">${e.acct}</div></div>
              </div></td>
              <td style="font-family:monospace;font-size:12px;">${e.id}</td>
              <td style="font-size:11px;max-width:130px;white-space:normal;">${e.org.split(' ').slice(0,4).join(' ')}…</td>
              <td>${e.branch}</td>
              <td>
                <strong>${e.salaryBasis==='hours'?`₹${e.gross}/hr`:e.salaryBasis==='perday'?`₹${e.gross}/day`:fmt(e.gross)}</strong>
                ${e.salaryBasis==='hours'?`<div style="font-size:10px;color:var(--muted);">${e.empWorkingHours||240} hrs/month</div>`:''}
              </td>
              <td>${(e.travellingAllowance||0)>0?fmt(e.travellingAllowance):'—'}</td>
              <td><span class="type-chip ${e.salaryBatch==='B1'?'chip-b1':'chip-b2'}">${e.salaryBatch==='B1'?'B1 26–25':'B2 1–30'}</span></td>
              <td><span class="type-chip ${e.salaryBasis==='hours'?'chip-hours':e.salaryBasis==='perday'?'chip-hours':'chip-days'}">${e.salaryBasis==='hours'?'⏱ Hours':e.salaryBasis==='perday'?'💰 Per Day':'📅 Days'}</span></td>
              <td style="font-size:11px;">${e.lastIncrement||'—'}</td>
              <td>${(e.advanceBalance||0)>0?`<span class="badge b-red">${fmt(e.advanceBalance)}</span>`:'<span class="badge b-grn">Nil</span>'}</td>
              <td>${e.inactive?'<span class="badge b-red">Inactive</span>':'<span class="badge b-grn">Active</span>'}</td>
              <td><div class="acts">
                <button class="btn btn-o btn-sm" onclick="openEditEmp('${e.id}')">✏️</button>
                <button class="btn btn-pu btn-sm" onclick="openIncrement('${e.id}')">📈</button>
                <button class="btn btn-g btn-sm" onclick="openAdvance('${e.id}')">💰</button>
                <button class="btn btn-or btn-sm" onclick="gotoPage('documents');setTimeout(()=>{toggleDocSection('${e.id}')},200)" title="${docCount} doc(s) uploaded">📁${docCount?` <span style='font-size:10px;'>×${docCount}</span>`:''}</button>
                <button class="btn ${e.inactive?'btn-grn':'btn-d'} btn-sm" onclick="toggleActive('${e.id}')" title="${e.inactive?'Activate':'Deactivate'}">${e.inactive?'✅':'🚫'}</button>
                <button class="btn btn-d btn-sm" onclick="delEmp('${e.id}')">🗑</button>
              </div></td>
            </tr>`;
          }).join('')}
      </tbody>
    </table>
  </div>`;
}

// ── EMP FORM ──
function empFormHTML(e,isEdit){
  const orgOpts=ORGS.map(o=>`<option value="${o.name}" ${e.org===o.name?'selected':''}>${o.name}</option>`).join('');
  const currentOrg=ORGS.find(o=>o.name===e.org)||ORGS[0];
  const branchOpts=(currentOrg?.branches||['Anna Salai','Gee Gee Complex']).map(b=>`<option ${e.branch===b?'selected':''}>${b}</option>`).join('');
  return `<div class="fg">
    <div class="sec-div">Personal Details</div>
    <div class="f fi full"><label>Organisation *</label>
      <select id="f-org" onchange="updateBranchOpts()">
        ${orgOpts}
      </select>
    </div>
    <div class="f fi"><label>Branch *</label>
      <select id="f-branch">${branchOpts}</select>
    </div>
    <div class="f fi"><label>Full Name *</label><input id="f-name" value="${e.name||''}" placeholder="Full name"/></div>
    <div class="f fi"><label>Employee ID</label><input id="f-id" value="${e.id||nextId()}" ${isEdit?'readonly':''}/></div>
    <div class="f fi"><label>Designation</label><input id="f-desig" value="${e.designation||''}" placeholder="Manager, Staff…"/></div>
    <div class="f fi"><label>Phone</label><input id="f-phone" value="${e.phone||''}" placeholder="+91…"/></div>
    <div class="f fi"><label>Email</label><input id="f-email" value="${e.email||''}" placeholder="email@…"/></div>
    <div class="f fi full"><label>Bank Account Number</label><input id="f-acct" value="${e.acct||''}" placeholder="Account number"/></div>
    <div class="f fi"><label>Bank Name</label><input id="f-bank" value="${e.bank||''}" placeholder="INDIAN BANK…"/></div>
    <div class="f fi"><label>IFSC Code</label><input id="f-ifsc" value="${e.ifsc||''}" placeholder="IDIB000A089"/></div>
    <div class="f fi"><label>Date of Joining</label><input id="f-doj" type="date" value="${e.doj||''}"/></div>
    <div class="f fi"><label>Date of Relieving (if any)</label><input id="f-dor" type="date" value="${e.dor||''}"/></div>

    <div class="sec-div">Salary Structure</div>
    <div class="f fi"><label id="f-gross-lbl">${e.salaryBasis==='hours'?'Per Hour Rate (₹) *':e.salaryBasis==='perday'?'Per Day Rate (₹) *':'Gross Salary (₹) *'}</label>
      <input id="f-gross" type="number" value="${e.gross||''}" oninput="calcEmpTotal()" placeholder="${e.salaryBasis==='hours'?'e.g. 75 (per hour)':e.salaryBasis==='perday'?'e.g. 500 (per day)':'e.g. 15000 (monthly)'}"/>
      <div id="grossPreview" style="margin-top:4px;font-size:12px;font-weight:700;color:var(--green);min-height:18px;"></div>
      <div class="f-hint" id="f-gross-hint">${
        e.salaryBasis==='hours'?'Net = Per Hour Rate × Present Hours worked':
        e.salaryBasis==='perday'?'Net = Per Day Rate × Present Days (no LOP)':
        'Fixed monthly salary — LOP deducted for absent days'
      }</div>
    </div>
    <div class="f fi" id="f-workhrs-row" style="display:${e.salaryBasis==='hours'?'':'none'};">
      <label>Working Hours / Month *</label>
      <input id="f-workhrs" type="number" value="${e.empWorkingHours||240}" placeholder="e.g. 240"/>
      <div class="f-hint">Total scheduled hours per month (e.g. 26 days × 8 hrs = 208, or 30 × 8 = 240)</div>
    </div>
    <div class="f fi"><label>Travelling Allowance (₹)</label><input id="f-ta" type="number" value="${e.travellingAllowance||0}" oninput="calcEmpTotal()"/></div>
    <div class="f fi full" style="display:flex;align-items:center;gap:8px;padding:8px 12px;background:#fffdf0;border-radius:8px;border:1px solid #fde68a;">
      <input type="checkbox" id="f-prorata" ${e.proRataAllowance?'checked':''} style="width:16px;height:16px;accent-color:var(--orange);cursor:pointer;"/>
      <label for="f-prorata" style="font-size:12px;font-weight:600;color:var(--navy);cursor:pointer;margin:0;">
        📊 Pro-Rata Allowances — reduce all allowances proportionally based on present days
        <span style="display:block;font-size:11px;font-weight:400;color:var(--muted);margin-top:2px;">
          e.g. TA ₹10,000 · 15/30 days → pays ₹5,000 only
        </span>
      </label>
    </div>
    <div class="f fi"><label>Other Conveyance (₹)</label><input id="f-oc" type="number" value="${e.otherConveyance||0}" oninput="calcEmpTotal()"/></div>
    <div class="f fi"><label>Telephone Expenses (₹)</label><input id="f-te" type="number" value="${e.telephoneExpenses||0}" oninput="calcEmpTotal()"/></div>
    <div class="f fi"><label>Other Expenses (₹)</label><input id="f-oe" type="number" value="${e.otherExpenses||0}" oninput="calcEmpTotal()"/></div>
    <div class="f fi full" style="display:none;" id="totalPrevRow">
      <div class="net-bar"><div class="nb-l">Total Monthly Payable</div><div class="nb-v" id="totalPrev">${fmt((e.gross||0)+(e.travellingAllowance||0)+(e.otherConveyance||0)+(e.telephoneExpenses||0)+(e.otherExpenses||0))}</div></div>
    </div>
    <div class="f fi"><label>Salary Batch</label>
      <select id="f-batch">
        <option value="B1" ${e.salaryBatch==='B1'?'selected':''}>Batch 1 — 26th to 25th</option>
        <option value="B2" ${e.salaryBatch==='B2'?'selected':''}>Batch 2 — 1st to 30th</option>
      </select>
    </div>
    <div class="f fi"><label>Salary Basis</label>
      <select id="f-basis" onchange="onBasisChange(this)">
        <option value="days"   ${e.salaryBasis==='days'||!e.salaryBasis?'selected':''}>📅 Days Basis — Fixed monthly salary</option>
        <option value="hours"  ${e.salaryBasis==='hours'?'selected':''}>⏱ Hours Basis — Per hour rate</option>
        <option value="perday" ${e.salaryBasis==='perday'?'selected':''}>💰 Per Day Rate</option>
      </select>
    </div>
    <div class="f fi"><label>Last Increment Date</label><input id="f-inc" type="date" value="${e.lastIncrement||''}"/></div>
    <div class="f fi"><label>Login Password *</label><input id="f-pass" value="${e.pass||''}" placeholder="Portal password"/></div>
    <div class="sec-div">Leave Allocation (Annual)</div>
    <div class="f fi"><label>Casual Leave (days)</label><input id="f-cl" type="number" value="${e.leaveBalance?.casual||12}"/></div>
    <div class="f fi"><label>Sick Leave (days)</label><input id="f-sl" type="number" value="${e.leaveBalance?.sick||12}"/></div>
    <div class="f fi"><label>Earned Leave (days)</label><input id="f-el" type="number" value="${e.leaveBalance?.earned||15}"/></div>
  </div>`;
}
// Show/hide fields based on salary basis selection
function onBasisChange(sel){
  const basis = sel.value;
  // Show/hide Working Hours field
  const whRow = document.getElementById('f-workhrs-row');
  if(whRow) whRow.style.display = basis==='hours' ? '' : 'none';
  // Update gross label and hint
  const lbl = document.getElementById('f-gross-lbl');
  const hint = document.getElementById('f-gross-hint');
  const inp = document.getElementById('f-gross');
  if(basis==='hours'){
    if(lbl) lbl.textContent = 'Per Hour Rate (₹) *';
    if(hint) hint.textContent = 'Net = Per Hour Rate × Present Hours worked';
    if(inp) inp.placeholder = 'e.g. 75 (per hour)';
  } else if(basis==='perday'){
    if(lbl) lbl.textContent = 'Per Day Rate (₹) *';
    if(hint) hint.textContent = 'Net = Per Day Rate × Present Days (no LOP)';
    if(inp) inp.placeholder = 'e.g. 500 (per day)';
  } else {
    if(lbl) lbl.textContent = 'Gross Salary (₹) *';
    if(hint) hint.textContent = 'Fixed monthly salary — LOP deducted for absent days';
    if(inp) inp.placeholder = 'e.g. 15000 (monthly)';
  }
  calcEmpTotal();
}

function updateBranchOpts(){
  const orgName=document.getElementById('f-org')?.value;
  const org=ORGS.find(o=>o.name===orgName)||ORGS[0];
  const sel=document.getElementById('f-branch');
  if(!sel) return;
  sel.innerHTML=(org?.branches||[]).map(b=>`<option>${b}</option>`).join('');
}
function calcEmpTotal(){
  const g=parseFloat(document.getElementById('f-gross')?.value)||0;
  const t=parseFloat(document.getElementById('f-ta')?.value)||0;
  const o=parseFloat(document.getElementById('f-oc')?.value)||0;
  const te=parseFloat(document.getElementById('f-te')?.value)||0;
  const oe=parseFloat(document.getElementById('f-oe')?.value)||0;
  const el=document.getElementById('totalPrev');
  const row=document.getElementById('totalPrevRow');
  if(el){ el.textContent=fmt(g+t+o+te+oe); row.style.display=''; }
  // Live gross preview so typos are instantly visible
  const gp=document.getElementById('grossPreview');
  if(gp){
    if(g>0){
      const basis=document.getElementById('f-basis')?.value||'days';
      const label=basis==='hours'?'per hour rate':basis==='perday'?'per day rate':'monthly gross';
      gp.textContent=`→ ${fmt(g)} ${label}`;
      gp.style.color=g<1000&&basis==='days'?'var(--red)':'var(--green)';
    } else {
      gp.textContent='';
    }
  }
}
function collectForm(existingId){
  const name=document.getElementById('f-name').value.trim();
  const id=existingId||(document.getElementById('f-id').value||'').trim().toUpperCase();
  const gross=parseFloat(document.getElementById('f-gross').value)||0;
  const pass=document.getElementById('f-pass').value.trim();
  if(!name||!id||!gross||!pass){ toast('Fill all required fields','err'); return null; }
  return { id, name,
    org:document.getElementById('f-org').value,
    designation:document.getElementById('f-desig').value.trim(),
    branch:document.getElementById('f-branch').value,
    phone:document.getElementById('f-phone').value.trim(),
    email:document.getElementById('f-email').value.trim(),
    acct:document.getElementById('f-acct').value.trim(),
    bank:document.getElementById('f-bank').value.trim(),
    ifsc:document.getElementById('f-ifsc').value.trim(),
    doj:document.getElementById('f-doj').value,
    dor:document.getElementById('f-dor').value,
    gross,
    travellingAllowance:parseFloat(document.getElementById('f-ta').value)||0,
    proRataAllowance:document.getElementById('f-prorata')?.checked||false,
    otherConveyance:parseFloat(document.getElementById('f-oc').value)||0,
    telephoneExpenses:parseFloat(document.getElementById('f-te').value)||0,
    otherExpenses:parseFloat(document.getElementById('f-oe').value)||0,
    salaryBatch:document.getElementById('f-batch').value,
    salaryBasis:document.getElementById('f-basis').value,
    empWorkingHours:parseInt(document.getElementById('f-workhrs')?.value)||240,
    lastIncrement:document.getElementById('f-inc').value,
    pass,
    leaveBalance:{ casual:parseInt(document.getElementById('f-cl').value)||12, sick:parseInt(document.getElementById('f-sl').value)||12, earned:parseInt(document.getElementById('f-el').value)||15 }
  };
}
function openAddEmp(){
  mOpen('Add New Employee',empFormHTML({},false),[{l:'Cancel',c:'btn-o',f:'mClose()'},{l:'Save',c:'btn-p',f:'saveAddEmp()'}]);
  setTimeout(calcEmpTotal,50);
}
function saveAddEmp(){
  const d=collectForm(null); if(!d) return;
  if(EMP.find(e=>e.id===d.id)){ toast('ID exists','err'); return; }
  EMP.push({...d,salaryHistory:[],advanceBalance:0,advanceHistory:[]});
  save(); mClose(); gotoPage('employees'); toast(d.name+' added');
}
function openEditEmp(id){
  const e=byId(id); if(!e) return;
  mOpen('Edit — '+e.name,empFormHTML(e,true),[{l:'Cancel',c:'btn-o',f:'mClose()'},{l:'Save Changes',c:'btn-p',f:`saveEditEmp('${id}')`}]);
  setTimeout(calcEmpTotal,50);
}
function saveEditEmp(id){
  const d=collectForm(id); if(!d) return;
  const i=idx(id); EMP[i]={...EMP[i],...d};
  save(); mClose(); gotoPage(curPage); toast('Employee updated');
}
function delEmp(id){
  const e=byId(id);
  if(!e||!confirm(`Delete ${e.name}?`)) return;
  EMP=EMP.filter(x=>x.id!==id); save(); gotoPage('employees'); toast(e.name+' deleted','err');
}

// ── INCREMENT ──
function openIncrement(id){
  const e=byId(id); if(!e) return;
  const hist=(e.salaryHistory||[]).slice(-5).reverse();
  const now=new Date();
  const curMonVal=MONTHS_LIST[now.getMonth()].slice(0,3)+' '+now.getFullYear();
  window._incId=id;
  mOpen('Salary Increment — '+e.name,`
    <div style="margin-bottom:12px;">
      <div style="font-size:11px;color:var(--muted);margin-bottom:8px;text-transform:uppercase;letter-spacing:.06em;">Current Salary</div>
      <div class="sal-grid">
        <div class="sal-row"><span class="sl">Gross</span><span class="sv">${fmt(e.gross)}</span></div>
        <div class="sal-row"><span class="sl">Travel Allow.</span><span class="sv">${fmt(e.travellingAllowance||0)}</span></div>
        <div class="sal-row"><span class="sl">Other Conv.</span><span class="sv">${fmt(e.otherConveyance||0)}</span></div>
        <div class="sal-row"><span class="sl">Other Exp.</span><span class="sv">${fmt(e.otherExpenses||0)}</span></div>
        <div class="sal-row tot full"><span class="sl">Total Payable</span><span class="sv">${fmt((e.gross||0)+(e.travellingAllowance||0)+(e.otherConveyance||0)+(e.telephoneExpenses||0)+(e.otherExpenses||0))}</span></div>
      </div>
    </div>
    <div class="fg">
      <div class="sec-div">Apply Increment</div>
      <div class="f fi full"><label>Type</label>
        <select id="incType" onchange="toggleIncType()">
          <option value="fixed">Set New Fixed Gross Salary</option>
          <option value="pct">Percentage on Current Gross</option>
        </select>
      </div>
      <div id="incFixed" class="full">
        <div class="fg">
          <div class="f fi"><label>New Gross (₹)</label><input id="inc-g" type="number" value="${e.gross}" oninput="prevInc()"/></div>
          <div class="f fi"><label>New Travel Allow. (₹)</label><input id="inc-ta" type="number" value="${e.travellingAllowance||0}" oninput="prevInc()"/></div>
        </div>
      </div>
      <div id="incPct" class="full" style="display:none;">
        <div class="f fi"><label>Increment %</label><input id="inc-pct" type="number" value="10" oninput="prevInc()"/></div>
      </div>
      <div class="f fi"><label>Effective From Month *</label>
        <select id="inc-mon">
          ${(()=>{
            const opts=[];
            for(let y=now.getFullYear()-1; y<=now.getFullYear()+1; y++){
              MONTHS_LIST.forEach(mo=>{
                const val=mo.slice(0,3)+' '+y;
                opts.push(`<option value="${val}" ${val===curMonVal?'selected':''}>${val}</option>`);
              });
            }
            return opts.join('');
          })()}
        </select>
      </div>
      <div class="f fi"><label>Note</label><input id="inc-note" placeholder="Annual increment…"/></div>
      <div class="f fi"><label>Effective Date</label><input id="inc-date" type="date" value="${new Date().toISOString().split('T')[0]}"/></div>
      <div class="full" id="incPrev"></div>
    </div>
    ${hist.length?`<div class="inc-hist">
      <div style="font-size:11px;text-transform:uppercase;color:var(--muted);margin-bottom:6px;">History</div>
      ${hist.map(h=>`<div class="inc-row">
        <span style="min-width:80px;color:var(--muted);font-size:11px;">${h.fromMonth}</span>
        <span style="color:var(--green);font-weight:700;">↑</span>
        <span style="flex:1;">${fmt(h.basic||0)} → ${fmt(h.revised||h.basic||0)}</span>
        <span style="color:var(--muted);font-size:11px;">${h.pct?h.pct+'%':''} ${h.note?'· '+h.note:''}</span>
      </div>`).join('')}
    </div>`:''}`,
    [{l:'Cancel',c:'btn-o',f:'mClose()'},{l:'Apply Increment',c:'btn-pu',f:`doIncrement('${id}')`}]);
  setTimeout(prevInc,50);
}
function toggleIncType(){
  const t=document.getElementById('incType').value;
  document.getElementById('incFixed').style.display=t==='fixed'?'':'none';
  document.getElementById('incPct').style.display=t==='pct'?'':'none';
  prevInc();
}
function prevInc(){
  const e=byId(window._incId); if(!e) return;
  const t=document.getElementById('incType')?.value||'fixed';
  let newG=e.gross, newTa=e.travellingAllowance||0;
  if(t==='fixed'){
    newG=parseFloat(document.getElementById('inc-g')?.value)||e.gross;
    newTa=parseFloat(document.getElementById('inc-ta')?.value)||0;
  } else {
    const pct=parseFloat(document.getElementById('inc-pct')?.value)||0;
    newG=Math.round(e.gross*(1+pct/100));
  }
  const total=newG+newTa+(e.otherConveyance||0)+(e.telephoneExpenses||0)+(e.otherExpenses||0);
  const el=document.getElementById('incPrev');
  if(el) el.innerHTML=`<div class="net-bar"><div class="nb-l">New Monthly Total Payable</div><div class="nb-v">${fmt(total)}</div></div>`;
}
function doIncrement(id){
  const e=byId(id); if(!e) return;
  const t=document.getElementById('incType').value;
  const fromMonth=document.getElementById('inc-mon').value;
  const note=document.getElementById('inc-note').value.trim();
  const date=document.getElementById('inc-date').value;
  if(!fromMonth){ toast('Select effective month','err'); return; }

  const oldGross=e.gross;
  let newG=oldGross, pct=0;

  if(t==='fixed'){
    newG=parseFloat(document.getElementById('inc-g').value)||oldGross;
    if(newG<=0){ toast('Enter valid new gross amount','err'); return; }
    const incAmt=newG-oldGross;
    pct=oldGross>0?Math.round(incAmt/oldGross*10000)/100:0;
    e.travellingAllowance=parseFloat(document.getElementById('inc-ta').value)||0;
  } else {
    pct=parseFloat(document.getElementById('inc-pct').value)||0;
    if(!pct){ toast('Enter increment percentage','err'); return; }
    newG=Math.round(oldGross*(1+pct/100));
  }

  // Push complete history record (revised filled before push)
  e.salaryHistory=e.salaryHistory||[];
  e.salaryHistory.push({
    fromMonth, basic:oldGross, revised:newG, pct, note, appliedOn:today()
  });

  e.gross=newG;
  if(date) e.lastIncrement=date;

  save();
  mClose();
  toast(`✅ Increment applied for ${e.name}: ${fmt(oldGross)} → ${fmt(newG)}`);
  // Stay on increments page and refresh it
  gotoPage('increments');
}

function viewIncHistory(id){
  const e=byId(id); if(!e) return;
  // Build full timeline: joining → all increments (oldest first)
  const hist=[...(e.salaryHistory||[])];
  // Sort oldest first by fromMonth
  hist.sort((a,b)=>{
    const toMs=s=>{
      if(!s||s==='—') return 0;
      const p=s.trim().split(' ');
      const mo=MONTHS_LIST.findIndex(m=>m.startsWith(p[0]));
      return (parseInt(p[1])||2000)*100+(mo>=0?mo:0);
    };
    return toMs(a.fromMonth)-toMs(b.fromMonth);
  });

  if(!hist.length){ toast('No salary history recorded for '+e.name,'err'); return; }

  const ci=idx(e.id);
  const joiningGross=hist[0]?.basic||e.gross;
  const currentGross=e.gross;
  const totalInc=currentGross-joiningGross;
  const totalPct=joiningGross>0?Math.round(totalInc/joiningGross*10000)/100:0;

  // Build timeline rows
  let rows='';
  hist.forEach((h,i)=>{
    const before=h.basic||0;
    const after=h.revised||before;
    const diff=after-before;
    const pctLabel=h.pct?(diff>=0?'+':'')+h.pct+'%':'';
    const isLast=i===hist.length-1;
    rows+=`
    <tr style="${i%2===0?'background:#fafafa':'background:white'}">
      <td style="padding:10px 12px;vertical-align:middle;">
        <div style="display:flex;align-items:center;gap:6px;">
          <div style="width:10px;height:10px;border-radius:50%;background:${isLast?'var(--green)':'var(--navy)'};flex-shrink:0;"></div>
          <span style="font-weight:700;color:var(--navy);white-space:nowrap;">${h.fromMonth||'—'}</span>
          ${isLast?`<span style="font-size:9px;background:var(--green);color:white;padding:1px 6px;border-radius:10px;font-weight:700;">CURRENT</span>`:''}
        </div>
      </td>
      <td style="padding:10px 12px;font-family:monospace;color:var(--muted);text-align:right;">${fmt(before)}</td>
      <td style="padding:10px 12px;text-align:center;font-size:16px;color:var(--muted);">→</td>
      <td style="padding:10px 12px;font-family:monospace;font-weight:800;color:var(--navy);text-align:right;">${fmt(after)}</td>
      <td style="padding:10px 12px;text-align:right;">
        ${diff!==0?`<span style="font-weight:700;color:${diff>0?'var(--green)':'var(--red)'};font-family:monospace;">${diff>0?'+':''}${fmt(Math.abs(diff))}</span>
        <br><span style="font-size:10px;color:${diff>0?'var(--green)':'var(--red)'};">${pctLabel}</span>`:'<span style="color:var(--muted);">—</span>'}
      </td>
      <td style="padding:10px 12px;font-size:11px;color:var(--muted);">${h.note||'—'}</td>
      <td style="padding:10px 12px;font-size:11px;color:var(--muted);white-space:nowrap;">${h.appliedOn||h.date||'—'}</td>
    </tr>`;
  });

  mOpen('Salary History — '+e.name,`
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;padding:12px 14px;background:#f5f7fa;border-radius:8px;border-left:4px solid var(--purple);">
      <div style="width:42px;height:42px;border-radius:50%;background:${clr(ci)}22;color:${clr(ci)};font-size:13px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;">${ini(e.name)}</div>
      <div style="flex:1;">
        <div style="font-weight:700;font-size:14px;color:var(--navy);">${e.name}</div>
        <div style="font-size:11px;color:var(--muted);">${e.designation||'Staff'} · ${e.branch} · DOJ: ${e.doj||'—'}</div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;">Current Gross</div>
        <div style="font-size:22px;font-weight:800;color:var(--navy);font-family:monospace;">${fmt(currentGross)}</div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:14px;">
      <div style="background:#eff6ff;border-radius:8px;padding:10px 12px;border:1px solid #dbeafe;">
        <div style="font-size:10px;color:#3b82f6;text-transform:uppercase;font-weight:600;margin-bottom:3px;">Starting Salary</div>
        <div style="font-size:17px;font-weight:800;color:var(--navy);font-family:monospace;">${fmt(joiningGross)}</div>
      </div>
      <div style="background:#f0fdf4;border-radius:8px;padding:10px 12px;border:1px solid #bbf7d0;">
        <div style="font-size:10px;color:var(--green);text-transform:uppercase;font-weight:600;margin-bottom:3px;">Total Increment</div>
        <div style="font-size:17px;font-weight:800;color:var(--green);font-family:monospace;">+${fmt(totalInc)}</div>
      </div>
      <div style="background:#fdf4ff;border-radius:8px;padding:10px 12px;border:1px solid #e9d5ff;">
        <div style="font-size:10px;color:var(--purple);text-transform:uppercase;font-weight:600;margin-bottom:3px;">Total Growth</div>
        <div style="font-size:17px;font-weight:800;color:var(--purple);">+${totalPct}%</div>
      </div>
    </div>

    <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin-bottom:6px;">
      Increment Timeline · ${hist.length} record${hist.length>1?'s':''} · oldest → latest
    </div>
    <div style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
      <table style="width:100%;border-collapse:collapse;font-size:12px;">
        <thead>
          <tr style="background:#1a2744;">
            <th style="padding:8px 12px;text-align:left;color:rgba(255,255,255,.75);font-size:10px;font-weight:600;text-transform:uppercase;">Month</th>
            <th style="padding:8px 12px;text-align:right;color:rgba(255,255,255,.75);font-size:10px;font-weight:600;text-transform:uppercase;">Before</th>
            <th style="padding:8px 12px;text-align:center;color:rgba(255,255,255,.75);font-size:10px;"></th>
            <th style="padding:8px 12px;text-align:right;color:rgba(255,255,255,.75);font-size:10px;font-weight:600;text-transform:uppercase;">After</th>
            <th style="padding:8px 12px;text-align:right;color:rgba(255,255,255,.75);font-size:10px;font-weight:600;text-transform:uppercase;">Change</th>
            <th style="padding:8px 12px;text-align:left;color:rgba(255,255,255,.75);font-size:10px;font-weight:600;text-transform:uppercase;">Note</th>
            <th style="padding:8px 12px;text-align:left;color:rgba(255,255,255,.75);font-size:10px;font-weight:600;text-transform:uppercase;">Applied On</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
        <tfoot>
          <tr style="background:#1a2744;">
            <td colspan="3" style="padding:9px 12px;color:rgba(255,255,255,.7);font-size:11px;font-weight:600;">CURRENT SALARY</td>
            <td style="padding:9px 12px;font-family:monospace;font-weight:800;color:#f5c842;font-size:14px;text-align:right;">${fmt(currentGross)}</td>
            <td colspan="3" style="padding:9px 12px;font-family:monospace;color:var(--green);font-weight:700;font-size:12px;">+${fmt(totalInc)} · +${totalPct}%</td>
          </tr>
        </tfoot>
      </table>
    </div>`,
    [{l:'Close',c:'btn-o',f:'mClose()'},{l:'📈 Apply New Increment',c:'btn-pu',f:`mClose();setTimeout(()=>openIncrement('${id}'),150)`}]);
}
// ── ATTENDANCE CALENDAR (Per-Day employees) ──
function openAttCal(i){
  const r=_genRows[i];
  const e=byId(r.empId);
  if(!r||!e) return;
  const period=getPeriodDates(r.batchType, _genMon);
  const pStr=periodToStrings(period);
  const dates=[];
  let cur=new Date(pStr.fromStr);
  const end=new Date(pStr.toStr);
  while(cur<=end){ dates.push(cur.toISOString().split('T')[0]); cur=new Date(cur.getTime()+86400000); }
  const saved=r._workedDates||[];
  const dayNames=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  mOpen(`📅 Attendance — ${e.name} (${_genMon})`,`
    <div style="margin-bottom:10px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;">
      <div style="font-size:12px;color:var(--muted);">Period: <strong>${pStr.fromStr}</strong> → <strong>${pStr.toStr}</strong> (${dates.length} days)</div>
      <div style="display:flex;gap:6px;">
        <button class="btn btn-o btn-xs" onclick="attCalSelectAll()">All</button>
        <button class="btn btn-o btn-xs" onclick="attCalClear()">Clear</button>
        <button class="btn btn-o btn-xs" onclick="attCalAlt()">Alternate</button>
      </div>
    </div>
    <div id="attCalGrid" style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-bottom:12px;">
      ${dayNames.map(d=>`<div style="text-align:center;font-size:10px;font-weight:700;color:var(--muted);padding:4px 0;">${d}</div>`).join('')}
      ${(()=>{
        const firstDay=new Date(dates[0]).getDay();
        let cells=Array(firstDay).fill('<div></div>').join('');
        cells+=dates.map(dt=>{
          const d=new Date(dt);
          const isWk=d.getDay()===0||d.getDay()===6;
          const chk=saved.includes(dt)?'checked':'';
          return `<label style="display:flex;flex-direction:column;align-items:center;cursor:pointer;padding:5px 2px;border-radius:6px;border:1.5px solid ${chk?'var(--green)':'#e5e7eb'};background:${chk?'#f0fdf4':isWk?'#faf5ff':'white'};transition:.15s;" id="acd_${dt}">
            <input type="checkbox" ${chk} value="${dt}" onchange="attCalToggle('${dt}',this.checked)" style="display:none;"/>
            <span style="font-size:11px;font-weight:700;color:${isWk?'var(--purple)':'var(--navy)'};">${d.getDate()}</span>
            <span style="font-size:9px;color:var(--muted);">${dayNames[d.getDay()]}</span>
          </label>`;
        }).join('');
        return cells;
      })()}
    </div>
    <div style="background:#f0fdf4;border-radius:8px;padding:10px 14px;display:flex;justify-content:space-between;align-items:center;border:1px solid #bbf7d0;">
      <span style="font-size:12px;font-weight:600;color:var(--green);">Selected Working Days:</span>
      <span id="attCalCount" style="font-size:20px;font-weight:800;color:var(--navy);">${saved.length}</span>
    </div>`,
    [{l:'Cancel',c:'btn-o',f:'mClose()'},{l:'✓ Apply',c:'btn-g',f:`applyAttCal(${i})`}]);
  window._attCalDates=dates;
  window._attCalIdx=i;
  window._attCalSelected=new Set(saved);
  updateAttCalCount();
}
function attCalToggle(dt,checked){
  if(checked) window._attCalSelected.add(dt);
  else window._attCalSelected.delete(dt);
  const lbl=document.getElementById('acd_'+dt);
  if(lbl){ lbl.style.borderColor=checked?'var(--green)':'#e5e7eb'; lbl.style.background=checked?'#f0fdf4':'white'; }
  updateAttCalCount();
}
function attCalSelectAll(){
  window._attCalDates.forEach(dt=>{
    window._attCalSelected.add(dt);
    const lbl=document.getElementById('acd_'+dt);
    const cb=lbl?.querySelector('input');
    if(cb){ cb.checked=true; lbl.style.borderColor='var(--green)'; lbl.style.background='#f0fdf4'; }
  });
  updateAttCalCount();
}
function attCalClear(){
  window._attCalDates.forEach(dt=>{
    window._attCalSelected.delete(dt);
    const lbl=document.getElementById('acd_'+dt);
    const cb=lbl?.querySelector('input');
    if(cb){ cb.checked=false; lbl.style.borderColor='#e5e7eb'; lbl.style.background='white'; }
  });
  updateAttCalCount();
}
function attCalAlt(){
  attCalClear();
  window._attCalDates.forEach((dt,idx)=>{
    if(idx%2===0){
      window._attCalSelected.add(dt);
      const lbl=document.getElementById('acd_'+dt);
      const cb=lbl?.querySelector('input');
      if(cb){ cb.checked=true; lbl.style.borderColor='var(--green)'; lbl.style.background='#f0fdf4'; }
    }
  });
  updateAttCalCount();
}
function updateAttCalCount(){
  const el=document.getElementById('attCalCount');
  if(el) el.textContent=window._attCalSelected.size;
}
function applyAttCal(i){
  const r=_genRows[i];
  const sel=[...window._attCalSelected].sort();
  r._workedDates=sel;
  r.present=sel.length;
  const inp=document.getElementById('pdpres'+i);
  if(inp) inp.value=sel.length;
  gRefreshEarned(i);
  gRecalc(i);
  mClose();
  toast(`✓ ${sel.length} working days recorded for ${byId(r.empId)?.name}`);
}

// ── ADVANCE ──
function openAdvance(id){
  const e=byId(id); if(!e) return;
  const bal=e.advanceBalance||0;
  const hist=(e.advanceHistory||[]).slice().reverse();
  mOpen('Advance — '+e.name,`
    <div class="adv-summary">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span style="font-size:13px;font-weight:600;">Outstanding Balance</span>
        <span style="font-size:22px;font-weight:700;color:${bal>0?'var(--red)':'var(--green)'};">${fmt(bal)}</span>
      </div>
      ${bal>0?`<div class="adv-prog"><div class="adv-fill" style="width:100%"></div></div><div style="font-size:12px;color:var(--muted);">Total advance pending</div>`
        :'<div style="margin-top:6px;font-size:12px;color:var(--green);">✓ No pending advance</div>'}
    </div>
    <div class="fg">
      <div class="sec-div">New Advance Entry</div>
      <div class="f fi full"><label>Type</label>
        <select id="adv-type">
          <option value="given">Give Advance</option>
          <option value="manual">Manual Deduction (non-payroll)</option>
        </select>
      </div>
      <div class="f fi"><label>Amount (₹) *</label><input id="adv-amt" type="number" placeholder="5000"/></div>
      <div class="f fi"><label>Date</label><input id="adv-date" type="date" value="${new Date().toISOString().split('T')[0]}"/></div>
      <div class="f fi full"><label>Purpose / Note</label><input id="adv-note" placeholder="Festival advance, medical…"/></div>
      <div class="full"><div class="banner bn-info">💡 Payroll deduction: enter in <strong>Advance Deducted</strong> column when generating payroll. Balance auto-updates on finalize.</div></div>
    </div>
    ${hist.length?`<div class="adv-hist">
      <div style="font-size:11px;text-transform:uppercase;color:var(--muted);margin-bottom:6px;">History (${hist.length} entries)</div>
      ${hist.map((h,i)=>{
        const realIdx=(e.advanceHistory||[]).length-1-i;
        return `<div class="adv-row" style="align-items:center;">
          <span style="color:${h.type==='given'?'var(--red)':'var(--green)'};font-weight:600;min-width:80px;">${h.type==='given'?'▲ Given':'▼ Deducted'}</span>
          <span style="flex:1;font-size:11px;">${h.note||'—'}</span>
          <span style="color:var(--muted);font-size:11px;min-width:80px;">${h.date||''}</span>
          <span style="font-weight:700;min-width:60px;text-align:right;">${fmt(h.amount)}</span>
          <div style="display:flex;gap:4px;margin-left:8px;">
            <button class="btn btn-o btn-xs" onclick="editAdvEntry('${id}',${realIdx})" title="Edit">✏️</button>
            <button class="btn btn-d btn-xs" onclick="delAdvEntry('${id}',${realIdx})" title="Delete">🗑</button>
          </div>
        </div>`;
      }).join('')}
    </div>`:''}`,
    [{l:'Cancel',c:'btn-o',f:'mClose()'},{l:'+ Record',c:'btn-g',f:`doAdvance('${id}')`}]);
}

function doAdvance(id){
  const e=byId(id); if(!e) return;
  const type=document.getElementById('adv-type').value;
  const amt=parseFloat(document.getElementById('adv-amt').value)||0;
  if(!amt){ toast('Enter amount','err'); return; }
  e.advanceHistory=e.advanceHistory||[];
  e.advanceHistory.push({type:type==='given'?'given':'deducted',amount:amt,date:document.getElementById('adv-date').value,note:document.getElementById('adv-note').value});
  e.advanceBalance = type==='given'?(e.advanceBalance||0)+amt:Math.max(0,(e.advanceBalance||0)-amt);
  save(); mClose();
  toast(`Advance recorded for ${e.name}`);
  pgAdvances(document.getElementById('hrMain'));
}

function editAdvEntry(id, idx){
  const e=byId(id); if(!e) return;
  const h=(e.advanceHistory||[])[idx];
  if(!h){ toast('Entry not found','err'); return; }
  mOpen('Edit Advance Entry — '+e.name,`
    <div class="fg">
      <div class="f fi full"><label>Type</label>
        <select id="eadv-type">
          <option value="given" ${h.type==='given'?'selected':''}>Given</option>
          <option value="deducted" ${h.type==='deducted'?'selected':''}>Deducted</option>
        </select>
      </div>
      <div class="f fi"><label>Amount (₹) *</label><input id="eadv-amt" type="number" value="${h.amount}"/></div>
      <div class="f fi"><label>Date</label><input id="eadv-date" type="date" value="${h.date||''}"/></div>
      <div class="f fi full"><label>Note</label><input id="eadv-note" value="${h.note||''}"/></div>
    </div>`,
    [{l:'Cancel',c:'btn-o',f:`mClose();openAdvance('${id}')`},
     {l:'Save Changes',c:'btn-p',f:`saveAdvEntry('${id}',${idx})`}]);
}

function saveAdvEntry(id, idx){
  const e=byId(id); if(!e) return;
  const h=(e.advanceHistory||[])[idx];
  if(!h){ toast('Entry not found','err'); return; }
  const oldType=h.type, oldAmt=h.amount;
  const newType=document.getElementById('eadv-type').value;
  const newAmt=parseFloat(document.getElementById('eadv-amt').value)||0;
  if(!newAmt){ toast('Enter valid amount','err'); return; }
  // Reverse old effect on balance
  if(oldType==='given') e.advanceBalance=(e.advanceBalance||0)-oldAmt;
  else e.advanceBalance=(e.advanceBalance||0)+oldAmt;
  // Apply new effect
  if(newType==='given') e.advanceBalance=(e.advanceBalance||0)+newAmt;
  else e.advanceBalance=Math.max(0,(e.advanceBalance||0)-newAmt);
  // Update record
  h.type=newType;
  h.amount=newAmt;
  h.date=document.getElementById('eadv-date').value;
  h.note=document.getElementById('eadv-note').value;
  save();
  mClose();
  toast(`Entry updated for ${e.name} ✓`);
  openAdvance(id);
}

function delAdvEntry(id, idx){
  const e=byId(id); if(!e) return;
  const h=(e.advanceHistory||[])[idx];
  if(!h){ toast('Entry not found','err'); return; }
  if(!confirm(`Delete this entry?\n${h.type==='given'?'Given':'Deducted'} ₹${h.amount} on ${h.date||'—'}`)) return;
  // Reverse its effect on balance
  if(h.type==='given') e.advanceBalance=Math.max(0,(e.advanceBalance||0)-h.amount);
  else e.advanceBalance=(e.advanceBalance||0)+h.amount;
  e.advanceHistory.splice(idx,1);
  save();
  toast('Entry deleted ✓');
  openAdvance(id);
}

// ═══════════════════════════════════════════
//  GENERATE PAYROLL
// ═══════════════════════════════════════════
// ══════════════════════════════════════════════════════
//  ATTENDANCE ENTRY PAGE
// ══════════════════════════════════════════════════════
let _attMon='', _attBatch='';
const ATT_DATA={};

function loadAttData(){
  try{ const d=localStorage.getItem('tatti_att_v1'); if(d){ const p=JSON.parse(d); Object.assign(ATT_DATA,p); } }catch(e){}
}
loadAttData();

function pgAttendance(m){
  const now=new Date();
  const mons=[];
  for(let i=-24;i<=60;i++){
    const d=new Date(now.getFullYear(),now.getMonth()+i,1);
    mons.push(MONTHS_LIST[d.getMonth()].slice(0,3)+' '+d.getFullYear());
  }
  if(!_attMon) _attMon=MONTHS_LIST[now.getMonth()].slice(0,3)+' '+now.getFullYear();
  if(!ATT_DATA[_attMon]) ATT_DATA[_attMon]={};
  const fl=EMP.filter(e=>!e.inactive&&(!_attBatch||e.salaryBatch===_attBatch));

  m.innerHTML=`
  <div class="page-hd">
    <div><h1>📝 Attendance Entry</h1><p>Enter hours / days / deductions before generating payroll</p></div>
    <div class="pha"><button class="btn btn-p" onclick="saveAttendance()">💾 Save</button></div>
  </div>
  <div class="banner bn-info" style="margin-bottom:1rem;">
    ✅ <strong>Correct flow:</strong> Fill this page first → <strong>⚡ Generate Payroll</strong> → all data auto-fills → Finalize & Lock.
  </div>
  <div class="filter-row" style="margin-bottom:1rem;">
    <div><label class="filter-label">Month</label>
    <select onchange="_attMon=this.value;pgAttendance(document.getElementById('hrMain'))">
      ${mons.map(mo=>`<option value="${mo}" ${_attMon===mo?'selected':''}>${mo}</option>`).join('')}
    </select></div>
    <div><label class="filter-label">Batch</label>
    <select onchange="_attBatch=this.value;pgAttendance(document.getElementById('hrMain'))">
      <option value="">All</option>
      <option value="B1" ${_attBatch==='B1'?'selected':''}>Batch 1</option>
      <option value="B2" ${_attBatch==='B2'?'selected':''}>Batch 2</option>
    </select></div>
  </div>
  <div class="rpt-tbl-wrap">
    <table class="rpt-tbl" style="font-size:12px;">
      <thead><tr>
        <th>Employee</th>
        <th>Type</th>
        <th style="text-align:center;color:#f97316;">⏱ Hours Worked<br><span style="font-size:9px;font-weight:400;color:#f97316;">⏱ hours basis only</span></th>
        <th style="text-align:center;color:#3b82f6;">📅 Present Days<br><span style="font-size:9px;font-weight:400;color:#3b82f6;">💰 per-day basis only</span></th>
        <th style="text-align:right;">Gross / Rate<br><span style="font-size:9px;font-weight:400;color:var(--muted);">auto from profile</span></th>
        <th style="text-align:right;color:var(--green);">🎯 Incentive<br><span style="font-size:9px;font-weight:400;color:var(--green);">one-time bonus</span></th>
        <th style="text-align:right;">Advance<br>Deducted</th>
        <th style="text-align:right;">Other<br>Deduction</th>
        <th style="text-align:right;">Half Day<br>Cut</th>
        <th style="text-align:right;">Total Adv<br>Received</th>
        <th>Remarks</th>
      </tr></thead>
      <tbody>
        ${fl.map(e=>{
          const ci=idx(e.id);
          const isH=e.salaryBasis==='hours', isPD=e.salaryBasis==='perday', isDays=e.salaryBasis==='days';
          const sv=ATT_DATA[_attMon][e.id]||{};
          const rowBg=isDays?'background:#f8fff8;':isH?'background:#fffaf4;':'background:#f0f8ff;';
          return `<tr style="${rowBg}">
            <td>
              <div style="display:flex;align-items:center;gap:7px;">
                <div style="width:28px;height:28px;border-radius:50%;background:${clr(ci)}22;color:${clr(ci)};font-size:9px;font-weight:700;display:flex;align-items:center;justify-content:center;">${ini(e.name)}</div>
                <div>
                  <div style="font-weight:600;">${e.name}</div>
                  <div style="font-size:10px;color:var(--muted);">${e.id} · ${e.branch}</div>
                  ${isDays?`<div style="font-size:10px;color:var(--green);font-weight:600;margin-top:2px;">📅 Fixed salary — enter deductions below if any</div>`:''}
                </div>
              </div>
            </td>
            <td>
              <span class="type-chip ${e.salaryBatch==='B1'?'chip-b1':'chip-b2'}" style="font-size:9px;">${e.salaryBatch}</span>
              <span class="type-chip ${isH?'chip-hours':isPD?'chip-hours':'chip-days'}" style="font-size:9px;">${isH?'⏱ Hrs':isPD?'💰/Day':'📅 Fixed'}</span>
            </td>
            <td style="text-align:center;">
              ${isH?`<input class="gi narrow" type="number" placeholder="0" value="${sv.presentHours||''}"
                style="border:2px solid #f97316;font-weight:700;background:#fffaf4;text-align:center;"
                onchange="attSet('${e.id}','presentHours',this.value)"/>`
              :'<span style="color:#ddd;font-size:18px;">—</span>'}
            </td>
            <td style="text-align:center;">
              ${isPD?`<input class="gi narrow" type="number" placeholder="0" value="${sv.present||''}"
                id="att_pd_${e.id}"
                style="border:2px solid #3b82f6;font-weight:700;text-align:center;"
                onchange="attSet('${e.id}','present',this.value)"/>
              <button class="btn btn-o btn-xs" style="margin-top:3px;width:100%;font-size:10px;" onclick="openAttCalEmp('${e.id}','${_attMon}')">📅 Pick</button>`
              :'<span style="color:#ddd;font-size:18px;">—</span>'}
            </td>
            <td style="text-align:right;font-family:monospace;font-weight:700;color:var(--navy);">
              ${fmt(e.gross||0)}
              <div style="font-size:10px;color:var(--muted);font-weight:400;">${isDays?'monthly':isPD?'/day':'/hr'}</div>
            </td>
            <td><input class="gi" type="number" placeholder="0" value="${sv.incentive||''}" 
              style="border:1.5px solid var(--green);"
              onchange="attSet('${e.id}','incentive',this.value)" 
              title="One-time incentive (admissions, targets, performance)"/></td>
            <td><input class="gi" type="number" placeholder="0" value="${sv.advanceDeducted||''}" onchange="attSet('${e.id}','advanceDeducted',this.value)"/></td>
            <td><input class="gi" type="number" placeholder="0" value="${sv.otherDeduction||''}" onchange="attSet('${e.id}','otherDeduction',this.value)"/></td>
            <td><input class="gi" type="number" placeholder="0" value="${sv.halfDayDeduction||''}" onchange="attSet('${e.id}','halfDayDeduction',this.value)"/></td>
            <td><input class="gi" type="number" placeholder="0" value="${sv.totalAdvReceived||''}" onchange="attSet('${e.id}','totalAdvReceived',this.value)"/></td>
            <td><input class="gi wide" type="text" placeholder="note…" value="${sv.remarks||''}" onchange="attSet('${e.id}','remarks',this.value)"/></td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>
  </div>
  <div style="margin-top:1rem;display:flex;gap:10px;flex-wrap:wrap;">
    <button class="btn btn-p" onclick="saveAttendance()">💾 Save Attendance</button>
    <button class="btn btn-g" onclick="saveAttendance();gotoPage('generate')">💾 Save & Generate Payroll →</button>
  </div>`;
}

function attSet(empId,field,val){
  if(!ATT_DATA[_attMon]) ATT_DATA[_attMon]={};
  if(!ATT_DATA[_attMon][empId]) ATT_DATA[_attMon][empId]={};
  ATT_DATA[_attMon][empId][field]=field==='remarks'?val:(parseFloat(val)||0);
  // Auto-save immediately so data is never lost
  try{ localStorage.setItem('tatti_att_v1',JSON.stringify(ATT_DATA)); }catch(e){}
}

function saveAttendance(){
  try{ localStorage.setItem('tatti_att_v1',JSON.stringify(ATT_DATA)); }catch(e){}
  toast('✅ Attendance saved for '+_attMon);
}

function openAttCalEmp(empId,month){
  const e=byId(empId); if(!e) return;
  const period=getPeriodDates(e.salaryBatch||'B2',month);
  const pStr=periodToStrings(period);
  const dates=[];
  let cur=new Date(pStr.fromStr);
  const end=new Date(pStr.toStr);
  while(cur<=end){ dates.push(cur.toISOString().split('T')[0]); cur=new Date(cur.getTime()+86400000); }
  const saved=(ATT_DATA[month]?.[empId]?._workedDates)||[];
  const dayNames=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  mOpen(`📅 Attendance — ${e.name} (${month})`,`
    <div style="margin-bottom:10px;display:flex;justify-content:space-between;align-items:center;gap:6px;flex-wrap:wrap;">
      <div style="font-size:12px;color:var(--muted);">Period: <strong>${pStr.fromStr}</strong> → <strong>${pStr.toStr}</strong></div>
      <div style="display:flex;gap:6px;">
        <button class="btn btn-o btn-xs" onclick="attCalSelectAll()">All</button>
        <button class="btn btn-o btn-xs" onclick="attCalClear()">Clear</button>
        <button class="btn btn-o btn-xs" onclick="attCalAlt()">Alternate</button>
      </div>
    </div>
    <div id="attCalGrid" style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-bottom:12px;">
      ${dayNames.map(d=>`<div style="text-align:center;font-size:10px;font-weight:700;color:var(--muted);padding:4px 0;">${d}</div>`).join('')}
      ${(()=>{
        const firstDay=new Date(dates[0]).getDay();
        let cells=Array(firstDay).fill('<div></div>').join('');
        cells+=dates.map(dt=>{
          const d=new Date(dt);
          const isWk=d.getDay()===0||d.getDay()===6;
          const chk=saved.includes(dt)?'checked':'';
          return `<label style="display:flex;flex-direction:column;align-items:center;cursor:pointer;padding:5px 2px;border-radius:6px;border:1.5px solid ${chk?'var(--green)':'#e5e7eb'};background:${chk?'#f0fdf4':isWk?'#faf5ff':'white'};" id="acd_${dt}">
            <input type="checkbox" ${chk} value="${dt}" onchange="attCalToggle('${dt}',this.checked)" style="display:none;"/>
            <span style="font-size:11px;font-weight:700;color:${isWk?'var(--purple)':'var(--navy)'};">${d.getDate()}</span>
            <span style="font-size:9px;color:var(--muted);">${dayNames[d.getDay()]}</span>
          </label>`;
        }).join('');
        return cells;
      })()}
    </div>
    <div style="background:#f0fdf4;border-radius:8px;padding:10px 14px;display:flex;justify-content:space-between;align-items:center;border:1px solid #bbf7d0;">
      <span style="font-size:12px;font-weight:600;color:var(--green);">Selected Days:</span>
      <span id="attCalCount" style="font-size:20px;font-weight:800;color:var(--navy);">${saved.length}</span>
    </div>`,
    [{l:'Cancel',c:'btn-o',f:'mClose()'},{l:'✓ Apply',c:'btn-g',f:`applyAttCalEmp('${empId}','${month}')`}]);
  window._attCalDates=dates;
  window._attCalSelected=new Set(saved);
  updateAttCalCount();
}

function applyAttCalEmp(empId,month){
  const sel=[...window._attCalSelected].sort();
  if(!ATT_DATA[month]) ATT_DATA[month]={};
  if(!ATT_DATA[month][empId]) ATT_DATA[month][empId]={};
  ATT_DATA[month][empId]._workedDates=sel;
  ATT_DATA[month][empId].present=sel.length;
  // Update the input field in attendance table
  const inp=document.getElementById('att_pd_'+empId);
  if(inp) inp.value=sel.length;
  // Save to localStorage immediately
  try{ localStorage.setItem('tatti_att_v1',JSON.stringify(ATT_DATA)); }catch(e){}
  mClose();
  toast(`✓ ${sel.length} days recorded for ${byId(empId)?.name||empId}`);
}


function pgGenerate(m){
  const now=new Date();
  m.innerHTML=`
  <div class="page-hd"><div><h1>Generate Payroll</h1><p>Select month, batch, then click Load Employees</p></div></div>
  <div class="card" style="margin-bottom:1rem;">
    <div class="card-h"><h3>Payroll Period & Batch</h3></div>
    <div style="padding:1rem 1.25rem;">
      ${monthYearWidget(MONTHS_LIST[now.getMonth()].slice(0,3)+' '+now.getFullYear(),'updateGenMonth()')}
      <div style="margin-top:1rem;">
        <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin-bottom:8px;">Generate For</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <label style="display:flex;align-items:center;gap:7px;padding:9px 16px;border:1.5px solid #ddd;border-radius:var(--rs);cursor:pointer;font-size:13px;background:white;font-family:'DM Sans',sans-serif;">
            <input type="radio" name="genBatch" value="all" checked style="accent-color:var(--navy);"/> All Employees
          </label>
          <label style="display:flex;align-items:center;gap:7px;padding:9px 16px;border:1.5px solid #ddd;border-radius:var(--rs);cursor:pointer;font-size:13px;background:white;font-family:'DM Sans',sans-serif;">
            <input type="radio" name="genBatch" value="B1" style="accent-color:var(--purple);"/>
            <span class="type-chip chip-b1" style="font-size:10px;">B1</span> Batch 1 — 26th to 25th
          </label>
          <label style="display:flex;align-items:center;gap:7px;padding:9px 16px;border:1.5px solid #ddd;border-radius:var(--rs);cursor:pointer;font-size:13px;background:white;font-family:'DM Sans',sans-serif;">
            <input type="radio" name="genBatch" value="B2" style="accent-color:var(--green);"/>
            <span class="type-chip chip-b2" style="font-size:10px;">B2</span> Batch 2 — 1st to 30th
          </label>
        </div>
        <div class="f-hint" style="margin-top:6px;">💡 You can generate B1 and B2 separately and save each independently — both will be stored under the same month.</div>
      </div>
      <div style="margin-top:1rem;display:flex;gap:10px;">
        <button class="btn btn-p" onclick="loadGen()">Load Employees ↓</button>
      </div>
    </div>
  </div>
  <div id="genArea"></div>`;
}

let _genMon='', _genRows=[], _genBatch='';

function updateGenMonth(){ /* reactive — handled on loadGen */ }

function loadGen(){
  const month=getMonYrValue();
  if(!month){ toast('Select month and year','err'); return; }
  const area=document.getElementById('genArea');
  if(isLocked(month)){ area.innerHTML=`<div class="banner bn-warn">🔒 <strong>${month}</strong> is locked. Unlock from Payroll History first.</div>`; return; }

  const batchSel=document.querySelector('input[name="genBatch"]:checked')?.value||'all';
  _genBatch = batchSel==='all' ? '' : batchSel;

  const empList=(_genBatch ? EMP.filter(e=>e.salaryBatch===_genBatch) : EMP).filter(e=>!e.inactive);
  if(!empList.length){ area.innerHTML=`<div class="banner bn-warn">⚠ No active employees found for ${_genBatch?batchLabel(_genBatch):'all batches'}.</div>`; return; }

  const rows=empList.map(e=>{
    // ── 1. ATTENDANCE ENTRY (hours, present days, deductions)
    const att=ATT_DATA[month]?.[e.id]||{};
    const wd=workingDaysDefault(e.salaryBatch, month);
    const empWH=e.empWorkingHours||240;

    // ── 2. EMPLOYEE MASTER (always fresh — increments update e.gross)
    const gross=e.gross||0;
    const ta=e.travellingAllowance||0;
    const oc=e.otherConveyance||0;
    const te=e.telephoneExpenses||0;
    const oe=e.otherExpenses||0;

    // ── 3. APPROVED EXPENSES for this month (from Expense module)
    const approvedExpAmt=EXPENSE_CLAIMS.filter(c=>
      c.empId===e.id && c.status==='approved' && c.payrollMonth===month
    ).reduce((s,c)=>s+(c.amount||0),0);

    // ── 4. ADVANCE BALANCE (from Advance module)
    const advBalance=e.advanceBalance||0;
    const advDeducted=att.advanceDeducted||0;

    return {
      empId:e.id, month,
      batchType:e.salaryBatch,
      basisType:e.salaryBasis,
      periodLabel:periodLabel(e.salaryBatch, month),
      // Salary — always from employee master (increments reflect immediately)
      gross,
      travellingAllowance:ta,
      otherConveyance:oc,
      telephoneExpenses:te,
      // otherExpenses = fixed from profile + approved expenses this month
      otherExpenses:oe+approvedExpAmt,
      incentive:att.incentive||0, // one-time incentive this month
      _expenseAmt:approvedExpAmt, // for display hint
      proRataAllowance:e.proRataAllowance||false,
      // Attendance
      workingDays:wd,
      workingHours:empWH,
      present:att.present!==undefined ? att.present : wd,
      _workedDates:att._workedDates||[],
      presentHours:att.presentHours||0,
      // Leave (will be filled below)
      paidLeave:0, unpaidUnits:0, halfDayUnits:0,
      lopAuto:0, lopOverride:false, lopAmount:0, _leaveHint:'',
      // Deductions from Attendance Entry
      advanceDeducted:advDeducted,
      halfDayDeduction:att.halfDayDeduction||0,
      otherDeduction:att.otherDeduction||0,
      totalAdvReceived:att.totalAdvReceived||advBalance,
      remarks:att.remarks||'',
      // Advance balance hint
      _advBalance:advBalance,
      netPayable:0, paidAmount:0, balanceAmount:0,
      carriedForward:0, deduction:0, yetToDeduct:0,
    };
  });

  _genMon=month; _genRows=rows;

  // ── 5. LEAVE MODULE — always re-sync, reset first so deletions/corrections reflect
  rows.forEach(r=>{
    const period=getPeriodDates(r.batchType, month);
    const pStr=periodToStrings(period);
    const empLeaves=LEAVE_APPS.filter(a=>
      a.empId===r.empId && a.status==='approved' && a.fromDate
      && leaveDaysInPeriod(a, pStr) > 0
    );
    // Always reset leave fields
    r.paidLeave=0; r.unpaidUnits=0; r.halfDayUnits=0; r._leaveHint='';
    // Only reset present for days-basis — per-day/hours come from Attendance Entry
    if(r.basisType==='days') r.present=r.workingDays||30;
    if(!empLeaves.length){
      if(!r.lopOverride){ r.lopAmount=0; r.lopAuto=0; }
      return;
    }
    let paidDays=0, lwpDays=0, halfDayLWP=0;
    empLeaves.forEach(a=>{
      const d=leaveDaysInPeriod(a, pStr);
      if(a.type==='LWP') lwpDays+=d;
      else if(a.type==='HALFLWP') halfDayLWP+=d;
      else paidDays+=d;
    });
    r.paidLeave=paidDays; r.unpaidUnits=lwpDays; r.halfDayUnits=halfDayLWP;
    if(r.basisType==='days'){
      r.present=Math.max(0, r.workingDays-paidDays-lwpDays-halfDayLWP*0.5);
    } else if(r.basisType==='perday'){
      // Per-day: deduct LWP from ATT_DATA present days
      const attPresent=ATT_DATA[month]?.[r.empId]?.present;
      const base=attPresent!==undefined ? attPresent : r.workingDays;
      r.present=Math.max(0, base-lwpDays-halfDayLWP*0.5);
    }
    if(!r.lopOverride){ r.lopAmount=calcAutoLOP(r); r.lopAuto=r.lopAmount; }
    const parts=[];
    if(paidDays>0) parts.push(paidDays+'d paid');
    if(lwpDays>0) parts.push(lwpDays+'d LWP');
    if(halfDayLWP>0) parts.push(halfDayLWP+' half-day LWP');
    r._leaveHint=`📋 ${empLeaves.length} leave(s): ${parts.join(', ')}`;
  });

  // ── 6. Final net calculation
  rows.forEach(r=>{ r.netPayable=netPay(r); r.balanceAmount=r.netPayable; });

  buildGenTable(area);
}

function buildGenTable(area){
  const batchTitle = _genBatch ? ` — ${batchLabel(_genBatch)}` : ' — All Employees';
  area.innerHTML=`
  <div class="banner bn-info" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:.75rem;">
    <span>👁 <strong>View Only</strong> — data pulled from Attendance Entry, Leave & Advance modules automatically.</span>
    <button class="btn btn-o btn-sm" onclick="gotoPage('attendance')">📝 Edit in Attendance Entry →</button>
  </div>
  <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:.75rem;">
    <div style="display:flex;gap:8px;flex-wrap:wrap;">
      <span class="type-chip chip-b1">B1 26–25</span>
      <span class="type-chip chip-b2">B2 1–30</span>
      <span class="type-chip chip-hours">⏱ Hours</span>
      <span class="type-chip chip-days">📅 Days</span>
    </div>
    <div style="font-size:12px;font-weight:600;color:var(--navy);">
      ${_genMon}${batchTitle} · ${_genRows.length} employee(s)
    </div>
  </div>
  <div class="gen-wrap">
    <table class="gen-tbl">
      <thead>
        <tr>
          <th rowspan="2" style="min-width:155px;">Employee</th>
          <th colspan="6" class="earn" style="text-align:center;">Earnings</th>
          <th colspan="3" style="text-align:center;">Attendance</th>
          <th colspan="5" class="ded" style="text-align:center;">Deductions</th>
          <th rowspan="2" style="min-width:88px;">Net Pay</th>
        </tr>
        <tr>
          <th class="earn">Gross/Rate ₹</th><th class="earn">TA ₹</th><th class="earn">Conv ₹</th><th class="earn">Tel ₹</th><th class="earn">Other Exp ₹</th>
          <th class="earn" style="color:#86efac;">🎯 Incentive ₹</th>
          <th>Work Days</th>
          <th>Sched. Hrs</th>
          <th>Present / Hrs</th>
          <th>LOP ₹</th>
          <th class="ded">Adv Deduct ₹</th><th class="ded">Half Day ₹</th><th class="ded">Other Ded ₹</th><th class="ded">Adv Recd ₹</th><th class="ded">Remarks</th>
        </tr>
      </thead>
      <tbody>
        ${_genRows.map((r,i)=>{
          const e=byId(r.empId);
          const ci=idx(r.empId);
          const isH=r.basisType==='hours';
          const isPD=r.basisType==='perday';
          const aLop=calcAutoLOP(r);
          const lDisp=r.lopOverride?r.lopAmount:aLop;
          const net=netPay(r);
          const bgRow=r.batchType==='B1'?'background:#fdf8ff':'';
          const earnedPD=isPD?(r.gross||0)*(r.present||0):0;
          const ro=true; // generate table is VIEW ONLY — edit via Attendance Entry page
          const roAttr=`readonly style="background:#f4f4f2;color:#888;cursor:not-allowed;"`;
          const netA=calcAllowances(r);
          return `<tr id="gr${i}" style="${bgRow}">
            <td>
              <div class="nc">
                <div class="row-av" style="background:${clr(ci)}22;color:${clr(ci)};font-size:10px;">${ini(e?.name||'')}</div>
                <div>
                  <div style="font-size:12px;font-weight:500;">${e?.name||r.empId}</div>
                  <div style="display:flex;gap:3px;margin-top:2px;flex-wrap:wrap;">
                    <span class="type-chip ${r.batchType==='B1'?'chip-b1':'chip-b2'}" style="font-size:9px;">${r.batchType}</span>
                    <span class="type-chip ${isH?'chip-hours':isPD?'chip-hours':'chip-days'}" style="font-size:9px;">${isH?'⏱':isPD?'💰':'📅'}</span>
                  </div>
                  <div style="font-size:10px;color:var(--muted);margin-top:2px;">${r.periodLabel}</div>
                  ${(e?.advanceBalance||0)>0?`<span class="adv-chip">Adv: ${fmt(e.advanceBalance)}</span>`:''}
                  ${r._leaveHint?`<div style="font-size:10px;color:var(--green);margin-top:2px;">${r._leaveHint}</div>`:''}
                  ${(r._expenseAmt||0)>0?`<div style="font-size:10px;color:var(--purple);margin-top:2px;">💸 Expenses: ${fmt(r._expenseAmt)}</div>`:''}
                  ${(r.incentive||0)>0?`<div style="font-size:10px;color:var(--green);font-weight:700;margin-top:2px;">🎯 Incentive: ${fmt(r.incentive)}</div>`:''}
                  ${(r._advBalance||0)>0?`<div style="font-size:10px;color:var(--red);margin-top:2px;">💳 Adv balance: ${fmt(r._advBalance)}</div>`:''}
                </div>
              </div>
            </td>
            <td>
              <div style="font-family:monospace;font-weight:700;font-size:13px;">${fmt(r.gross)}</div>
              <div style="font-size:10px;color:var(--muted);margin-top:2px;">${isPD?'per day':isH?'per hour':'monthly'}</div>
              ${isPD?`<div style="font-size:10px;color:var(--blue);margin-top:2px;font-weight:600;">× ${r.present||0}d = ${fmt((r.gross||0)*(r.present||0))}</div>`:''}
              ${isH?`<div style="font-size:10px;color:var(--orange);margin-top:2px;font-weight:600;">× ${r.presentHours||0}hrs = ${fmt((r.gross||0)*(r.presentHours||0))}</div>`:''}
            </td>
            <td style="font-family:monospace;text-align:right;">${(netA.ta||0)>0?fmt(netA.ta):'—'}</td>
            <td style="font-family:monospace;text-align:right;">${(netA.oc||0)>0?fmt(netA.oc):'—'}</td>
            <td style="font-family:monospace;text-align:right;">${(netA.te||0)>0?fmt(netA.te):'—'}</td>
            <td style="font-family:monospace;text-align:right;">${(netA.oe||0)>0?fmt(netA.oe):'—'}</td>
            <td style="font-family:monospace;text-align:right;font-weight:700;color:var(--green);">${(r.incentive||0)>0?fmt(r.incentive):'—'}</td>
            <td style="text-align:center;font-weight:700;">${r.workingDays||30}</td>
            <td style="text-align:center;color:var(--muted);">${isH?(r.workingHours||240):'—'}</td>
            <td style="text-align:center;">
              ${isH?`<span style="font-weight:800;font-size:14px;color:var(--orange);">${r.presentHours||0}</span><div style="font-size:9px;color:var(--muted);">hrs</div>`
              :isPD?`<span style="font-weight:800;font-size:14px;color:var(--blue);">${r.present||0}</span><div style="font-size:9px;color:var(--muted);">days</div>`
              :`<span style="font-weight:700;">${r.present||0}</span><div style="font-size:9px;color:var(--muted);">days</div>`}
              ${r.paidLeave>0?`<div style="font-size:10px;color:var(--blue);">+${r.paidLeave}d leave</div>`:''}
              ${(r.halfDayUnits||0)>0?`<div style="font-size:10px;color:var(--orange);">🌗 ${r.halfDayUnits} half-day</div>`:''}
            </td>
            <td style="font-family:monospace;text-align:right;color:var(--red);">${lopAmt(r)>0?fmt(lopAmt(r)):'—'}</td>
            <td style="font-family:monospace;text-align:right;color:var(--purple);">${(r.advanceDeducted||0)>0?fmt(r.advanceDeducted):'—'}</td>
            <td style="font-family:monospace;text-align:right;">${(r.halfDayDeduction||0)>0?fmt(r.halfDayDeduction):'—'}</td>
            <td style="font-family:monospace;text-align:right;">${(r.otherDeduction||0)>0?fmt(r.otherDeduction):'—'}</td>
            <td style="font-size:11px;color:var(--muted);">${r.totalAdvReceived>0?fmt(r.totalAdvReceived):'—'}</td>
            <td style="font-size:11px;color:var(--muted);max-width:100px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${r.remarks||'—'}</td>
            <td><span class="gen-net" id="gnet${i}">${fmt(net)}</span></td>
          </tr>`;
        }).join('')}
      </tbody>
      <tfoot>
        <tr style="background:#1a2744;color:white;">
          <td colspan="10" style="padding:10px 12px;font-weight:700;font-size:12px;letter-spacing:.04em;">TOTAL (${_genRows.length} employees)</td>
          <td style="padding:10px 12px;text-align:right;font-family:monospace;font-weight:700;" id="gfootGross"></td>
          <td style="padding:10px 12px;text-align:right;font-family:monospace;" id="gfootTA"></td>
          <td style="padding:10px 12px;text-align:right;font-family:monospace;" id="gfootOC"></td>
          <td style="padding:10px 12px;text-align:right;font-family:monospace;" id="gfootTE"></td>
          <td style="padding:10px 12px;text-align:right;font-family:monospace;" id="gfootOE"></td>
          <td style="padding:10px 12px;text-align:right;font-family:monospace;color:#86efac;font-weight:700;" id="gfootInc"></td>
          <td colspan="3"></td>
          <td style="padding:10px 12px;text-align:right;font-family:monospace;color:#fca5a5;" id="gfootLOP"></td>
          <td style="padding:10px 12px;text-align:right;font-family:monospace;color:#c4b5fd;" id="gfootAdv"></td>
          <td style="padding:10px 12px;text-align:right;font-family:monospace;color:#fdba74;" id="gfootHD"></td>
          <td style="padding:10px 12px;text-align:right;font-family:monospace;color:#fdba74;" id="gfootOD"></td>
          <td colspan="2"></td>
          <td style="padding:10px 14px;text-align:right;font-family:monospace;font-size:15px;font-weight:800;color:#f5c842;" id="gfootNet"></td>
        </tr>
      </tfoot>
    </table>
  </div>
  <div style="margin-top:1.1rem;display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
    <button class="btn btn-o" onclick="saveDraft()">💾 Save Draft</button>
    <button class="btn btn-p" onclick="confirmFinalize()">🔒 Finalize & Lock</button>
    <span style="font-size:12px;color:var(--muted);">
      ${_genBatch?`Saving <strong>${batchLabel(_genBatch)}</strong> only · other batch records preserved`:'Saving all employees'}
      · Draft = editable · Lock = employees can view
    </span>
  </div>`;
  setTimeout(gUpdateFooter, 30);
}

function gUpdateFooter(){
  const totals=_genRows.reduce((t,r)=>{
    t.gross+=(r.gross||0);
    t.ta+=(r.travellingAllowance||0);
    t.oc+=(r.otherConveyance||0);
    t.te+=(r.telephoneExpenses||0);
    t.oe+=(r.otherExpenses||0);
    t.inc+=(r.incentive||0);
    t.lop+=lopAmt(r);
    t.adv+=(r.advanceDeducted||0);
    t.hd+=(r.halfDayDeduction||0);
    t.od+=(r.otherDeduction||0);
    t.net+=netPay(r);
    return t;
  },{gross:0,ta:0,oc:0,te:0,oe:0,inc:0,lop:0,adv:0,hd:0,od:0,net:0});
  const set=(id,val)=>{ const el=document.getElementById(id); if(el) el.textContent=val>0?fmt(val):'—'; };
  set('gfootGross',totals.gross);
  set('gfootTA',totals.ta);
  set('gfootOC',totals.oc);
  set('gfootTE',totals.te);
  set('gfootOE',totals.oe);
  set('gfootInc',totals.inc);
  set('gfootLOP',totals.lop);
  set('gfootAdv',totals.adv);
  set('gfootHD',totals.hd);
  set('gfootOD',totals.od);
  const netEl=document.getElementById('gfootNet');
  if(netEl) netEl.textContent=fmt(totals.net);
}

function gU(i,f,v){
  _genRows[i][f] = f==='remarks'?v:(parseFloat(v)||0);
  if(!['remarks','totalAdvReceived','carriedForward'].includes(f)) gRecalc(i);
}
function gRefreshEarned(i){
  // For per-day or hours rate employees, update the earned hint when present changes
  gRecalc(i);
}
function gAutoUnpaid(i){
  const r=_genRows[i];
  if(r.basisType==='hours'){
    const wh=r.workingHours||240;
    const ph=r.presentHours||0;
    r.unpaidUnits=Math.max(0,wh-ph-(r.paidLeave||0));
  } else {
    const wd=r.workingDays||30;
    r.unpaidUnits=Math.max(0,wd-(r.present||0)-(r.paidLeave||0));
  }
  gRecalc(i);
}
function gUpdateLOP(i,val){
  const r=_genRows[i];
  const manual=parseFloat(val)||0;
  const auto=calcAutoLOP(r);
  r.lopOverride=Math.abs(manual-auto)>0.5;
  r.lopAmount=manual;
  const h=document.getElementById('loph'+i);
  if(h){ h.textContent=r.lopOverride?'⚠ Override':'Auto: '+fmt(auto); h.className='lop-hint'+(r.lopOverride?' ov':''); }
  gRecalc(i);
}
function fixGross(i){
  const r=_genRows[i];
  const corrected=prompt(`⚠ Current gross for this employee is ₹${r.gross}.\n\nEnter the correct monthly gross salary (e.g. 25000):`, r.gross);
  if(corrected===null) return;
  const val=parseFloat(corrected)||0;
  if(!val){ toast('Invalid amount','err'); return; }
  r.gross=val;
  // Also update the employee master record so it's fixed for future months
  const emp=byId(r.empId);
  if(emp){
    emp.gross=val;
    if(!emp.salaryHistory) emp.salaryHistory=[];
    emp.salaryHistory.push({date:today(), oldGross:r.gross, newGross:val, note:'Corrected via payroll generate table'});
  }
  save();
  toast(`Gross corrected to ${fmt(val)} ✓`);
  // Refresh the generate table
  buildGenTable(_genMon);
}
function gRecalc(i){
  const r=_genRows[i];
  const aLop=calcAutoLOP(r);
  r.lopAuto=aLop;
  if(!r.lopOverride){
    r.lopAmount=aLop;
    const li=document.getElementById('lop'+i);
    if(li) li.value=aLop.toFixed(2);
    const lh=document.getElementById('loph'+i);
    if(lh){ lh.textContent='Auto: '+fmt(aLop); lh.className='lop-hint'; }
  }
  // Update hours rate hint dynamically
  if(r.basisType==='hours'){
    const hh=document.getElementById('ghint'+i);
    if(hh) hh.innerHTML=`₹${r.gross||0} × ${r.presentHours||0}hrs = <span style="color:var(--green);">${fmt((r.gross||0)*(r.presentHours||0))}</span>`;
  }
  const net=netPay(r);
  r.netPayable=net; r.balanceAmount=net;
  const el=document.getElementById('gnet'+i);
  if(el){ el.textContent=fmt(net); el.style.color=net>0?'var(--green)':'var(--red)'; }
  gUpdateFooter();
}
function saveDraft(){
  const existing=PAY[_genMon]||{};
  // Keep records from OTHER batch; replace only the current batch being edited
  const otherRecs=(existing.records||[]).filter(r=>_genBatch?r.batchType!==_genBatch:false);
  const newRecs=_genRows.map(r=>({...r,netPayable:netPay(r),balanceAmount:netPay(r),totalPayable:recTotalPayable(r)}));
  PAY[_genMon]={...existing, locked:false, generatedOn:today(), records:[...otherRecs,...newRecs]};
  save();
  toast('Draft saved — '+_genMon+(_genBatch?' ('+batchLabel(_genBatch)+')':''));
}
function confirmFinalize(){
  mOpen('Finalize — '+_genMon,
    `<p style="font-size:14px;margin-bottom:12px;">Finalize & lock <strong>${_genMon}</strong>?</p>
     <div class="banner bn-warn">🔒 Payslips become permanent. Advance deductions will update employee balances. Unlock from History if corrections needed.</div>`,
    [{l:'Cancel',c:'btn-o',f:'mClose()'},{l:'Finalize & Lock',c:'btn-p',f:'doFinalize()'}]);
}
function doFinalize(){
  const prev=PAY[_genMon];
  for(const r of _genRows){
    const e=byId(r.empId); if(!e) continue;
    const prevRec=prev?.records?.find(x=>x.empId===r.empId);
    const prevDed=prevRec?.advanceDeducted||0;
    const delta=(r.advanceDeducted||0)-prevDed;
    if(delta>0){
      e.advanceBalance=Math.max(0,(e.advanceBalance||0)-delta);
      e.advanceHistory=e.advanceHistory||[];
      e.advanceHistory.push({type:'deducted',amount:delta,date:today(),note:'Payroll deduction — '+_genMon});
    }
    if(r.totalAdvReceived>0 && (prevRec?.totalAdvReceived||0)<r.totalAdvReceived){
      const newAdv=r.totalAdvReceived-(prevRec?.totalAdvReceived||0);
      e.advanceBalance=(e.advanceBalance||0)+newAdv;
      e.advanceHistory=e.advanceHistory||[];
      e.advanceHistory.push({type:'given',amount:newAdv,date:today(),note:'Advance via payroll — '+_genMon});
    }
  }
  // Merge: keep other-batch records, replace current-batch records, then lock entire month
  const otherRecs=(prev?.records||[]).filter(r=>_genBatch?r.batchType!==_genBatch:false);
  const newRecs=_genRows.map(r=>({...r,netPayable:netPay(r),balanceAmount:netPay(r),totalPayable:recTotalPayable(r)}));
  PAY[_genMon]={locked:true,generatedOn:today(),records:[...otherRecs,...newRecs]};
  save(); mClose();
  toast(_genMon+(_genBatch?' ('+batchLabel(_genBatch)+')':'')+' finalized 🔒');
  gotoPage('history');
}

// ═══════════════════════════════════════════
//  PAYROLL HISTORY
// ═══════════════════════════════════════════
let _histView = 'table'; // 'card' | 'table'

// ── FETCH EMAIL STATUS FROM BACKEND ──
const normalizeEmailStatus = (status) => {
  if (!status && status !== 0) return '';
  const s = String(status).trim().toLowerCase();
  if (!s) return '';
  if (s === 'sent') return 'Sent';
  if (s === 'failed') return 'Failed';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

async function fetchEmailStatusForMonth(month) {
  try {
    const recs = PAY[month]?.records || [];
    if (!recs.length) return;

    const response = await fetch(`${API_BASE_URL}/api/email-history-month/${encodeURIComponent(month)}`);
    if (!response.ok) {
      console.log('Could not fetch email status for month:', month, 'status:', response.status);
      return;
    }

    const data = await response.json();
    if (data.success && data.history) {
      const statusMap = new Map();
      data.history.forEach(h => {
        const empKey = String(h.empId || '').trim().toUpperCase();
        const monthKey = String(h.month || '').trim();
        const status = normalizeEmailStatus(h.status);
        if (empKey && monthKey && status) {
          statusMap.set(`${empKey}|${monthKey}`, status);
        }
      });

      recs.forEach(r => {
        const empKey = String(r.empId || '').trim().toUpperCase();
        const monthKey = String(r.month || month).trim();
        const key = `${empKey}|${monthKey}`;
        const status = statusMap.get(key);
        // Only update if backend has a non-Pending status (to preserve immediate local updates)
        if (status && status !== 'Pending') {
          r.emailStatus = status;
        }
      });

      save();
    }
  } catch (e) {
    console.log('Error fetching email status:', e);
  }
}

function pgHistory(m, skipBackendFetch = false){
  const mons=mList();
  if(mons.length===0){
    m.innerHTML=`<div class="page-hd"><div><h1>Payroll History</h1></div></div>
    <div class="empty"><div class="ei">🗂️</div><h3>No payrolls yet</h3><button class="btn btn-p" style="margin-top:1rem" onclick="gotoPage('generate')">⚡ Generate</button></div>`; return;
  }
  const sel=selMonth||mons[0];
  const recs=PAY[sel]?.records||[];
  const locked=isLocked(sel);

  // Initialize email status to 'Pending' if not set
  recs.forEach(r => {
    if (!r.emailStatus) {
      r.emailStatus = 'Pending';
    }
  });

  // Fetch email status from backend before rendering (unless skipped)
  if (!skipBackendFetch) {
    fetchEmailStatusForMonth(sel);
  }

  const fl=srchQ
    ? recs.filter(r=>{const e=byId(r.empId);return e&&(e.name.toLowerCase().includes(srchQ)||e.branch.toLowerCase().includes(srchQ)||e.id.toLowerCase().includes(srchQ));})
    : [...recs].sort((a,b)=>a.batchType.localeCompare(b.batchType));
  const tP=recs.reduce((s,r)=>s+recTotalPayable(r),0);
  const tN=recs.reduce((s,r)=>s+netPay(r),0);
  const tL=recs.reduce((s,r)=>s+lopAmt(r),0);
  const tA=recs.reduce((s,r)=>s+(r.advanceDeducted||0),0);

  m.innerHTML=`
  <div class="page-hd"><div><h1>Payroll History</h1><p>${mons.length} month(s) · ${recs.length} records</p></div>
    <div class="pha">
      <button class="btn btn-grn btn-sm" onclick="exportExcel('${sel}')">⬇ Excel</button>
      <button class="btn btn-o btn-sm" onclick="exportCSV('${sel}')">⬇ CSV</button>
      ${locked?`<button class="btn btn-o btn-sm" onclick="unlockMon('${sel}')">🔓 Unlock</button>`:`<button class="btn btn-g btn-sm" onclick="editDraft('${sel}')">✏️ Edit</button>`}
      <button class="btn btn-d btn-sm" onclick="deletePayrollMonth('${sel}')">🗑 Delete Month</button>
    </div>
  </div>
  <div class="month-tabs">
    ${mons.map(mo=>`<button class="mtab ${mo===sel?'active':''} ${isLocked(mo)?'locked':''}" onclick="selMonth='${mo}';pgHistory(document.getElementById('hrMain'))">${mo}</button>`).join('')}
  </div>
  ${locked?`<div class="banner bn-warn">🔒 <strong>${sel}</strong> is finalized. Payslips are read-only.</div>`:''}
  <div class="stat-strip" style="grid-template-columns:repeat(4,1fr);">
    <div class="sc green"><div class="sc-l">Total Payable</div><div class="sc-v">${fmtK(tP)}</div><div class="sc-s">${recs.length} employees</div></div>
    <div class="sc blue"><div class="sc-l">Net Disbursed</div><div class="sc-v">${fmtK(tN)}</div></div>
    <div class="sc red"><div class="sc-l">Total LOP</div><div class="sc-v">${fmtK(tL)}</div></div>
    <div class="sc purple"><div class="sc-l">Advance Recovered</div><div class="sc-v">${fmtK(tA)}</div></div>
  </div>
  <div class="toolbar" style="justify-content:space-between;">
    <input class="search-inp" type="text" placeholder="Search name / ID / branch…" value="${srchQ}" oninput="srchQ=this.value.toLowerCase();pgHistory(document.getElementById('hrMain'))"/>
    <div style="display:flex;gap:6px;">
      <button class="btn btn-sm ${_histView==='card'?'btn-p':'btn-o'}" onclick="_histView='card';pgHistory(document.getElementById('hrMain'))" title="Card View">☰ Cards</button>
      <button class="btn btn-sm ${_histView==='table'?'btn-p':'btn-o'}" onclick="_histView='table';pgHistory(document.getElementById('hrMain'))" title="Table View">⊞ Table</button>
    </div>
  </div>
  ${_histView==='table' ? renderHistTable(fl, sel) : renderHistCards(fl, sel)}`;
}

function renderHistTable(fl, sel){
  if(!fl.length) return `<div class="empty"><div class="ei">🔍</div><h3>No records found</h3></div>`;
  const totTP=fl.reduce((s,r)=>s+recTotalPayable(r),0);
  const totNet=fl.reduce((s,r)=>s+netPay(r),0);
  const totLOP=fl.reduce((s,r)=>s+lopAmt(r),0);
  const totAdv=fl.reduce((s,r)=>s+(r.advanceDeducted||0),0);
  const totOth=fl.reduce((s,r)=>s+(r.otherDeduction||0),0);
  return `
  <div class="rpt-tbl-wrap" style="margin-top:.5rem;">
    <table class="rpt-tbl" style="font-size:12px;">
      <thead>
        <tr>
          <th>#</th>
          <th>Employee</th>
          <th>ID</th>
          <th>Branch</th>
          <th>Batch</th>
          <th>Basis</th>
          <th>Period</th>
          <th>Attendance</th>
          <th style="text-align:right;">Gross/Rate</th>
          <th style="text-align:right;">Allowances</th>
          <th style="text-align:right;">Total Payable</th>
          <th style="text-align:right;color:#fca5a5;">LOP</th>
          <th style="text-align:right;color:#c4b5fd;">Adv Deduct</th>
          <th style="text-align:right;color:#fdba74;">Other Ded</th>
          <th style="text-align:right;color:#86efac;">Net Pay</th>
          <th style="text-align:center;">Payslip</th>
          <th style="text-align:center;">Email Status</th>
        </tr>
      </thead>
      <tbody>
        ${fl.map((r,i)=>{
          const e=byId(r.empId); if(!e) return '';
          const ci=idx(r.empId);
          const isH=r.basisType==='hours', isPD=r.basisType==='perday';
          const net=netPay(r), lop=lopAmt(r), tp=recTotalPayable(r);
          const allowances=(r.travellingAllowance||0)+(r.otherConveyance||0)+(r.telephoneExpenses||0)+(r.otherExpenses||0);
          const attStr=isH?`${r.presentHours||0}/${r.workingHours||240} hrs`:`${r.present||0}/${r.workingDays||30} days`;
          const lopStyle=lop>0?'color:#dc2626;font-weight:600;':'color:#aaa;';
          return `<tr style="cursor:pointer;" onclick="openSlip('${r.empId}','${sel}')">
            <td style="color:var(--muted);font-size:11px;">${i+1}</td>
            <td>
              <div style="display:flex;align-items:center;gap:7px;">
                <div style="width:28px;height:28px;border-radius:50%;background:${clr(ci)}22;color:${clr(ci)};font-size:9px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;">${ini(e.name)}</div>
                <span style="font-weight:600;font-size:12px;">${e.name}</span>
              </div>
            </td>
            <td style="font-family:monospace;font-size:11px;color:var(--muted);">${e.id}</td>
            <td style="font-size:11px;">${e.branch}</td>
            <td><span class="type-chip ${r.batchType==='B1'?'chip-b1':'chip-b2'}" style="font-size:9px;">${r.batchType}</span></td>
            <td><span class="type-chip ${isH?'chip-hours':isPD?'chip-hours':'chip-days'}" style="font-size:9px;">${isH?'⏱Hrs':isPD?'💰/Day':'📅Days'}</span></td>
            <td style="font-size:10px;color:var(--muted);white-space:nowrap;">${r.periodLabel||'—'}</td>
            <td style="font-size:11px;text-align:center;">
              ${attStr}
              ${lop>0?`<div style="font-size:9px;color:#dc2626;margin-top:1px;">LWP ${r.unpaidUnits||0}${isH?'hrs':'d'}</div>`:''}
            </td>
            <td style="text-align:right;font-family:monospace;">${fmt(r.gross||0)}</td>
            <td style="text-align:right;font-family:monospace;color:var(--muted);">${allowances>0?fmt(allowances):'—'}</td>
            <td style="text-align:right;font-weight:700;font-family:monospace;">${fmt(tp)}</td>
            <td style="text-align:right;font-family:monospace;${lopStyle}">${lop>0?'−'+fmt(lop):'—'}</td>
            <td style="text-align:right;font-family:monospace;color:${(r.advanceDeducted||0)>0?'#7c3aed':'#aaa'};">${(r.advanceDeducted||0)>0?'−'+fmt(r.advanceDeducted):'—'}</td>
            <td style="text-align:right;font-family:monospace;color:${(r.otherDeduction||0)>0?'#d97706':'#aaa'};">${(r.otherDeduction||0)>0?'−'+fmt(r.otherDeduction):'—'}</td>
            <td style="text-align:right;font-weight:800;font-family:monospace;color:${net>0?'#16a34a':'#dc2626'};">${fmt(net)}</td>
            <td style="text-align:center;">
              <button class="btn btn-o btn-xs" onclick="event.stopPropagation();openSlip('${r.empId}','${sel}')">👁 View</button>
            </td>
            <td style="text-align:center;">
              <span class="badge ${r.emailStatus==='Sent'?'b-grn':r.emailStatus==='Failed'?'b-red':'b-gold'}" style="font-size:9px;">${r.emailStatus||'Pending'}</span>
            </td>
          </tr>`;
        }).join('')}
      </tbody>
      <tfoot>
        <tr>
          <td colspan="10" style="text-align:right;">TOTAL (${fl.length} employees)</td>
          <td style="text-align:right;">${fmt(totTP)}</td>
          <td style="text-align:right;">${totLOP>0?'−'+fmt(totLOP):'—'}</td>
          <td style="text-align:right;">${totAdv>0?'−'+fmt(totAdv):'—'}</td>
          <td style="text-align:right;">${totOth>0?'−'+fmt(totOth):'—'}</td>
          <td style="text-align:right;">${fmt(totNet)}</td>
          <td></td>
          <td></td>
        </tr>
      </tfoot>
    </table>
  </div>`;
}

function renderHistCards(fl, sel){
  if(!fl.length) return `<div class="empty"><div class="ei">🔍</div><h3>No records found</h3></div>`;
  return `<div class="ps-list">
    ${fl.map(r=>{
      const e=byId(r.empId); if(!e) return '';
      const ci=idx(r.empId); const net=netPay(r); const lop=lopAmt(r);
      const isH=r.basisType==='hours';
      return `<div class="ps-item" onclick="openSlip('${r.empId}','${sel}')">
        <div class="pav" style="background:${clr(ci)}22;color:${clr(ci)}">${ini(e.name)}</div>
        <div style="flex:1;">
          <div class="pn">${e.name}</div>
          <div class="pm">
            ${e.id} · ${e.branch} ·
            <span class="type-chip ${r.batchType==='B1'?'chip-b1':'chip-b2'}" style="font-size:9px;">${r.batchType}</span>
            <span class="type-chip ${isH?'chip-hours':'chip-days'}" style="font-size:9px;">${isH?'⏱ Hrs':'📅 Days'}</span>
            ${isH?`· ${r.presentHours||0}/${r.workingHours||240} hrs`:`· ${r.present||0}/${r.workingDays||30} days`}
            ${lop>0?` · <span style="color:var(--red)">LOP: ${fmt(lop)}</span>`:''}
          </div>
          <div class="pm" style="font-style:italic;">${r.periodLabel||''}</div>
        </div>
        <div style="text-align:right;">
          <div class="pnet">${fmt(net)}</div>
          ${(r.advanceDeducted||0)>0?`<div style="font-size:11px;color:var(--purple);">Adv: ${fmt(r.advanceDeducted)}</div>`:''}
        </div>
      </div>`;
    }).join('')}
  </div>`;
}
function unlockMon(month){
  mOpen('Unlock — '+month,
    `<p>Unlock <strong>${month}</strong> for editing?</p><div class="banner bn-warn" style="margin-top:10px;">Re-lock after corrections.</div>`,
    [{l:'Cancel',c:'btn-o',f:'mClose()'},{l:'Unlock',c:'btn-p',f:`doUnlock('${month}')`}]);
}
function doUnlock(month){
  if(PAY[month]) PAY[month].locked=false;
  save(); mClose(); toast(month+' unlocked','inf'); pgHistory(document.getElementById('hrMain'));
}
function deletePayrollMonth(month){
  const recs=PAY[month]?.records||[];
  if(!confirm(`⚠ DELETE payroll for ${month}?\n\nThis will permanently remove ${recs.length} salary record(s).\n\nThis cannot be undone. Confirm?`)) return;
  delete PAY[month];
  // Also reset selMonth to another available month
  const remaining=mList();
  selMonth=remaining.length?remaining[0]:'';
  saveAll();
  toast(`✅ Payroll for ${month} deleted`);
  pgHistory(document.getElementById('hrMain'));
}
function editDraft(month){
  _genMon=month;
  _genRows=(PAY[month]?.records||[]).map(r=>({...r}));
  gotoPage('generate');
  setTimeout(()=>{
    // set month/year selectors
    const parts=month.split(' ');
    const moEl=document.getElementById('selMo');
    const yrEl=document.getElementById('selYr');
    if(moEl) moEl.value=MONTHS_LIST.findIndex(x=>x.startsWith(parts[0]));
    if(yrEl) yrEl.value=parseInt(parts[1]);
    buildGenTable(document.getElementById('genArea'));
  },80);
}

// ═══════════════════════════════════════════
//  ORGANIZATIONS
// ═══════════════════════════════════════════
function pgOrganizations(m){
  m.innerHTML=`
  <div class="page-hd">
    <div><h1>Organizations & Branches</h1><p>${ORGS.length} organization(s) · ${ORGS.reduce((s,o)=>s+(o.branches?.length||0),0)} branches</p></div>
    <div class="pha"><button class="btn btn-p" onclick="openAddOrg()">+ Add Organization</button></div>
  </div>
  <div id="orgList">
    ${ORGS.map(o=>renderOrgCard(o)).join('')}
  </div>`;
}
function renderOrgCard(o){
  const empCount=EMP.filter(e=>e.org===o.name).length;
  return `<div class="org-card" style="border-top-color:${o.color||'var(--gold)'};">
    <div class="org-hd">
      <div style="display:flex;align-items:center;gap:12px;flex:1;">
        <div class="org-badge" style="background:${o.color||'var(--navy)'};">${(o.shortName||o.name).slice(0,2).toUpperCase()}</div>
        <div>
          <div class="org-name">${o.name}</div>
          <div class="org-short">${o.shortName||''} · ${empCount} employee${empCount!==1?'s':''}</div>
        </div>
      </div>
      <div style="display:flex;gap:6px;">
        <button class="btn btn-o btn-sm" onclick="openEditOrg('${o.id}')">✏️ Edit</button>
        <button class="btn btn-p btn-sm" onclick="openAddBranch('${o.id}')">+ Branch</button>
        <button class="btn btn-d btn-sm" onclick="delOrg('${o.id}')">🗑</button>
      </div>
    </div>
    ${(o.address||o.phone||o.email)?`<div class="org-meta">
      ${o.address?`<span>📍 ${o.address}</span>`:''}
      ${o.phone?`<span>📞 ${o.phone}</span>`:''}
      ${o.email?`<span>✉️ ${o.email}</span>`:''}
      ${o.website?`<span>🌐 ${o.website}</span>`:''}
    </div>`:''}
    <div class="branch-pills">
      <span style="font-size:11px;font-weight:600;color:var(--muted);margin-right:4px;">Branches:</span>
      ${(o.branches||[]).map(b=>`
        <span class="branch-pill">
          🏢 ${b}
          <button class="del-br" onclick="delBranch('${o.id}','${b.replace(/'/g,"\\'")}')">✕</button>
        </span>`).join('')}
      ${(o.branches||[]).length===0?'<span style="font-size:11px;color:var(--muted);">No branches yet</span>':''}
    </div>
  </div>`;
}
function openAddOrg(){
  mOpen('Add Organization',orgFormHTML({}),
    [{l:'Cancel',c:'btn-o',f:'mClose()'},{l:'Save Organization',c:'btn-p',f:'doSaveOrg(null)'}]);
}
function openEditOrg(id){
  const o=ORGS.find(x=>x.id===id); if(!o) return;
  mOpen('Edit — '+o.name,orgFormHTML(o),
    [{l:'Cancel',c:'btn-o',f:'mClose()'},{l:'Save Changes',c:'btn-p',f:`doSaveOrg('${id}')`}]);
}
function orgFormHTML(o){
  const colors=['#0d1b2a','#6b3ac0','#1a7a4a','#1a5fa8','#b83030','#e8a832','#c05a0f','#c0297a'];
  return `<div class="fg">
    <div class="f fi full"><label>Organization Name *</label><input id="org-name" value="${o.name||''}" placeholder="Full organization name"/></div>
    <div class="f fi"><label>Short Name / Abbreviation</label><input id="org-short" value="${o.shortName||''}" placeholder="TATTI, RM Trust…"/></div>
    <div class="f fi"><label>Brand Color</label>
      <select id="org-color">
        ${colors.map(c=>`<option value="${c}" ${o.color===c?'selected':''} style="background:${c};color:white;">${c}</option>`).join('')}
      </select>
    </div>
    <div class="f fi full"><label>Address</label><input id="org-addr" value="${o.address||''}" placeholder="Full address"/></div>
    <div class="f fi"><label>Phone</label><input id="org-phone" value="${o.phone||''}" placeholder="+91 …"/></div>
    <div class="f fi"><label>Email</label><input id="org-email" value="${o.email||''}" placeholder="info@org.com"/></div>
    <div class="f fi full"><label>Website</label><input id="org-web" value="${o.website||''}" placeholder="https://…"/></div>
  </div>`;
}
function doSaveOrg(id){
  const name=(document.getElementById('org-name').value||'').trim();
  if(!name){ toast('Enter organization name','err'); return; }
  if(id){
    const o=ORGS.find(x=>x.id===id); if(!o) return;
    o.name=name;
    o.shortName=document.getElementById('org-short').value.trim();
    o.color=document.getElementById('org-color').value;
    o.address=document.getElementById('org-addr').value.trim();
    o.phone=document.getElementById('org-phone').value.trim();
    o.email=document.getElementById('org-email').value.trim();
    o.website=document.getElementById('org-web').value.trim();
  } else {
    ORGS.push({
      id:'ORG'+Date.now(),
      name, shortName:document.getElementById('org-short').value.trim(),
      color:document.getElementById('org-color').value,
      branches:[],
      address:document.getElementById('org-addr').value.trim(),
      phone:document.getElementById('org-phone').value.trim(),
      email:document.getElementById('org-email').value.trim(),
      website:document.getElementById('org-web').value.trim()
    });
  }
  saveAll(); mClose(); pgOrganizations(document.getElementById('hrMain')); toast('Organization saved');
}
function delOrg(id){
  const o=ORGS.find(x=>x.id===id); if(!o) return;
  const empCount=EMP.filter(e=>e.org===o.name).length;
  if(empCount>0){ toast(`Cannot delete: ${empCount} employee(s) assigned to this org`,'err'); return; }
  if(!confirm(`Delete "${o.name}"?`)) return;
  ORGS=ORGS.filter(x=>x.id!==id);
  saveAll(); pgOrganizations(document.getElementById('hrMain')); toast('Deleted');
}
function openAddBranch(orgId){
  mOpen('Add Branch',`
    <div class="f"><label>Branch Name *</label><input id="br-name" placeholder="e.g. Anna Salai, MG Road…"/></div>`,
    [{l:'Cancel',c:'btn-o',f:'mClose()'},{l:'Add Branch',c:'btn-p',f:`doAddBranch('${orgId}')`}]);
}
function doAddBranch(orgId){
  const name=(document.getElementById('br-name').value||'').trim();
  if(!name){ toast('Enter branch name','err'); return; }
  const o=ORGS.find(x=>x.id===orgId); if(!o) return;
  o.branches=o.branches||[];
  if(o.branches.includes(name)){ toast('Branch already exists','err'); return; }
  o.branches.push(name);
  saveAll(); mClose(); pgOrganizations(document.getElementById('hrMain')); toast('Branch added');
}
function delBranch(orgId, branchName){
  const o=ORGS.find(x=>x.id===orgId); if(!o) return;
  const empCount=EMP.filter(e=>e.branch===branchName&&e.org===o.name).length;
  if(empCount>0){ toast(`${empCount} employee(s) in this branch — reassign first`,'err'); return; }
  o.branches=o.branches.filter(b=>b!==branchName);
  saveAll(); pgOrganizations(document.getElementById('hrMain')); toast('Branch removed');
}

// ═══════════════════════════════════════════
//  EMPLOYEE DOCUMENTS
// ═══════════════════════════════════════════
function pgDocuments(m){
  const fl=srchQ?EMP.filter(e=>e.name.toLowerCase().includes(srchQ)):EMP;
  m.innerHTML=`
  <div class="page-hd">
    <div><h1>Employee Documents</h1><p>Upload & manage employee records</p></div>
  </div>
  <div class="toolbar">
    <input class="search-inp" placeholder="Search employee…" value="${srchQ}" oninput="srchQ=this.value.toLowerCase();pgDocuments(document.getElementById('hrMain'))"/>
  </div>
  <div style="display:grid;gap:1rem;">
    ${fl.map(e=>{
      const docs=EMP_DOCS.filter(d=>d.empId===e.id);
      const ci=idx(e.id);
      return `<div style="background:white;border-radius:var(--r);box-shadow:var(--sh);overflow:hidden;">
        <div class="doc-emp-hd" style="border-bottom:1px solid var(--cream2);margin:0;border-radius:0;cursor:pointer;" onclick="toggleDocSection('${e.id}')">
          <div class="row-av" style="background:${clr(ci)}22;color:${clr(ci)};width:40px;height:40px;font-size:13px;">${ini(e.name)}</div>
          <div style="flex:1;">
            <div style="font-weight:600;font-size:14px;color:var(--navy);">${e.name}</div>
            <div style="font-size:11px;color:var(--muted);">${e.id} · ${e.branch} · ${e.designation||''}</div>
          </div>
          <div style="display:flex;gap:8px;align-items:center;">
            ${docs.length?`<span class="badge b-grn">${docs.length} doc${docs.length!==1?'s':''}</span>`:`<span class="badge b-or">No docs</span>`}
            <span style="color:var(--muted);font-size:13px;">▾</span>
          </div>
        </div>
        <div id="docSec-${e.id}" style="display:none;padding:1rem 1.25rem;">
          ${renderDocSection(e.id)}
        </div>
      </div>`;
    }).join('')}
  </div>`;
}
function toggleDocSection(empId){
  const el=document.getElementById('docSec-'+empId);
  if(!el) return;
  if(el.style.display==='none'){
    el.style.display='block';
    el.innerHTML=renderDocSection(empId);
  } else el.style.display='none';
}
function renderDocSection(empId){
  const docs=EMP_DOCS.filter(d=>d.empId===empId);
  return `<div class="doc-grid">
    ${DOC_TYPES.map(dt=>{
      const existing=docs.find(d=>d.type===dt.id);
      return `<div class="doc-tile ${existing?'has-doc':''}" onclick="openDocUpload('${empId}','${dt.id}')">
        ${existing?'<div class="doc-badge">✓</div>':''}
        <span class="doc-tile-ic">${dt.emoji}</span>
        <div class="doc-tile-label">${dt.label}</div>
        <div class="doc-tile-status">${existing?'✅ Uploaded · '+existing.uploadedOn:'Click to upload'}</div>
        ${existing?`<div style="display:flex;gap:4px;justify-content:center;margin-top:8px;">
          <button class="btn btn-grn btn-xs" onclick="event.stopPropagation();previewDoc('${existing.id}')">👁 View</button>
          <button class="btn btn-d btn-xs" onclick="event.stopPropagation();deleteDoc('${existing.id}','${empId}')">🗑</button>
        </div>`:''}
      </div>`;
    }).join('')}
  </div>`;
}
function openDocUpload(empId, docType){
  const dt=DOC_TYPES.find(x=>x.id===docType);
  const existing=EMP_DOCS.find(d=>d.empId===empId&&d.type===docType);
  const e=byId(empId);
  mOpen(`Upload — ${dt.emoji} ${dt.label}`,`
    <div style="margin-bottom:12px;font-size:13px;color:var(--navy);">Employee: <strong>${e?.name||empId}</strong></div>
    ${existing?`<div class="banner bn-warn" style="margin-bottom:12px;">⚠️ A file is already uploaded. Uploading will replace it.</div>`:''}
    <div class="f">
      <label>Select File *</label>
      <input type="file" id="doc-file" accept="${dt.accept}" style="padding:10px;border:1.5px dashed #ddd;border-radius:var(--rs);width:100%;font-family:'DM Sans',sans-serif;font-size:13px;"/>
      <div class="f-hint">Accepted: ${dt.accept} · Max 2MB recommended</div>
    </div>
    <div class="f">
      <label>Notes (optional)</label>
      <input id="doc-note" placeholder="e.g. Aadhar front side, expires 2030…"/>
    </div>`,
    [{l:'Cancel',c:'btn-o',f:'mClose()'},{l:'Upload',c:'btn-p',f:`doUploadDoc('${empId}','${docType}')`}]);
}
function doUploadDoc(empId, docType){
  const fileEl=document.getElementById('doc-file');
  const file=fileEl?.files?.[0];
  if(!file){ toast('Select a file','err'); return; }
  if(file.size>5*1024*1024){ toast('File too large (max 5MB)','err'); return; }
  const reader=new FileReader();
  reader.onload=function(ev){
    // Remove old doc of same type for same employee
    EMP_DOCS=EMP_DOCS.filter(d=>!(d.empId===empId&&d.type===docType));
    EMP_DOCS.push({
      id:'DOC'+Date.now(), empId, type:docType,
      fileName:file.name, fileType:file.type,
      fileData:ev.target.result,
      note:document.getElementById('doc-note')?.value||'',
      uploadedOn:today(), size:file.size
    });
    saveDocs(); mClose();
    const sec=document.getElementById('docSec-'+empId);
    if(sec&&sec.style.display!=='none') sec.innerHTML=renderDocSection(empId);
    pgDocuments(document.getElementById('hrMain'));
    toast('Document uploaded ✅');
  };
  reader.readAsDataURL(file);
}
function previewDoc(docId){
  const doc=EMP_DOCS.find(d=>d.id===docId); if(!doc) return;
  const isImg=doc.fileType?.startsWith('image/');
  mOpen('📄 '+doc.fileName,`
    <div style="margin-bottom:10px;font-size:12px;color:var(--muted);">Uploaded: ${doc.uploadedOn} · ${(doc.size/1024).toFixed(1)} KB${doc.note?` · ${doc.note}`:''}</div>
    ${isImg
      ? `<img src="${doc.fileData}" style="width:100%;max-height:400px;object-fit:contain;border-radius:8px;border:1px solid var(--cream2);"/>`
      : `<div style="text-align:center;padding:2rem;background:var(--cream);border-radius:8px;">
          <div style="font-size:48px;margin-bottom:12px;">📄</div>
          <div style="font-size:13px;color:var(--navy);font-weight:600;">${doc.fileName}</div>
          <div style="font-size:11px;color:var(--muted);margin-top:4px;">PDF/Document — click Download to open</div>
        </div>`
    }`,
    [{l:'Close',c:'btn-o',f:'mClose()'},{l:'⬇ Download',c:'btn-p',f:`downloadDoc('${docId}')`}],true);
}
function downloadDoc(docId){
  const doc=EMP_DOCS.find(d=>d.id===docId); if(!doc) return;
  const a=document.createElement('a');
  a.href=doc.fileData; a.download=doc.fileName; a.click();
  toast('Downloading…');
}
function deleteDoc(docId, empId){
  if(!confirm('Delete this document?')) return;
  EMP_DOCS=EMP_DOCS.filter(d=>d.id!==docId);
  saveDocs();
  const sec=document.getElementById('docSec-'+empId);
  if(sec&&sec.style.display!=='none') sec.innerHTML=renderDocSection(empId);
  pgDocuments(document.getElementById('hrMain'));
  toast('Document deleted');
}

// ── CREDENTIALS ──
function pgCredentials(m){
  m.innerHTML=`
  <div class="page-hd"><div><h1>Credentials</h1><p>Employee login access</p></div>
    <div class="pha"><button class="btn btn-or btn-sm" onclick="changeHRPass()">🔑 Change HR Password</button></div>
  </div>
  <div class="banner bn-warn" style="margin-bottom:1rem;">🔒 HR Admin password is set. Use "Change HR Password" to update it.</div>
  <div class="tbl-wrap">
    <table class="tbl">
      <thead><tr><th>Employee</th><th>ID</th><th>Password</th><th>Status</th><th>Org</th><th>Branch</th><th>Actions</th></tr></thead>
      <tbody>
        ${EMP.map((e,i)=>`<tr style="${e.inactive?'opacity:.55;':''}">
          <td><div class="nc">
            <div class="row-av" style="background:${clr(i)}22;color:${clr(i)}">${ini(e.name)}</div>
            <div><div class="nm">${e.name}</div><div class="ns">${e.designation||''}</div></div>
          </div></td>
          <td style="font-family:monospace;font-size:12px;">${e.id}</td>
          <td><code style="background:var(--cream);padding:2px 8px;border-radius:4px;font-size:12px;">••••••••</code>
            <button class="btn btn-xs btn-o" style="margin-left:4px;" onclick="revealPass(this,'${e.id}')">👁</button>
          </td>
          <td>${e.inactive?'<span class="badge b-red">Inactive</span>':'<span class="badge b-grn">Active</span>'}</td>
          <td style="font-size:11px;">${e.org.split(' ').slice(0,3).join(' ')}…</td>
          <td>${e.branch}</td>
          <td><div class="acts">
            <button class="btn btn-o btn-sm" onclick="changePass('${e.id}')">🔑 Password</button>
            <button class="btn ${e.inactive?'btn-grn':'btn-d'} btn-sm" onclick="toggleActive('${e.id}')">${e.inactive?'✅ Activate':'🚫 Deactivate'}</button>
          </div></td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>`;
}
function revealPass(btn, id){
  const e=byId(id); if(!e) return;
  const code=btn.previousElementSibling;
  if(code.textContent==='••••••••'){ code.textContent=e.pass; btn.textContent='🙈'; }
  else { code.textContent='••••••••'; btn.textContent='👁'; }
}
function changeHRPass(){
  mOpen('Change HR Admin Password',
    `<div class="f"><label>Current Password</label><input type="password" id="hrp-old" placeholder="Current HR password"/></div>
     <div class="f"><label>New Password *</label><input type="password" id="hrp-new" placeholder="New password (min 6 chars)"/></div>
     <div class="f"><label>Confirm New Password *</label><input type="password" id="hrp-conf" placeholder="Repeat new password"/></div>`,
    [{l:'Cancel',c:'btn-o',f:'mClose()'},{l:'Update HR Password',c:'btn-p',f:'doChangeHRPass()'}]);
}
function doChangeHRPass(){
  const old=document.getElementById('hrp-old').value;
  const np=document.getElementById('hrp-new').value;
  const conf=document.getElementById('hrp-conf').value;
  if(old!==HR_PASS){ toast('Current password is wrong','err'); return; }
  if(np.length<6){ toast('New password must be at least 6 characters','err'); return; }
  if(np!==conf){ toast('Passwords do not match','err'); return; }
  HR_PASS=np;
  localStorage.setItem('tatti_hrpass_v1',HR_PASS);
  mClose(); toast('HR password updated ✓');
}
function toggleActive(id){
  const e=byId(id); if(!e) return;
  e.inactive=!e.inactive;
  save(); gotoPage('credentials');
  toast(e.name+(e.inactive?' deactivated':' activated'));
}
function changePass(id){
  const e=byId(id);
  mOpen('Change Password — '+e.name,
    `<div class="f"><label>New Password</label><input type="text" id="np" value="${e.pass}"/></div>`,
    [{l:'Cancel',c:'btn-o',f:'mClose()'},{l:'Update',c:'btn-p',f:`doCP('${id}')`}]);
}
function doCP(id){ byId(id).pass=document.getElementById('np').value; save(); mClose(); gotoPage('credentials'); toast('Password updated'); }

// ═══════════════════════════════════════════
//  PAYSLIP MODAL — FORMAL DESIGN
// ═══════════════════════════════════════════
function openSlip(empId, month){
  const e=byId(empId), r=getRec(month,empId);
  if(!e||!r) return;
  const net=netPay(r), lop=lopAmt(r);
  const tp=recTotalPayable(r);
  const totalDed=lop+(r.advanceDeducted||0)+(r.otherDeduction||0)+(r.halfDayDeduction||0);
  const isH=r.basisType==='hours', isPD=r.basisType==='perday';
  const locked=isLocked(month);
  const a=calcAllowances(r); // pro-rata aware allowances
  
  
  const photoDoc=EMP_DOCS.find(d=>d.empId===empId&&d.type==='photo');
  const avatarHtml=photoDoc
    ? `<img src="${photoDoc.fileData}" style="width:48px;height:48px;border-radius:50%;object-fit:cover;border:2px solid rgba(255,255,255,.5);flex-shrink:0;"/>`
    : `<div style="width:48px;height:48px;border-radius:50%;background:#e0e0e0;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:800;color:#111;flex-shrink:0;">${ini(e.name)}</div>`;
  const attendPct=isH?Math.round((r.presentHours||0)/(r.workingHours||240)*100):Math.round((r.present||0)/(r.workingDays||30)*100);

  // Earnings
  const earnItems=[];
  if(isPD) earnItems.push(['Per Day Rate × '+r.present+' days',(r.gross||0)*(r.present||0)]);
  else if(isH) earnItems.push(['Per Hour Rate × '+(r.presentHours||0)+' hrs',(r.gross||0)*(r.presentHours||0)]);
  else earnItems.push(['Basic / Gross Salary',r.gross||0]);
  if(a.ta>0) earnItems.push(['Travelling Allowance'+(r.proRataAllowance?' (pro-rata)':''),a.ta]);
  if(a.oc>0) earnItems.push(['Other Conveyance'+(r.proRataAllowance?' (pro-rata)':''),a.oc]);
  if(a.te>0) earnItems.push(['Telephone Expenses'+(r.proRataAllowance?' (pro-rata)':''),a.te]);
  if(a.oe>0) earnItems.push(['Other Expenses'+(r.proRataAllowance?' (pro-rata)':''),a.oe]);
  if((r.incentive||0)>0) earnItems.push(['🎯 Incentive / Bonus',r.incentive]);

  // Deductions
  const dedItems=[];
  // Split LOP into full-day and half-day components for clarity
  const fullDayLOP=r.unpaidUnits>0 ? Math.round((r.gross||0)/(r.workingDays||30)*(r.unpaidUnits||0)*100)/100 : 0;
  const halfDayLOP=r.halfDayUnits>0 ? Math.round((r.gross||0)/(r.workingDays||30)*(r.halfDayUnits||0)*0.5*100)/100 : 0;
  if(r.lopOverride && lop>0){
    dedItems.push(['Loss of Pay (LOP) *Override*', lop]);
  } else {
    if(fullDayLOP>0) dedItems.push([`LOP \u2014 Full Day (${r.unpaidUnits||0}d)`, fullDayLOP]);
    if(halfDayLOP>0) dedItems.push([`LOP \u2014 Half Day (${r.halfDayUnits||0} \u00d7 \u00bdd)`, halfDayLOP]);
  }
  if((r.halfDayDeduction||0)>0)      dedItems.push(['Half Day Deduction',r.halfDayDeduction]);
  if((r.advanceDeducted||0)>0)       dedItems.push(['Advance Recovery',r.advanceDeducted]);
  if((r.otherDeduction||0)>0)        dedItems.push(['Other Deductions',r.otherDeduction]);

  const maxR=Math.max(earnItems.length,dedItems.length,1);
  while(earnItems.length<maxR) earnItems.push(null);
  while(dedItems.length<maxR) dedItems.push(null);

  const tblRows=earnItems.map((ei,i)=>{
    const di=dedItems[i];
    return `<tr>
      <td class="fslip-earn-lbl">${ei?ei[0]:''}</td>
      <td class="fslip-earn-amt">${ei?fmt(ei[1]):''}</td>
      <td class="fslip-ded-lbl">${di?di[0]:''}</td>
      <td class="fslip-ded-amt">${di?'− '+fmt(di[1]):''}</td>
    </tr>`;
  }).join('');

  mOpen('Payslip — '+e.name,`
  <div class="fslip" id="fslipDoc">
    <div class="fslip-header" >
      <div class="fslip-header-left">
        ${avatarHtml}
        <div>
          <div class="fslip-org-name">${e.org}</div>
          <div class="fslip-org-sub">📍 ${e.branch} · Payroll Department</div>
        </div>
      </div>
      <div class="fslip-status-chip">${locked?'🔒 FINALIZED':'📝 DRAFT'}</div>
    </div>
    <div class="fslip-title">PAY SLIP &nbsp;·&nbsp; ${month} &nbsp;·&nbsp; ${r.periodLabel||''}</div>
    <div class="fslip-emp-grid">
      <div class="fslip-emp-col">
        <div class="fslip-emp-cell"><span class="fslip-elbl">Employee Name</span><span class="fslip-eval">${e.name}</span></div>
        <div class="fslip-emp-cell"><span class="fslip-elbl">Employee ID</span><span class="fslip-eval">${e.id}</span></div>
        <div class="fslip-emp-cell"><span class="fslip-elbl">Designation</span><span class="fslip-eval">${e.designation||'Staff'}</span></div>
        <div class="fslip-emp-cell"><span class="fslip-elbl">Date of Joining</span><span class="fslip-eval">${e.doj||'—'}</span></div>
      </div>
      <div class="fslip-emp-col">
        <div class="fslip-emp-cell"><span class="fslip-elbl">Bank Account</span><span class="fslip-eval" style="font-family:monospace;font-size:11px;">${e.acct||'—'}</span></div>
        <div class="fslip-emp-cell"><span class="fslip-elbl">Bank Name</span><span class="fslip-eval">${e.bank||'—'}</span></div>
        <div class="fslip-emp-cell"><span class="fslip-elbl">IFSC Code</span><span class="fslip-eval">${e.ifsc||'—'}</span></div>
        <div class="fslip-emp-cell"><span class="fslip-elbl">Salary Batch</span><span class="fslip-eval">${batchLabel(r.batchType)} · ${basisLabel(r.basisType)}</span></div>
      </div>
    </div>
    <div class="fslip-section-hd">Attendance Summary</div>
    <div class="fslip-att">
      <div class="fslip-att-cell"><div class="fslip-att-v">${r.workingDays||30}</div><div class="fslip-att-l">Work Days</div></div>
      ${isH?`
      <div class="fslip-att-cell"><div class="fslip-att-v">${r.workingHours||240}</div><div class="fslip-att-l">Sched. Hrs</div></div>
      <div class="fslip-att-cell"><div class="fslip-att-v">${r.presentHours||0}</div><div class="fslip-att-l">Present Hrs</div></div>
      <div class="fslip-att-cell"><div class="fslip-att-v">${r.unpaidUnits||0}</div><div class="fslip-att-l">Absent Hrs</div></div>
      `:`
      <div class="fslip-att-cell"><div class="fslip-att-v">${r.present||0}</div><div class="fslip-att-l">Present</div></div>
      <div class="fslip-att-cell"><div class="fslip-att-v">${r.paidLeave||0}</div><div class="fslip-att-l">Paid Leave</div></div>
      <div class="fslip-att-cell"><div class="fslip-att-v">${r.unpaidUnits||0}</div><div class="fslip-att-l">Absent (LOP)</div></div>
      `}
      <div class="fslip-att-cell"><div class="fslip-att-v">${attendPct}%</div><div class="fslip-att-l">Attendance</div></div>
    </div>
    <div class="fslip-section-hd">Earnings &amp; Deductions</div>
    <table class="fslip-ed">
      <thead><tr>
        <th colspan="2" class="fslip-earn-hd" >Earnings</th>
        <th colspan="2" class="fslip-ded-hd" >Deductions</th>
      </tr></thead>
      <tbody>${tblRows}</tbody>
      <tfoot><tr>
        <td>Total Earnings</td><td>${fmt(tp)}</td>
        <td>Total Deductions</td><td>${totalDed>0?'− '+fmt(totalDed):fmt(0)}</td>
      </tr></tfoot>
    </table>
    <div class="fslip-net" >
      <div>
        <div class="fslip-net-label">Net Payable Amount</div>
        <div class="fslip-net-words">${toWords(net)}</div>
      </div>
      <div class="fslip-net-amount">${fmt(net)}</div>
    </div>
    ${(r.totalAdvReceived||0)>0?`<div class="fslip-adv-row"><span>Total Advance Received (Outstanding Balance)</span><span>${fmt(r.totalAdvReceived)}</span></div>`:''}
    ${r.remarks?`<div style="padding:5px 14px;font-size:10px;color:#666;background:#fffdf0;border-top:1px solid #eee;">📝 Remarks: ${r.remarks}</div>`:''}
    <div class="fslip-foot">
      <span>🏢 ${e.org} · ${e.branch}</span>
      <span>Computer-generated payslip. No signature required.</span>
      <span>Generated: ${PAY[month]?.generatedOn||today()}</span>
    </div>
  </div>`,
  [{l:'Close',c:'btn-o',f:'mClose()'},{l:'✉ Email',c:'btn-pu',f:`sendPayslipEmail('${empId}', '${month}')`},{l:'⬇ PDF',c:'btn-g',f:'exportModalPayslipPDF()'},{l:'🖨 Print',c:'btn-p',f:'printPayslip()'}], true);
}

function sendPayslipEmail(empId, month) {
  const e = byId(empId);
  const r = getRec(month, empId);
  if (!e) { toast('Employee not found', 'err'); return; }

  const recipientEmail = e.email || '';

  if (!recipientEmail) {
    // Prompt user to enter an email address
    mOpen('Send Payslip by Email — ' + e.name,
      `<div class="f">
        <label>Recipient Email Address</label>
        <input id="email-send-to" type="email" placeholder="Enter email address" value=""/>
        <div class="f-hint">This employee has no email configured. Enter an address to send the payslip to.</div>
      </div>`,
      [{l:'Cancel',c:'btn-o',f:'mClose()'},
       {l:'✉ Send',c:'btn-pu',f:`doSendPayslipEmail('${empId}','${month}',document.getElementById('email-send-to').value)`}]
    );
    return;
  }

  doSendPayslipEmail(empId, month, recipientEmail);
}

function doSendPayslipEmail(empId, month, toEmail) {
  const e = byId(empId);
  let r = getRec(month, empId);
  if (!r) {
    for (const recMonth in PAY) {
      const rec = PAY[recMonth]?.records?.find(x =>
        String(x.empId || '').trim().toUpperCase() === String(empId || '').trim().toUpperCase() &&
        String(x.month || recMonth).trim() === String(month).trim()
      );
      if (rec) { r = rec; break; }
    }
  }
  if (!e) { toast('Employee not found', 'err'); return; }
  if (!toEmail || !toEmail.includes('@')) { toast('Please enter a valid email address', 'err'); return; }

  // Close any open modal
  mClose();

  toast('✉ Sending payslip to ' + toEmail + '…', 'inf');

  // Capture the payslip HTML from the DOM
  const fslipDoc = document.getElementById('fslipDoc');
  let htmlContent = '';
  if (fslipDoc) {
    // Collect all styles from the document
    const allStyles = Array.from(document.styleSheets).reduce((acc, sheet) => {
      try {
        return acc + Array.from(sheet.cssRules).map(r => r.cssText).join('\n');
      } catch(e) { return acc; }
    }, '');

    htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap" rel="stylesheet"/>
  <style>
    ${allStyles}
    body { background: white !important; padding: 20px; }
    .fslip { box-shadow: none !important; border: 1.5px solid #222 !important; max-width: 100% !important; }
    .modal-ov, .topnav, .sidebar, #toast { display: none !important; }
  </style>
</head>
<body>
  ${fslipDoc.outerHTML}
</body>
</html>`;
  }

  console.log('doSendPayslipEmail host:', window.location.hostname, 'API_BASE_URL:', API_BASE_URL);
  // Force local backend URL during local development
  const emailApiUrl = LOCAL_HOSTNAMES.includes(window.location.hostname)
    ? 'http://127.0.0.1:8000/api/send-payslip-email'
    : `${API_BASE_URL}/api/send-payslip-email`;
  console.log('Email send URL:', emailApiUrl);

  const updateEmailStatus = (status) => {
    console.log('[EMAIL STATUS UPDATE] Starting update with status:', status, 'for empId:', empId, 'month:', month);
    
    if (!r) {
      console.log('[EMAIL STATUS UPDATE] No record found, aborting');
      return;
    }

    const targetEmpKey = String(empId || '').trim().toUpperCase();
    const targetMonth = String(month || '').trim().toLowerCase();
    
    console.log('[EMAIL STATUS UPDATE] Target empKey:', targetEmpKey, 'targetMonth:', targetMonth);

    let updated = false;
    for (const mon in PAY) {
      const records = PAY[mon]?.records || [];
      records.forEach(rec => {
        const recEmpKey = String(rec.empId || '').trim().toUpperCase();
        const recMonthKey = String(rec.month || mon).trim().toLowerCase();
        console.log('[EMAIL STATUS UPDATE] Checking record:', recEmpKey, recMonthKey, 'against target:', targetEmpKey, targetMonth);
        
        if (recEmpKey === targetEmpKey && recMonthKey === targetMonth) {
          console.log('[EMAIL STATUS UPDATE] MATCH! Updating record from', rec.emailStatus, 'to', status);
          rec.emailStatus = status;
          updated = true;
        }
      });
    }

    if (!updated) {
      console.log('[EMAIL STATUS UPDATE] WARNING: No matching record found for update');
    }

    save();
    console.log('[EMAIL STATUS UPDATE] Data saved');
    
    // Re-render the page immediately with updated data
    const hrMain = document.getElementById('hrMain');
    if (hrMain && typeof pgHistory === 'function') {
      console.log('[EMAIL STATUS UPDATE] Calling pgHistory with skipBackendFetch=true');
      pgHistory(hrMain, true);
    } else {
      console.log('[EMAIL STATUS UPDATE] ERROR: hrMain or pgHistory not available');
    }
  };

  fetch(emailApiUrl, {
    method: 'POST',
    mode: 'cors',
    credentials: 'same-origin',
    cache: 'no-store',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      empId: empId,
      month: month,
      customEmail: toEmail,
      employee: { id:e.id, name:e.name, org:e.org, branch:e.branch, designation:e.designation||'Staff', email:toEmail },
      payroll: r,
      htmlContent: htmlContent
    })
  })
  .then(async res => {
    let data;
    try {
      data = await res.json();
    } catch (parseErr) {
      console.error('Could not parse email API response as JSON:', parseErr);
      data = null;
    }

    if (res.ok && data && data.success) {
      toast('✅ Email sent successfully to ' + toEmail, 'success');
      updateEmailStatus('Sent');
      return;
    }

    const errorMessage = formatSendError(data, res);
    console.error('Email send failed:', { status: res.status, data, errorMessage });
    updateEmailStatus('Failed');
    toast('❌ Email failed: ' + errorMessage, 'err');
  })
  .catch(err => {
    console.error('Email service error:', err);
    console.log('Backend URL was:', emailApiUrl);
    updateEmailStatus('Failed');
    toast('❌ Cannot reach email service: ' + (err.message || err), 'err');
  });
}

// ═══════════════════════════════════════════
//  EXPORT
// ═══════════════════════════════════════════
function exportCSV(month){
  if(!month||!PAY[month]){ toast('No data','err'); return; }
  const recs=[...PAY[month].records].sort((a,b)=>a.batchType.localeCompare(b.batchType));
  const hdr=['Org','Branch','Name','Account','Bank','IFSC','Batch','Basis','Period','Gross','TA','Other Conv','Tel Exp','Other Exp','Total Payable','Work Days','Work Hrs','Present','Present Hrs','Unpaid Units','LOP','LOP Override','Adv Deducted','Half Day Ded','Other Ded','Total Adv Recd','Net Payable','Month','Remarks'];
  const rows=[hdr];
  for(const r of recs){
    const e=byId(r.empId); if(!e) continue;
    rows.push([e.org,e.branch,e.name,e.acct,e.bank||'',e.ifsc||'',r.batchType,r.basisType,r.periodLabel||'',r.gross,r.travellingAllowance||0,r.otherConveyance||0,r.telephoneExpenses||0,r.otherExpenses||0,recTotalPayable(r).toFixed(2),r.workingDays||30,r.workingHours||'',r.present||0,r.presentHours||'',r.unpaidUnits||0,lopAmt(r).toFixed(2),r.lopOverride?'Yes':'No',r.advanceDeducted||0,r.halfDayDeduction||0,r.otherDeduction||0,r.totalAdvReceived||0,netPay(r).toFixed(2),month,r.remarks||'']);
  }
  dl(`Payroll_${month.replace(' ','_')}.csv`,'text/csv',rows.map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n'));
  toast('CSV exported');
}
function exportExcel(month){
  if(!month||!PAY[month]){ toast('No data','err'); return; }
  const recs=[...PAY[month].records].sort((a,b)=>a.batchType.localeCompare(b.batchType));
  const hdrs=['Org','Branch','Employee Name','Account #','Bank','IFSC','Batch','Basis','Period','Gross Salary','Travelling Allow.','Other Conv.','Tel. Expenses','Other Expenses','Total Payable','Work Days','Work Hours','Present','Present Hours','Unpaid Units','LOP','LOP Override','Adv Deducted','Half Day Ded','Other Ded','Total Adv Recd','Net Payable','Month','Remarks'];
  let html=`<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="UTF-8"></head><body><table border="1">`;
  html+=`<tr>${hdrs.map(h=>`<th style="background:#0d1b2a;color:white;font-weight:bold;white-space:nowrap;">${h}</th>`).join('')}</tr>`;
  let tP=0,tN=0,tL=0,tA=0;
  for(const r of recs){
    const e=byId(r.empId); if(!e) continue;
    const tp=recTotalPayable(r); const net=netPay(r); const lop=lopAmt(r);
    tP+=tp; tN+=net; tL+=lop; tA+=(r.advanceDeducted||0);
    const rowBg=r.batchType==='B1'?'background:#f8f4ff':'';
    html+=`<tr style="${rowBg}"><td>${e.org}</td><td>${e.branch}</td><td>${e.name}</td><td>${e.acct}</td><td>${e.bank||''}</td><td>${e.ifsc||''}</td><td>${r.batchType}</td><td>${r.basisType}</td><td>${r.periodLabel||''}</td><td>${r.gross}</td><td>${r.travellingAllowance||0}</td><td>${r.otherConveyance||0}</td><td>${r.telephoneExpenses||0}</td><td>${r.otherExpenses||0}</td><td>${tp.toFixed(2)}</td><td>${r.workingDays||30}</td><td>${r.workingHours||''}</td><td>${r.present||0}</td><td>${r.presentHours||''}</td><td>${r.unpaidUnits||0}</td><td>${lop.toFixed(2)}</td><td>${r.lopOverride?'Yes':'No'}</td><td>${r.advanceDeducted||0}</td><td>${r.halfDayDeduction||0}</td><td>${r.otherDeduction||0}</td><td>${r.totalAdvReceived||0}</td><td style="font-weight:bold;color:green;">${net.toFixed(2)}</td><td>${month}</td><td>${r.remarks||''}</td></tr>`;
  }
  html+=`<tr style="font-weight:bold;background:#fdf8f0;"><td colspan="14">TOTAL</td><td>${tP.toFixed(2)}</td><td></td><td></td><td></td><td></td><td></td><td>${tL.toFixed(2)}</td><td></td><td>${tA.toFixed(2)}</td><td></td><td></td><td></td><td style="color:green;">${tN.toFixed(2)}</td><td></td><td></td></tr>`;
  html+=`</table></body></html>`;
  dl(`Payroll_${month.replace(' ','_')}.xls`,'application/vnd.ms-excel',html);
  toast('Excel exported');
}
function dl(name,mime,content){
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([content],{type:mime+';charset=utf-8;'}));
  a.download=name; a.click();
}

// ═══════════════════════════════════════════
//  EMPLOYEE VIEW
// ═══════════════════════════════════════════
function showEmpScreen(emp){
  curEmpId=emp.id;
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById('empScreen').classList.add('active');
  const ci=idx(emp.id), c=clr(ci);
  const av=document.getElementById('empAv');
  av.textContent=ini(emp.name); av.style.background=c+'33'; av.style.color=c;
  document.getElementById('empNm').textContent=emp.name;
  const mons=empMons(emp.id);
  empViewMon=empViewMon||mons[0]||null;
  renderEmpView(emp);
}
function renderEmpView(emp){
  const mons=empMons(emp.id);
  const sel=empViewMon;
  const r=sel?getRec(sel,emp.id):null;
  const main=document.getElementById('empMain');
  if(mons.length===0){
    main.innerHTML=`<div class="empty"><div class="ei">📄</div><h3>No payslips yet</h3><p>Your payslips will appear once HR generates them.</p></div>`; return;
  }
  
  const net=r?netPay(r):0, lop=r?lopAmt(r):0, tp=r?recTotalPayable(r):0;
  const totalDed=lop+(r?.advanceDeducted||0)+(r?.otherDeduction||0)+(r?.halfDayDeduction||0);
  const locked=sel?isLocked(sel):false;
  const isH=r?.basisType==='hours', isPD=r?.basisType==='perday';
  const attendPct=r?(isH?Math.round((r.presentHours||0)/(r.workingHours||240)*100):Math.round((r.present||0)/(r.workingDays||30)*100)):0;
  const photoDoc=EMP_DOCS.find(d=>d.empId===emp.id&&d.type==='photo');
  const avatarHtml=photoDoc
    ? `<img src="${photoDoc.fileData}" style="width:48px;height:48px;border-radius:50%;object-fit:cover;border:2px solid rgba(255,255,255,.5);flex-shrink:0;"/>`
    : `<div style="width:48px;height:48px;border-radius:50%;background:#e0e0e0;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:800;color:#111;flex-shrink:0;">${ini(emp.name)}</div>`;

  let tblRows='';
  if(r){
    const earnItems=[];
    if(isPD) earnItems.push(['Per Day Rate × '+r.present+' days',(r.gross||0)*(r.present||0)]);
    else if(isH) earnItems.push(['Per Hour Rate × '+(r.presentHours||0)+' hrs',(r.gross||0)*(r.presentHours||0)]);
    else earnItems.push(['Basic / Gross Salary',r.gross||0]);
    if((r.travellingAllowance||0)>0) earnItems.push(['Travelling Allowance',r.travellingAllowance]);
    if((r.otherConveyance||0)>0)     earnItems.push(['Other Conveyance',r.otherConveyance]);
    if((r.telephoneExpenses||0)>0)   earnItems.push(['Telephone Expenses',r.telephoneExpenses]);
    if((r.otherExpenses||0)>0)       earnItems.push(['Other Expenses',r.otherExpenses]);
    const dedItems=[];
    // Split LOP into full-day and half-day components for clarity
    const fullDayLOP2=r.unpaidUnits>0 ? Math.round((r.gross||0)/(r.workingDays||30)*(r.unpaidUnits||0)*100)/100 : 0;
    const halfDayLOP2=r.halfDayUnits>0 ? Math.round((r.gross||0)/(r.workingDays||30)*(r.halfDayUnits||0)*0.5*100)/100 : 0;
    if(r.lopOverride && lop>0){
      dedItems.push(['Loss of Pay (LOP) *Override*', lop]);
    } else {
      if(fullDayLOP2>0) dedItems.push([`LOP \u2014 Full Day (${r.unpaidUnits||0}d)`, fullDayLOP2]);
      if(halfDayLOP2>0) dedItems.push([`LOP \u2014 Half Day (${r.halfDayUnits||0} \u00d7 \u00bdd)`, halfDayLOP2]);
    }
    if((r.halfDayDeduction||0)>0)     dedItems.push(['Half Day Deduction',r.halfDayDeduction]);
    if((r.advanceDeducted||0)>0)      dedItems.push(['Advance Recovery',r.advanceDeducted]);
    if((r.otherDeduction||0)>0)       dedItems.push(['Other Deductions',r.otherDeduction]);
    const maxR=Math.max(earnItems.length,dedItems.length,1);
    while(earnItems.length<maxR) earnItems.push(null);
    while(dedItems.length<maxR) dedItems.push(null);
    tblRows=earnItems.map((ei,i)=>{
      const di=dedItems[i];
      return `<tr><td class="fslip-earn-lbl">${ei?ei[0]:''}</td><td class="fslip-earn-amt">${ei?fmt(ei[1]):''}</td><td class="fslip-ded-lbl">${di?di[0]:''}</td><td class="fslip-ded-amt">${di?'− '+fmt(di[1]):''}</td></tr>`;
    }).join('');
  }

  main.innerHTML=`
  <div class="emp-mtabs">
    ${mons.map(m=>`<button class="emtab ${m===sel?'active':''}" onclick="empViewMon='${m}';renderEmpView(byId('${emp.id}'))">${m}${isLocked(m)?' 🔒':''}</button>`).join('')}
  </div>
  ${r?`
  <div class="fslip" id="slipDoc" style="max-width:780px;margin:0 auto;">
    <div class="fslip-header" >
      <div class="fslip-header-left">
        ${avatarHtml}
        <div>
          <div class="fslip-org-name">${emp.org}</div>
          <div class="fslip-org-sub">📍 ${emp.branch} · Payroll Department</div>
        </div>
      </div>
      <div class="fslip-status-chip">${locked?'🔒 FINALIZED':'📝 DRAFT'}</div>
    </div>
    <div class="fslip-title">PAY SLIP &nbsp;·&nbsp; ${sel} &nbsp;·&nbsp; ${r.periodLabel||''}</div>
    <div class="fslip-emp-grid">
      <div class="fslip-emp-col">
        <div class="fslip-emp-cell"><span class="fslip-elbl">Employee Name</span><span class="fslip-eval">${emp.name}</span></div>
        <div class="fslip-emp-cell"><span class="fslip-elbl">Employee ID</span><span class="fslip-eval">${emp.id}</span></div>
        <div class="fslip-emp-cell"><span class="fslip-elbl">Designation</span><span class="fslip-eval">${emp.designation||'Staff'}</span></div>
        <div class="fslip-emp-cell"><span class="fslip-elbl">Date of Joining</span><span class="fslip-eval">${emp.doj||'—'}</span></div>
      </div>
      <div class="fslip-emp-col">
        <div class="fslip-emp-cell"><span class="fslip-elbl">Bank Account</span><span class="fslip-eval" style="font-family:monospace;font-size:11px;">${emp.acct||'—'}</span></div>
        <div class="fslip-emp-cell"><span class="fslip-elbl">Bank Name</span><span class="fslip-eval">${emp.bank||'—'}</span></div>
        <div class="fslip-emp-cell"><span class="fslip-elbl">IFSC Code</span><span class="fslip-eval">${emp.ifsc||'—'}</span></div>
        <div class="fslip-emp-cell"><span class="fslip-elbl">Salary Batch</span><span class="fslip-eval">${batchLabel(r.batchType)}</span></div>
      </div>
    </div>
    <div class="fslip-section-hd">Attendance Summary</div>
    <div class="fslip-att">
      <div class="fslip-att-cell"><div class="fslip-att-v">${r.workingDays||30}</div><div class="fslip-att-l">Work Days</div></div>
      ${isH?`
      <div class="fslip-att-cell"><div class="fslip-att-v">${r.workingHours||240}</div><div class="fslip-att-l">Sched. Hrs</div></div>
      <div class="fslip-att-cell"><div class="fslip-att-v">${r.presentHours||0}</div><div class="fslip-att-l">Present Hrs</div></div>
      <div class="fslip-att-cell"><div class="fslip-att-v">${r.unpaidUnits||0}</div><div class="fslip-att-l">Absent Hrs</div></div>
      `:`
      <div class="fslip-att-cell"><div class="fslip-att-v">${r.present||0}</div><div class="fslip-att-l">Present</div></div>
      <div class="fslip-att-cell"><div class="fslip-att-v">${r.paidLeave||0}</div><div class="fslip-att-l">Paid Leave</div></div>
      <div class="fslip-att-cell"><div class="fslip-att-v">${r.unpaidUnits||0}</div><div class="fslip-att-l">Absent (LOP)</div></div>
      `}
      <div class="fslip-att-cell"><div class="fslip-att-v">${attendPct}%</div><div class="fslip-att-l">Attendance</div></div>
    </div>
    <div class="fslip-section-hd">Earnings &amp; Deductions</div>
    <table class="fslip-ed">
      <thead><tr>
        <th colspan="2" class="fslip-earn-hd" >Earnings</th>
        <th colspan="2" class="fslip-ded-hd" >Deductions</th>
      </tr></thead>
      <tbody>${tblRows}</tbody>
      <tfoot><tr>
        <td>Total Earnings</td><td>${fmt(tp)}</td>
        <td>Total Deductions</td><td>${totalDed>0?'− '+fmt(totalDed):fmt(0)}</td>
      </tr></tfoot>
    </table>
    <div class="fslip-net" >
      <div>
        <div class="fslip-net-label">Net Payable Amount</div>
        <div class="fslip-net-words">${toWords(net)}</div>
      </div>
      <div class="fslip-net-amount">${fmt(net)}</div>
    </div>
    ${(r.totalAdvReceived||0)>0?`<div class="fslip-adv-row"><span>Total Advance Received (Outstanding)</span><span>${fmt(r.totalAdvReceived)}</span></div>`:''}
    ${r.remarks?`<div style="padding:5px 14px;font-size:10px;color:#666;background:#fffdf0;border-top:1px solid #eee;">📝 Remarks: ${r.remarks}</div>`:''}
    <div class="fslip-foot">
      <span>🏢 ${emp.org} · ${emp.branch}</span>
      <span>Computer-generated payslip. No signature required.</span>
      <span>Generated: ${PAY[sel]?.generatedOn||today()}</span>
    </div>
  </div>
  <div class="act-bar">
    <button class="btn btn-p" onclick="printPayslip()">🖨 Print Payslip</button>
    <button class="btn btn-g" onclick="exportPayslipPDF()">⬇ Save as PDF</button>
  </div>`
  :'<div class="empty"><div class="ei">📄</div><h3>No payslip data for this month</h3></div>'}`;
}

// ═══════════════════════════════════════════
//  MODAL ENGINE
// ═══════════════════════════════════════════
function mOpen(title,body,btns,wide=false){
  document.getElementById('mTitle').textContent=title;
  document.getElementById('mBody').innerHTML=body;
  document.getElementById('mBox').style.maxWidth=wide?'860px':'660px';
  document.getElementById('mFoot').innerHTML=btns.map(b=>`<button class="btn ${b.c}" onclick="${b.f}">${b.l}</button>`).join('');
  document.getElementById('mOv').classList.add('open');
}
function mClose(){ document.getElementById('mOv').classList.remove('open'); }
function mOut(e){ if(e.target===document.getElementById('mOv')) mClose(); }

// ═══════════════════════════════════════════
//  LEAVE MANAGEMENT
// ═══════════════════════════════════════════
function empLeaveBalance(empId){
  const emp=byId(empId);
  const bal=emp?.leaveBalance||{CL:12,SL:12,EL:15,ML:0,LWP:0};
  const used={};
  LEAVE_TYPES.forEach(t=>{ used[t.id]=LEAVE_APPS.filter(a=>a.empId===empId&&a.type===t.id&&a.status==='approved').reduce((s,a)=>s+(a.days||0),0); });
  return {bal,used};
}

let _leaveView='table';
let _leaveMon='';

function pgLeave(m){
  const now=new Date();
  const monOptions=[];
  for(let i=-24;i<=60;i++){
    const d=new Date(now.getFullYear(),now.getMonth()+i,1);
    const key=MONTHS_LIST[d.getMonth()].slice(0,3)+' '+d.getFullYear();
    monOptions.push(key);
  }
  let apps=[...LEAVE_APPS].sort((a,b)=>b.appliedOn?.localeCompare(a.appliedOn||'')||0);
  if(_leaveFilter!=='all') apps=apps.filter(a=>a.status===_leaveFilter);
  if(window._lvTypeF) apps=apps.filter(a=>a.type===window._lvTypeF);
  if(srchQ) apps=apps.filter(a=>{const e=byId(a.empId);return e&&(e.name.toLowerCase().includes(srchQ)||e.id.toLowerCase().includes(srchQ));});
  if(_leaveMon) apps=apps.filter(a=>{
    if(!a.fromDate) return false;
    const d=new Date(a.fromDate);
    const key=MONTHS_LIST[d.getMonth()].slice(0,3)+' '+d.getFullYear();
    return key===_leaveMon;
  });
  if(window._lvBrF) apps=apps.filter(a=>{ const e=byId(a.empId); return e?.branch===window._lvBrF; });
  if(window._lvEmpF) apps=apps.filter(a=>a.empId===window._lvEmpF);
  const allApps=[...LEAVE_APPS];
  const pending=allApps.filter(a=>a.status==='pending').length;
  const approved=allApps.filter(a=>a.status==='approved').length;
  m.innerHTML=`
  <div class="page-hd">
    <div><h1>Leave Management</h1><p>${allApps.length} total · ${pending} pending</p></div>
    <div class="pha">
      <button class="btn btn-p" onclick="openAddLeave()">+ New Application</button>
      <button class="btn btn-grn btn-sm" onclick="exportLeaveCSV()">⬇ Export CSV</button>
    </div>
  </div>
  <div class="stat-strip" style="grid-template-columns:repeat(4,1fr);">
    <div class="sc gold"><div class="sc-l">Total Applications</div><div class="sc-v">${allApps.length}</div></div>
    <div class="sc orange"><div class="sc-l">Pending</div><div class="sc-v">${pending}</div></div>
    <div class="sc green"><div class="sc-l">Approved</div><div class="sc-v">${approved}</div></div>
    <div class="sc red"><div class="sc-l">Rejected</div><div class="sc-v">${allApps.filter(a=>a.status==='rejected').length}</div></div>
  </div>
  <div class="card" style="margin-bottom:1.25rem;">
    <div class="card-h">
      <h3>Leave Balance Summary</h3>
      <div style="display:flex;gap:8px;align-items:center;">
        <select onchange="window._lvBalEmp=this.value;pgLeave(document.getElementById('hrMain'))" style="padding:5px 10px;border:1.5px solid #ddd;border-radius:var(--rs);font-size:12px;font-family:'DM Sans',sans-serif;">
          <option value="">All Employees</option>
          ${EMP.map(e=>`<option value="${e.id}" ${window._lvBalEmp===e.id?'selected':''}}>${e.name}</option>`).join('')}
        </select>
        <button class="btn btn-o btn-sm" onclick="window._lvBalHide=!window._lvBalHide;pgLeave(document.getElementById('hrMain'))" style="white-space:nowrap;">${window._lvBalHide?'👁 Show':'🙈 Hide'}</button>
      </div>
    </div>
    ${!window._lvBalHide?`<div style="padding:1rem 1.25rem;">${window._lvBalEmp?renderSingleLeaveBalance(window._lvBalEmp):renderLeaveBalanceSummary()}</div>`:`<div style="padding:8px 1.25rem;font-size:12px;color:var(--muted);">Hidden — click Show to expand.</div>`}
  </div>
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.75rem;flex-wrap:wrap;gap:8px;">
    <h3 style="font-size:14px;font-weight:700;color:var(--navy);margin:0;">Applications <span style="font-size:12px;color:var(--muted);font-weight:400;">(${apps.length} shown)</span></h3>
    <div style="display:flex;gap:6px;">
      <button class="btn btn-sm ${_leaveView==='card'?'btn-p':'btn-o'}" onclick="_leaveView='card';pgLeave(document.getElementById('hrMain'))">☰ Cards</button>
      <button class="btn btn-sm ${_leaveView==='table'?'btn-p':'btn-o'}" onclick="_leaveView='table';pgLeave(document.getElementById('hrMain'))">⊞ Table</button>
    </div>
  </div>
  <div class="filter-row" style="margin-bottom:1rem;">
    <div><label class="filter-label">Month</label>
    <select onchange="_leaveMon=this.value;pgLeave(document.getElementById('hrMain'))">
      <option value="">All Months</option>
      ${monOptions.map(mo=>`<option value="${mo}" ${_leaveMon===mo?'selected':''}}>${mo}</option>`).join('')}
    </select></div>
    <div><label class="filter-label">Status</label>
    <select onchange="_leaveFilter=this.value;pgLeave(document.getElementById('hrMain'))">
      <option value="all" ${_leaveFilter==='all'?'selected':''}>All Status</option>
      <option value="pending" ${_leaveFilter==='pending'?'selected':''}>Pending</option>
      <option value="approved" ${_leaveFilter==='approved'?'selected':''}>Approved</option>
      <option value="rejected" ${_leaveFilter==='rejected'?'selected':''}>Rejected</option>
    </select></div>
    <div><label class="filter-label">Leave Type</label>
    <select onchange="window._lvTypeF=this.value;pgLeave(document.getElementById('hrMain'))">
      <option value="">All Types</option>
      ${LEAVE_TYPES.map(t=>`<option value="${t.id}" ${window._lvTypeF===t.id?'selected':''}}>${t.emoji} ${t.label}</option>`).join('')}
    </select></div>
    <div><label class="filter-label">Branch</label>
    <select onchange="window._lvBrF=this.value;pgLeave(document.getElementById('hrMain'))">
      <option value="">All Branches</option>
      ${[...new Set(EMP.map(e=>e.branch).filter(Boolean))].map(b=>`<option value="${b}" ${window._lvBrF===b?'selected':''}>${b}</option>`).join('')}
    </select></div>
    <div><label class="filter-label">Employee</label>
    <select onchange="window._lvEmpF=this.value;pgLeave(document.getElementById('hrMain'))">
      <option value="">All Employees</option>
      ${EMP.map(e=>`<option value="${e.id}" ${window._lvEmpF===e.id?'selected':''}>${e.name}</option>`).join('')}
    </select></div>
    <div><label class="filter-label">Search</label>
    <input type="text" placeholder="Name / ID…" value="${srchQ}" oninput="srchQ=this.value.toLowerCase();pgLeave(document.getElementById('hrMain'))"/></div>
    ${(_leaveMon||_leaveFilter!=='all'||window._lvTypeF||window._lvBrF||window._lvEmpF||srchQ)?`<div style="display:flex;align-items:flex-end;"><button class="btn btn-o btn-sm" onclick="_leaveMon='';_leaveFilter='all';window._lvTypeF='';window._lvBrF='';window._lvEmpF='';srchQ='';pgLeave(document.getElementById('hrMain'))">✕ Clear</button></div>`:''}
  </div>
  ${apps.length===0
    ?`<div class="empty"><div class="ei">🏖️</div><h3>No applications found</h3></div>`
    :_leaveView==='table'?renderLeaveTable(apps):apps.map(a=>renderLeaveApp(a)).join('')}`;
}

function renderLeaveTable(apps){
  const sC={pending:'#d97706',approved:'#16a34a',rejected:'#dc2626'};
  const sBg={pending:'#fef9ee',approved:'#f0fdf4',rejected:'#fef2f2'};
  const totalDays=apps.reduce((s,a)=>s+(parseFloat(a.days)||1),0);
  return `
  <div class="rpt-tbl-wrap">
    <table class="rpt-tbl" style="font-size:12px;">
      <thead><tr>
        <th>#</th><th>Employee</th><th>Branch</th><th>Leave Type</th>
        <th>From</th><th>To</th><th style="text-align:center;">Days</th>
        <th>Reason</th><th style="text-align:center;">Status</th>
        <th>Applied On</th><th style="text-align:center;">Actions</th>
      </tr></thead>
      <tbody>
        ${apps.map((a,i)=>{
          const e=byId(a.empId);
          const ci=e?idx(a.empId):0;
          const lt=LEAVE_TYPES.find(t=>t.id===a.type)||LEAVE_TYPES[0];
          return `<tr>
            <td style="color:var(--muted);font-size:11px;">${i+1}</td>
            <td><div style="display:flex;align-items:center;gap:7px;">
              <div style="width:26px;height:26px;border-radius:50%;background:${clr(ci)}22;color:${clr(ci)};font-size:9px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;">${ini(e?.name||'?')}</div>
              <span style="font-weight:600;">${e?.name||a.empId}</span></div></td>
            <td style="font-size:11px;color:var(--muted);">${e?.branch||'—'}</td>
            <td><span style="display:inline-flex;align-items:center;gap:4px;background:${lt.color}18;color:${lt.color};padding:3px 9px;border-radius:12px;font-size:11px;font-weight:600;">${lt.emoji} ${lt.label}</span></td>
            <td style="font-size:12px;white-space:nowrap;">${a.fromDate||'—'}</td>
            <td style="font-size:12px;white-space:nowrap;">${a.toDate||'—'}</td>
            <td style="text-align:center;font-weight:700;color:var(--navy);">${a.days||1}</td>
            <td style="font-size:11px;color:var(--muted);max-width:130px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${a.reason||''}">${a.reason||'—'}</td>
            <td style="text-align:center;"><span style="font-size:10px;font-weight:700;padding:3px 10px;border-radius:20px;background:${sBg[a.status]};color:${sC[a.status]};text-transform:uppercase;letter-spacing:.06em;">${a.status}</span></td>
            <td style="font-size:11px;color:var(--muted);white-space:nowrap;">${a.appliedOn||'—'}</td>
            <td style="text-align:center;"><div style="display:flex;gap:4px;justify-content:center;">
              ${a.status==='pending'?`<button class="btn btn-grn btn-xs" onclick="updateLeaveStatus('${a.id}','approved')">✓</button><button class="btn btn-d btn-xs" onclick="updateLeaveStatus('${a.id}','rejected')">✕</button>`:''}
              <button class="btn btn-d btn-xs" onclick="deleteLeave('${a.id}')">🗑</button>
            </div></td>
          </tr>`;
        }).join('')}
      </tbody>
      <tfoot><tr>
        <td colspan="6" style="text-align:right;">TOTAL DAYS</td>
        <td style="text-align:center;">${totalDays}</td>
        <td colspan="4"></td>
      </tr></tfoot>
    </table>
  </div>`;
}


function renderLeaveBalanceSummary(){
  // Summary across all employees for the 3 main leave types
  return `<div style="overflow-x:auto;"><table class="rpt-tbl" style="min-width:500px;">
    <thead><tr><th>Employee</th>${LEAVE_TYPES.slice(0,3).map(t=>`<th>${t.emoji} ${t.label}</th>`).join('')}</tr></thead>
    <tbody>
    ${EMP.map(e=>{
      const {bal,used}=empLeaveBalance(e.id);
      const ci=idx(e.id);
      return `<tr>
        <td><div class="nc"><div class="row-av" style="background:${clr(ci)}22;color:${clr(ci)};font-size:10px;">${ini(e.name)}</div>
        <div><div class="nm">${e.name}</div><div class="ns">${e.branch}</div></div></div></td>
        ${LEAVE_TYPES.slice(0,3).map(t=>{
          const alloc=bal[t.id]||t.max;
          const usedN=used[t.id]||0;
          const rem=alloc-usedN;
          return `<td><span style="font-weight:600;color:${rem<=2?'var(--red)':'var(--navy)'};">${rem}</span><span style="color:var(--muted);font-size:11px;"> / ${alloc}</span></td>`;
        }).join('')}
      </tr>`;
    }).join('')}
    </tbody>
  </table></div>`;
}

function renderSingleLeaveBalance(empId){
  const e=byId(empId); if(!e) return '';
  const {bal,used}=empLeaveBalance(empId);
  return `<div class="leave-bal-grid" style="grid-template-columns:repeat(3,1fr);">
    ${LEAVE_TYPES.slice(0,3).map(t=>{
      const alloc=bal[t.id]||t.max;
      const usedN=used[t.id]||0;
      const rem=alloc-usedN;
      return `<div class="lb-card ${t.id.toLowerCase()}">
        <div class="lb-num" style="color:${t.color};">${rem}</div>
        <div class="lb-used">Used: ${usedN} of ${alloc}</div>
        <div class="lb-type">${t.emoji} ${t.label}</div>
      </div>`;
    }).join('')}
  </div>`;
}

function renderLeaveApp(a){
  const e=byId(a.empId);
  const ci=e?idx(a.empId):0;
  const lt=LEAVE_TYPES.find(t=>t.id===a.type)||LEAVE_TYPES[0];
  const statusColors={pending:'var(--gold)',approved:'var(--green)',rejected:'var(--red)'};
  const statusBg={pending:'#fff8e6',approved:'#e6f5ec',rejected:'#fceaea'};
  return `<div class="lv-app-item ${a.status}">
    <div class="lv-ic" style="background:${lt.color}22;">${lt.emoji}</div>
    <div class="lv-meta" style="flex:1;">
      <div class="lv-name">${e?e.name:a.empId} <span style="font-weight:400;font-size:11px;color:var(--muted);">· ${e?.branch||''}</span></div>
      <div class="lv-info">${lt.label} · ${a.fromDate||'—'} to ${a.toDate||'—'} · <span class="lv-days-badge">${a.days||1} day${(a.days||1)>1?'s':''}</span></div>
      ${a.reason?`<div style="font-size:11px;color:var(--muted);margin-top:3px;font-style:italic;">"${a.reason}"</div>`:''}
    </div>
    <div class="lv-acts">
      <div style="text-align:right;margin-bottom:6px;">
        <span style="font-size:10px;font-weight:600;padding:3px 10px;border-radius:20px;background:${statusBg[a.status]};color:${statusColors[a.status]};text-transform:uppercase;letter-spacing:.06em;">${a.status}</span>
      </div><br>
      ${a.status==='pending'?`
        <button class="btn btn-grn btn-xs" onclick="updateLeaveStatus('${a.id}','approved')">✓ Approve</button>
        <button class="btn btn-d btn-xs" onclick="updateLeaveStatus('${a.id}','rejected')">✕ Reject</button>
      `:''}
      <button class="btn btn-d btn-xs" onclick="deleteLeave('${a.id}')">🗑</button>
    </div>
  </div>`;
}

function openAddLeave(){
  const today2=new Date().toISOString().split('T')[0];
  mOpen('New Leave Application',`
    <div class="fg">
      <div class="f fi full"><label>Employee *</label>
        <select id="lv-emp"><option value="">Select…</option>${EMP.map(e=>`<option value="${e.id}">${e.name} (${e.id})</option>`).join('')}</select>
      </div>
      <div class="f fi"><label>Leave Type *</label>
        <select id="lv-type">${LEAVE_TYPES.map(t=>`<option value="${t.id}">${t.emoji} ${t.label}</option>`).join('')}</select>
      </div>
      <div class="f fi"><label>No. of Days *</label><input id="lv-days" type="number" min="0.5" step="0.5" value="1" readonly style="background:#f0e9dc;"/><div class="f-hint">Auto-calculated from dates below</div></div>
      <div class="f fi"><label>From Date *</label><input id="lv-from" type="date" value="${today2}" oninput="calcLeaveDays()"/></div>
      <div class="f fi"><label>To Date *</label><input id="lv-to" type="date" value="${today2}" oninput="calcLeaveDays()"/></div>
      <div class="f fi full"><label>Reason</label><input id="lv-reason" placeholder="Brief reason for leave…"/></div>
      <div class="f fi"><label>Status</label>
        <select id="lv-status">
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
    </div>`,
    [{l:'Cancel',c:'btn-o',f:'mClose()'},{l:'Submit Application',c:'btn-p',f:'doAddLeave()'}]);
}

function calcLeaveDays(){
  const from=document.getElementById('lv-from')?.value;
  const to=document.getElementById('lv-to')?.value;
  const dEl=document.getElementById('lv-days');
  if(!from||!to||!dEl) return;
  const d1=new Date(from), d2=new Date(to);
  if(d2<d1){ dEl.value=0; return; }
  // Calendar days inclusive
  const diff=Math.round((d2-d1)/(1000*60*60*24))+1;
  dEl.value=diff;
}

function doAddLeave(){
  const empId=document.getElementById('lv-emp').value;
  const type=document.getElementById('lv-type').value;
  const days=parseFloat(document.getElementById('lv-days').value)||1;
  const from=document.getElementById('lv-from').value;
  const to=document.getElementById('lv-to').value;
  if(!empId||!from){ toast('Select employee and dates','err'); return; }
  LEAVE_APPS.push({
    id:'LV'+Date.now(), empId, type, days, fromDate:from, toDate:to,
    reason:document.getElementById('lv-reason').value,
    status:document.getElementById('lv-status').value, appliedOn:today()
  });
  saveAll(); mClose(); toast('Leave application recorded'); pgLeave(document.getElementById('hrMain'));
}

function updateLeaveStatus(id,status){
  const a=LEAVE_APPS.find(x=>x.id===id);
  if(a){ a.status=status; saveAll(); toast('Leave '+status); pgLeave(document.getElementById('hrMain')); }
}

function deleteLeave(id){
  const idx2=LEAVE_APPS.findIndex(x=>x.id===id);
  if(idx2>=0){ LEAVE_APPS.splice(idx2,1); saveAll(); toast('Deleted'); pgLeave(document.getElementById('hrMain')); }
}

function exportLeaveCSV(){
  const rows=[['App ID','Employee','ID','Branch','Type','Days','From','To','Reason','Status','Applied On']];
  LEAVE_APPS.forEach(a=>{
    const e=byId(a.empId);
    rows.push([a.id,e?.name||a.empId,a.empId,e?.branch||'',a.type,a.days,a.fromDate,a.toDate,a.reason||'',a.status,a.appliedOn||'']);
  });
  dlCSV('leave_report.csv',rows);
}

// ═══════════════════════════════════════════
//  EXPENSES MANAGEMENT
// ═══════════════════════════════════════════
let _expView='table';
let _expMon='';

function pgExpenses(m){
  const now=new Date();
  const monOptions=[];
  for(let i=-24;i<=60;i++){
    const d=new Date(now.getFullYear(),now.getMonth()+i,1);
    monOptions.push(MONTHS_LIST[d.getMonth()].slice(0,3)+' '+d.getFullYear());
  }

  let claims=[...EXPENSE_CLAIMS].sort((a,b)=>(b.claimDate||'').localeCompare(a.claimDate||''));
  if(_expFilter!=='all') claims=claims.filter(c=>c.status===_expFilter);
  if(window._expCatF) claims=claims.filter(c=>c.category===window._expCatF);
  if(window._expEmpF) claims=claims.filter(c=>c.empId===window._expEmpF);
  if(_expMon) claims=claims.filter(c=>{
    if(!c.claimDate) return false;
    const d=new Date(c.claimDate);
    return (MONTHS_LIST[d.getMonth()].slice(0,3)+' '+d.getFullYear())===_expMon;
  });
  if(srchQ) claims=claims.filter(c=>{
    const e=byId(c.empId);
    return (e&&e.name.toLowerCase().includes(srchQ))||(c.note||'').toLowerCase().includes(srchQ)||(c.receiptRef||'').toLowerCase().includes(srchQ);
  });

  const allClaims=EXPENSE_CLAIMS;
  const totalPending=allClaims.filter(c=>c.status==='pending').reduce((s,c)=>s+(c.amount||0),0);
  const totalApproved=allClaims.filter(c=>c.status==='approved').reduce((s,c)=>s+(c.amount||0),0);
  const totalRejected=allClaims.filter(c=>c.status==='rejected').reduce((s,c)=>s+(c.amount||0),0);
  const pendingCount=allClaims.filter(c=>c.status==='pending').length;

  // Category summary
  const catSummary=EXPENSE_CATS.map(cat=>{
    const catClaims=allClaims.filter(c=>c.category===cat.id&&c.status==='approved');
    return {cat,total:catClaims.reduce((s,c)=>s+(c.amount||0),0),count:catClaims.length};
  }).filter(x=>x.total>0).sort((a,b)=>b.total-a.total);

  // Employee-wise summary (approved only)
  const empSummary=EMP.map(e=>{
    const eClaims=allClaims.filter(c=>c.empId===e.id&&c.status==='approved');
    return {e,total:eClaims.reduce((s,c)=>s+(c.amount||0),0),count:eClaims.length};
  }).filter(x=>x.total>0).sort((a,b)=>b.total-a.total).slice(0,5);

  m.innerHTML=`
  <div class="page-hd">
    <div><h1>Expense Management</h1><p>${allClaims.length} claims · ${fmt(totalPending)} pending</p></div>
    <div class="pha">
      <button class="btn btn-p" onclick="openAddExpense()">+ New Claim</button>
      ${pendingCount>0?`<button class="btn btn-grn" onclick="bulkApproveExp()">✓ Approve All Pending (${pendingCount})</button>`:''}
      <button class="btn btn-grn btn-sm" onclick="exportExpenseCSV()">⬇ CSV</button>
    </div>
  </div>

  <div class="stat-strip" style="grid-template-columns:repeat(4,1fr);">
    <div class="sc orange"><div class="sc-l">Pending</div><div class="sc-v">${fmtK(totalPending)}</div><div class="sc-s">${pendingCount} claims</div></div>
    <div class="sc green"><div class="sc-l">Approved</div><div class="sc-v">${fmtK(totalApproved)}</div></div>
    <div class="sc red"><div class="sc-l">Rejected</div><div class="sc-v">${fmtK(totalRejected)}</div></div>
    <div class="sc blue"><div class="sc-l">Total Claims</div><div class="sc-v">${allClaims.length}</div></div>
  </div>

  <!-- Category & Employee Summary -->
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.25rem;">
    <div class="card">
      <div class="card-h"><h3>📊 By Category (Approved)</h3></div>
      <div style="padding:.75rem 1rem;">
        ${catSummary.length?catSummary.map(({cat,total,count})=>`
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
            <span style="font-size:16px;">${cat.emoji}</span>
            <div style="flex:1;">
              <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:2px;">
                <span style="font-weight:600;">${cat.label}</span>
                <span style="font-family:monospace;font-weight:700;color:var(--navy);">${fmt(total)}</span>
              </div>
              <div style="background:#e5e7eb;border-radius:4px;height:5px;">
                <div style="background:var(--green);border-radius:4px;height:5px;width:${Math.round(total/Math.max(...catSummary.map(x=>x.total))*100)}%;"></div>
              </div>
              <div style="font-size:10px;color:var(--muted);margin-top:2px;">${count} claim${count>1?'s':''}</div>
            </div>
          </div>`).join('')
        :'<div style="color:var(--muted);font-size:12px;padding:8px 0;">No approved expenses yet</div>'}
      </div>
    </div>
    <div class="card">
      <div class="card-h"><h3>👤 Top Claimants (Approved)</h3></div>
      <div style="padding:.75rem 1rem;">
        ${empSummary.length?empSummary.map(({e,total,count},i)=>{
          const ci=idx(e.id);
          return `<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
            <div style="width:26px;height:26px;border-radius:50%;background:${clr(ci)}22;color:${clr(ci)};font-size:9px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;">${ini(e.name)}</div>
            <div style="flex:1;">
              <div style="display:flex;justify-content:space-between;font-size:12px;">
                <span style="font-weight:600;">${e.name}</span>
                <span style="font-family:monospace;font-weight:700;color:var(--navy);">${fmt(total)}</span>
              </div>
              <div style="font-size:10px;color:var(--muted);">${count} claim${count>1?'s':''} · ${e.branch}</div>
            </div>
          </div>`;
        }).join('')
        :'<div style="color:var(--muted);font-size:12px;padding:8px 0;">No approved expenses yet</div>'}
      </div>
    </div>
  </div>

  <!-- Filters -->
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.75rem;flex-wrap:wrap;gap:8px;">
    <h3 style="font-size:14px;font-weight:700;color:var(--navy);margin:0;">Claims <span style="font-size:12px;color:var(--muted);font-weight:400;">(${claims.length} shown)</span></h3>
    <div style="display:flex;gap:6px;">
      <button class="btn btn-sm ${_expView==='card'?'btn-p':'btn-o'}" onclick="_expView='card';pgExpenses(document.getElementById('hrMain'))">☰ Cards</button>
      <button class="btn btn-sm ${_expView==='table'?'btn-p':'btn-o'}" onclick="_expView='table';pgExpenses(document.getElementById('hrMain'))">⊞ Table</button>
    </div>
  </div>
  <div class="filter-row" style="margin-bottom:1rem;">
    <div><label class="filter-label">Month</label>
    <select onchange="_expMon=this.value;pgExpenses(document.getElementById('hrMain'))">
      <option value="">All Months</option>
      ${monOptions.map(mo=>`<option value="${mo}" ${_expMon===mo?'selected':''}>${mo}</option>`).join('')}
    </select></div>
    <div><label class="filter-label">Status</label>
    <select onchange="_expFilter=this.value;pgExpenses(document.getElementById('hrMain'))">
      <option value="all" ${_expFilter==='all'?'selected':''}>All Status</option>
      <option value="pending" ${_expFilter==='pending'?'selected':''}>Pending</option>
      <option value="approved" ${_expFilter==='approved'?'selected':''}>Approved</option>
      <option value="rejected" ${_expFilter==='rejected'?'selected':''}>Rejected</option>
    </select></div>
    <div><label class="filter-label">Category</label>
    <select onchange="window._expCatF=this.value;pgExpenses(document.getElementById('hrMain'))">
      <option value="">All Categories</option>
      ${EXPENSE_CATS.map(c=>`<option value="${c.id}" ${window._expCatF===c.id?'selected':''}>${c.emoji} ${c.label}</option>`).join('')}
    </select></div>
    <div><label class="filter-label">Employee</label>
    <select onchange="window._expEmpF=this.value;pgExpenses(document.getElementById('hrMain'))">
      <option value="">All Employees</option>
      ${EMP.map(e=>`<option value="${e.id}" ${window._expEmpF===e.id?'selected':''}>${e.name}</option>`).join('')}
    </select></div>
    <div><label class="filter-label">Search</label>
    <input type="text" placeholder="Note / ref…" value="${srchQ}" oninput="srchQ=this.value.toLowerCase();pgExpenses(document.getElementById('hrMain'))"/></div>
    ${(_expMon||_expFilter!=='all'||window._expCatF||window._expEmpF||srchQ)?`<div style="display:flex;align-items:flex-end;"><button class="btn btn-o btn-sm" onclick="_expMon='';_expFilter='all';window._expCatF='';window._expEmpF='';srchQ='';pgExpenses(document.getElementById('hrMain'))">✕ Clear</button></div>`:''}
  </div>

  ${claims.length===0
    ?'<div class="empty"><div class="ei">💸</div><h3>No expense claims found</h3></div>'
    :_expView==='table' ? renderExpTable(claims) : claims.map(c=>renderExpenseItem(c)).join('')}`;
}

function bulkApproveExp(){
  const pending=EXPENSE_CLAIMS.filter(c=>c.status==='pending');
  if(!pending.length){ toast('No pending claims','err'); return; }
  if(!confirm(`Approve all ${pending.length} pending expense claims?\nTotal: ${fmt(pending.reduce((s,c)=>s+(c.amount||0),0))}`)) return;
  pending.forEach(c=>{
    c.status='approved';
    c.approvedOn=today();
    pushExpToAttData(c);
  });
  save();
  toast(`✅ ${pending.length} claims approved — amounts added to respective payroll months`);
  pgExpenses(document.getElementById('hrMain'));
}

function renderExpTable(claims){
  const sC={pending:'#d97706',approved:'#16a34a',rejected:'#dc2626'};
  const sBg={pending:'#fef9ee',approved:'#f0fdf4',rejected:'#fef2f2'};
  const totAmt=claims.reduce((s,c)=>s+(c.amount||0),0);
  const totApproved=claims.filter(c=>c.status==='approved').reduce((s,c)=>s+(c.amount||0),0);
  const totPending=claims.filter(c=>c.status==='pending').reduce((s,c)=>s+(c.amount||0),0);
  return `
  <div class="rpt-tbl-wrap">
    <table class="rpt-tbl" style="font-size:12px;">
      <thead><tr>
        <th>#</th>
        <th>Employee</th>
        <th>Branch</th>
        <th>Category</th>
        <th>Date</th>
        <th style="text-align:right;">Amount</th>
        <th>Description</th>
        <th>Receipt Ref</th>
        <th>Payroll Month</th>
        <th style="text-align:center;">Status</th>
        <th>Added On</th>
        <th style="text-align:center;">Actions</th>
      </tr></thead>
      <tbody>
        ${claims.map((c,i)=>{
          const e=byId(c.empId);
          const ci=e?idx(c.empId):0;
          const cat=EXPENSE_CATS.find(x=>x.id===c.category)||EXPENSE_CATS[6];
          return `<tr>
            <td style="color:var(--muted);font-size:11px;">${i+1}</td>
            <td>
              <div style="display:flex;align-items:center;gap:7px;">
                <div style="width:26px;height:26px;border-radius:50%;background:${clr(ci)}22;color:${clr(ci)};font-size:9px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;">${ini(e?.name||'?')}</div>
                <span style="font-weight:600;">${e?.name||c.empId}</span>
              </div>
            </td>
            <td style="font-size:11px;color:var(--muted);">${e?.branch||'—'}</td>
            <td><span style="display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:600;color:#444;">${cat.emoji} ${cat.label}</span></td>
            <td style="font-size:12px;white-space:nowrap;">${c.claimDate||'—'}</td>
            <td style="text-align:right;font-family:monospace;font-weight:700;font-size:13px;color:var(--navy);">${fmt(c.amount||0)}</td>
            <td style="font-size:11px;color:var(--muted);max-width:150px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${c.note||''}">${c.note||'—'}</td>
            <td style="font-size:11px;color:var(--blue);">${c.receiptRef?'📎 '+c.receiptRef:'—'}</td>
            <td style="font-size:11px;font-weight:600;color:${c.payrollMonth?'var(--purple)':'var(--muted)'};">${c.payrollMonth||'—'}</td>
            <td style="text-align:center;"><span style="font-size:10px;font-weight:700;padding:3px 10px;border-radius:20px;background:${sBg[c.status]};color:${sC[c.status]};text-transform:uppercase;letter-spacing:.06em;">${c.status}</span></td>
            <td style="font-size:11px;color:var(--muted);white-space:nowrap;">${c.addedOn||'—'}</td>
            <td style="text-align:center;">
              <div style="display:flex;gap:4px;justify-content:center;">
                ${c.status==='pending'?`
                  <button class="btn btn-grn btn-xs" onclick="updateExpStatus('${c.id}','approved');pgExpenses(document.getElementById('hrMain'))">✓</button>
                  <button class="btn btn-d btn-xs" onclick="updateExpStatus('${c.id}','rejected');pgExpenses(document.getElementById('hrMain'))">✕</button>`:''}
                <button class="btn btn-d btn-xs" onclick="deleteExp('${c.id}')">🗑</button>
              </div>
            </td>
          </tr>`;
        }).join('')}
      </tbody>
      <tfoot><tr>
        <td colspan="5" style="text-align:right;">TOTAL (${claims.length})</td>
        <td style="text-align:right;font-family:monospace;font-weight:700;">${fmt(totAmt)}</td>
        <td colspan="3" style="font-size:11px;color:var(--muted);">✓ ${fmt(totApproved)} approved &nbsp;|&nbsp; ⏳ ${fmt(totPending)} pending</td>
        <td colspan="3"></td>
      </tr></tfoot>
    </table>
  </div>`;
}

function renderExpenseItem(c){
  const e=byId(c.empId);
  const ci=e?idx(c.empId):0;
  const cat=EXPENSE_CATS.find(x=>x.id===c.category)||EXPENSE_CATS[6];
  const statusColors={pending:'var(--gold)',approved:'var(--green)',rejected:'var(--red)'};
  const statusBg={pending:'#fff3cc',approved:'#e6f5ec',rejected:'#fceaea'};
  return `<div class="exp-item ${c.status}">
    <div class="exp-cat-dot" style="background:${statusBg[c.status]};">${cat.emoji}</div>
    <div style="flex:1;">
      <div style="font-weight:600;font-size:13px;color:var(--navy);">${e?e.name:c.empId} <span style="font-weight:400;font-size:11px;color:var(--muted);">· ${cat.label}</span></div>
      <div style="font-size:11px;color:var(--muted);margin-top:3px;">${c.claimDate||'—'} · ${c.note||'No description'}</div>
      ${c.receiptRef?`<div style="font-size:10px;color:var(--blue);margin-top:2px;">📎 Ref: ${c.receiptRef}</div>`:''}
    </div>
    <div style="text-align:right;margin-right:10px;">
      <div class="exp-amt ${c.status}">${fmt(c.amount||0)}</div>
      <div style="font-size:10px;margin-top:4px;padding:2px 8px;border-radius:20px;background:${statusBg[c.status]};color:${statusColors[c.status]};font-weight:600;text-transform:uppercase;letter-spacing:.06em;">${c.status}</div>
    </div>
    <div style="display:flex;flex-direction:column;gap:5px;">
      ${c.status==='pending'?`
        <button class="btn btn-grn btn-xs" onclick="updateExpStatus('${c.id}','approved')">✓ Approve</button>
        <button class="btn btn-d btn-xs" onclick="updateExpStatus('${c.id}','rejected')">✕ Reject</button>
      `:''}
      <button class="btn btn-d btn-xs" onclick="deleteExp('${c.id}')">🗑</button>
    </div>
  </div>`;
}

function openAddExpense(){
  const today2=new Date().toISOString().split('T')[0];
  const now=new Date();
  const monOptions=[];
  for(let i=-6;i<=6;i++){
    const d=new Date(now.getFullYear(),now.getMonth()+i,1);
    monOptions.push(MONTHS_LIST[d.getMonth()].slice(0,3)+' '+d.getFullYear());
  }
  const curMon=MONTHS_LIST[now.getMonth()].slice(0,3)+' '+now.getFullYear();
  mOpen('New Expense Claim',`
    <div class="fg">
      <div class="f fi full"><label>Employee *</label>
        <select id="ex-emp"><option value="">Select…</option>${EMP.map(e=>`<option value="${e.id}">${e.name} (${e.id})</option>`).join('')}</select>
      </div>
      <div class="f fi"><label>Category *</label>
        <select id="ex-cat">${EXPENSE_CATS.map(c=>`<option value="${c.id}">${c.emoji} ${c.label}</option>`).join('')}</select>
      </div>
      <div class="f fi"><label>Amount (₹) *</label><input id="ex-amt" type="number" placeholder="500"/></div>
      <div class="f fi"><label>Claim Date *</label><input id="ex-date" type="date" value="${today2}"/></div>
      <div class="f fi"><label>Add to Payroll Month *</label>
        <select id="ex-paymon">
          ${monOptions.map(mo=>`<option value="${mo}" ${mo===curMon?'selected':''}>${mo}</option>`).join('')}
        </select>
      </div>
      <div class="f fi"><label>Receipt / Ref No.</label><input id="ex-ref" placeholder="Bill no., receipt no."/></div>
      <div class="f fi full"><label>Description *</label><input id="ex-note" placeholder="Brief description of expense…"/></div>
      <div class="f fi"><label>Status</label>
        <select id="ex-status">
          <option value="pending">Pending — approve later</option>
          <option value="approved">Approved — add to payroll now</option>
        </select>
      </div>
      <div class="full">
        <div class="banner bn-info">💡 When <strong>Approved</strong>, the amount is auto-added to the employee's <strong>Other Expenses</strong> in Attendance Entry for the selected payroll month.</div>
      </div>
    </div>`,
    [{l:'Cancel',c:'btn-o',f:'mClose()'},{l:'Submit Claim',c:'btn-p',f:'doAddExpense()'}]);
}

function doAddExpense(){
  const empId=document.getElementById('ex-emp').value;
  const amt=parseFloat(document.getElementById('ex-amt').value)||0;
  if(!empId||!amt){ toast('Select employee and amount','err'); return; }
  const status=document.getElementById('ex-status').value;
  const payMon=document.getElementById('ex-paymon').value;
  const claim={
    id:'EX'+Date.now(), empId,
    category:document.getElementById('ex-cat').value,
    amount:amt,
    claimDate:document.getElementById('ex-date').value,
    payrollMonth:payMon,
    receiptRef:document.getElementById('ex-ref').value,
    note:document.getElementById('ex-note').value,
    status, addedOn:today()
  };
  EXPENSE_CLAIMS.push(claim);
  if(status==='approved') pushExpToAttData(claim);
  saveAll(); mClose(); toast('Expense claim recorded');
  pgExpenses(document.getElementById('hrMain'));
}

function pushExpToAttData(claim){
  // Add approved expense amount to ATT_DATA otherExpenses for that employee+month
  const mon=claim.payrollMonth||'';
  if(!mon||!claim.empId) return;
  if(!ATT_DATA[mon]) ATT_DATA[mon]={};
  if(!ATT_DATA[mon][claim.empId]) ATT_DATA[mon][claim.empId]={};
  const prev=ATT_DATA[mon][claim.empId].otherExpenses||0;
  ATT_DATA[mon][claim.empId].otherExpenses=prev+(claim.amount||0);
  // Save ATT_DATA
  try{ localStorage.setItem('tatti_att_v1',JSON.stringify(ATT_DATA)); }catch(e){}
}

function updateExpStatus(id,status){
  const c=EXPENSE_CLAIMS.find(x=>x.id===id);
  if(!c) return;
  const wasApproved=c.status==='approved';
  c.status=status;
  if(status==='approved' && !wasApproved){
    // Push to ATT_DATA
    pushExpToAttData(c);
    toast(`✅ Approved — ₹${fmt(c.amount)} added to ${c.payrollMonth||'payroll'} for ${byId(c.empId)?.name}`);
  } else if(status==='rejected' && wasApproved){
    // Reverse from ATT_DATA
    const mon=c.payrollMonth||'';
    if(mon&&ATT_DATA[mon]?.[c.empId]){
      ATT_DATA[mon][c.empId].otherExpenses=Math.max(0,(ATT_DATA[mon][c.empId].otherExpenses||0)-(c.amount||0));
      try{ localStorage.setItem('tatti_att_v1',JSON.stringify(ATT_DATA)); }catch(e){}
    }
    toast('Expense rejected — removed from payroll');
  } else {
    toast('Expense '+status);
  }
  saveAll();
  pgExpenses(document.getElementById('hrMain'));
}
function deleteExp(id){
  const i=EXPENSE_CLAIMS.findIndex(x=>x.id===id);
  if(i<0) return;
  const c=EXPENSE_CLAIMS[i];
  // If approved, reverse the amount from ATT_DATA
  if(c.status==='approved' && c.payrollMonth && c.empId){
    const mon=c.payrollMonth;
    if(ATT_DATA[mon]?.[c.empId]){
      ATT_DATA[mon][c.empId].otherExpenses=Math.max(0,(ATT_DATA[mon][c.empId].otherExpenses||0)-(c.amount||0));
      try{ localStorage.setItem('tatti_att_v1',JSON.stringify(ATT_DATA)); }catch(e){}
    }
  }
  EXPENSE_CLAIMS.splice(i,1);
  saveAll();
  toast('Expense deleted — removed from payroll');
  pgExpenses(document.getElementById('hrMain'));
}
function exportExpenseCSV(){
  const rows=[['Claim ID','Employee','ID','Branch','Category','Amount','Date','Description','Receipt Ref','Status','Added On']];
  EXPENSE_CLAIMS.forEach(c=>{
    const e=byId(c.empId);
    const cat=EXPENSE_CATS.find(x=>x.id===c.category)||{label:c.category};
    rows.push([c.id,e?.name||c.empId,c.empId,e?.branch||'',cat.label,c.amount,c.claimDate,c.note||'',c.receiptRef||'',c.status,c.addedOn||'']);
  });
  dlCSV('expenses_report.csv',rows);
}

// ═══════════════════════════════════════════
//  INCREMENTS MANAGEMENT (full page)
// ═══════════════════════════════════════════
let _incView='table';

function pgIncrements(m){
  const allFiltered=EMP.filter(e=>{
    if(window._incBrF&&e.branch!==window._incBrF) return false;
    if(window._incBatF&&e.salaryBatch!==window._incBatF) return false;
    if(srchQ&&!e.name.toLowerCase().includes(srchQ)&&!e.branch.toLowerCase().includes(srchQ)&&!e.id.toLowerCase().includes(srchQ)) return false;
    return true;
  });
  const totalGross=EMP.reduce((s,e)=>s+(e.gross||0),0);
  const withHist=EMP.filter(e=>(e.salaryHistory||[]).length>0).length;

  m.innerHTML=`
  <div class="page-hd">
    <div><h1>Increment Management</h1><p>${EMP.length} employees · ${withHist} with salary history</p></div>
    <div class="pha">
      <button class="btn btn-grn btn-sm" onclick="exportIncrementCSV()">⬇ Export CSV</button>
    </div>
  </div>
  <div class="stat-strip" style="grid-template-columns:repeat(3,1fr);">
    <div class="sc gold"><div class="sc-l">Total Employees</div><div class="sc-v">${EMP.length}</div></div>
    <div class="sc green"><div class="sc-l">Total Gross Payroll</div><div class="sc-v">${fmtK(totalGross)}</div><div class="sc-s">per month</div></div>
    <div class="sc purple"><div class="sc-l">Avg Gross Salary</div><div class="sc-v">${EMP.length?fmtK(Math.round(totalGross/EMP.length)):fmt(0)}</div></div>
  </div>
  <div class="filter-row">
    <div><label class="filter-label">Branch</label>
    <select onchange="window._incBrF=this.value;pgIncrements(document.getElementById('hrMain'))">
      <option value="">All Branches</option>
      ${[...new Set(EMP.map(e=>e.branch))].map(b=>`<option value="${b}" ${window._incBrF===b?'selected':''}>${b}</option>`).join('')}
    </select></div>
    <div><label class="filter-label">Batch</label>
    <select onchange="window._incBatF=this.value;pgIncrements(document.getElementById('hrMain'))">
      <option value="">All Batches</option>
      <option value="B1" ${window._incBatF==='B1'?'selected':''}>Batch 1 (B1)</option>
      <option value="B2" ${window._incBatF==='B2'?'selected':''}>Batch 2 (B2)</option>
    </select></div>
    <div><label class="filter-label">Search</label>
    <input type="text" placeholder="Name / ID / branch…" value="${srchQ}" oninput="srchQ=this.value.toLowerCase();pgIncrements(document.getElementById('hrMain'))"/></div>
    <div style="margin-left:auto;display:flex;gap:6px;">
      <button class="btn btn-sm ${_incView==='card'?'btn-p':'btn-o'}" onclick="_incView='card';pgIncrements(document.getElementById('hrMain'))">☰ Cards</button>
      <button class="btn btn-sm ${_incView==='table'?'btn-p':'btn-o'}" onclick="_incView='table';pgIncrements(document.getElementById('hrMain'))">⊞ Table</button>
    </div>
  </div>
  ${_incView==='table' ? renderIncTable(allFiltered) : renderIncCards(allFiltered)}`;
}

function renderIncTable(fl){
  if(!fl.length) return `<div class="empty"><div class="ei">🔍</div><h3>No employees found</h3></div>`;
  const totGross=fl.reduce((s,e)=>s+(e.gross||0),0);
  const totTA=fl.reduce((s,e)=>s+(e.travellingAllowance||0),0);
  const totTotal=fl.reduce((s,e)=>s+(e.gross||0)+(e.travellingAllowance||0)+(e.otherConveyance||0)+(e.telephoneExpenses||0)+(e.otherExpenses||0),0);
  return `
  <div class="rpt-tbl-wrap" style="margin-top:.5rem;">
    <table class="rpt-tbl" style="font-size:12px;">
      <thead>
        <tr>
          <th>#</th>
          <th>Employee</th>
          <th>ID</th>
          <th>Branch</th>
          <th>Batch</th>
          <th>Designation</th>
          <th style="text-align:right;">Gross / Rate</th>
          <th style="text-align:right;">Allowances</th>
          <th style="text-align:right;">Total Monthly</th>
          <th>Last Increment</th>
          <th>Salary History</th>
          <th style="text-align:center;">Action</th>
        </tr>
      </thead>
      <tbody>
        ${fl.map((e,i)=>{
          const ci=idx(e.id);
          const hist=(e.salaryHistory||[]).slice().reverse();
          const lastH=hist[0];
          const totalPay=(e.gross||0)+(e.travellingAllowance||0)+(e.otherConveyance||0)+(e.telephoneExpenses||0)+(e.otherExpenses||0);
          const isH=e.salaryBasis==='hours', isPD=e.salaryBasis==='perday';
          const basisLabel=isH?'⏱/hr':isPD?'💰/day':'📅/mo';
          const hasInc=hist.length>0;
          const incPct=lastH?.pct?`+${lastH.pct}%`:'';
          return `<tr style="cursor:pointer;" onclick="openIncrement('${e.id}')">
            <td style="color:var(--muted);font-size:11px;">${i+1}</td>
            <td>
              <div style="display:flex;align-items:center;gap:7px;">
                <div style="width:28px;height:28px;border-radius:50%;background:${clr(ci)}22;color:${clr(ci)};font-size:9px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;">${ini(e.name)}</div>
                <span style="font-weight:600;">${e.name}</span>
              </div>
            </td>
            <td style="font-family:monospace;font-size:11px;color:var(--muted);">${e.id}</td>
            <td style="font-size:11px;">${e.branch}</td>
            <td><span class="type-chip ${e.salaryBatch==='B1'?'chip-b1':'chip-b2'}" style="font-size:9px;">${e.salaryBatch}</span></td>
            <td style="font-size:11px;color:var(--muted);">${e.designation||'Staff'}</td>
            <td style="text-align:right;">
              <span style="font-family:monospace;font-weight:700;color:var(--navy);">${fmt(e.gross||0)}</span>
              <span style="font-size:10px;color:var(--muted);margin-left:4px;">${basisLabel}</span>
            </td>
            <td style="text-align:right;font-family:monospace;color:var(--muted);">
              ${(e.travellingAllowance||0)+(e.otherConveyance||0)+(e.telephoneExpenses||0)+(e.otherExpenses||0)>0
                ? fmt((e.travellingAllowance||0)+(e.otherConveyance||0)+(e.telephoneExpenses||0)+(e.otherExpenses||0))
                : '—'}
            </td>
            <td style="text-align:right;font-family:monospace;font-weight:700;color:var(--green);">${fmt(totalPay)}</td>
            <td style="font-size:11px;">
              ${lastH
                ? `<div style="color:var(--muted);">${lastH.fromMonth}</div>
                   ${incPct?`<div style="color:var(--green);font-weight:700;font-size:10px;">${incPct}</div>`:''}`
                : `<span style="color:var(--muted);font-size:11px;">—</span>`}
              ${e.lastIncrement?`<div style="font-size:10px;color:var(--muted);">${e.lastIncrement}</div>`:''}
            </td>
            <td>
              ${hasInc
                ? `<div style="display:flex;flex-direction:column;gap:2px;">
                    ${hist.slice(0,3).map(h=>`
                      <div style="display:flex;align-items:center;gap:5px;font-size:10px;">
                        <span style="color:var(--muted);min-width:60px;">${h.fromMonth}</span>
                        <span style="color:var(--muted);">→</span>
                        <span style="font-family:monospace;font-weight:600;color:var(--navy);">${fmt(h.revised||e.gross)}</span>
                        ${h.pct?`<span style="color:var(--green);font-weight:700;">+${h.pct}%</span>`:''}
                      </div>`).join('')}
                    ${hist.length>3?`<div style="font-size:10px;color:var(--muted);">+${hist.length-3} more</div>`:''}
                  </div>`
                : `<span style="color:var(--muted);font-size:11px;">No history</span>`}
            </td>
            <td style="text-align:center;">
              <div style="display:flex;gap:4px;justify-content:center;flex-wrap:wrap;">
                <button class="btn btn-pu btn-xs" onclick="event.stopPropagation();openIncrement('${e.id}')">📈 Revise</button>
                ${hasInc?`<button class="btn btn-o btn-xs" onclick="event.stopPropagation();viewIncHistory('${e.id}')">📋 History</button>`:''}
              </div>
            </td>
          </tr>`;
        }).join('')}
      </tbody>
      <tfoot>
        <tr>
          <td colspan="6" style="text-align:right;font-weight:700;">TOTAL (${fl.length} employees)</td>
          <td style="text-align:right;font-weight:700;font-family:monospace;">${fmt(totGross)}</td>
          <td style="text-align:right;font-weight:700;font-family:monospace;">${fmt(totTA)}</td>
          <td style="text-align:right;font-weight:700;font-family:monospace;color:var(--green);">${fmt(totTotal)}</td>
          <td colspan="3"></td>
        </tr>
      </tfoot>
    </table>
  </div>`;
}

function renderIncCards(fl){
  if(!fl.length) return `<div class="empty"><div class="ei">🔍</div><h3>No employees found</h3></div>`;
  return fl.map(e=>{
    const ci=idx(e.id);
    const hist=(e.salaryHistory||[]).slice().reverse().slice(0,2);
    const lastH=hist[0];
    const pct=lastH&&lastH.pct?`+${lastH.pct}%`:'—';
    return `<div class="inc-page-item" onclick="openIncrement('${e.id}')">
      <div class="row-av" style="background:${clr(ci)}22;color:${clr(ci)};width:40px;height:40px;font-size:12px;">${ini(e.name)}</div>
      <div style="flex:1;">
        <div style="font-weight:600;font-size:13px;color:var(--navy);">${e.name}</div>
        <div style="font-size:11px;color:var(--muted);">${e.id} · ${e.branch} · ${batchLabel(e.salaryBatch)} · ${e.designation||'Staff'}</div>
        ${lastH?`<div class="inc-hist-chip">Last: ${lastH.fromMonth} · ${pct}</div>`:''}
      </div>
      <div style="text-align:right;">
        ${lastH&&lastH.basic!==lastH.revised?`<div class="inc-sal-flow">
          <span class="inc-sal-old">${fmt(lastH.basic)}</span>
          <span class="inc-sal-arrow">→</span>
          <span class="inc-sal-new">${fmt(e.gross)}</span>
        </div>`:`<div class="inc-sal-new" style="font-size:18px;">${fmt(e.gross)}</div>`}
        <div style="font-size:10px;color:var(--muted);margin-top:3px;">Last increment: ${e.lastIncrement||'—'}</div>
      </div>
      <button class="btn btn-pu btn-sm" onclick="event.stopPropagation();openIncrement('${e.id}')">📈 Revise</button>
    </div>`;
  }).join('');
}

function exportIncrementCSV(){
  const rows=[['ID','Name','Branch','Org','Batch','Gross','TA','Last Increment','Increment History']];
  EMP.forEach(e=>{
    const hist=(e.salaryHistory||[]).map(h=>`${h.fromMonth}:${h.revised}`).join('|');
    rows.push([e.id,e.name,e.branch,e.org,e.salaryBatch,e.gross,e.travellingAllowance||0,e.lastIncrement||'',hist]);
  });
  dlCSV('increments_report.csv',rows);
}

// ═══════════════════════════════════════════
//  ADVANCES MANAGEMENT (full page)
// ═══════════════════════════════════════════
let _advView='table';

function pgAdvances(m){
  const totalBalance=EMP.reduce((s,e)=>s+(e.advanceBalance||0),0);
  const withBalance=EMP.filter(e=>(e.advanceBalance||0)>0);
  let fl=srchQ?EMP.filter(e=>e.name.toLowerCase().includes(srchQ)||e.id.toLowerCase().includes(srchQ)):[...EMP];
  if(window._advBrF) fl=fl.filter(e=>e.branch===window._advBrF);
  if(window._advShowF==='owing') fl=fl.filter(e=>(e.advanceBalance||0)>0);
  if(window._advShowF==='clear') fl=fl.filter(e=>(e.advanceBalance||0)<=0);
  fl.sort((a,b)=>(b.advanceBalance||0)-(a.advanceBalance||0));

  m.innerHTML=`
  <div class="page-hd">
    <div><h1>Advance Management</h1><p>${withBalance.length} employees with outstanding advances</p></div>
    <div class="pha">
      <button class="btn btn-grn btn-sm" onclick="exportAdvanceCSV()">⬇ Export CSV</button>
    </div>
  </div>
  <div class="stat-strip" style="grid-template-columns:repeat(3,1fr);">
    <div class="sc red"><div class="sc-l">Total Outstanding</div><div class="sc-v">${fmtK(totalBalance)}</div><div class="sc-s">across ${withBalance.length} employees</div></div>
    <div class="sc green"><div class="sc-l">Clear Balance</div><div class="sc-v">${EMP.length-withBalance.length}</div><div class="sc-s">employees</div></div>
    <div class="sc orange"><div class="sc-l">Total Employees</div><div class="sc-v">${EMP.length}</div></div>
  </div>
  <div class="filter-row" style="margin-bottom:1rem;">
    <div><label class="filter-label">Show</label>
    <select onchange="window._advShowF=this.value;pgAdvances(document.getElementById('hrMain'))">
      <option value="all" ${!window._advShowF||window._advShowF==='all'?'selected':''}>All Employees</option>
      <option value="owing" ${window._advShowF==='owing'?'selected':''}>With Balance</option>
      <option value="clear" ${window._advShowF==='clear'?'selected':''}>No Balance</option>
    </select></div>
    <div><label class="filter-label">Branch</label>
    <select onchange="window._advBrF=this.value;pgAdvances(document.getElementById('hrMain'))">
      <option value="">All Branches</option>
      ${[...new Set(EMP.map(e=>e.branch))].map(b=>`<option value="${b}" ${window._advBrF===b?'selected':''}>${b}</option>`).join('')}
    </select></div>
    <div><label class="filter-label">Search</label>
    <input type="text" placeholder="Name / ID…" value="${srchQ}" oninput="srchQ=this.value.toLowerCase();pgAdvances(document.getElementById('hrMain'))"/></div>
    <div style="display:flex;align-items:flex-end;gap:6px;margin-left:auto;">
      <button class="btn btn-sm ${_advView==='card'?'btn-p':'btn-o'}" onclick="_advView='card';pgAdvances(document.getElementById('hrMain'))">☰ Cards</button>
      <button class="btn btn-sm ${_advView==='table'?'btn-p':'btn-o'}" onclick="_advView='table';pgAdvances(document.getElementById('hrMain'))">⊞ Table</button>
    </div>
  </div>
  ${fl.length===0
    ?`<div class="empty"><div class="ei">💳</div><h3>No employees found</h3></div>`
    :_advView==='table' ? renderAdvTable(fl) : renderAdvCards(fl)}`;
}

function renderAdvTable(fl){
  const totBal=fl.reduce((s,e)=>s+(e.advanceBalance||0),0);
  const totGiven=fl.reduce((s,e)=>s+(e.advanceHistory||[]).filter(h=>h.type==='given').reduce((x,h)=>x+(h.amount||0),0),0);
  const totDed=fl.reduce((s,e)=>s+(e.advanceHistory||[]).filter(h=>h.type==='deducted').reduce((x,h)=>x+(h.amount||0),0),0);
  return `
  <div class="rpt-tbl-wrap">
    <table class="rpt-tbl" style="font-size:12px;">
      <thead><tr>
        <th>#</th>
        <th>Employee</th>
        <th>ID</th>
        <th>Branch</th>
        <th style="text-align:right;">Total Given</th>
        <th style="text-align:right;">Total Deducted</th>
        <th style="text-align:right;">Outstanding Balance</th>
        <th>Last Transaction</th>
        <th>Transactions</th>
        <th style="text-align:center;">Action</th>
      </tr></thead>
      <tbody>
        ${fl.map((e,i)=>{
          const ci=idx(e.id);
          const bal=e.advanceBalance||0;
          const hist=(e.advanceHistory||[]);
          const given=hist.filter(h=>h.type==='given').reduce((s,h)=>s+(h.amount||0),0);
          const deducted=hist.filter(h=>h.type==='deducted').reduce((s,h)=>s+(h.amount||0),0);
          const lastH=[...hist].reverse()[0];
          const recentHist=[...hist].reverse().slice(0,3);
          return `<tr>
            <td style="color:var(--muted);font-size:11px;">${i+1}</td>
            <td>
              <div style="display:flex;align-items:center;gap:7px;">
                <div style="width:28px;height:28px;border-radius:50%;background:${clr(ci)}22;color:${clr(ci)};font-size:9px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;">${ini(e.name)}</div>
                <span style="font-weight:600;">${e.name}</span>
              </div>
            </td>
            <td style="font-family:monospace;font-size:11px;color:var(--muted);">${e.id}</td>
            <td style="font-size:11px;">${e.branch}</td>
            <td style="text-align:right;font-family:monospace;color:var(--red);font-weight:600;">${given>0?fmt(given):'—'}</td>
            <td style="text-align:right;font-family:monospace;color:var(--green);font-weight:600;">${deducted>0?fmt(deducted):'—'}</td>
            <td style="text-align:right;">
              <span style="font-family:monospace;font-weight:800;font-size:13px;color:${bal>0?'#dc2626':'#16a34a'};">${fmt(bal)}</span>
              <div style="font-size:9px;color:var(--muted);margin-top:2px;">${bal>0?'⚠ Outstanding':'✓ Clear'}</div>
            </td>
            <td style="font-size:11px;">
              ${lastH?`<div style="color:${lastH.type==='given'?'var(--red)':'var(--green)'}; font-weight:600;">${lastH.type==='given'?'▲ Given':'▼ Deducted'} ${fmt(lastH.amount)}</div>
              <div style="font-size:10px;color:var(--muted);">${lastH.date||'—'} ${lastH.note?'· '+lastH.note:''}</div>`
              :'<span style="color:var(--muted);">No history</span>'}
            </td>
            <td style="font-size:11px;">
              ${recentHist.length?`<div style="display:flex;flex-direction:column;gap:2px;">
                ${recentHist.map(h=>`<div style="display:flex;align-items:center;gap:5px;font-size:10px;">
                  <span style="color:${h.type==='given'?'var(--red)':'var(--green)'};font-weight:700;min-width:14px;">${h.type==='given'?'▲':'▼'}</span>
                  <span style="font-family:monospace;font-weight:600;">${fmt(h.amount)}</span>
                  <span style="color:var(--muted);">${h.date||''}</span>
                </div>`).join('')}
                ${hist.length>3?`<div style="font-size:10px;color:var(--muted);">+${hist.length-3} more</div>`:''}
              </div>`:'<span style="color:var(--muted);">—</span>'}
            </td>
            <td style="text-align:center;">
              <button class="btn btn-or btn-xs" onclick="openAdvance('${e.id}')">💳 Manage</button>
            </td>
          </tr>`;
        }).join('')}
      </tbody>
      <tfoot><tr>
        <td colspan="4" style="text-align:right;">TOTAL (${fl.length} employees)</td>
        <td style="text-align:right;color:#fca5a5;">${fmt(totGiven)}</td>
        <td style="text-align:right;color:#86efac;">${fmt(totDed)}</td>
        <td style="text-align:right;color:${totBal>0?'#fca5a5':'#86efac'};font-size:14px;">${fmt(totBal)}</td>
        <td colspan="3"></td>
      </tr></tfoot>
    </table>
  </div>`;
}

function renderAdvCards(fl){
  return fl.map(e=>{
    const ci=idx(e.id);
    const bal=e.advanceBalance||0;
    const hist=(e.advanceHistory||[]).slice().reverse().slice(0,1)[0];
    return `<div class="adv-page-item ${bal>0?'has-balance':'clear'}">
      <div class="row-av" style="background:${clr(ci)}22;color:${clr(ci)};width:40px;height:40px;font-size:12px;">${ini(e.name)}</div>
      <div style="flex:1;">
        <div style="font-weight:600;font-size:13px;color:var(--navy);">${e.name}</div>
        <div style="font-size:11px;color:var(--muted);">${e.id} · ${e.branch}</div>
        ${hist?`<div style="font-size:10px;color:var(--muted);margin-top:3px;">${hist.type==='given'?'▲ Given':'▼ Deducted'} ${fmt(hist.amount)} on ${hist.date||'—'}</div>`:'<div style="font-size:10px;color:var(--muted);margin-top:3px;">No advance history</div>'}
      </div>
      <div style="text-align:right;margin-right:10px;">
        <div class="adv-bal-amt ${bal>0?'owing':'clear'}">${fmt(bal)}</div>
        <div style="font-size:10px;color:var(--muted);">${bal>0?'Outstanding':'Clear'}</div>
      </div>
      <button class="btn btn-or btn-sm" onclick="openAdvance('${e.id}')">💳 Manage</button>
    </div>`;
  }).join('');
}

function exportAdvanceCSV(){
  const rows=[['ID','Name','Branch','Org','Outstanding Balance','Last Transaction','Last Date']];
  EMP.forEach(e=>{
    const last=(e.advanceHistory||[]).slice(-1)[0];
    rows.push([e.id,e.name,e.branch,e.org,e.advanceBalance||0,last?`${last.type} ${last.amount}`:'',last?.date||'']);
  });
  dlCSV('advances_report.csv',rows);
}

// ═══════════════════════════════════════════
//  REPORTS & ANALYTICS
// ═══════════════════════════════════════════
function pgReports(m){
  const mons=mList();
  if(!_rptMonth&&mons.length) _rptMonth=mons[0];
  m.innerHTML=`
  <div class="page-hd">
    <div><h1>Reports &amp; Analytics</h1><p>Salary breakup by organisation, branch &amp; batch</p></div>
    <div class="pha">
      <button class="btn btn-grn btn-sm" onclick="exportRptCSV()">⬇ Export Report CSV</button>
      <button class="btn btn-or btn-sm" onclick="exportPayrollReportPDF()">⬇ PDF Report</button>
      <button class="btn btn-o btn-sm" onclick="window.print()">🖨 Print</button>
    </div>
  </div>
  <div class="filter-row" style="margin-bottom:1rem;">
    <div><label class="filter-label">Month</label>
    <select onchange="_rptMonth=this.value;pgReports(document.getElementById('hrMain'))">
      <option value="">All Months</option>
      ${mons.map(mo=>`<option value="${mo}" ${_rptMonth===mo?'selected':''}>${mo}${isLocked(mo)?' 🔒':''}</option>`).join('')}
    </select></div>
    <div><label class="filter-label">Branch</label>
    <select onchange="window._rptBr=this.value;pgReports(document.getElementById('hrMain'))">
      <option value="">All Branches</option>
      ${[...new Set(EMP.map(e=>e.branch))].map(b=>`<option value="${b}" ${window._rptBr===b?'selected':''}>${b}</option>`).join('')}
    </select></div>
    <div><label class="filter-label">Designation</label>
    <select onchange="window._rptDesig=this.value;pgReports(document.getElementById('hrMain'))">
      <option value="">All Designations</option>
      ${[...new Set(EMP.map(e=>e.designation||'').filter(Boolean))].sort().map(d=>`<option value="${d}" ${window._rptDesig===d?'selected':''}>${d}</option>`).join('')}
    </select></div>
    <div><label class="filter-label">Batch</label>
    <select onchange="window._rptBat=this.value;pgReports(document.getElementById('hrMain'))">
      <option value="">All Batches</option>
      <option value="B1" ${window._rptBat==='B1'?'selected':''}>Batch 1 (B1)</option>
      <option value="B2" ${window._rptBat==='B2'?'selected':''}>Batch 2 (B2)</option>
    </select></div>
    ${(window._rptBr||window._rptDesig||window._rptBat)?`<div style="display:flex;align-items:flex-end;"><button class="btn btn-o btn-sm" onclick="window._rptBr='';window._rptDesig='';window._rptBat='';pgReports(document.getElementById('hrMain'))">✕ Clear</button></div>`:''}
  </div>
  <div class="rpt-tabs">
    <button class="rtab ${_rptTab==='org'?'active':''}" onclick="_rptTab='org';pgReports(document.getElementById('hrMain'))">🏢 Organisation</button>
    <button class="rtab ${_rptTab==='branch'?'active':''}" onclick="_rptTab='branch';pgReports(document.getElementById('hrMain'))">🏬 Branch</button>
    <button class="rtab ${_rptTab==='desig'?'active':''}" onclick="_rptTab='desig';pgReports(document.getElementById('hrMain'))">🎓 Designation</button>
    <button class="rtab ${_rptTab==='batch'?'active':''}" onclick="_rptTab='batch';pgReports(document.getElementById('hrMain'))">📦 Batch</button>
    <button class="rtab ${_rptTab==='employee'?'active':''}" onclick="_rptTab='employee';pgReports(document.getElementById('hrMain'))">👤 Employee</button>
    <button class="rtab ${_rptTab==='trend'?'active':''}" onclick="_rptTab='trend';pgReports(document.getElementById('hrMain'))">📈 Trend</button>
  </div>
  <div id="rptContent">${renderRptTab()}</div>`;
}

function getRptRecords(){
  let recs=[];
  const mons=_rptMonth?[_rptMonth]:mList();
  mons.forEach(mo=>{
    (PAY[mo]?.records||[]).forEach(r=>{
      const e=byId(r.empId); if(!e) return;
      if(window._rptBr&&e.branch!==window._rptBr) return;
      if(window._rptBat&&r.batchType!==window._rptBat) return;
      if(window._rptDesig&&(e.designation||'')!==window._rptDesig) return;
      recs.push({...r,_emp:e,_month:mo});
    });
  });
  return recs;
}

function renderRptTab(){
  const recs=getRptRecords();
  if(_rptTab==='org') return renderRptOrgWise(recs);
  if(_rptTab==='branch') return renderRptBranchWise(recs);
  if(_rptTab==='desig') return renderRptDesigWise(recs);
  if(_rptTab==='batch') return renderRptBatchWise(recs);
  if(_rptTab==='employee') return renderRptEmpWise(recs);
  if(_rptTab==='trend') return renderRptTrend();
  return '';
}

function renderRptDesigWise(recs){
  if(!recs.length) return `<div class="empty"><div class="ei">📊</div><h3>No payroll data found</h3></div>`;
  const groups=rptGroup(recs, r=>r._emp?.designation||'Unspecified');
  const sorted=groups.sort((a,b)=>rptSummaryRow(b.recs).net-rptSummaryRow(a.recs).net);
  return `
  <div style="margin-bottom:1rem;font-size:12px;color:var(--muted);">${sorted.length} designation(s) · ${recs.length} records</div>
  ${sorted.map(g=>{
    const s=rptSummaryRow(g.recs);
    const empList=[...new Set(g.recs.map(r=>r._emp?.name||r.empId))];
    return `<div class="rpt-card" style="margin-bottom:1rem;">
      <div class="rpt-card-hd">
        <div>
          <div style="font-size:15px;font-weight:700;color:var(--navy);">🎓 ${g.label}</div>
          <div style="font-size:11px;color:var(--muted);margin-top:2px;">${s.count} employee(s) · ${empList.slice(0,4).join(', ')}${empList.length>4?' +'+( empList.length-4)+' more':''}</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:20px;font-weight:800;color:var(--navy);font-family:monospace;">${fmt(s.net)}</div>
          <div style="font-size:10px;color:var(--muted);">net payable</div>
        </div>
      </div>
      <div class="rpt-stats">
        <div class="rpt-stat"><span class="rsl">Gross</span><span class="rsv">${fmt(s.gross)}</span></div>
        <div class="rpt-stat"><span class="rsl">Total Payable</span><span class="rsv">${fmt(s.tp)}</span></div>
        <div class="rpt-stat"><span class="rsl">LOP</span><span class="rsv" style="color:var(--red);">${fmt(s.lop)}</span></div>
        <div class="rpt-stat"><span class="rsl">Adv. Deducted</span><span class="rsv" style="color:var(--purple);">${fmt(s.adv)}</span></div>
        <div class="rpt-stat"><span class="rsl">Net Pay</span><span class="rsv" style="color:var(--green);font-weight:800;">${fmt(s.net)}</span></div>
      </div>
      <div class="rpt-tbl-wrap" style="margin-top:.5rem;">
        <table class="rpt-tbl" style="font-size:11px;">
          <thead><tr>
            <th>Employee</th><th>Branch</th><th>Batch</th>
            <th style="text-align:right;">Gross</th>
            <th style="text-align:right;">Net Pay</th>
            <th style="text-align:right;">LOP</th>
          </tr></thead>
          <tbody>
            ${g.recs.map(r=>`<tr>
              <td style="font-weight:600;">${r._emp?.name||r.empId}</td>
              <td style="color:var(--muted);">${r._emp?.branch||'—'}</td>
              <td><span class="type-chip ${r.batchType==='B1'?'chip-b1':'chip-b2'}" style="font-size:9px;">${r.batchType}</span></td>
              <td style="text-align:right;font-family:monospace;">${fmt(r.gross||0)}</td>
              <td style="text-align:right;font-family:monospace;font-weight:700;color:var(--green);">${fmt(netPay(r))}</td>
              <td style="text-align:right;font-family:monospace;color:${lopAmt(r)>0?'var(--red)':'var(--muted)'};">${lopAmt(r)>0?fmt(lopAmt(r)):'—'}</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
  }).join('')}`;
}

function rptGroup(recs, keyFn){
  const groups={};
  recs.forEach(r=>{
    const k=keyFn(r); groups[k]=groups[k]||{label:k,recs:[]};
    groups[k].recs.push(r);
  });
  return Object.values(groups);
}

function rptSummaryRow(recs){
  return {
    count:[...new Set(recs.map(r=>r.empId))].length,
    gross:recs.reduce((s,r)=>s+(r.gross||0),0),
    tp:recs.reduce((s,r)=>s+recTotalPayable(r),0),
    net:recs.reduce((s,r)=>s+netPay(r),0),
    lop:recs.reduce((s,r)=>s+lopAmt(r),0),
    adv:recs.reduce((s,r)=>s+(r.advanceDeducted||0),0),
    other:recs.reduce((s,r)=>s+(r.otherDeduction||0),0),
  };
}

function rptTable(groups){
  const totals=rptSummaryRow(groups.flatMap(g=>g.recs));
  const maxNet=Math.max(...groups.map(g=>rptSummaryRow(g.recs).net),1);
  return `
  <!-- Bar chart -->
  <div class="card" style="margin-bottom:1.25rem;">
    <div class="card-h"><h3>Net Pay Distribution</h3></div>
    <div style="padding:1rem 1.5rem;" class="rpt-bar-wrap">
      ${groups.map(g=>{
        const s=rptSummaryRow(g.recs);
        const pct=Math.round(s.net/maxNet*100);
        return `<div class="rpt-bar-row">
          <div class="rpt-bar-label">${g.label}</div>
          <div class="rpt-bar-bg">
            <div class="rpt-bar-fill" style="width:${pct}%;">
              <span class="rpt-bar-val">${fmtK(s.net)}</span>
            </div>
          </div>
          <div style="font-size:11px;color:var(--muted);min-width:90px;text-align:right;">${s.count} emp</div>
        </div>`;
      }).join('')}
    </div>
  </div>
  <!-- Table -->
  <div class="rpt-tbl-wrap">
    <table class="rpt-tbl">
      <thead><tr>
        <th>Group</th><th>Employees</th><th>Gross</th>
        <th>Allowances</th><th>Total Payable</th><th>LOP</th><th>Adv Deduction</th><th>Other Ded</th><th>Net Pay</th>
      </tr></thead>
      <tbody>
      ${groups.map(g=>{
        const s=rptSummaryRow(g.recs);
        const ta=s.tp-s.gross;
        return `<tr>
          <td style="font-weight:600;">${g.label}</td>
          <td>${s.count}</td>
          <td>${fmt(s.gross)}</td>
          <td>${fmt(ta)}</td>
          <td style="font-weight:600;">${fmt(s.tp)}</td>
          <td style="color:var(--red);">${fmt(s.lop)}</td>
          <td style="color:var(--purple);">${fmt(s.adv)}</td>
          <td style="color:var(--orange);">${fmt(s.other)}</td>
          <td style="font-weight:700;color:var(--green);">${fmt(s.net)}</td>
        </tr>`;
      }).join('')}
      </tbody>
      <tfoot><tr>
        <td>TOTAL</td>
        <td>${totals.count}</td>
        <td>${fmt(totals.gross)}</td>
        <td>${fmt(totals.tp-totals.gross)}</td>
        <td>${fmt(totals.tp)}</td>
        <td>${fmt(totals.lop)}</td>
        <td>${fmt(totals.adv)}</td>
        <td>${fmt(totals.other)}</td>
        <td>${fmt(totals.net)}</td>
      </tr></tfoot>
    </table>
  </div>`;
}

function renderRptOrgWise(recs){
  if(!recs.length) return noDataMsg();
  const groups=rptGroup(recs,r=>r._emp.org.split(' ').slice(0,5).join(' '));
  return rptTable(groups);
}
function renderRptBranchWise(recs){
  if(!recs.length) return noDataMsg();
  const groups=rptGroup(recs,r=>r._emp.branch);
  return rptTable(groups);
}
function renderRptBatchWise(recs){
  if(!recs.length) return noDataMsg();
  const groups=rptGroup(recs,r=>r.batchType==='B1'?'Batch 1 (26–25)':'Batch 2 (1–30)');
  return rptTable(groups);
}

function renderRptEmpWise(recs){
  if(!recs.length) return noDataMsg();
  // Group by empId, sum across months if multiple
  const grouped={};
  recs.forEach(r=>{
    const id=r.empId; grouped[id]=grouped[id]||{emp:r._emp,recs:[]};
    grouped[id].recs.push(r);
  });
  const rows=Object.values(grouped).sort((a,b)=>rptSummaryRow(b.recs).net-rptSummaryRow(a.recs).net);
  const totals=rptSummaryRow(recs);
  return `<div class="rpt-tbl-wrap">
    <table class="rpt-tbl">
      <thead><tr>
        <th>Employee</th><th>ID</th><th>Branch</th><th>Batch</th>
        <th>Gross</th><th>Total Payable</th><th>LOP</th><th>Adv</th><th>Net Pay</th>
      </tr></thead>
      <tbody>
      ${rows.map(({emp,recs:er})=>{
        const ci=idx(emp.id);
        const s=rptSummaryRow(er);
        return `<tr>
          <td><div class="nc">
            <div class="row-av" style="background:${clr(ci)}22;color:${clr(ci)};font-size:10px;">${ini(emp.name)}</div>
            <div class="nm">${emp.name}</div>
          </div></td>
          <td style="font-size:11px;font-family:monospace;">${emp.id}</td>
          <td>${emp.branch}</td>
          <td><span class="type-chip ${er[0]?.batchType==='B1'?'chip-b1':'chip-b2'}" style="font-size:9px;">${er[0]?.batchType}</span></td>
          <td>${fmt(s.gross)}</td>
          <td style="font-weight:600;">${fmt(s.tp)}</td>
          <td style="color:var(--red);">${fmt(s.lop)}</td>
          <td style="color:var(--purple);">${fmt(s.adv)}</td>
          <td style="font-weight:700;color:var(--green);">${fmt(s.net)}</td>
        </tr>`;
      }).join('')}
      </tbody>
      <tfoot><tr>
        <td colspan="4">TOTAL</td>
        <td>${fmt(totals.gross)}</td>
        <td>${fmt(totals.tp)}</td>
        <td>${fmt(totals.lop)}</td>
        <td>${fmt(totals.adv)}</td>
        <td>${fmt(totals.net)}</td>
      </tr></tfoot>
    </table>
  </div>`;
}

function renderRptTrend(){
  const mons=mList().slice(0,12).reverse();
  if(!mons.length) return noDataMsg();
  const data=mons.map(mo=>{
    const recs=PAY[mo]?.records||[];
    const filtRecs=recs.filter(r=>{
      const e=byId(r.empId); if(!e) return false;
      if(window._rptBr&&e.branch!==window._rptBr) return false;
      if(window._rptBat&&r.batchType!==window._rptBat) return false;
      return true;
    });
    return {mo,net:filtRecs.reduce((s,r)=>s+netPay(r),0),tp:filtRecs.reduce((s,r)=>s+recTotalPayable(r),0),lop:filtRecs.reduce((s,r)=>s+lopAmt(r),0),cnt:filtRecs.length};
  });
  const maxNet=Math.max(...data.map(d=>d.net),1);
  return `
  <div class="card" style="margin-bottom:1.25rem;">
    <div class="card-h"><h3>Net Pay Trend (last ${mons.length} months)</h3></div>
    <div style="padding:1rem 1.5rem;" class="rpt-bar-wrap">
      ${data.map(d=>{
        const pct=Math.round(d.net/maxNet*100);
        return `<div class="rpt-bar-row">
          <div class="rpt-bar-label">${d.mo}</div>
          <div class="rpt-bar-bg">
            <div class="rpt-bar-fill" style="width:${pct}%;">
              <span class="rpt-bar-val">${fmtK(d.net)}</span>
            </div>
          </div>
          <div style="font-size:11px;color:var(--muted);min-width:90px;text-align:right;">${d.cnt} emp</div>
        </div>`;
      }).join('')}
    </div>
  </div>
  <div class="rpt-tbl-wrap">
    <table class="rpt-tbl">
      <thead><tr><th>Month</th><th>Employees</th><th>Total Payable</th><th>LOP</th><th>Net Disbursed</th><th>Status</th></tr></thead>
      <tbody>
      ${data.map(d=>`<tr>
        <td style="font-weight:600;">${d.mo}</td>
        <td>${d.cnt}</td>
        <td>${fmt(d.tp)}</td>
        <td style="color:var(--red);">${fmt(d.lop)}</td>
        <td style="font-weight:700;color:var(--green);">${fmt(d.net)}</td>
        <td><span class="badge ${isLocked(d.mo)?'b-lock':'b-blue'}">${isLocked(d.mo)?'Locked':'Draft'}</span></td>
      </tr>`).join('')}
      </tbody>
    </table>
  </div>`;
}

function noDataMsg(){ return '<div class="empty"><div class="ei">📊</div><h3>No payroll data found</h3><p>Generate payroll for a month first.</p></div>'; }

function exportRptCSV(){
  const recs=getRptRecords();
  const rows=[['Month','Employee','ID','Org','Branch','Batch','Basis','Gross','TA','Conv','Tel','Other Exp','Total Payable','Working Days','Present','LOP','Adv Deducted','Other Ded','Net Pay']];
  recs.forEach(r=>{
    const e=r._emp;
    rows.push([r._month,e.name,e.id,e.org,e.branch,r.batchType,r.basisType,r.gross,r.travellingAllowance||0,r.otherConveyance||0,r.telephoneExpenses||0,r.otherExpenses||0,recTotalPayable(r).toFixed(2),r.workingDays||30,r.basisType==='hours'?r.presentHours:r.present,lopAmt(r).toFixed(2),r.advanceDeducted||0,r.otherDeduction||0,netPay(r).toFixed(2)]);
  });
  dlCSV((_rptTab+'_report'+((_rptMonth)?'_'+_rptMonth:'')+'.csv').replace(/ /g,'_'),rows);
}

// ── CSV DOWNLOAD HELPER ──
function dlCSV(filename,rows){
  const csv=rows.map(r=>r.map(v=>{
    const s=String(v||'').replace(/"/g,'""');
    return s.includes(',')|| s.includes('"')|| s.includes('\n')?`"${s}"`:s;
  }).join(',')).join('\n');
  const blob=new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8;'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob); a.download=filename; a.click();
  toast('Exported '+filename);
}

// ── MOBILE SIDEBAR ──
function toggleMobSidebar(){
  const sb=document.getElementById('hrSidebar');
  const ov=document.getElementById('sidebarOverlay');
  sb.classList.toggle('mob-open');
  ov.classList.toggle('open');
}
function closeMobSidebar(){
  document.getElementById('hrSidebar')?.classList.remove('mob-open');
  document.getElementById('sidebarOverlay')?.classList.remove('open');
}
document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('.snav-item').forEach(el=>{
    el.addEventListener('click',()=>{ if(window.innerWidth<=960) closeMobSidebar(); });
  });
});

// ── PRINT PAYSLIP ──
function printPayslip(){
  const el=document.querySelector('#mBody .fslip')||document.querySelector('#empScreen .fslip');
  if(!el){ window.print(); return; }
  const pw=window.open('','_blank','width=900,height=700');
  const styles=[...document.styleSheets].map(ss=>{ try{ return [...ss.cssRules].map(r=>r.cssText).join('\n'); }catch(e){return '';} }).join('\n');
  pw.document.write('<!DOCTYPE html><html><head><title>Payslip</title>'
    +'<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>'
    +'<style>*{box-sizing:border-box;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}'
    +'body{margin:0;padding:16px;background:#fff;font-family:\'DM Sans\',sans-serif}'
    +'@page{size:A4 portrait;margin:12mm}'
    +'@media print{body{padding:0}}'
    +styles+'</style></head><body>'+el.outerHTML+'</body></html>');
  pw.document.close();
  pw.focus();
  setTimeout(()=>{ pw.print(); setTimeout(()=>pw.close(),1000); },600);
}

// ── PDF EXPORT ──
function _pdfSlipEl(scope){
  return document.querySelector(scope+' .fslip')||document.querySelector(scope+' .cslip')||document.querySelector(scope+' .slip-wrap');
}
function exportPayslipPDF(){
  const el=_pdfSlipEl('#empScreen');
  if(!el){ toast('No payslip to export','err'); return; }
  const empName=document.querySelector('.fslip-org-name, .cslip-nm')?.textContent||'Employee';
  const month=document.querySelector('.emtab.active')?.textContent||'Payslip';
  toast('Generating PDF…');
  html2pdf().set({
    margin:[6,6,6,6],
    filename:`Payslip_${empName.replace(/\s+/g,'_')}_${month.replace(/\s+/g,'_')}.pdf`,
    image:{type:'jpeg',quality:0.98},
    html2canvas:{scale:2,useCORS:true,logging:false},
    jsPDF:{unit:'mm',format:'a4',orientation:'portrait'},
    pagebreak:{mode:['avoid-all','css','legacy']}
  }).from(el).save().then(()=>toast('PDF downloaded ✓'));
}
function exportModalPayslipPDF(){
  const el=_pdfSlipEl('#mBody');
  if(!el){ toast('No payslip to export','err'); return; }
  const empName=document.querySelector('#mBody .fslip-org-name, #mBody .cslip-nm')?.textContent||'Employee';
  const month=document.querySelector('#mTitle')?.textContent||'Payslip';
  toast('Generating PDF…');
  html2pdf().set({
    margin:[6,6,6,6],
    filename:`Payslip_${empName.replace(/\s+/g,'_')}_${month.replace(/\s+/g,'_')}.pdf`,
    image:{type:'jpeg',quality:0.98},
    html2canvas:{scale:2,useCORS:true,logging:false},
    jsPDF:{unit:'mm',format:'a4',orientation:'portrait'},
    pagebreak:{mode:['avoid-all','css','legacy']}
  }).from(el).save().then(()=>toast('PDF downloaded ✓'));
}
function exportPayrollReportPDF(){
  const el=document.querySelector('.hr-main');
  if(!el){ toast('Nothing to export','err'); return; }
  toast('Generating PDF report…');
  html2pdf().set({
    margin:[8,8,8,8],
    filename:`Payroll_Report_${new Date().toISOString().slice(0,7)}.pdf`,
    image:{type:'jpeg',quality:0.95},
    html2canvas:{scale:1.5,useCORS:true,logging:false,windowWidth:1200},
    jsPDF:{unit:'mm',format:'a4',orientation:'landscape'}
  }).from(el).save().then(()=>toast('PDF report downloaded ✓'));
}

// ═══════════════════════════════════════════
//  BACKUP & RESTORE
// ═══════════════════════════════════════════
function pgBackup(m){
  const empCount=EMP.length;
  const payCount=Object.keys(PAY).length;
  const leaveCount=LEAVE_APPS.length;
  const expCount=EXPENSE_CLAIMS.length;
  const orgCount=ORGS.length;
  const docCount=EMP_DOCS.length;
  const lastBackup=localStorage.getItem('tatti_last_backup')||'Never';

  m.innerHTML=`
  <div class="page-hd"><div><h1>Backup & Restore</h1><p>Protect your payroll data — export and import all data as a file</p></div></div>

  <div class="banner bn-warn" style="margin-bottom:1.25rem;">
    ⚠️ <strong>Important:</strong> This app stores data in your browser. If you clear browser data or open on a different device, all data will be lost. 
    <strong>Export a backup regularly</strong> and keep it safe.
  </div>

  <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.5rem;">
    <!-- Export -->
    <div class="card">
      <div class="card-h"><h3>📤 Export Backup</h3></div>
      <div style="padding:1.25rem;">
        <div style="margin-bottom:1rem;">
          <div style="font-size:13px;font-weight:600;color:var(--navy);margin-bottom:8px;">Current Data Summary</div>
          ${[
            ['👥 Employees', empCount],
            ['📅 Payroll Months', payCount],
            ['🏖️ Leave Records', leaveCount],
            ['💸 Expense Claims', expCount],
            ['🏛️ Organizations', orgCount],
            ['📁 Documents', docCount+' file(s)'],
          ].map(([l,v])=>`<div style="display:flex;justify-content:space-between;padding:5px 8px;background:var(--cream);border-radius:6px;font-size:12px;margin-bottom:4px;">
            <span style="color:var(--muted);">${l}</span><strong>${v}</strong>
          </div>`).join('')}
        </div>
        <div style="font-size:11px;color:var(--muted);margin-bottom:12px;">Last backup: <strong>${lastBackup}</strong></div>
        <button class="btn btn-p" style="width:100%;" onclick="doExportBackup()">⬇ Download Full Backup (.json)</button>
      </div>
    </div>

    <!-- Import -->
    <div class="card">
      <div class="card-h"><h3>📥 Import / Restore</h3></div>
      <div style="padding:1.25rem;">
        <div class="banner bn-warn" style="margin-bottom:1rem;font-size:12px;">⚠️ Importing will <strong>replace ALL current data</strong>. Export a backup first.</div>
        <div class="f">
          <label>Select Backup File (.json)</label>
          <input type="file" id="restore-file" accept=".json" style="padding:10px;border:1.5px dashed #ddd;border-radius:var(--rs);width:100%;font-family:'DM Sans',sans-serif;font-size:13px;"/>
        </div>
        <button class="btn btn-or" style="width:100%;margin-top:8px;" onclick="doImportBackup()">📥 Restore from Backup</button>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-h"><h3>🗑 Clear Data</h3></div>
    <div style="padding:1.25rem;display:flex;align-items:center;gap:1rem;flex-wrap:wrap;">
      <div style="flex:1;font-size:13px;color:var(--muted);">Danger zone — permanently delete specific data. Export a backup before clearing.</div>
      <button class="btn btn-d btn-sm" onclick="clearPayrollData()">Clear All Payroll Records</button>
      <button class="btn btn-d btn-sm" onclick="clearAllData()">⚠ Reset Everything</button>
    </div>
  </div>`;
}

function doExportBackup(){
  const backup={
    version:'v6', exportedOn:new Date().toISOString(),
    HR_PASS, EMP, PAY, LEAVE_APPS, EXPENSE_CLAIMS, ORGS, EMP_DOCS
  };
  const json=JSON.stringify(backup, null, 2);
  const blob=new Blob([json],{type:'application/json'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download=`TATTI_Backup_${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  const now=new Date().toLocaleString('en-IN');
  localStorage.setItem('tatti_last_backup', now);
  toast('Backup downloaded ✓ Keep this file safe!');
  setTimeout(()=>pgBackup(document.getElementById('hrMain')),500);
}

function doImportBackup(){
  const file=document.getElementById('restore-file')?.files?.[0];
  if(!file){ toast('Select a backup .json file','err'); return; }
  if(!confirm('⚠️ This will REPLACE ALL current data with the backup. Are you sure?')) return;
  const reader=new FileReader();
  reader.onload=function(ev){
    try{
      const d=JSON.parse(ev.target.result);
      if(!d.EMP||!d.PAY){ toast('Invalid backup file','err'); return; }
      EMP=d.EMP||[]; PAY=d.PAY||{};
      LEAVE_APPS=d.LEAVE_APPS||[]; EXPENSE_CLAIMS=d.EXPENSE_CLAIMS||[];
      ORGS=d.ORGS||DEFAULT_ORGS; EMP_DOCS=d.EMP_DOCS||[];
      if(d.HR_PASS) HR_PASS=d.HR_PASS;
      saveAll(); saveDocs();
      localStorage.setItem('tatti_hrpass_v1', HR_PASS);
      toast('Data restored successfully ✓ — '+EMP.length+' employees, '+Object.keys(PAY).length+' payroll months');
      gotoPage('dashboard');
    }catch(e){ toast('Failed to read backup file: '+e.message,'err'); }
  };
  reader.readAsText(file);
}

function clearPayrollData(){
  if(!confirm('Delete ALL payroll records? Employee data will be kept.')) return;
  PAY={}; save();
  toast('All payroll records cleared');
  pgBackup(document.getElementById('hrMain'));
}

function clearAllData(){
  if(!confirm('⚠️ DELETE EVERYTHING — employees, payroll, leaves, expenses? This cannot be undone.')) return;
  if(!confirm('Final confirmation: Are you 100% sure you want to reset ALL data?')) return;
  EMP=seedEmployees(); PAY={}; LEAVE_APPS=[]; EXPENSE_CLAIMS=[]; EMP_DOCS=[];
  ORGS=[...DEFAULT_ORGS]; saveAll(); saveDocs();
  toast('All data reset to defaults','err');
  gotoPage('dashboard');
}

// ── INIT ──
switchTab('hr');