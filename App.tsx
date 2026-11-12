import { useMemo, useState } from "react";
import { Activity, CalendarDays, Check, ChevronDown, Clock3, LayoutDashboard, LogOut, MapPin, Menu, Plus, Search, Stethoscope, Users, Bell, MoreHorizontal, ArrowUpRight } from "lucide-react";
import type { Appointment, AppointmentStatus } from "./types";
import { getAppointments, getDoctors, getPatients, save } from "./storage";
import { formatDate, formatTime, initials, todayISO } from "./utils";
import Modal from "./components/Modal";
import AppointmentForm from "./components/AppointmentForm";

type Page = "Overview" | "Appointments" | "Patients" | "Doctors";
const nav: {label:Page; icon:typeof LayoutDashboard}[] = [
  {label:"Overview",icon:LayoutDashboard},{label:"Appointments",icon:CalendarDays},{label:"Patients",icon:Users},{label:"Doctors",icon:Stethoscope}
];
const statusClass:Record<AppointmentStatus,string> = {Confirmed:"green",Pending:"amber",Completed:"blue",Cancelled:"red"};
export default function App() {
  const [page,setPage] = useState<Page>("Overview");
  const [appointments,setAppointments] = useState(getAppointments);
  const [patients] = useState(getPatients);
  const [doctors] = useState(getDoctors);
  const [modal,setModal] = useState(false);
  const [search,setSearch] = useState("");
  const [filter,setFilter] = useState("All");
  const [mobileNav,setMobileNav] = useState(false);
  const todayAppointments = useMemo(()=>appointments.filter(a=>a.date===todayISO()).sort((a,b)=>a.time.localeCompare(b.time)),[appointments]);
  const filtered = useMemo(()=>appointments.filter(a=>
    (filter==="All" || a.status===filter) &&
    `${a.patient} ${a.doctor} ${a.specialty} ${a.location}`.toLowerCase().includes(search.toLowerCase())
  ).sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time)),[appointments,filter,search]);
  function addAppointment(a:Appointment) {
    const next=[a,...appointments];setAppointments(next);save("clinicflow_appointments",next);setModal(false);
  }
  function updateStatus(id:string,status:AppointmentStatus) {
    const next=appointments.map(a=>a.id===id?{...a,status}:a);setAppointments(next);save("clinicflow_appointments",next);
  }
  const counts = {
    today:todayAppointments.length,
    confirmed:appointments.filter(a=>a.status==="Confirmed" && a.date>=todayISO()).length,
    pending:appointments.filter(a=>a.status==="Pending").length,
    patients:patients.length
  };
  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav?"open":""}`}>
      <div className="brand"><div className="brand-mark"><Activity size={22}/></div><span>clinic<span>flow</span></span></div>
      <div className="workspace"><div className="workspace-avatar">MC</div><div><b>Metro Care Clinic</b><small>Clinic workspace</small></div><ChevronDown size={15}/></div>
      <p className="nav-label">WORKSPACE</p>
      <nav>{nav.map(item=><button key={item.label} onClick={()=>{setPage(item.label);setMobileNav(false);}} className={`nav-item ${page===item.label?"active":""}`}><item.icon size={18}/>{item.label}{item.label==="Appointments"&&<span className="nav-count">{appointments.length}</span>}</button>)}</nav>
      <div className="sidebar-bottom"><div className="help-card"><div className="help-icon"><Activity size={18}/></div><b>Need a hand?</b><p>Manage your clinic smoothly with ClinicFlow.</p><button onClick={()=>setPage("Doctors")}>View team <ArrowUpRight size={14}/></button></div><button className="nav-item logout"><LogOut size={18}/>Sign out</button><div className="profile"><div className="avatar">SA</div><div><b>Sarah Ahmed</b><small>Administrator</small></div><MoreHorizontal size={18}/></div></div>
    </aside>
    {mobileNav&&<button className="mobile-scrim" onClick={()=>setMobileNav(false)} aria-label="Close menu"/>}
    <main className="main">
      <header className="topbar"><button className="mobile-menu icon-btn" onClick={()=>setMobileNav(!mobileNav)}><Menu/></button><div className="breadcrumb">Workspace <span>/</span> <b>{page}</b></div><div className="top-actions"><div className="today-pill"><span className="live-dot"/>{new Date().toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"})}</div><button className="icon-btn notification" aria-label="Notifications"><Bell size={19}/><i/></button><div className="avatar top-avatar">SA</div></div></header>
      <div className="content">
        <div className="page-heading"><div><p className="eyebrow">CLINIC MANAGEMENT</p><h1>{page==="Overview"?"Good morning, Sarah":page}</h1><p className="subheading">{page==="Overview"?"Here’s what’s happening at your clinic today.":page==="Appointments"?"Schedule, track and manage patient appointments.":page==="Patients"?"Keep patient information organized in one place.":"Your clinic’s medical team and consultation rooms."}</p></div><button className="btn btn-primary" onClick={()=>setModal(true)}><Plus size={17}/> New appointment</button></div>
        {page==="Overview"&&<>
          <section className="stats-grid">
            <Stat icon={<CalendarDays/>} label="Today's appointments" value={counts.today} note="Scheduled for today" tone="purple"/>
            <Stat icon={<Check/>} label="Upcoming confirmed" value={counts.confirmed} note="Confirmed appointments" tone="green"/>
            <Stat icon={<Clock3/>} label="Pending confirmation" value={counts.pending} note="Need your attention" tone="orange"/>
            <Stat icon={<Users/>} label="Total patients" value={counts.patients} note="In your patient list" tone="blue"/>
          </section>
          <section className="overview-grid">
            <div className="panel schedule-panel"><div className="panel-head"><div><h2>Today’s schedule</h2><p>Your appointments in chronological order</p></div><button className="text-btn" onClick={()=>setPage("Appointments")}>View all <ArrowUpRight size={15}/></button></div>
              {todayAppointments.length===0?<Empty text="No appointments scheduled for today."/>:<div className="schedule-list">{todayAppointments.map(a=><div className="schedule-row" key={a.id}><div className="schedule-time">{formatTime(a.time)}<small>{a.duration} min</small></div><div className="timeline"><span/></div><div className="schedule-info"><div className="schedule-title"><b>{a.patient}</b><span className={`status ${statusClass[a.status]}`}>{a.status}</span></div><p>{a.specialty} · {a.doctor}</p><small><MapPin size={12}/>{a.location}</small></div><button className="icon-btn row-more" title="Mark completed" onClick={()=>updateStatus(a.id,"Completed")}><MoreHorizontal size={18}/></button></div>)}</div>}
            </div>
            <div className="panel side-panel"><div className="panel-head"><div><h2>Medical team</h2><p>Doctors on your team</p></div><button className="icon-btn" onClick={()=>setPage("Doctors")}><ArrowUpRight size={17}/></button></div>
              <div className="doctor-list">{doctors.map((d,i)=><div className="doctor-row" key={d.id}><div className={`doctor-avatar color-${i}`}>{initials(d.name)}</div><div className="doctor-info"><b>{d.name}</b><small>{d.specialty}</small></div><span className="online-dot"/></div>)}</div>
              <div className="availability-card"><div className="availability-icon"><Clock3 size={18}/></div><div><b>Keep your schedule updated</b><p>Add appointments with the right doctor, time and clinic room.</p></div></div>
            </div>
          </section>
          <section className="panel upcoming-panel"><div className="panel-head"><div><h2>Upcoming appointments</h2><p>Next visits across your clinic</p></div><button className="text-btn" onClick={()=>setPage("Appointments")}>See appointments <ArrowUpRight size={15}/></button></div><AppointmentTable rows={appointments.filter(a=>a.date>=todayISO()).sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time)).slice(0,4)} onStatus={updateStatus}/></section>
        </>}
        {page==="Appointments"&&<section className="panel table-panel"><div className="toolbar"><div className="search-box"><Search size={17}/><input placeholder="Search patient, doctor or location..." value={search} onChange={e=>setSearch(e.target.value)}/></div><select className="filter-select" value={filter} onChange={e=>setFilter(e.target.value)}><option>All</option><option>Confirmed</option><option>Pending</option><option>Completed</option><option>Cancelled</option></select></div><AppointmentTable rows={filtered} onStatus={updateStatus}/></section>}
        {page==="Patients"&&<section className="panel table-panel"><div className="toolbar"><div className="search-box"><Search size={17}/><input placeholder="Search patients..." value={search} onChange={e=>setSearch(e.target.value)}/></div><span className="muted">{patients.length} patients</span></div><div className="table-wrap"><table><thead><tr><th>Patient</th><th>Phone</th><th>Age / Gender</th><th>Last visit</th><th>Notes</th></tr></thead><tbody>{patients.filter(p=>p.name.toLowerCase().includes(search.toLowerCase())).map(p=><tr key={p.id}><td><div className="person-cell"><div className="person-avatar">{initials(p.name)}</div><div><b>{p.name}</b><small>{p.id}</small></div></div></td><td>{p.phone}</td><td>{p.age} · {p.gender}</td><td>{formatDate(p.lastVisit)}</td><td>{p.notes}</td></tr>)}</tbody></table></div></section>}
        {page==="Doctors"&&<section className="doctor-cards">{doctors.map((d,i)=><article className="panel doctor-card" key={d.id}><div className={`doctor-avatar large color-${i}`}>{initials(d.name)}</div><h3>{d.name}</h3><p>{d.specialty}</p><div className="doctor-meta"><span><MapPin size={14}/>{d.location}</span><span><Stethoscope size={14}/>{d.room}</span></div><div className="doctor-card-foot"><span className="status green">Active</span><span className="muted">{appointments.filter(a=>a.doctor===d.name&&a.date===todayISO()).length} appointments today</span></div></article>)}</section>}
        <footer className="footer">© 2026 ClinicFlow <span>Appointment management made simpler.</span></footer>
      </div>
    </main>
    {modal&&<Modal title="Create appointment" onClose={()=>setModal(false)}><AppointmentForm doctors={doctors} patients={patients} onSave={addAppointment} onCancel={()=>setModal(false)}/></Modal>}
  </div>;
}
function Stat({icon,label,value,note,tone}:{icon:React.ReactNode;label:string;value:number;note:string;tone:string}) {
  return <article className="stat-card"><div className="stat-top"><span>{label}</span><div className={`stat-icon ${tone}`}>{icon}</div></div><div className="stat-value">{value}</div><div className="stat-note">{note}</div></article>;
}
function Empty({text}:{text:string}) { return <div className="empty-state"><CalendarDays size={26}/><p>{text}</p></div>; }
function AppointmentTable({rows,onStatus}:{rows:Appointment[];onStatus:(id:string,status:AppointmentStatus)=>void}) {
  if(!rows.length)return <Empty text="No appointments found. Create one to get started."/>;
  return <div className="table-wrap"><table><thead><tr><th>Patient</th><th>Doctor</th><th>Date & time</th><th>Clinic / room</th><th>Status</th><th>Action</th></tr></thead><tbody>{rows.map(a=><tr key={a.id}><td><div className="person-cell"><div className="person-avatar">{initials(a.patient)}</div><div><b>{a.patient}</b><small>{a.phone}</small></div></div></td><td><div className="doctor-cell"><b>{a.doctor}</b><small>{a.specialty}</small></div></td><td><b>{formatDate(a.date)}</b><small className="table-sub">{formatTime(a.time)} · {a.duration} min</small></td><td><span className="location-cell"><MapPin size={13}/>{a.location}</span></td><td><span className={`status ${statusClass[a.status]}`}>{a.status}</span></td><td><select className="action-select" aria-label={`Update ${a.patient} appointment status`} value={a.status} onChange={e=>onStatus(a.id,e.target.value as AppointmentStatus)}><option>Confirmed</option><option>Pending</option><option>Completed</option><option>Cancelled</option></select></td></tr>)}</tbody></table></div>;
}
