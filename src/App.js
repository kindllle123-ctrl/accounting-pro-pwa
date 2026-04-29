import React, { useState, useEffect } from 'react';

// ─── THEMES ──────────────────────────────────────────────────────────────────
const THEMES = {
  indigo: {
    name: "Indigo",
    sidebarBg: "#1E1B4B",
    sidebarText: "#E0E7FF",
    primary: "#6366F1",
    primaryDark: "#4F46E5",
    primaryLight: "#EEF2FF",
    accent: "#818CF8",
  },
  emerald: {
    name: "Emerald",
    sidebarBg: "#064E3B",
    sidebarText: "#CCFBF1",
    primary: "#059669",
    primaryDark: "#047857",
    primaryLight: "#D1FAE5",
    accent: "#10B981",
  },
  slate: {
    name: "Slate",
    sidebarBg: "#1E293B",
    sidebarText: "#E2E8F0",
    primary: "#475569",
    primaryDark: "#334155",
    primaryLight: "#F1F5F9",
    accent: "#64748B",
  },
  rose: {
    name: "Rose",
    sidebarBg: "#4C0519",
    sidebarText: "#FBE7F1",
    primary: "#E11D48",
    primaryDark: "#BE123C",
    primaryLight: "#FFE4F0",
    accent: "#F43F5E",
  },
  amber: {
    name: "Amber",
    sidebarBg: "#451A03",
    sidebarText: "#FEF3C7",
    primary: "#D97706",
    primaryDark: "#B45309",
    primaryLight: "#FEF3C7",
    accent: "#F59E0B",
  },
  cyan: {
    name: "Cyan",
    sidebarBg: "#083344",
    sidebarText: "#CFFAFE",
    primary: "#0891B2",
    primaryDark: "#0E7490",
    primaryLight: "#CFFAFE",
    accent: "#06B6D4",
  },
  violet: {
    name: "Violet",
    sidebarBg: "#2E1065",
    sidebarText: "#EDE9FE",
    primary: "#7C3AED",
    primaryDark: "#6D28D9",
    primaryLight: "#EDE9FE",
    accent: "#A78BFA",
  },
  teal: {
    name: "Teal",
    sidebarBg: "#134E4A",
    sidebarText: "#CCFBF1",
    primary: "#0D9488",
    primaryDark: "#0F766E",
    primaryLight: "#CCFBF1",
    accent: "#14B8A6",
  }
};

const CATS = ["Customer","Vendor","Investor","Bank","Cash","Income","Expense","Equity","Other"];
const initState = { auth:null, users:[], accounts:[], vouchers:[], nextVoucher:1, theme:"indigo" };

function useStore() {
  const [state, setState] = useState(() => {
    try { const s = localStorage.getItem("accpro_v4"); return s ? JSON.parse(s) : initState; }
    catch { return initState; }
  });
  const save = fn => setState(prev => {
    const next = typeof fn === "function" ? fn(prev) : fn;
    try { localStorage.setItem("accpro_v4", JSON.stringify(next)); } catch {}
    return next;
  });
  return [state, save];
}

const fmt = n => Number(n).toFixed(2);
const today = () => new Date().toISOString().slice(0,10);
const vId = n => "VOU-" + String(n).padStart(4,"0");

const iStyle = (theme) => ({ padding:"10px 13px", borderRadius:10, border:`1.5px solid ${theme.primaryLight}`, background:"#F9FAFB", color:"#111827", fontSize:13.5, width:"100%", transition:"all 0.18s", fontFamily:"'Times New Roman', Times, serif" });
const Card = ({ children, style, theme }) => (
  <div style={{ background:"#fff", border:`1px solid #E5E7EB`, borderRadius:16, padding:"1.4rem", boxShadow:"0 2px 8px rgba(0,0,0,0.04)", ...style }}>{children}</div>
);
const PageHeader = ({ title, sub }) => (
  <div style={{ marginBottom:"1.6rem" }}>
    <div style={{ fontWeight:700, fontSize:26, color:"#1E1B4B", letterSpacing:"-0.5px", lineHeight:1.2 }}>{title}</div>
    {sub && <div style={{ fontSize:14, color:"#9CA3AF", marginTop:7, fontWeight: 400, lineHeight: 1.5 }}>{sub}</div>}
  </div>
);

