import { useState, useEffect } from "react";

const API_BASE = "http://127.0.0.1:8000/api/v1";

const FONTS_ID = "ps-fonts";
const STYLE_ID = "ps-styles";

const CSS = `
.ps-root { min-height: 100vh; background: #f8f9fa; font-family: 'DM Sans', sans-serif; color: #1a1a2e; display: flex; flex-direction: column; }
/* ...CSS omitted for brevity, see attachment for full CSS... */
`;

function injectStyles() {
  if (!document.getElementById(FONTS_ID)) {/* Lines 171-175 omitted */}
  if (!document.getElementById(STYLE_ID)) {/* Lines 177-180 omitted */}
}

const LANGS = [
  "English (United States)", "English (United Kingdom)", "French (France)",
  "German (Germany)", "Spanish (Spain)", "Arabic (UAE)",
];

const ROLES_SEED = [
  { id: 1, name: "Super Admin",      desc: "Full platform access",  users: 3, dot: "red"  },
  { id: 2, name: "Support Manager",  desc: "Tickets & users only",  users: 8, dot: "blue" },
  { id: 3, name: "Billing Analyst",  desc: "Financial reports",     users: 2, dot: "gray" },
];

const INTEGRATIONS_SEED = [
  { id: "maps",   name: "Google Maps Platform", desc: "Required for location tracking and geocoding",  status: "connected", key: "AIzaSyBw-x8X2kYm_H3l9ZpQ7v0rN5t1" },
  { id: "stripe", name: "Stripe Payments",      desc: "Handle subscriptions and transactional billing", status: "action",    key: "sk_test_••••••••••••••••" },
];

const TEMPLATES_SEED = [
  { id: 1, name: "Welcome Email",  sub: "User registration",    event: "New User Signup",        status: "active" },
  { id: 2, name: "Password Reset", sub: "Security verification", event: "Forgot Password Request", status: "active" },
  { id: 3, name: "Booking Confirmed", sub: "Booking lifecycle", event: "Booking Created",         status: "active" },
  { id: 4, name: "Service Completed",  sub: "Post-service",     event: "Booking Completed",       status: "active" },
];

const authH = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
});
const apiGet  = url => fetch(`${API_BASE}${url}`, { headers: authH() });
const apiPost = (url, body) => fetch(`${API_BASE}${url}`, { method:"POST",  headers: authH(), body: JSON.stringify(body) });
const apiPut  = (url, body) => fetch(`${API_BASE}${url}`, { method:"PUT",   headers: authH(), body: JSON.stringify(body) });
const apiPatch= (url, body) => fetch(`${API_BASE}${url}`, { method:"PATCH", headers: authH(), body: JSON.stringify(body) });

// ...SVG icon components omitted for brevity...

function KeyField({ value, onChange }) {
  const [show, setShow] = useState(false);
  return (
    <div className="ps-key-field">
      <input type={show ? "text" : "password"} value={value} onChange={e => onChange(e.target.value)} />
      <button type="button" className="ps-key-eye" onClick={() => setShow(s => !s)}>
        {show ? <IcEyeOff /> : <IcEye />}
      </button>
    </div>
  );
}

function AddRoleModal({ onClose, onSave }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  return (
    <div className="ps-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="ps-modal">
        <div className="ps-modal-head">
          <div className="ps-modal-title">Add New Role</div>
        </div>
        <div className="ps-modal-body">
          <div className="ps-field">
            <label className="ps-label">Role Name</label>
            <input className="ps-input" placeholder="e.g. Operations Manager" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="ps-field" style={{marginBottom:0}}>
            <label className="ps-label">Description</label>
            <input className="ps-input" placeholder="What can this role do?" value={desc} onChange={e => setDesc(e.target.value)} />
          </div>
        </div>
        <div className="ps-modal-foot">
          <button className="ps-btn-cancel" onClick={onClose}>Cancel</button>
          <button className="ps-btn-save" onClick={() => {/* Line 263 omitted */}}>Add Role</button>
        </div>
      </div>
    </div>
  );
}

export default function PlatformSettings() {
  useEffect(() => {/* Line 271 omitted */}, []);

  const [activeTab,  setActiveTab]  = useState("general");
  const [saving,     setSaving]     = useState(false);
  const [toast,      setToast]      = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);

  const [config, setConfig] = useState({
    platform_name: "AutoServe Vehicle Platform",
    default_language: "English (United States)",
    support_email: "support@autoserve.com",
  });

  const [integrations, setIntegrations] = useState(INTEGRATIONS_SEED);
  const [roles,        setRoles]        = useState(ROLES_SEED);
  const [templates,    setTemplates]    = useState(TEMPLATES_SEED);

  const [sysStatus] = useState({ uptime: "99.98%", region: "US-East" });

  useEffect(() => {/* Lines 291-298 omitted */}, []);

  function showToast(msg, type = "ok") {/* Lines 301-303 omitted */}

  async function handleSave() {/* Lines 306-319 omitted */}

  function handleCancel() {/* Lines 322-328 omitted */}

  function handleAddRole(role) {/* Lines 331-335 omitted */}

  function updateIntegrationKey(id, val) {/* Lines 338-339 omitted */}

  const TABS = [
    { id: "general",   label: "General",         icon: <IcSettings /> },
    { id: "apikeys",   label: "API Keys",         icon: <IcKey /> },
    { id: "templates", label: "Email Templates",  icon: <IcMail /> },
    { id: "roles",     label: "Admin Roles",      icon: <IcUsers /> },
  ];
  /* Lines 347-572 omitted */
}
