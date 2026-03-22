/**
 * ServiceManagement.jsx
 * Route: /admin/services
 *
 * SRS Coverage (FR-06):
 *   - Admin creates service categories
 *   - Defines service descriptions
 *   - Sets pricing (base_price)
 *   - Enable / disable (archive) services
 *
 * Fully self-contained — all API calls inline, no external imports.
 * No booking connection.
 */

import { useState, useEffect, useRef } from "react";
import "./ServiceManagement.css";

// ── Inline API ────────────────────────────────────────────────
const API_BASE = "http://127.0.0.1:8000/api/v1";
const authH = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
});

const apiGet    = (url)         => fetch(`${API_BASE}${url}`, { headers: authH() });
const apiPost   = (url, body)   => fetch(`${API_BASE}${url}`, { method: "POST",   headers: authH(), body: JSON.stringify(body) });
const apiPut    = (url, body)   => fetch(`${API_BASE}${url}`, { method: "PUT",    headers: authH(), body: JSON.stringify(body) });
const apiDelete = (url)         => fetch(`${API_BASE}${url}`, { method: "DELETE", headers: authH() });

// ── Seed data (used until real API responds) ──────────────────
const SEED = [
  {
    id: 1,
    name: "Oil Change",
    description: "Essential routine maintenance for engine longevity and performance.",
    base_price: 49.99,
    is_active: true,
    services_linked: 12,
    cover: "https://images.unsplash.com/photo-1635784063388-1ff3d6f5a5b3?w=400&q=75&fit=crop",
    icon: "wrench",
  },
  {
    id: 2,
    name: "Engine Repair",
    description: "Complete mechanical diagnostics and heavy-duty restoration work.",
    base_price: 199.99,
    is_active: true,
    services_linked: 8,
    cover: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&q=75&fit=crop",
    icon: "engine",
  },
  {
    id: 3,
    name: "Detailing",
    description: "Comprehensive interior and exterior cleaning and protection.",
    base_price: 79.99,
    is_active: true,
    services_linked: 15,
    cover: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=400&q=75&fit=crop",
    icon: "car",
  },
];

// ── Icon options ──────────────────────────────────────────────
const ICON_OPTIONS = [
  {
    key: "engine",
    label: "Engine",
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="8" width="18" height="10" rx="2"/>
        <path d="M7 8V6a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v2"/>
        <path d="M3 12h2M19 12h2M12 8v4"/>
      </svg>
    ),
  },
  {
    key: "car",
    label: "Car",
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/>
        <path d="M14 17H10"/>
        <circle cx="7.5" cy="17.5" r="2.5"/>
        <circle cx="16.5" cy="17.5" r="2.5"/>
        <path d="M5 7l2-4h10l2 4"/>
      </svg>
    ),
  },
  {
    key: "tool",
    label: "Tool",
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
      </svg>
    ),
  },
  {
    key: "wrench",
    label: "Wrench",
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
      </svg>
    ),
  },
];

// ── Blank form template ───────────────────────────────────────
const BLANK = {
  id: null,
  name: "",
  description: "",
  base_price: "",
  is_active: true,
  services_linked: 0,
  cover: "",
  icon: "wrench",
};