// ─── APP ─────────────────────────────────────────────────────────────────────
function App() {
  const [store, save] = useStore();
  const [page, setPage] = useState("dashboard");
  const [sideOpen, setSideOpen] = useState(window.innerWidth > 700);
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({ username:"", password:"", email:"" });
  const [authErr, setAuthErr] = useState("");
  const [notify, setNotify] = useState(null);
  const [pageKey, setPageKey] = useState(0);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const theme = THEMES[store.theme] || THEMES.indigo;
  const toast = (msg, type="success") => { setNotify({msg,type}); setTimeout(()=>setNotify(null),3500); };
  const go = p => { setPage(p); setPageKey(k=>k+1); if(window.innerWidth<=700) setSideOpen(false); };
  const switchTheme = t => { save(s=>({...s,theme:t})); setShowThemeMenu(false); };

  if (!store.auth) return <AuthScreen mode={authMode} setMode={setAuthMode} form={authForm} setForm={setAuthForm} err={authErr} setErr={setAuthErr}
    onLogin={(u,p)=>{ const user=store.users.find(x=>x.username===u&&x.password===p); if(!user){setAuthErr("Invalid credentials");return;} save(s=>({...s,auth:user})); }}
    onSignup={(u,p,e)=>{ if(store.users.find(x=>x.username===u)){setAuthErr("Username taken");return;} const user={username:u,password:p,email:e}; save(s=>({...s,users:[...s.users,user],auth:user})); toast("Account created!"); }} />;

  const navItems = [
    {id:"dashboard",label:"Dashboard",icon:"⊞"},
    {id:"accounts",label:"Chart of Accounts",icon:"≡"},
    {id:"sales",label:"Sales Invoice",icon:"↑"},
    {id:"purchase",label:"Purchase Invoice",icon:"↓"},
    {id:"journal",label:"Journal Voucher",icon:"◈"},
    {id:"cashpay",label:"Cash Payment",icon:"−"},
    {id:"cashrec",label:"Cash Receipt",icon:"+"},
    {id:"ledger",label:"Ledger",icon:"≣"},
    {id:"trial",label:"Trial Balance",icon:"⊜"},
    {id:"pl",label:"Profit & Loss",icon:"◎"},
  ];

  return (
    <div style={{ display:"flex", height:"100vh", overflow:"hidden" }}>
      {sideOpen && window.innerWidth<=700 && <div onClick={()=>setSideOpen(false)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:19 }} />}

      {notify && <div className="toast-in" style={{ position:"fixed", top:20, right:20, zIndex:9999, background:notify.type==="success"?theme.accent:notify.type==="error"?"#EF4444":theme.primary, color:"#fff", padding:"13px 22px", borderRadius:14, fontSize:13.5, fontWeight:700, boxShadow:"0 12px 36px rgba(0,0,0,0.3)", display:"flex", alignItems:"center", gap:10 }}>
        {notify.type==="success"?"✓":notify.type==="error"?"✕":"ℹ"} {notify.msg}
      </div>}

      {/* Sidebar */}
      <div style={{ position: window.innerWidth<=700?"fixed":"relative", left:0, top:0, bottom:0, width:sideOpen?260:0, minWidth:sideOpen?260:0, overflow:"hidden", transition:"all 0.3s cubic-bezier(.4,0,.2,1)", background:theme.sidebarBg, display:"flex", flexDirection:"column", zIndex:20, flexShrink:0, boxShadow: sideOpen ? "3px 0 16px rgba(0,0,0,0.15)" : "none" }}>
        <div style={{ padding:"22px 18px 18px", borderBottom:`1px solid rgba(255,255,255,0.1)` }}>
          <div style={{ display:"flex", alignItems:"center", gap:13 }}>
            <div style={{ width:40, height:40, borderRadius:13, background:`linear-gradient(135deg,${theme.primary},${theme.accent})`, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:`0 8px 20px rgba(0,0,0,0.25)`, flexShrink:0 }}>
              <span style={{ color:"#fff", fontWeight:800, fontSize:19, fontStyle: "italic" }}>A</span>
            </div>
            <div>
              <div style={{ fontWeight:700, fontSize:15.5, color:"#fff", letterSpacing: "0.6px", lineHeight:1.2 }}>AccountingPro</div>
              <div style={{ fontSize:9, color:`rgba(255,255,255,0.6)`, letterSpacing:"1px", marginTop:3, fontWeight:600 }}>PREMIUM SUITE</div>
            </div>
          </div>
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:"14px 9px" }}>
          {navItems.map(n => (
            <div key={n.id} className={`nav-item ${page===n.id?"sidebar-active":""}`} onClick={()=>go(n.id)}
              style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px", fontSize:13.5, whiteSpace:"nowrap", borderRadius:11, marginBottom:5, background:page===n.id?`rgba(255,255,255,0.15)`:"transparent", color:page===n.id?"#fff":theme.sidebarText, fontWeight:page===n.id?700:500, letterSpacing: "0.2px", cursor:"pointer" }}>
              <span style={{ fontSize:16, width:20, textAlign:"center" }}>{n.icon}</span> {n.label}
            </div>
          ))}
        </div>
        <div style={{ padding:"16px 13px", borderTop:`1px solid rgba(255,255,255,0.1)` }}>
          <div style={{ display:"flex", alignItems:"center", gap:11, marginBottom:13, paddingBottom:13, borderBottom:`1px solid rgba(255,255,255,0.1)` }}>
            <div style={{ width:34, height:34, borderRadius:"50%", background:`linear-gradient(135deg,${theme.primary},${theme.accent})`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <span style={{ color:"#fff", fontSize:13, fontWeight:700 }}>{store.auth.username[0].toUpperCase()}</span>
            </div>
            <div style={{ overflow:"hidden", minWidth: 0 }}>
              <div style={{ fontSize:12.5, fontWeight:700, color:"#fff", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{store.auth.username}</div>
              <div style={{ fontSize:10, color:`rgba(255,255,255,0.5)`, marginTop: 2.5 }}>Administrator</div>
            </div>
          </div>
          <button className="btn-ghost" onClick={()=>save(s=>({...s,auth:null}))}
            style={{ width:"100%", padding:"9px", border:`1px solid rgba(255,255,255,0.2)`, borderRadius:10, background:"transparent", fontSize:12.5, color:`rgba(255,255,255,0.7)`, fontWeight:700, cursor:"pointer", letterSpacing: "0.4px", transition:"all 0.2s" }}>Sign Out</button>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0 }}>
        <div style={{ padding:"0 20px", height:64, background:"#fff", borderBottom:`1px solid #E5E7EB`, display:"flex", alignItems:"center", gap:16, flexShrink:0, boxShadow:"0 2px 6px rgba(0,0,0,0.04)" }}>
          <button onClick={()=>setSideOpen(o=>!o)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:24, padding:"4px 8px", color:theme.primary, lineHeight:1, borderRadius:8, transition:"all 0.2s" }}>☰</button>
          <div style={{ display:"flex", alignItems:"center", gap:9, fontSize:14, fontWeight: 500, minWidth: 0 }}>
            <span style={{ color:"#9CA3AF", whiteSpace: "nowrap" }}>AccountingPro</span>
            <span style={{ color:"#D1D5DB" }}>›</span>
            <span style={{ fontWeight:700, color:"#1E1B4B", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{navItems.find(n=>n.id===page)?.label}</span>
          </div>
          <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:18 }}>
            <div style={{ fontSize:12, color:"#9CA3AF", fontWeight: 700, letterSpacing: "0.4px", whiteSpace: "nowrap" }}>{new Date().toLocaleDateString("en-US",{weekday:"short",year:"numeric",month:"short",day:"numeric"})}</div>
            <div style={{ position: "relative" }}>
              <button onClick={()=>setShowThemeMenu(o=>!o)} style={{ background:theme.primaryLight, border:`2px solid ${theme.primary}`, cursor:"pointer", fontSize:20, padding:"5px 8px", color:theme.primary, borderRadius:9, fontWeight:700, transition:"all 0.2s", lineHeight:1 }}>🎨</button>
              {showThemeMenu && <div style={{ position:"absolute", top:"100%", right:0, background:"#fff", borderRadius:13, border:`1px solid #E5E7EB`, padding:"12px", marginTop:10, boxShadow:"0 16px 40px rgba(0,0,0,0.15)", zIndex:1000 }}>
                <div style={{ fontSize:10, fontWeight:700, color:"#6B7280", marginBottom:12, paddingBottom:10, borderBottom:"1px solid #E5E7EB", letterSpacing:"0.6px" }}>SELECT THEME</div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(2, 1fr)", gap:9 }}>
                  {Object.entries(THEMES).map(([key, t]) => (
                    <button key={key} onClick={()=>switchTheme(key)} className="theme-btn" style={{ background:`linear-gradient(135deg,${t.primary},${t.accent})`, opacity: store.theme === key ? 1 : 0.65, borderColor: store.theme === key ? "#fff" : "transparent" }} title={t.name}>
                      <span style={{ color:"#fff", fontSize:10, fontWeight:700 }}>{t.name.slice(0,1)}</span>
                    </button>
                  ))}
                </div>
              </div>}
            </div>
          </div>
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:"1.8rem", background:"#FAFBFC" }}>
          <div key={pageKey} className="fade-in" style={{maxWidth:"2000px", margin:"0 auto"}}>
            {page==="dashboard" && <Dashboard store={store} go={go} theme={theme} />}
            {page==="accounts"  && <Accounts store={store} save={save} toast={toast} theme={theme} />}
            {page==="sales"     && <VoucherForm type="Sales Invoice"     store={store} save={save} toast={toast} theme={theme} />}
            {page==="purchase"  && <VoucherForm type="Purchase Invoice"  store={store} save={save} toast={toast} theme={theme} />}
            {page==="journal"   && <VoucherForm type="Journal Voucher"   store={store} save={save} toast={toast} theme={theme} />}
            {page==="cashpay"   && <VoucherForm type="Cash Payment"      store={store} save={save} toast={toast} theme={theme} />}
            {page==="cashrec"   && <VoucherForm type="Cash Receipt"      store={store} save={save} toast={toast} theme={theme} />}
            {page==="ledger"    && <Ledger store={store} save={save} toast={toast} theme={theme} />}
            {page==="trial"     && <TrialBalance store={store} theme={theme} />}
            {page==="pl"        && <PandL store={store} theme={theme} />}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────
