import React, { useState } from "react";

/* ─── INLINE STYLES ──────────────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  .inv-wrap * { box-sizing: border-box; margin: 0; padding: 0; }

  .inv-wrap {
    background: #0d1117;
    min-height: 100vh;
    font-family: 'Inter', sans-serif;
    color: #e6edf3;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 20px 64px;
  }

  /* NAV */
  .inv-nav {
    width: 100%; max-width: 780px;
    display: flex; align-items: center; justify-content: space-between;
    padding: 24px 0 32px;
  }
  .inv-nav-brand {
    display: flex; align-items: center; gap: 10px;
    font-size: 15px; font-weight: 600; color: #e6edf3;
  }
  .inv-nav-brand-icon {
    width: 32px; height: 32px; border-radius: 8px;
    background: #1e3a6e;
    display: flex; align-items: center; justify-content: center;
    color: #60a5fa;
  }
  .inv-nav-actions { display: flex; gap: 10px; }
  .inv-nav-btn {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 8px 16px;
    border-radius: 8px;
    border: 1px solid #30363d;
    background: #161b22;
    color: #c9d1d9;
    font-family: 'Inter', sans-serif;
    font-size: 13px; font-weight: 500;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s;
  }
  .inv-nav-btn:hover { background: #21262d; border-color: #8b949e; }

  /* CARD */
  .inv-card {
    width: 100%; max-width: 780px;
    background: #161b22;
    border: 1px solid #21262d;
    border-radius: 16px;
    padding: 40px 44px 44px;
  }

  /* INVOICE HEADER */
  .inv-top {
    display: flex; align-items: flex-start; justify-content: space-between;
    margin-bottom: 32px;
  }
  .inv-title {
    font-size: 28px; font-weight: 800;
    letter-spacing: -0.5px; color: #e6edf3;
    margin-bottom: 8px;
  }
  .inv-issued {
    display: flex; align-items: center; gap: 6px;
    font-size: 13px; color: #8b949e;
  }
  .inv-badge {
    padding: 7px 14px;
    background: #1e3a6e;
    color: #60a5fa;
    border-radius: 8px;
    font-size: 12px; font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    white-space: nowrap;
    margin-top: 4px;
  }

  /* PARTIES */
  .inv-parties {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 16px; margin-bottom: 32px;
  }
  .inv-party-right { text-align: right; }
  .inv-party-label {
    font-size: 11px; font-weight: 600;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: #6e7681; margin-bottom: 6px;
  }
  .inv-party-name {
    font-size: 16px; font-weight: 700;
    color: #e6edf3; margin-bottom: 4px;
  }
  .inv-party-name.blue { color: #2563eb; }
  .inv-party-addr { font-size: 13px; color: #8b949e; line-height: 1.65; }

  /* DIVIDER */
  .inv-hr { border: none; border-top: 1px solid #21262d; margin-bottom: 28px; }

  /* ITEMS */
  .inv-section-label {
    font-size: 15px; font-weight: 700; color: #e6edf3;
    margin-bottom: 16px;
  }
  .inv-items { display: flex; flex-direction: column; gap: 4px; margin-bottom: 32px; }

  .inv-item {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 16px;
    border-radius: 10px;
    transition: background 0.15s;
  }
  .inv-item:hover { background: #0d1117; }

  .inv-item-left { display: flex; align-items: center; gap: 14px; }

  .inv-item-icon-box {
    width: 38px; height: 38px; border-radius: 9px;
    background: #1e3a6e;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; color: #60a5fa;
  }

  .inv-item-name {
    font-size: 14px; font-weight: 600; color: #e6edf3; margin-bottom: 2px;
  }
  .inv-item-desc { font-size: 12.5px; color: #8b949e; }

  .inv-item-right { text-align: right; }
  .inv-item-price {
    font-size: 15px; font-weight: 700; color: #e6edf3;
    font-variant-numeric: tabular-nums;
  }
  .inv-item-tag { font-size: 12px; color: #6e7681; margin-top: 2px; }

  /* TOTALS */
  .inv-totals {
    display: flex; flex-direction: column; align-items: flex-end;
    gap: 2px; margin-bottom: 28px;
  }
  .inv-total-row {
    display: flex; justify-content: space-between;
    width: 300px; padding: 5px 0;
  }
  .inv-total-lbl { font-size: 13.5px; color: #8b949e; }
  .inv-total-val { font-size: 13.5px; color: #e6edf3; font-variant-numeric: tabular-nums; }
  .inv-total-row.grand { border-top: 1px solid #21262d; margin-top: 8px; padding-top: 14px; }
  .inv-total-row.grand .inv-total-lbl { font-size: 15px; font-weight: 700; color: #e6edf3; }
  .inv-total-row.grand .inv-total-val { font-size: 24px; font-weight: 800; color: #2563eb; }

  /* PAY BUTTON */
  .inv-pay-btn {
    width: 100%; padding: 16px;
    background: #2563eb; color: #fff;
    border: none; border-radius: 12px;
    font-family: 'Inter', sans-serif;
    font-size: 16px; font-weight: 700;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 10px;
    transition: background 0.15s, transform 0.1s, box-shadow 0.15s;
    box-shadow: 0 4px 20px rgba(37,99,235,0.4);
    margin-bottom: 12px;
  }
  .inv-pay-btn:hover { background: #1d4ed8; transform: translateY(-1px); box-shadow: 0 6px 24px rgba(37,99,235,0.5); }
  .inv-pay-btn:active { transform: translateY(0); }
  .inv-pay-btn.paid { background: #16a34a; box-shadow: 0 4px 20px rgba(22,163,74,0.4); }

  .inv-secure {
    display: flex; align-items: center; justify-content: center; gap: 5px;
    font-size: 12px; color: #6e7681;
  }

  /* FOOTER */
  .inv-footer { margin-top: 40px; text-align: center; }
  .inv-footer-title { font-size: 14px; font-weight: 500; color: #6e7681; margin-bottom: 4px; }
  .inv-footer-sub { font-size: 12px; color: #484f58; }
`;

/* ─── SVG ICONS (matching design exactly) ──────────────────────── */
const IconInvoiceDoc = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
    <line x1="9" y1="7" x2="15" y2="7"/>
    <line x1="9" y1="11" x2="15" y2="11"/>
    <line x1="9" y1="15" x2="13" y2="15"/>
  </svg>
);

const IconDownload = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

const IconShare = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3"/>
    <circle cx="6" cy="12" r="3"/>
    <circle cx="18" cy="19" r="3"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
  </svg>
);

const IconCalendar = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

/* Item icons — matching the design */
const IconWrench = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
  </svg>
);

const IconGear = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);

const IconDroplet = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
    <line x1="12" y1="12" x2="12" y2="16"/>
    <line x1="10" y1="14" x2="14" y2="14"/>
  </svg>
);

const IconCircle = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="12" r="3"/>
    <line x1="12" y1="2" x2="12" y2="9"/>
    <line x1="12" y1="15" x2="12" y2="22"/>
    <line x1="2" y1="12" x2="9" y2="12"/>
    <line x1="15" y1="12" x2="22" y2="12"/>
  </svg>
);

const IconCreditCard = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
    <line x1="1" y1="10" x2="23" y2="10"/>
  </svg>
);

const IconLock = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

/* ─── HELPERS ───────────────────────────────────────────────────── */
function fmt(n) {
  return "$" + Number(n).toFixed(2);
}

/* ─── DEFAULT DATA ──────────────────────────────────────────────── */
const defaultItems = [
  { icon: <IconWrench />,  name: "Standard Service Fee",   desc: "Routine diagnostic and multi-point inspection",  price: 85,  tag: "Labor"         },
  { icon: <IconGear />,    name: "Brake Pad Replacement",  desc: "Front axle high-performance ceramic pads",       price: 145, tag: "Parts"         },
  { icon: <IconDroplet />, name: "Synthetic Oil Change",   desc: "Full synthetic oil and premium filter upgrade",  price: 65,  tag: "Parts + Labor" },
  { icon: <IconCircle />,  name: "Wheel Alignment",        desc: "Four-wheel precision alignment",                 price: 90,  tag: "Labor"         },
];

/* ─── COMPONENT ─────────────────────────────────────────────────── */
export default function DigitalInvoice({
  invoiceNumber  = "INV-2023-084",
  issuedDate     = "November 12, 2023",
  dueLabel       = "DUE IN 5 DAYS",
  clientName     = "Alex Thompson",
  clientAddress  = "742 Evergreen Terrace",
  clientCity     = "Springfield, IL 62704",
  companyName    = "Precision Auto Care",
  companyAddress = "1024 Industrial Way",
  companyCity    = "Springfield, IL 62705",
  companyPhone   = "(555) 123-4567",
  items          = defaultItems,
  taxRate        = 0.08,
}) {
  const [paid, setPaid] = useState(false);

  const subtotal = items.reduce((s, i) => s + Number(i.price), 0);
  const tax      = subtotal * taxRate;
  const total    = subtotal + tax;

  return (
    <>
      <style>{css}</style>
      <div className="inv-wrap">

        {/* ── NAV ── */}
        <nav className="inv-nav">
          <div className="inv-nav-brand">
            <div className="inv-nav-brand-icon"><IconInvoiceDoc /></div>
            Digital Invoice
          </div>
          <div className="inv-nav-actions">
            <button className="inv-nav-btn"><IconDownload /> PDF</button>
            <button className="inv-nav-btn"><IconShare /> Share</button>
          </div>
        </nav>

        {/* ── CARD ── */}
        <div className="inv-card">

          {/* Header */}
          <div className="inv-top">
            <div>
              <div className="inv-title">Invoice #{invoiceNumber}</div>
              <div className="inv-issued">
                <IconCalendar /> Issued on {issuedDate}
              </div>
            </div>
            <div className="inv-badge">{dueLabel}</div>
          </div>

          {/* Parties */}
          <div className="inv-parties">
            <div>
              <div className="inv-party-label">Billed To</div>
              <div className="inv-party-name">{clientName}</div>
              <div className="inv-party-addr">{clientAddress}<br />{clientCity}</div>
            </div>
            <div className="inv-party-right">
              <div className="inv-party-label">From</div>
              <div className="inv-party-name blue">{companyName}</div>
              <div className="inv-party-addr">{companyAddress}<br />{companyCity}</div>
            </div>
          </div>

          <hr className="inv-hr" />

          {/* Line Items */}
          <div className="inv-section-label">Itemized Services &amp; Parts</div>
          <div className="inv-items">
            {items.map((item, i) => (
              <div className="inv-item" key={i}>
                <div className="inv-item-left">
                  <div className="inv-item-icon-box">{item.icon}</div>
                  <div>
                    <div className="inv-item-name">{item.name}</div>
                    <div className="inv-item-desc">{item.desc}</div>
                  </div>
                </div>
                <div className="inv-item-right">
                  <div className="inv-item-price">{fmt(item.price)}</div>
                  <div className="inv-item-tag">{item.tag}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="inv-totals">
            <div className="inv-total-row">
              <span className="inv-total-lbl">Subtotal</span>
              <span className="inv-total-val">{fmt(subtotal)}</span>
            </div>
            <div className="inv-total-row">
              <span className="inv-total-lbl">Tax ({(taxRate * 100).toFixed(0)}%)</span>
              <span className="inv-total-val">{fmt(tax)}</span>
            </div>
            <div className="inv-total-row grand">
              <span className="inv-total-lbl">Total Amount</span>
              <span className="inv-total-val">{fmt(total)}</span>
            </div>
          </div>

          {/* Pay Button */}
          <button
            className={`inv-pay-btn${paid ? " paid" : ""}`}
            onClick={() => setPaid(!paid)}
          >
            {paid
              ? "✓ Payment Received"
              : <><IconCreditCard /> Pay Now</>
            }
          </button>
          <div className="inv-secure">
            <IconLock /> Secure payment powered by Stripe. All transactions are encrypted.
          </div>

        </div>

        {/* Footer */}
        <div className="inv-footer">
          <div className="inv-footer-title">Thank you for choosing {companyName}!</div>
          <div className="inv-footer-sub">
            If you have any questions concerning this invoice, contact us at {companyPhone}
          </div>
        </div>

      </div>
    </>
  );
}
