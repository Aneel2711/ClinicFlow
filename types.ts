export type AppointmentStatus = "Confirmed" | "Pending" | "Completed" | "Cancelled";
export interface Appointment {
  id: string; patient: string; phone: string; doctor: string; specialty: string;
  date: string; time: string; duration: number; location: string;
  reason: string; status: AppointmentStatus;
}
export interface Patient {
  id: string; name: string; phone: string; email: string; age: number;
  gender: string; lastVisit: string; notes: string;
}
export interface Doctor {
  id: string; name: string; specialty: string; room: string; location: string;
}