function AuthScreen({ mode, setMode, form, setForm, err, setErr, onLogin, onSignup }) {
  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)" }}>
      <div style={{ position:"absolute", inset:0, opacity:0.1, backgroundImage:"url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
      <div className="pop-in" style={{ position:"relative", background:"#fff", borderRadius:22, padding:"2.8rem 2.2rem", width:"min(380px, 92vw)", boxShadow:"0 40px 100px rgba(0,0,0,0.4)", border:"1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ textAlign:"center", marginBottom:"2.2rem" }}>
          <div style={{ width:60, height:60, borderRadius:18, background:"linear-gradient(135deg,#6366F1,#8B5CF6)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px", boxShadow:"0 10px 28px rgba(99,102,241,0.5)" }}>
            <span style={{ color:"#fff", fontWeight:800, fontSize:26, fontStyle:"italic" }}>A</span>
          </div>
          <div style={{ fontWeight:800, fontSize:24, color:"#1E1B4B", letterSpacing:"-0.3px" }}>AccountingPro</div>
          <div style={{ fontSize:13.5, color:"#9CA3AF", marginTop:6, fontWeight:500 }}>{mode==="login"?"Sign in to your account":"Create your new account"}</div>
        </div>
        {err && <div className="slide-in" style={{ background:"#FEE2E2", color:"#991B1B", padding:"11px 14px", borderRadius:11, fontSize:12.5, marginBottom:16, fontWeight:600, borderLeft:`4px solid #DC2626` }}>⚠ {err}</div>}
        <div style={{ display:"flex", flexDirection:"column", gap:15 }}>
          <div>
            <label style={{ fontSize:11, fontWeight:700, color:"#6B7280", display:"block", marginBottom:6, letterSpacing:"0.5px" }}>USERNAME</label>
            <input placeholder="Enter your username" value={form.username} onChange={e=>{setForm({...form,username:e.target.value});setErr("");}} style={{...iStyle({primaryLight:"#EEF2FF"}), borderColor: "#E5E7EB" }} />
          </div>
          {mode==="signup" && <div>
            <label style={{ fontSize:11, fontWeight:700, color:"#6B7280", display:"block", marginBottom:6, letterSpacing:"0.5px" }}>EMAIL</label>
            <input type="email" placeholder="Enter your email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} style={{...iStyle({primaryLight:"#EEF2FF"}), borderColor: "#E5E7EB" }} />
          </div>}
          <div>
            <label style={{ fontSize:11, fontWeight:700, color:"#6B7280", display:"block", marginBottom:6, letterSpacing:"0.5px" }}>PASSWORD</label>
            <input type="password" placeholder="Enter your password" value={form.password} onChange={e=>{setForm({...form,password:e.target.value});setErr("");}} style={{...iStyle({primaryLight:"#EEF2FF"}), borderColor: "#E5E7EB" }} />
          </div>
          <button className="btn-primary" onClick={()=>mode==="login"?onLogin(form.username,form.password):onSignup(form.username,form.password,form.email)}
            style={{ padding:"12px", background:"linear-gradient(135deg,#6366F1,#8B5CF6)", color:"#fff", border:"none", borderRadius:11, fontWeight:700, fontSize:14.5, marginTop:6, boxShadow:"0 6px 20px rgba(99,102,241,0.35)" }}>
            {mode==="login"?"Sign In →":"Create Account →"}
          </button>
          <div style={{ textAlign:"center", fontSize:12.5, color:"#9CA3AF", fontWeight:500 }}>
            {mode==="login"?"Don't have an account? ":"Already have one? "}
            <span onClick={()=>{setMode(mode==="login"?"signup":"login");setErr("");}} style={{ color:"#6366F1", cursor:"pointer", fontWeight:700, transition:"all 0.2s" }}>
              {mode==="login"?"Create one":"Sign in"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD ───────────────────────────────────────────────────────────────
function Dashboard({ store, go, theme }) {
  const totalIncome = store.accounts.filter(a=>a.category==="Income").reduce((s,a)=>{
    let cr=0; store.vouchers.forEach(v=>v.lines.forEach(l=>{ if(l.accountCode===a.code) cr+=(l.cr||0)-(l.dr||0); })); return s+cr; },0);
  const totalExpense = store.accounts.filter(a=>a.category==="Expense").reduce((s,a)=>{
    let dr=0; store.vouchers.forEach(v=>v.lines.forEach(l=>{ if(l.accountCode===a.code) dr+=(l.dr||0)-(l.cr||0); })); return s+dr; },0);
  const net = totalIncome - totalExpense;
  const metrics = [
    {label:"Accounts",value:store.accounts.length,color:theme.primary,bg:theme.primaryLight,icon:"≡"},
    {label:"Vouchers",value:store.vouchers.length,color:theme.accent,bg:"rgba(255,255,255,0.6)",icon:"◈"},
    {label:"Income",value:"PKR "+fmt(totalIncome),color:"#10B981",bg:"#D1FAE5",icon:"↑"},
    {label:"Expenses",value:"PKR "+fmt(totalExpense),color:"#EF4444",bg:"#FEE2E2",icon:"↓"},
    {label:net>=0?"Net Profit":"Net Loss",value:"PKR "+fmt(Math.abs(net)),color:net>=0?"#10B981":"#EF4444",bg:net>=0?"#D1FAE5":"#FEE2E2",icon:"◎"},
  ];
  const recent = [...store.vouchers].reverse().slice(0,5);
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"1.6rem" }}>
      <PageHeader title="Dashboard" sub="Welcome back! Here's your financial overview at a glance." />
      <div style={{ display:"flex", gap:13, flexWrap:"wrap" }}>
        {metrics.map((m,i) => (
          <div key={m.label} className="metric-card" style={{ flex:"1 1 140px", background:"#fff", border:`1px solid #E5E7EB`, borderRadius:16, padding:"1.2rem", animationDelay:`${i*0.08}s`, boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:13 }}>
              <span style={{ fontSize:10.5, color:"#9CA3AF", fontWeight:700, letterSpacing:"0.4px" }}>{m.label.toUpperCase()}</span>
              <div style={{ width:34, height:34, borderRadius:11, background:m.bg, display:"flex", alignItems:"center", justifyContent:"center", color:m.color, fontSize:16 }}>{m.icon}</div>
            </div>
            <div style={{ fontWeight:800, fontSize:23, color:m.color, lineHeight:1.2, letterSpacing:"-0.3px" }}>{m.value}</div>
          </div>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))", gap:16 }}>
        <Card theme={theme}>
          <div style={{ fontWeight:700, fontSize:15.5, color:"#1E1B4B", marginBottom:15, letterSpacing:"0.2px" }}>Recent Vouchers</div>
          {recent.length===0 && <div style={{ fontSize:13.5, color:"#9CA3AF", padding:"1.4rem 0", textAlign:"center", fontWeight:500 }}>No vouchers yet. Create one to get started.</div>}
          {recent.map(v=>(
            <div key={v.id} className="row-hover" style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"11px 8px", borderBottom:"1px solid #F3F4F6", borderRadius:8, cursor:"pointer" }}>
              <div>
                <div style={{ fontSize:12.5, fontWeight:700, color:theme.primary, fontFamily:"'Courier New', monospace", letterSpacing:"0.6px" }}>{v.voucherNo}</div>
                <div style={{ fontSize:11.5, color:"#9CA3AF", marginTop:3 }}>{(v.narration||"—").slice(0,34)}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:11.5, color:"#6B7280", fontWeight:600 }}>{v.date}</div>
                <span className="badge" style={{ background:theme.primaryLight, color:theme.primary, marginTop:5, display:"block" }}>{v.type.split(" ")[0]}</span>
              </div>
            </div>
          ))}
        </Card>
        <Card theme={theme}>
          <div style={{ fontWeight:700, fontSize:15.5, color:"#1E1B4B", marginBottom:13, letterSpacing:"0.2px" }}>Quick Access</div>
          {[
            {label:"Sales Invoice",page:"sales",emoji:"📊"},
            {label:"Purchase Order",page:"purchase",emoji:"📦"},
            {label:"Journal Entry",page:"journal",emoji:"📝"},
            {label:"Cash Receipt",page:"cashrec",emoji:"💰"},
            {label:"Cash Payment",page:"cashpay",emoji:"💸"},
            {label:"Ledger View",page:"ledger",emoji:"📖"},
          ].map(a=>(
            <button key={a.label} onClick={()=>go(a.page)} className="btn-ghost"
              style={{ width:"100%", padding:"10px 13px", fontSize:13.5, border:`1px solid ${theme.primaryLight}`, borderRadius:11, background:theme.primaryLight, marginBottom:8, textAlign:"left", color:theme.primary, fontWeight:600, cursor:"pointer", transition:"all 0.22s" }}>
              {a.emoji} {a.label} →
            </button>
          ))}
        </Card>
      </div>
    </div>
  );
}

