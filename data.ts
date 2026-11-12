import type { Appointment, Doctor, Patient } from "./types";

const today = new Date();
const date = (offset: number) => {
  const d = new Date(today); d.setDate(d.getDate() + offset);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
};
export const seedDoctors: Doctor[] = [
  { id:"D-101", name:"Dr. Sarah Ahmed", specialty:"Cardiology", room:"Room 204", location:"Main Clinic" },
  { id:"D-102", name:"Dr. Omar Khan", specialty:"Dermatology", room:"Room 108", location:"Main Clinic" },
  { id:"D-103", name:"Dr. Ayesha Malik", specialty:"Pediatrics", room:"Room 302", location:"Children's Wing" }
];
export const seedPatients: Patient[] = [
  { id:"P-1001", name:"Amina Yusuf", phone:"+92 300 1234567", email:"amina@example.com", age:34, gender:"Female", lastVisit:date(-12), notes:"Routine follow-up" },
  { id:"P-1002", name:"Hamza Ali", phone:"+92 301 7654321", email:"hamza@example.com", age:42, gender:"Male", lastVisit:date(-30), notes:"Blood pressure review" },
  { id:"P-1003", name:"Noor Fatima", phone:"+92 333 2221100", email:"noor@example.com", age:8, gender:"Female", lastVisit:date(-7), notes:"Pediatric check-up" },
  { id:"P-1004", name:"Bilal Raza", phone:"+92 312 9876543", email:"bilal@example.com", age:27, gender:"Male", lastVisit:date(-45), notes:"Skin consultation" }
];
export const seedAppointments: Appointment[] = [
  { id:"APT-2401", patient:"Amina Yusuf", phone:"+92 300 1234567", doctor:"Dr. Sarah Ahmed", specialty:"Cardiology", date:date(0), time:"09:00", duration:30, location:"Main Clinic · Room 204", reason:"Heart check-up", status:"Confirmed" },
  { id:"APT-2402", patient:"Hamza Ali", phone:"+92 301 7654321", doctor:"Dr. Omar Khan", specialty:"Dermatology", date:date(0), time:"10:30", duration:30, location:"Main Clinic · Room 108", reason:"Skin consultation", status:"Pending" },
  { id:"APT-2403", patient:"Noor Fatima", phone:"+92 333 2221100", doctor:"Dr. Ayesha Malik", specialty:"Pediatrics", date:date(0), time:"11:00", duration:45, location:"Children's Wing · Room 302", reason:"Routine check-up", status:"Confirmed" },
  { id:"APT-2404", patient:"Bilal Raza", phone:"+92 312 9876543", doctor:"Dr. Omar Khan", specialty:"Dermatology", date:date(1), time:"12:00", duration:30, location:"Main Clinic · Room 108", reason:"Follow-up", status:"Completed" },
  { id:"APT-2405", patient:"Amina Yusuf", phone:"+92 300 1234567", doctor:"Dr. Sarah Ahmed", specialty:"Cardiology", date:date(2), time:"14:00", duration:30, location:"Main Clinic · Room 204", reason:"Review reports", status:"Pending" }
];