// ─────────────────────────────────────────────────────────────
export default function ServiceManagement() {
  const [categories,  setCategories]  = useState(SEED);
  const [tab,         setTab]         = useState("all");  // "all" | "active" | "archived"
  const [search,      setSearch]      = useState("");
  const [panel,       setPanel]       = useState(null);   // null | "edit" | "add"
  const [form,        setForm]        = useState(BLANK);
  const [saving,      setSaving]      = useState(false);
  const [toast,       setToast]       = useState("");
  const [deleteId,    setDeleteId]    = useState(null);
  const fileRef = useRef();

  // ── load from API on mount ────────────────────────────────
  useEffect(() => {
    apiGet("/admin/services/")
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setCategories(data); })
      .catch(() => {}); // silently use seed data if API unavailable
  }, []);

  // ── toast helper ─────────────────────────────────────────
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2800);
  };

  // ── filtered list ─────────────────────────────────────────
  const filtered = categories.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchTab =
      tab === "all"      ? true :
      tab === "active"   ? c.is_active :
      tab === "archived" ? !c.is_active : true;
    return matchSearch && matchTab;
  });

  // ── open edit panel ───────────────────────────────────────
  const openEdit = (cat) => {
    setForm({ ...cat });
    setPanel("edit");
  };

  // ── open add panel ────────────────────────────────────────
  const openAdd = () => {
    setForm({ ...BLANK });
    setPanel("add");
  };

  // ── close panel ───────────────────────────────────────────
  const closePanel = () => {
    setPanel(null);
    setForm(BLANK);
  };

  // ── handle form field change ──────────────────────────────
  const setField = (key, val) => setForm(f => ({ ...f, [key]: val }));

  // ── save (create or update) ───────────────────────────────
  const handleSave = async () => {
    if (!form.name.trim()) { showToast("Category name is required."); return; }
    setSaving(true);
    try {
      const body = {
        name:        form.name,
        description: form.description,
        base_price:  parseFloat(form.base_price) || 0,
        is_active:   form.is_active,
        icon:        form.icon,
      };

      let saved;
      if (panel === "add") {
        const res  = await apiPost("/admin/services/", body);
        saved = await res.json();
        if (res.ok) {
          setCategories(prev => [...prev, { ...saved, services_linked: 0 }]);
          showToast("Category created successfully.");
        } else {
          showToast(saved.detail || "Could not create category.");
        }
      } else {
        const res  = await apiPut(`/admin/services/${form.id}/`, body);
        saved = await res.json();
        if (res.ok) {
          setCategories(prev => prev.map(c => c.id === form.id ? { ...c, ...saved } : c));
          showToast("Changes saved.");
        } else {
          showToast(saved.detail || "Could not save changes.");
        }
      }
    } catch {
      // optimistic local update when API is unavailable
      if (panel === "add") {
        const newCat = { ...form, id: Date.now(), services_linked: 0 };
        setCategories(prev => [...prev, newCat]);
        showToast("Category added (offline mode).");
      } else {
        setCategories(prev => prev.map(c => c.id === form.id ? { ...c, ...form } : c));
        showToast("Changes saved (offline mode).");
      }
    } finally {
      setSaving(false);
      closePanel();
    }
  };

  // ── archive / unarchive ───────────────────────────────────
  const handleArchive = async () => {
    try {
      await apiDelete(`/admin/services/${form.id}/`);
    } catch {}
    setCategories(prev =>
      prev.map(c => c.id === form.id ? { ...c, is_active: false } : c)
    );
    showToast("Category archived.");
    closePanel();
  };

  // ── cover image preview ───────────────────────────────────
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setField("cover", ev.target.result);
    reader.readAsDataURL(file);
  };

  // ── render ────────────────────────────────────────────────
  return (
    <div className="sm-root">

      {/* ── Toast ── */}
      {toast && <div className="sm-toast">{toast}</div>}

      {/* ── Navbar ── */}
      <header className="sm-header">
        <div className="sm-header-left">
          <div className="sm-logo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1"/>
              <rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/>
              <rect x="14" y="14" width="7" height="7" rx="1"/>
            </svg>
          </div>
          <h1 className="sm-title">Service Management</h1>
        </div>

        <div className="sm-header-right">
          <div className="sm-search-wrap">
            <svg className="sm-search-icon" width="15" height="15" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              className="sm-search"
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="sm-btn-add" onClick={openAdd}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Category
          </button>
          <div className="sm-avatar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="#666" strokeWidth="1.8" strokeLinecap="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
        </div>
      </header>

      {/* ── Main layout ── */}
      <div className="sm-body">

        {/* ── Left: grid area ── */}
        <div className={`sm-grid-area${panel ? " sm-grid-area--narrow" : ""}`}>

          {/* Tabs */}
          <div className="sm-tabs">
            {["all", "active", "archived"].map((t) => (
              <button
                key={t}
                className={`sm-tab${tab === t ? " active" : ""}`}
                onClick={() => setTab(t)}
              >
                {t === "all" ? "All Categories" : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {/* Cards grid */}
          <div className="sm-grid">
            {filtered.map((cat) => (
              <div
                key={cat.id}
                className={`sm-card${panel && form.id === cat.id ? " sm-card--selected" : ""}`}
              >
                {/* cover image */}
                <div className="sm-card-img-wrap">
                  {cat.cover
                    ? <img src={cat.cover} alt={cat.name} className="sm-card-img" />
                    : <div className="sm-card-img-placeholder">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                          stroke="#ccc" strokeWidth="1.5">
                          <rect x="3" y="3" width="18" height="18" rx="2"/>
                          <circle cx="8.5" cy="8.5" r="1.5"/>
                          <polyline points="21 15 16 10 5 21"/>
                        </svg>
                      </div>
                  }
                  <button
                    className="sm-card-edit-btn"
                    onClick={() => openEdit(cat)}
                    aria-label="Edit category"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                </div>

                {/* card body */}
                <div className="sm-card-body">
                  <h3 className="sm-card-name">{cat.name}</h3>
                  <p className="sm-card-desc">{cat.description}</p>
                  <div className="sm-card-meta">
                    <span className={`sm-badge${cat.is_active ? " sm-badge--active" : " sm-badge--archived"}`}>
                      {cat.is_active ? "Active" : "Archived"}
                    </span>
                    <span className="sm-card-count">
                      {cat.services_linked ?? 0} services linked
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Add new card */}
            <div className="sm-card sm-card--add" onClick={openAdd}>
              <div className="sm-card-add-inner">
                <div className="sm-add-circle">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                    stroke="#e05c2a" strokeWidth="2.2" strokeLinecap="round">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </div>
                <span className="sm-add-label">Add New Category</span>
              </div>
            </div>
          </div>

          {filtered.length === 0 && (
            <div className="sm-empty">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
                stroke="#ccc" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <p>No categories found.</p>
            </div>
          )}
        </div>

        {/* ── Right: edit / add panel ── */}
        {panel && (
          <aside className="sm-panel">
            <h2 className="sm-panel-heading">
              {panel === "add" ? "Add Category" : "Edit Category"}
            </h2>

            {/* Cover image */}
            <div className="sm-panel-field">
              <label className="sm-panel-label">Category Cover Image</label>
              <div
                className="sm-cover-preview"
                style={{ background: form.cover ? "transparent" : "#0d4a4a" }}
                onClick={() => fileRef.current?.click()}
              >
                {form.cover
                  ? <img src={form.cover} alt="cover" />
                  : <div className="sm-cover-placeholder">
                      <svg width="42" height="42" viewBox="0 0 24 24" fill="none"
                        stroke="rgba(255,255,255,0.25)" strokeWidth="1.2">
                        <rect x="3" y="3" width="18" height="18" rx="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                      </svg>
                    </div>
                }
                <div className="sm-cover-overlay">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="white" strokeWidth="2" strokeLinecap="round">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                  Change image
                </div>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </div>

            {/* Category Name */}
            <div className="sm-panel-field">
              <label className="sm-panel-label">Category Name</label>
              <input
                type="text"
                className="sm-panel-input"
                placeholder="e.g. Oil Change"
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
              />
            </div>

            {/* Description */}
            <div className="sm-panel-field">
              <label className="sm-panel-label">Description</label>
              <textarea
                className="sm-panel-textarea"
                placeholder="Describe this service category..."
                rows={4}
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
              />
            </div>

            {/* Base Price */}
            <div className="sm-panel-field">
              <label className="sm-panel-label">Base Price ($)</label>
              <input
                type="number"
                className="sm-panel-input"
                placeholder="0.00"
                min="0"
                step="0.01"
                value={form.base_price}
                onChange={(e) => setField("base_price", e.target.value)}
              />
            </div>

            {/* Icon Asset */}
            <div className="sm-panel-field">
              <label className="sm-panel-label">Icon Asset</label>
              <div className="sm-icon-row">
                {ICON_OPTIONS.map((ic) => (
                  <button
                    key={ic.key}
                    type="button"
                    className={`sm-icon-btn${form.icon === ic.key ? " active" : ""}`}
                    onClick={() => setField("icon", ic.key)}
                    title={ic.label}
                  >
                    {ic.svg}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="sm-panel-actions">
              <button
                className="sm-btn-save"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving…" : "Save Changes"}
              </button>
              <button className="sm-btn-cancel" onClick={closePanel}>
                Cancel
              </button>
            </div>

            {/* Archive — only in edit mode */}
            {panel === "edit" && form.is_active && (
              <button className="sm-btn-archive" onClick={handleArchive}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <polyline points="21 8 21 21 3 21 3 8"/>
                  <rect x="1" y="3" width="22" height="5"/>
                  <line x1="10" y1="12" x2="14" y2="12"/>
                </svg>
                Archive Category
              </button>
            )}
          </aside>
        )}

      </div>
    </div>
  );
}