// ─── ACCOUNTS ────────────────────────────────────────────────────────────────
function Accounts({ store, save, toast, theme }) {
  const [form, setForm] = useState({ code:"", name:"", category:CATS[0] });
  const [editId, setEditId] = useState(null);
  const [delId, setDelId] = useState(null);

  const save_ = () => {
    if(!form.code||!form.name){toast("All fields required","error");return;}
    if(editId) {
      save(s=>({...s,accounts:s.accounts.map(a=>a.code===editId?{code:form.code,name:form.name,category:form.category}:a)}));
      setEditId(null);
    } else {
      if(store.accounts.find(a=>a.code===form.code)){toast("Code already exists","error");return;}
      save(s=>({...s,accounts:[...s.accounts,{code:form.code,name:form.name,category:form.category}]}));
    }
    setForm({code:"",name:"",category:CATS[0]});
    toast(editId?"Account updated":"Account created");
  };

  const edit = a => { setForm(a); setEditId(a.code); };
  const del = () => { save(s=>({...s,accounts:s.accounts.filter(a=>a.code!==delId)})); setDelId(null); toast("Account deleted"); };

  return (
    <div>
      <PageHeader title="Chart of Accounts" sub="Manage and organize your account structure for financial tracking." />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(380px,1fr))", gap:20 }}>
        <Card theme={theme}>
          <div style={{ fontWeight:700, fontSize:15, color:"#1E1B4B", marginBottom:16, letterSpacing:"0.2px" }}>New Account</div>
          <div style={{ display:"flex", flexDirection:"column", gap:13 }}>
            <div>
              <label style={{ fontSize:11, fontWeight:700, color:"#6B7280", display:"block", marginBottom:6, letterSpacing:"0.4px" }}>ACCOUNT CODE</label>
              <input placeholder="e.g., 1000" value={form.code} onChange={e=>setForm({...form,code:e.target.value})} style={iStyle(theme)} disabled={!!editId} />
            </div>
            <div>
              <label style={{ fontSize:11, fontWeight:700, color:"#6B7280", display:"block", marginBottom:6, letterSpacing:"0.4px" }}>ACCOUNT NAME</label>
              <input placeholder="e.g., Petty Cash" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} style={iStyle(theme)} />
            </div>
            <div>
              <label style={{ fontSize:11, fontWeight:700, color:"#6B7280", display:"block", marginBottom:6, letterSpacing:"0.4px" }}>CATEGORY</label>
              <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} style={iStyle(theme)}>
                {CATS.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <button onClick={save_} className="btn-primary" style={{ padding:"11px", background:theme.primary, color:"#fff", boxShadow:`0 6px 20px rgba(0,0,0,0.15)` }}>
              {editId?"Update Account":"Create Account"}
            </button>
            {editId && <button onClick={()=>{setEditId(null);setForm({code:"",name:"",category:CATS[0]});}} style={{ padding:"9px", background:"#F3F4F6", color:"#6B7280", border:"none", borderRadius:10, fontSize:13, cursor:"pointer", fontWeight:600, transition:"all 0.2s" }}>Cancel</button>}
          </div>
        </Card>
        <Card theme={theme}>
          <div style={{ fontWeight:700, fontSize:15, color:"#1E1B4B", marginBottom:14, letterSpacing:"0.2px" }}>Accounts ({store.accounts.length})</div>
          {store.accounts.length===0?<div style={{ fontSize:13.5, color:"#9CA3AF", padding:"1.2rem", fontWeight:500 }}>No accounts yet. Create one above.</div>:
store.accounts.map(a=>(
            <div key={a.code} className="row-hover" style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"11px 8px", borderBottom:"1px solid #F3F4F6", borderRadius:8 }}>
              <div>
                <div style={{ fontSize:12.5, fontWeight:700, color:"#111827" }}>{a.name}</div>
                <div style={{ fontSize:10.5, color:"#9CA3AF", marginTop:2 }}>{a.code} · {a.category}</div>
              </div>
              <div style={{ display:"flex", gap:7 }}>
                <button onClick={()=>edit(a)} style={{ padding:"5px 11px", fontSize:11, background:`${theme.primaryLight}`, border:"none", borderRadius:7, cursor:"pointer", color:theme.primary, fontWeight:700, transition:"all 0.2s" }}>Edit</button>
                <button onClick={()=>setDelId(a.code)} style={{ padding:"5px 11px", fontSize:11, background:"#FEE2E2", border:"none", borderRadius:7, cursor:"pointer", color:"#DC2626", fontWeight:700, transition:"all 0.2s" }}>Delete</button>
              </div>
            </div>
          ))}
        </Card>
      </div>
      {delId && <Modal title="Delete Account" onClose={()=>setDelId(null)} onConfirm={del} text="This action cannot be undone." theme={theme} />}
    </div>
  );
}

