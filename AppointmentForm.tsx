import { useState } from "react";
import type { Appointment, Doctor, Patient } from "../types";
import { todayISO } from "../utils";

export default function AppointmentForm({ doctors, patients, onSave, onCancel }: {
  doctors:Doctor[]; patients:Patient[]; onSave:(a:Appointment)=>void; onCancel:()=>void;
}) {
  const [patient,setPatient] = useState(patients[0]?.name ?? "");
  const [doctor,setDoctor] = useState(doctors[0]?.name ?? "");
  const selected = doctors.find(d=>d.name===doctor);
  const [date,setDate] = useState(todayISO());
  const [time,setTime] = useState("09:00");
  const [duration,setDuration] = useState(30);
  const [reason,setReason] = useState("");
  const [status,setStatus] = useState<Appointment["status"]>("Confirmed");
  const [location,setLocation] = useState(selected ? `${selected.location} · ${selected.room}` : "");
  const patientRecord = patients.find(p=>p.name===patient);
  function submit(e:React.FormEvent) {
    e.preventDefault();
    if(!patient || !doctor || !date || !time) return;
    onSave({ id:`APT-${Date.now().toString().slice(-6)}`, patient, phone:patientRecord?.phone ?? "",
      doctor, specialty:selected?.specialty ?? "", date, time, duration, location, reason:reason || "General consultation", status });
  }
  return <form className="form-grid" onSubmit={submit}>
    <label className="field full">Patient<select value={patient} onChange={e=>setPatient(e.target.value)} required>{patients.map(p=><option key={p.id}>{p.name}</option>)}</select></label>
    <label className="field full">Doctor<select value={doctor} onChange={e=>{setDoctor(e.target.value);const d=doctors.find(x=>x.name===e.target.value);if(d)setLocation(`${d.location} · ${d.room}`);}} required>{doctors.map(d=><option key={d.id}>{d.name}</option>)}</select></label>
    <label className="field">Appointment date<input type="date" min={todayISO()} value={date} onChange={e=>setDate(e.target.value)} required/></label>
    <label className="field">Start time<input type="time" value={time} onChange={e=>setTime(e.target.value)} required/></label>
    <label className="field">Duration<select value={duration} onChange={e=>setDuration(Number(e.target.value))}><option value={15}>15 minutes</option><option value={30}>30 minutes</option><option value={45}>45 minutes</option><option value={60}>60 minutes</option></select></label>
    <label className="field">Status<select value={status} onChange={e=>setStatus(e.target.value as Appointment["status"])}><option>Confirmed</option><option>Pending</option><option>Completed</option><option>Cancelled</option></select></label>
    <label className="field full">Clinic / room<input value={location} onChange={e=>setLocation(e.target.value)} placeholder="Main Clinic · Room 204" required/></label>
    <label className="field full">Reason for visit<input value={reason} onChange={e=>setReason(e.target.value)} placeholder="e.g. Follow-up consultation"/></label>
    <div className="form-actions full"><button type="button" className="btn btn-light" onClick={onCancel}>Cancel</button><button className="btn btn-primary" type="submit">Save appointment</button></div>
  </form>;
}
