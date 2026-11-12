import type { Appointment, Doctor, Patient } from "./types";
import { seedAppointments, seedDoctors, seedPatients } from "./data";

function load<T>(key: string, fallback: T): T {
  try { const value = localStorage.getItem(key); return value ? JSON.parse(value) as T : fallback; }
  catch { return fallback; }
}
export const getAppointments = () => load<Appointment[]>("clinicflow_appointments", seedAppointments);
export const getPatients = () => load<Patient[]>("clinicflow_patients", seedPatients);
export const getDoctors = () => load<Doctor[]>("clinicflow_doctors", seedDoctors);
export function save<T>(key: string, value: T) { localStorage.setItem(key, JSON.stringify(value)); }