// ─── VOUCHER FORM ────────────────────────────────────────────────────────────
function VoucherForm({ type, store, save, toast, theme }) {
  const [form, setForm] = useState({ date:today(), narration:"", lines:[{accountCode:"",dr:0,cr:0}] });
  const [errors, setErrors] = useState([]);

  const addLine = () => setForm({...form,lines:[...form.lines,{accountCode:"",dr:0,cr:0}]});
  const rmLine = i => setForm({...form,lines:form.lines.filter((_,x)=>x!==i)});
  const upLine = (i,k,v) => {
    const lines=[...form.lines];
    lines[i]={...lines[i],[k]:k==="accountCode"?v:parseFloat(v)||0};
    setForm({...form,lines});
  };

  const submit = () => {
    const errs=[];
    if(!form.date)errs.push("Date required");
    form.lines.forEach((l,i)=>{
      if(!l.accountCode)errs.push(`Line ${i+1}: Select account`);
      if(l.dr<0||l.cr<0)errs.push(`Line ${i+1}: Amounts must be positive`);
    });
    const dr=form.lines.reduce((s,l)=>s+l.dr,0);
    const cr=form.lines.reduce((s,l)=>s+l.cr,0);
    if(Math.abs(dr-cr)>0.01)errs.push(`Debit (PKR ${fmt(dr)}) must equal Credit (PKR ${fmt(cr)})`);
    if(errs.length){setErrors(errs);return;}
    const vNo=vId(store.nextVoucher);
    save(s=>({...s,vouchers:[...s.vouchers,{id:Date.now(),voucherNo:vNo,type,date:form.date,narration:form.narration,lines:form.lines}],nextVoucher:s.nextVoucher+1}));
    setForm({date:today(),narration:"",lines:[{accountCode:"",dr:0,cr:0}]});
    setErrors([]);
    toast("Voucher posted successfully");
  };

  const dr=form.lines.reduce((s,l)=>s+l.dr,0);
  const cr=form.lines.reduce((s,l)=>s+l.cr,0);
  const balanced=Math.abs(dr-cr)<0.01;

  return (
    <div>
      <PageHeader title={type} sub={`Post a new ${type.toLowerCase()} and track your financial transactions.`} />
      <Card theme={theme} style={{ marginBottom:20 }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:15, marginBottom:18 }}>
          <div>
            <label style={{ fontSize:11, fontWeight:700, color:"#6B7280", display:"block", marginBottom:6, letterSpacing:"0.4px" }}>DATE</label>
            <input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} style={iStyle(theme)} />
          </div>
          <div>
            <label style={{ fontSize:11, fontWeight:700, color:"#6B7280", display:"block", marginBottom:6, letterSpacing:"0.4px" }}>NARRATION</label>
            <input placeholder="Description of transaction" value={form.narration} onChange={e=>setForm({...form,narration:e.target.value})} style={iStyle(theme)} />
          </div>
        </div>
        {errors.length>0 && <div style={{ background:"#FEE2E2", color:"#991B1B", padding:"12px 14px", borderRadius:11, fontSize:12.5, marginBottom:16, borderLeft:`4px solid #DC2626` }}>
          {errors.map((e,i)=><div key={i} style={{marginTop: i > 0 ? 5 : 0}}>• {e}</div>)}
        </div>}
        <div style={{ overflowX:"auto", marginBottom:16 }}>
          <table style={{ fontSize:12.5, minWidth: "700px" }}>
            <thead>
              <tr style={{ borderBottom:`2px solid ${theme.primaryLight}`, background:theme.primaryLight }}>
                <th style={{ textAlign:"left", padding:"12px", fontWeight:700, color:theme.primary, letterSpacing:"0.3px" }}>ACCOUNT</th>
                <th style={{ textAlign:"right", padding:"12px", fontWeight:700, color:theme.primary, width:110, letterSpacing:"0.3px" }}>DEBIT</th>
                <th style={{ textAlign:"right", padding:"12px", fontWeight:700, color:theme.primary, width:110, letterSpacing:"0.3px" }}>CREDIT</th>
                <th style={{ textAlign:"center", padding:"12px", fontWeight:700, color:theme.primary, width:44, letterSpacing:"0.3px" }}>ACT</th>
              </tr>
            </thead>
            <tbody>
              {form.lines.map((l,i)=>(
                <tr key={i} style={{ borderBottom:"1px solid #F3F4F6" }}>
                  <td style={{ padding:"10px" }}>
                    <select value={l.accountCode} onChange={e=>upLine(i,"accountCode",e.target.value)} style={{...iStyle(theme),fontSize:12}}>
                      <option value="">Select account</option>
                      {store.accounts.map(a=><option key={a.code} value={a.code}>{a.name} ({a.code})</option>)}
                    </select>
                  </td>
                  <td style={{ padding:"10px" }}>
                    <input type="number" min="0" step="0.01" value={l.dr} onChange={e=>upLine(i,"dr",e.target.value)} style={{...iStyle(theme),fontSize:12,textAlign:"right"}} />
                  </td>
                  <td style={{ padding:"10px" }}>
                    <input type="number" min="0" step="0.01" value={l.cr} onChange={e=>upLine(i,"cr",e.target.value)} style={{...iStyle(theme),fontSize:12,textAlign:"right"}} />
                  </td>
                  <td style={{ padding:"10px", textAlign:"center" }}>
                    <button onClick={()=>rmLine(i)} style={{ background:"none", border:"none", color:"#EF4444", cursor:"pointer", fontSize:18, padding:0, fontWeight:700, lineHeight:1 }}>×</button>
                  </td>
                </tr>
              ))}
              <tr style={{ background:theme.primaryLight, fontWeight:700 }}>
                <td style={{ padding:"12px", color:theme.primary }}>TOTAL</td>
                <td style={{ padding:"12px", textAlign:"right", color:balanced?theme.primary:"#EF4444" }}>PKR {fmt(dr)}</td>
                <td style={{ padding:"12px", textAlign:"right", color:balanced?theme.primary:"#EF4444" }}>PKR {fmt(cr)}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style={{ display:"flex", gap:11 }}>
          <button onClick={addLine} style={{ flex:1, padding:"10px", border:`2px dashed #D1D5DB`, background:"#F9FAFB", borderRadius:11, color:"#6B7280", cursor:"pointer", fontWeight:700, fontSize:13.5, transition:"all 0.2s" }}>+ Add Line</button>
          <button onClick={submit} className="btn-primary" style={{ flex:1, padding:"10px", background:theme.primary, color:"#fff", boxShadow:`0 6px 20px rgba(0,0,0,0.15)` }}>Post Voucher</button>
        </div>
      </Card>
    </div>
  );
}

