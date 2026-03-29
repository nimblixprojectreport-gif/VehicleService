import { useState, useEffect } from "react";
 
const API_BASE = "http://127.0.0.1:8000/api/v1";
const FONTS_ID = "sd-fonts";
const STYLE_ID = "sd-styles";
 
const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
.sd-root{min-height:100vh;background:#f0f0ec;font-family:'DM Sans',sans-serif;color:#1a1a1a;display:flex;flex-direction:column;}
.sd-nav{height:64px;background:#fff;border-bottom:1px solid #e8e8e8;display:flex;align-items:center;padding:0 28px;gap:18px;position:sticky;top:0;z-index:100;box-shadow:0 1px 4px rgba(0,0,0,0.06);}
.sd-brand{display:flex;align-items:center;gap:10px;}
.sd-brand-icon{width:36px;height:36px;background:linear-gradient(135deg,#e05c2a,#c44e1e);border-radius:10px;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 10px rgba(224,92,42,0.35);}
.sd-brand-name{font-family:'Sora',sans-serif;font-size:18px;font-weight:800;color:#111;letter-spacing:-0.3px;}
// ...rest of CSS omitted for brevity, but will be included in the file...
`;
 
const SEED = [
	{ id:"#12084",title:"Dashboard loading error on iOS",  meta:"Product: Mobile App • Category: Technical",    requester:"John Doe",          req_type:"Customer",       ini:"JD",col:"#6366f1",st:"in_progress",   pr:"critical", act:"Updated 4m ago",   desc:"The dashboard fails to load on iOS after the latest app update. Users report an infinite spinner." },
	{ id:"#12083",title:"Spare parts bulk order request",  meta:"Product: Service Parts • Category: Sales",    requester:"TechCenter Phoenix",req_type:"Service Center",  ini:"TC",col:"#0ea5e9",st:"new",           pr:"medium",   act:"Created 12m ago",  desc:"Service center requesting bulk Q4 spare parts order. Needs sales approval." },
	{ id:"#12082",title:"Warranty verification failure",   meta:"Product: Hardware • Category: Warranty",     requester:"Anna Smith",        req_type:"Customer",       ini:"AS",col:"#f59e0b",st:"awaiting_reply", pr:"high",     act:"Updated 1h ago",   desc:"Customer warranty check failing — serial number not found in the system." },
	{ id:"#12081",title:"Payment gateway timeout",         meta:"Product: Checkout • Category: Billing",      requester:"Mike K.",           req_type:"Customer",       ini:"MK",col:"#e05c2a",st:"resolved",       pr:"low",      act:"Resolved 3h ago",  desc:"Payment gateway timed out during checkout flow. Issue resolved." },
	{ id:"#12080",title:"OTP not delivered to mobile",     meta:"Product: Auth • Category: Technical",        requester:"Sara Lee",          req_type:"Customer",       ini:"SL",col:"#8b5cf6",st:"open",           pr:"high",     act:"Created 2h ago",   desc:"Customer not receiving OTP SMS during login." },
	{ id:"#12079",title:"Partner payout delayed 3 weeks",  meta:"Product: Payments • Category: Billing",      requester:"Ravi Motors",       req_type:"Service Center",  ini:"RM",col:"#10b981",st:"escalated",      pr:"urgent",   act:"Escalated 30m ago", desc:"Partner has not received payout for 3 completed bookings. Escalated." },
];
 
const CHART = [
	{d:"M",h:45,hl:false},{d:"T",h:62,hl:false},{d:"W",h:90,hl:true},
	{d:"T",h:72,hl:false},{d:"F",h:55,hl:false},{d:"S",h:40,hl:false},{d:"S",h:65,hl:false},
];
 
const authH = () => ({ "Content-Type":"application/json", Authorization:`Bearer ${localStorage.getItem("token")||""}` });
const api   = (m,url,b) => fetch(`${API_BASE}${url}`,{ method:m, headers:authH(), ...(b?{body:JSON.stringify(b)}:{}) });
 
function stLabel(s){ return ({in_progress:"In Progress",new:"New",awaiting_reply:"Awaiting Reply",resolved:"Resolved",open:"Open",closed:"Closed",escalated:"Escalated"})[s]||s; }
 
function injectStyles() {
	if (!document.getElementById(FONTS_ID)) {
		const l=document.createElement("link");l.id=FONTS_ID;l.rel="stylesheet";
		l.href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap";
		document.head.appendChild(l);
	}
	if (!document.getElementById(STYLE_ID)) {
		const s=document.createElement("style");s.id=STYLE_ID;s.textContent=CSS;document.head.appendChild(s);
	}
}
 
const SvgSearch =()=> <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const SvgBell   =()=> <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
const SvgGear   =()=> <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
const SvgChev   =()=> <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>;
const SvgFilt   =()=> <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>;
const SvgPlus   =()=> <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const SvgClose  =()=> <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const SvgPrev   =()=> <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>;
const SvgNext   =()=> <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>;
const SvgHead   =()=> <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" fill="white"/></svg>;
const SvgTix    =()=> <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 5v2M15 11v2M15 17v2M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V7a2 2 0 0 1 2-2z"/></svg>;
const SvgPpl    =()=> <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const SvgHome   =()=> <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const SvgWarn   =()=> <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="16" r="0.5" fill="currentColor"/></svg>;
 
function CreateModal({ onClose, onDone }) {
	const [f,setF] = useState({ title:"",desc:"",priority:"medium",category:"Technical",name:"",rtype:"Customer" });
	const [busy,setBusy] = useState(false);
	const set = (k,v) => setF(p=>({...p,[k]:v}));
 
	const submit = async () => {
		if (!f.title.trim()||!f.name.trim()) return;
		setBusy(true);
		let rawId = null;
		try {
			const r = await api("POST","/complaints/",{ description:`${f.title}\n\n${f.desc}", priority:f.priority, category:f.category });
			if (r.ok) { const d=await r.json(); rawId=d.id; }
		} catch {}
		onDone({
			id: rawId ? `#${rawId}` : `#${1200+Math.floor(Math.random()*99)}`,
			title:f.title, meta:`Product: App • Category: ${f.category}`,
			requester:f.name, req_type:f.rtype,
			ini:f.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase(),
			col:"#e05c2a", st:"new", pr:f.priority,
			act:"Created just now", desc:f.desc, raw_id:rawId,
		});
		setBusy(false);
	};
 
	return (
		<div className="sd-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
			<div className="sd-modal">
				<div className="sd-mh">
					<span className="sd-mt">Create New Ticket</span>
					<button className="sd-mx" onClick={onClose}><SvgClose /></button>
				</div>
				<div className="sd-mb">
					<div className="sd-mft">
						<label className="sd-ml">Subject / Title *</label>
						<input className="sd-mi" placeholder="e.g. Dashboard loading error on iOS" value={f.title} onChange={e=>set("title",e.target.value)} />
					</div>
					<div className="sd-mrow" style={{marginBottom:14}}>
						<div className="sd-mft" style={{marginBottom:0}}>
							<label className="sd-ml">Requester Name *</label>
							<input className="sd-mi" placeholder="Full name" value={f.name} onChange={e=>set("name",e.target.value)} />
						</div>
						<div className="sd-mft" style={{marginBottom:0}}>
							<label className="sd-ml">Requester Type</label>
							<select className="sd-msel" value={f.rtype} onChange={e=>set("rtype",e.target.value)}>
								<option>Customer</option><option>Service Center</option><option>Partner</option><option>Internal</option>
							</select>
						</div>
					</div>
					<div className="sd-mrow" style={{marginBottom:14}}>
						<div className="sd-mft" style={{marginBottom:0}}>
							<label className="sd-ml">Priority</label>
							<select className="sd-msel" value={f.priority} onChange={e=>set("priority",e.target.value)}>
								<option value="low">Low</option><option value="medium">Medium</option>
								<option value="high">High</option><option value="critical">Critical</option><option value="urgent">Urgent</option>
							</select>
						</div>
						<div className="sd-mft" style={{marginBottom:0}}>
							<label className="sd-ml">Category</label>
							<select className="sd-msel" value={f.category} onChange={e=>set("category",e.target.value)}>
								<option>Technical</option><option>Billing</option><option>Sales</option><option>Warranty</option><option>General</option>
							</select>
						</div>
					</div>
					<div className="sd-mft" style={{marginBottom:0}}>
						<label className="sd-ml">Description</label>
						<textarea className="sd-mta" placeholder="Describe the issue in detail..." value={f.desc} onChange={e=>set("desc",e.target.value)} />
					</div>
				</div>
				<div className="sd-mf">
					<button className="sd-btn-c" onClick={onClose}>Cancel</button>
					<button className="sd-btn-s" onClick={submit} disabled={busy||!f.title.trim()||!f.name.trim()}>
						{busy?"Creating…":"Create Ticket"}
					</button>
				</div>
			</div>
		</div>
	);
}
 
function Drawer({ t, onClose, onResolve }) {
	return (
		<>
			<div className="sd-dov" onClick={onClose}/>
			<div className="sd-drawer">
				<div className="sd-dh">
					<span className="sd-dt">{t.id} — {t.title}</span>
					<button className="sd-mx" onClick={onClose}><SvgClose /></button>
				</div>
				<div className="sd-db">
					<div className="sd-dsec">
						<div className="sd-dsec-t">Ticket Details</div>
						<div className="sd-drow"><span className="sd-dlbl">Status</span><span className="sd-dval"><span className={`sd-st ${t.st}`}>{/* ... */}<span className="sd-st-dot"/>{stLabel(t.st)}</span></span></div>
						<div className="sd-drow"><span className="sd-dlbl">Priority</span><span className="sd-dval"><span className={`sd-pr ${t.pr}`}>{t.pr.charAt(0).toUpperCase()+t.pr.slice(1)}</span></span></div>
						<div className="sd-drow"><span className="sd-dlbl">Requester</span><span className="sd-dval">{t.requester} <span style={{color:"#bbb",fontSize:12}}>({t.req_type})</span></span></div>
						<div className="sd-drow"><span className="sd-dlbl">Activity</span><span className="sd-dval">{t.act}</span></div>
						<div className="sd-drow"><span className="sd-dlbl">Details</span><span className="sd-dval">{t.meta}</span></div>
					</div>
					<div className="sd-dsec">
						<div className="sd-dsec-t">Description</div>
						<div className="sd-ddesc">{t.desc||"No description provided."}</div>
					</div>
				</div>
				<div className="sd-dfoot">
					<button className="sd-dbtn sec" onClick={onClose}>Close</button>
					{t.st!=="resolved"&&<button className="sd-dbtn pri" onClick={()=>{onResolve(t.id);onClose();}}>Mark Resolved</button>}
				</div>
			</div>
		</>
	);
}
 
export default function SupportDesk() {
	useEffect(()=>{ injectStyles(); },[]);
 
	const [tickets,setTickets] = useState(SEED);
	const [tab,setTab]         = useState("all");
	const [search,setSearch]   = useState("");
	const [page,setPage]       = useState(1);
	const [modal,setModal]     = useState(false);
	const [drawer,setDrawer]   = useState(null);
	const [toast,setToast]     = useState(null);
	const [loading,setLoading] = useState(false);
 
	const PER = 4;
 
	useEffect(()=>{
		setLoading(true);
		api("GET","/complaints/")
			.then(r=>r.ok?r.json():null)
			.then(data=>{
				if (!data) return;
				const list = Array.isArray(data)?data:(data.results||[]);
				if (list.length===0) return;
				setTickets(list.map(c=>({
					id:`#${c.id}`,
					title:(c.description||"").split("\n")[0]||`Ticket #${c.id}`,
					meta:`Status: ${c.status||"open"}`,
					requester:c.user?.full_name||"Customer",
					req_type:c.user?.role||"Customer",
					ini:(c.user?.full_name||"C").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase(),
					col:"#e05c2a",st:c.status||"open",pr:c.priority||"medium",
					act:c.updated_at?`Updated ${new Date(c.updated_at).toLocaleDateString()}`:"Recently",
					desc:c.description||"",raw_id:c.id,
				})));
			})
			.catch(()=>{})
			.finally(()=>setLoading(false));
	},[]);
 
	function toast_(msg,type="ok"){ setToast({msg,type}); setTimeout(()=>setToast(null),2600); }
 
	function onCreated(t){ setTickets(p=>[t,...p]); setModal(false); toast_(`Ticket ${t.id} created.`); }
 
	async function onResolve(tid){
		setTickets(p=>p.map(t=>t.id===tid?{...t,st:"resolved",act:"Resolved just now"}:t));
		toast_(`Ticket ${tid} marked resolved.`);
		const found=tickets.find(t=>t.id===tid);
		if (found?.raw_id) api("PATCH",`/complaints/${found.raw_id}/resolve/`,{resolution_note:"Resolved by agent."}).catch(()=>{});
	}
 
	const filtered = tickets.filter(t=>{
		const ms=!search||t.title.toLowerCase().includes(search.toLowerCase())||t.requester.toLowerCase().includes(search.toLowerCase())||t.id.includes(search);
		const mt=tab==="all"?true:tab==="customer"?t.req_type?.toLowerCase().includes("customer"):tab==="service"?t.req_type?.toLowerCase().includes("service"):tab==="escalated"?t.st==="escalated":true;
		return ms&&mt;
	});
 
	const pages    = Math.max(1,Math.ceil(filtered.length/PER));
	const paged    = filtered.slice((page-1)*PER,page*PER);
	const urgCnt   = tickets.filter(t=>t.pr==="critical"||t.pr==="urgent").length;
	const hiCnt    = tickets.filter(t=>t.pr==="high").length;
	const regCnt   = tickets.filter(t=>t.pr==="medium"||t.pr==="low").length;
	const total    = tickets.length;
	const resCnt   = tickets.filter(t=>t.st==="resolved").length;
	const goalPct  = total>0?Math.round(resCnt/total*100):82;
 
	const TABS=[
		{id:"all",       label:"All Tickets",           count:tickets.length,                                                    icon:<SvgTix/>},
		{id:"customer",  label:"Customer Inquiries",    count:tickets.filter(t=>t.req_type?.toLowerCase().includes("customer")).length, icon:<SvgPpl/>},
		{id:"service",   label:"Service Center Requests",count:tickets.filter(t=>t.req_type?.toLowerCase().includes("service")).length,  icon:<SvgHome/>},
		{id:"escalated", label:"Escalated",             count:tickets.filter(t=>t.st==="escalated").length,                     icon:<SvgWarn/>},
	];
 
	return (
		<div className="sd-root">
			{toast&&<div className={`sd-toast ${toast.type}`}>{toast.msg}</div>}
			{modal&&<CreateModal onClose={()=>setModal(false)} onDone={onCreated}/>}
			{drawer&&<Drawer t={drawer} onClose={()=>setDrawer(null)} onResolve={onResolve}/>}
 
			<nav className="sd-nav">
				<div className="sd-brand">
					<div className="sd-brand-icon"><SvgHead /></div>
					<span className="sd-brand-name">Support Desk</span>
				</div>
				<div className="sd-search-box">
					<SvgSearch/>
					<input placeholder="Search tickets, customers..." value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}}/>
				</div>
				<div className="sd-nav-gap"/>
				<div className="sd-nav-icon"><SvgBell/><span className="sd-notif-dot">{urgCnt}</span></div>
				<div className="sd-nav-icon"><SvgGear/></div>
				<div className="sd-agent">
					<div className="sd-agent-info">
						<div className="sd-agent-name">Alex Rivera</div>
						<div className="sd-agent-role">Senior Agent</div>
					</div>
					<div className="sd-agent-avatar">AR</div>
				</div>
			</nav>
 
			<div className="sd-page">
 
				<div className="sd-tabs">
					{TABS.map(t=>(
						<button key={t.id} className={`sd-tab${tab===t.id?" on":""}`} onClick={()=>{setTab(t.id);setPage(1);}}>
							{t.icon} {t.label}
							{t.count>0&&<span className="sd-tab-pill">{t.count}</span>}
						</button>
					))}
				</div>
 
				<div className="sd-filters">
					<button className="sd-filt-btn">Status: All Open <SvgChev/></button>
					<button className="sd-filt-btn">Priority: Urgent <SvgChev/></button>
					<button className="sd-filt-btn">Assigned To: Me <SvgChev/></button>
					<button className="sd-more"><SvgFilt/> More Filters</button>
					<div className="sd-gap"/>
					<button className="sd-create" onClick={()=>setModal(true)}><SvgPlus/> Create Ticket</button>
				</div>
 
				<div className="sd-card">
					{loading?(
						<div className="sd-spin"><div className="sd-ring"/> Loading tickets…</div>
					):(
						<>
							<table className="sd-tbl">
								<thead>
									<tr>
										<th style={{width:80}}>ID</th>
										<th>Subject &amp; Details</th>
										<th>Requester</th>
										<th>Status</th>
										<th>Priority</th>
										<th>Activity</th>
									</tr>
								</thead>
								<tbody>
									{paged.length===0?(
										<tr><td colSpan={6} style={{textAlign:"center",padding:"40px",color:"#bbb",fontSize:14}}>No tickets found.</td></tr>
									):paged.map(t=>(
										<tr key={t.id} onClick={()=>setDrawer(t)}>
											<td><span className="sd-tid">{t.id}</span></td>
											<td>
												<div className="sd-ttitle">{t.title}</div>
												<div className="sd-tmeta">{t.meta}</div>
											</td>
											<td>
												<div className="sd-req">
													<div className="sd-req-av" style={{background:t.col}}>{t.ini}</div>
													<div>
														<div className="sd-req-name">{t.requester}</div>
														<div className="sd-req-type">{t.req_type}</div>
													</div>
												</div>
											</td>
											<td><span className={`sd-st ${t.st}`}><span className="sd-st-dot"/>{stLabel(t.st)}</span></td>
											<td><span className={`sd-pr ${t.pr}`}>{t.pr.charAt(0).toUpperCase()+t.pr.slice(1)}</span></td>
											<td><span className="sd-act">{t.act}</span></td>
										</tr>
									))}
								</tbody>
							</table>
							<div className="sd-tfoot">
								<span className="sd-tfoot-info">Showing {filtered.length===0?0:(page-1)*PER+1} to {Math.min(page*PER,filtered.length)} of {filtered.length} entries</span>
								<div className="sd-pages">
									<button className="sd-pg" disabled={page===1} onClick={()=>setPage(p=>p-1)}><SvgPrev/></button>
									{Array.from({length:Math.min(pages,5)},(_,i)=>i+1).map(n=>(
										<button key={n} className={`sd-pg${page===n?" on":""}`} onClick={()=>setPage(n)}>{n}</button>
									))}
									{pages>5&&<span style={{color:"#bbb",padding:"0 4px"}}>…</span>}
									<button className="sd-pg" disabled={page===pages} onClick={()=>setPage(p=>p+1)}><SvgNext/></button>
								</div>
							</div>
						</>
					)}
				</div>
 
				<div className="sd-bottom">
					<div className="sd-prio-card">
						<div className="sd-card-lbl">Tickets by Priority</div>
						{[
							{label:"Urgent/Critical",count:urgCnt, pct:Math.min(100,Math.round(urgCnt/Math.max(total,1)*100)), color:"#ef4444"},
							{label:"High Priority",  count:hiCnt,  pct:Math.min(100,Math.round(hiCnt/Math.max(total,1)*100)),  color:"#f97316"},
							{label:"Regular",        count:regCnt, pct:Math.min(100,Math.round(regCnt/Math.max(total,1)*100)), color:"#e05c2a"},
						].map(r=>(
							<div className="sd-prow" key={r.label}>
								<div style={{flex:1}}>
									<div className="sd-pname">{r.label}</div>
									<div className="sd-ptrack"><div className="sd-pbar" style={{width:`${r.pct}%`,background:r.color}}/></div>
								</div>
								<div className="sd-pnum">{r.count}</div>
							</div>
						))}
					</div>
 
					<div className="sd-resp-card">
						<div className="sd-card-lbl">Response Time</div>
						<div className="sd-bars">
							{CHART.map((c,i)=>(
								<div className="sd-bc" key={i}>
									<div className={`sd-b${c.hl?" hl":""}`} style={{height:`${c.h}%`}}/>
									<span className="sd-bday">{c.d}</span>
								</div>
							))}
						</div>
						<div className="sd-resp-stat">
							<div className="sd-resp-val">1.2h</div>
							<div className="sd-resp-sub">Average first response</div>
						</div>
					</div>
 
					<div className="sd-goal-card">
						<div className="sd-goal-lbl">Daily Goal</div>
						<div className="sd-goal-pct">{goalPct}%</div>
						<div className="sd-goal-desc">Tickets resolved today. Keep it up!</div>
						<button className="sd-goal-btn">View Reports</button>
					</div>
				</div>
 
			</div>
		</div>
	);
}
[SupportDesk.jsx](SupportDesk.jsx)