// ─── LEDGER ──────────────────────────────────────────────────────────────────
function Ledger({ store, save, toast, theme }) {
  const [selCode, setSelCode] = useState(store.accounts[0]?.code||"");
  const account=store.accounts.find(a=>a.code===selCode);
  const txns=[];
  store.vouchers.forEach(v=>{
    v.lines.forEach(l=>{
      if(l.accountCode===selCode){
        txns.push({...l,voucherNo:v.voucherNo,type:v.type,date:v.date});
      }
    });
  });
  txns.sort((a,b)=>new Date(a.date)-new Date(b.date));
  let bal=0;
  const rows=txns.map(t=>{
    const dr=t.dr||0, cr=t.cr||0;
    bal+=dr-cr;
    return{...t,balance:bal};
  });
  return(
    <div>
      <PageHeader title="Ledger" sub="View detailed account-wise transaction history and running balances." />
      <Card theme={theme} style={{marginBottom:20}}>
        <label style={{fontSize:11,fontWeight:700,color:"#6B7280",display:"block",marginBottom:8, letterSpacing:"0.4px"}}>SELECT ACCOUNT</label>
        <select value={selCode} onChange={e=>setSelCode(e.target.value)} style={iStyle(theme)}>
          {store.accounts.map(a=><option key={a.code} value={a.code}>{a.name} ({a.code})</option>)}
        </select>
      </Card>
      <Card theme={theme}>
        {account && <div style={{marginBottom:18, paddingBottom:14, borderBottom:`1px solid #E5E7EB`}}>
          <div style={{fontSize:12.5,color:"#6B7280", fontWeight:600}}>Account: <span style={{fontWeight:700,color:theme.primary}}>{account.name}</span></div>
          <div style={{fontSize:12.5,color:"#6B7280", fontWeight:600, marginTop:6}}>Category: <span style={{fontWeight:700,color:"#111"}}>{account.category}</span></div>
        </div>}
        <div style={{overflowX:"auto"}}>
          <table style={{fontSize:12, minWidth:"700px"}}>
            <thead>
              <tr style={{borderBottom:`2px solid ${theme.primaryLight}`, background:theme.primaryLight}}>
                <th style={{textAlign:"left",padding:"12px",fontWeight:700,color:theme.primary, letterSpacing:"0.3px"}}>DATE</th>
                <th style={{textAlign:"left",padding:"12px",fontWeight:700,color:theme.primary, letterSpacing:"0.3px"}}>VOUCHER</th>
                <th style={{textAlign:"left",padding:"12px",fontWeight:700,color:theme.primary, letterSpacing:"0.3px"}}>TYPE</th>
                <th style={{textAlign:"right",padding:"12px",fontWeight:700,color:theme.primary,width:90, letterSpacing:"0.3px"}}>DEBIT</th>
                <th style={{textAlign:"right",padding:"12px",fontWeight:700,color:theme.primary,width:90, letterSpacing:"0.3px"}}>CREDIT</th>
                <th style={{textAlign:"right",padding:"12px",fontWeight:700,color:theme.primary,width:90, letterSpacing:"0.3px"}}>BALANCE</th>
              </tr>
            </thead>
            <tbody>
              {rows.length===0?<tr><td colSpan="6" style={{padding:"24px",textAlign:"center",color:"#9CA3AF", fontWeight:500}}>No transactions for this account</td></tr>:
rows.map((r,i)=>(
                <tr key={i} style={{borderBottom:"1px solid #F3F4F6"}}>
                  <td style={{padding:"10px", fontWeight:600}}>{r.date}</td>
                  <td style={{padding:"10px",color:theme.primary,fontFamily:"'Courier New', monospace", fontWeight:600}}>{r.voucherNo}</td>
                  <td style={{padding:"10px"}}>
                    <span className="badge" style={{background:theme.primaryLight,color:theme.primary}}>{r.type.split(" ")[0]}</span>
                  </td>
                  <td style={{padding:"10px",textAlign:"right",color:r.dr?"#EF4444":"#9CA3AF", fontWeight:r.dr?600:400}}>{r.dr?fmt(r.dr):"-"}</td>
                  <td style={{padding:"10px",textAlign:"right",color:r.cr?"#10B981":"#9CA3AF", fontWeight:r.cr?600:400}}>{r.cr?fmt(r.cr):"-"}</td>
                  <td style={{padding:"10px",textAlign:"right",fontWeight:700,color:r.balance<0?"#EF4444":"#10B981"}}>{fmt(r.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── TRIAL BALANCE ───────────────────────────────────────────────────────────
function TrialBalance({ store, theme }) {
  const rows=store.accounts.map(a=>{
    let dr=0,cr=0;
    store.vouchers.forEach(v=>v.lines.forEach(l=>{
      if(l.accountCode===a.code){dr+=l.dr||0;cr+=l.cr||0;}
    }));
    return{...a,dr,cr};
  }).filter(r=>r.dr!==0||r.cr!==0);
  const totDr=rows.reduce((s,r)=>s+r.dr,0);
  const totCr=rows.reduce((s,r)=>s+r.cr,0);
  const balanced=Math.abs(totDr-totCr)<0.01;
  return(
    <div>
      <PageHeader title="Trial Balance" sub="Verify that your journal entries are balanced and accurate." />
      <Card theme={theme}>
        <div style={{overflowX:"auto"}}>
          <table style={{fontSize:13, minWidth:"700px"}}>
            <thead>
              <tr style={{borderBottom:`2px solid ${theme.primaryLight}`, background:theme.primaryLight}}>
                <th style={{textAlign:"left",padding:"13px",fontWeight:700,color:theme.primary, letterSpacing:"0.3px"}}>ACCOUNT NAME</th>
                <th style={{textAlign:"left",padding:"13px",fontWeight:700,color:theme.primary, letterSpacing:"0.3px", width:100}}>CODE</th>
                <th style={{textAlign:"right",padding:"13px",fontWeight:700,color:theme.primary,width:120, letterSpacing:"0.3px"}}>DEBIT</th>
                <th style={{textAlign:"right",padding:"13px",fontWeight:700,color:theme.primary,width:120, letterSpacing:"0.3px"}}>CREDIT</th>
              </tr>
            </thead>
            <tbody>
              {rows.length===0?<tr><td colSpan="4" style={{padding:"24px",textAlign:"center",color:"#9CA3AF", fontWeight:500}}>No trial balance data</td></tr>:
rows.map(r=>(
                <tr key={r.code} style={{borderBottom:"1px solid #F3F4F6"}}>
                  <td style={{padding:"11px", fontWeight:600}}>{r.name}</td>
                  <td style={{padding:"11px",color:"#9CA3AF",fontFamily:"'Courier New', monospace",fontSize:12, fontWeight:600}}>{r.code}</td>
                  <td style={{padding:"11px",textAlign:"right", fontWeight:600}}>{r.dr>0?fmt(r.dr):"-"}</td>
                  <td style={{padding:"11px",textAlign:"right", fontWeight:600}}>{r.cr>0?fmt(r.cr):"-"}</td>
                </tr>
              ))}
              <tr style={{background:theme.primaryLight,fontWeight:700,borderTop:`2px solid ${theme.primaryLight}`}}>
                <td colSpan="2" style={{padding:"13px", color:theme.primary}}>TOTAL</td>
                <td style={{padding:"13px",textAlign:"right",color:balanced?theme.primary:"#EF4444"}}>PKR {fmt(totDr)}</td>
                <td style={{padding:"13px",textAlign:"right",color:balanced?theme.primary:"#EF4444"}}>PKR {fmt(totCr)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        {balanced?<div style={{marginTop:16,color:theme.primary,fontSize:13,fontWeight:700}}>✓ Trial balance is perfectly balanced</div>:
        <div style={{marginTop:16,color:"#EF4444",fontSize:13,fontWeight:700}}>✕ Out of balance by PKR {fmt(Math.abs(totDr-totCr))}</div>}
      </Card>
    </div>
  );
}

// ─── PROFIT & LOSS ───────────────────────────────────────────────────────────
function PandL({ store, theme }) {
  const getAmnt=(cat)=>store.accounts.filter(a=>a.category===cat).reduce((s,a)=>{
    let amt=0;store.vouchers.forEach(v=>v.lines.forEach(l=>{
      if(l.accountCode===a.code)amt+=(l.cr||0)-(l.dr||0);
    }));return s+amt;
  },0);
  const income=getAmnt("Income");
  const expenses=getAmnt("Expense");
  const net=income-expenses;
  return(
    <div>
      <PageHeader title="Profit & Loss Statement" sub="Comprehensive income statement for your current accounting period." />
      <Card theme={theme} style={{maxWidth:700}}>
        <div style={{borderBottom:`2px solid ${theme.primaryLight}`,paddingBottom:14,marginBottom:18}}>
          <div style={{fontWeight:700,fontSize:16,color:"#1E1B4B", letterSpacing:"-0.3px"}}>PROFIT & LOSS STATEMENT</div>
          <div style={{fontSize:11.5,color:"#9CA3AF", marginTop:4, fontWeight:500}}>As of {new Date().toLocaleDateString("en-US", {year:"numeric", month:"long", day:"numeric"})}</div>
        </div>
        <div style={{marginBottom:22}}>
          <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${theme.primaryLight}`, fontWeight:700, color:"#1E1B4B"}}>
            <div>INCOME</div>
            <div></div>
          </div>
          {store.accounts.filter(a=>a.category==="Income").map(a=>{
            const amt=store.vouchers.reduce((s,v)=>s+v.lines.filter(l=>l.accountCode===a.code).reduce((t,l)=>t+(l.cr||0)-(l.dr||0),0),0);
            return amt!==0&&<div key={a.code} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",fontSize:13.5}}>
              <div style={{color:"#111"}}>{a.name}</div>
              <div style={{color:"#10B981",fontWeight:700}}>PKR {fmt(amt)}</div>
            </div>;
          })}
          <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0",marginTop:10,borderTop:`1px solid ${theme.primaryLight}`,fontWeight:700,fontSize:14}}>
            <div>Total Income</div>
            <div style={{color:"#10B981"}}>PKR {fmt(income)}</div>
          </div>
        </div>
        <div style={{marginBottom:24}}>
          <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${theme.primaryLight}`, fontWeight:700, color:"#1E1B4B"}}>
            <div>EXPENSES</div>
            <div></div>
          </div>
          {store.accounts.filter(a=>a.category==="Expense").map(a=>{
            const amt=store.vouchers.reduce((s,v)=>s+v.lines.filter(l=>l.accountCode===a.code).reduce((t,l)=>t+(l.dr||0)-(l.cr||0),0),0);
            return amt!==0&&<div key={a.code} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",fontSize:13.5}}>
              <div style={{color:"#111"}}>{a.name}</div>
              <div style={{color:"#EF4444",fontWeight:700}}>PKR {fmt(amt)}</div>
            </div>;
          })}
          <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0",marginTop:10,borderTop:`1px solid ${theme.primaryLight}`,fontWeight:700,fontSize:14}}>
            <div>Total Expenses</div>
            <div style={{color:"#EF4444"}}>PKR {fmt(expenses)}</div>
          </div>
        </div>
        <div style={{background:net>=0?theme.primaryLight:"#FEE2E2",padding:16,borderRadius:12,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{fontWeight:700,color:net>=0?theme.primary:"#EF4444", fontSize:14, letterSpacing:"0.3px"}}>{net>=0?"NET PROFIT":"NET LOSS"}</div>
          <div style={{fontSize:20,fontWeight:800,color:net>=0?theme.primary:"#EF4444"}}>PKR {fmt(Math.abs(net))}</div>
        </div>
      </Card>
    </div>
  );
}

// ─── MODAL ───────────────────────────────────────────────────────────────────
function Modal({ title, text, onConfirm, onClose, theme }) {
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999}}>
      <div className="pop-in" style={{background:"#fff",borderRadius:16,padding:24,maxWidth:380,boxShadow:"0 25px 60px rgba(0,0,0,0.2)", border:`1px solid #E5E7EB`}}>
        <div style={{fontWeight:700,fontSize:16,color:"#1E1B4B",marginBottom:10, letterSpacing:"-0.2px"}}>{title}</div>
        <div style={{fontSize:13.5,color:"#9CA3AF",marginBottom:20, lineHeight:1.6, fontWeight:500}}>{text}</div>
        <div style={{display:"flex",gap:11}}>
          <button onClick={onClose} style={{flex:1,padding:"10px",background:"#F3F4F6",border:"none",borderRadius:10,cursor:"pointer",fontWeight:700,fontSize:13,color:"#6B7280", transition:"all 0.2s"}}>Cancel</button>
          <button onClick={onConfirm} style={{flex:1,padding:"10px",background:"#EF4444",border:"none",borderRadius:10,cursor:"pointer",fontWeight:700,fontSize:13,color:"#fff", transition:"all 0.2s", boxShadow:"0 4px 12px rgba(239,68,68,0.3)"}}>Delete</button>
        </div>
      </div>
    </div>
  );
}

export default App;
