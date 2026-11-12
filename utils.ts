export const todayISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
};
export const formatDate = (value: string) => new Date(`${value}T12:00:00`).toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" });
export const formatTime = (value: string) => {
  const [h,m] = value.split(":").map(Number);
  return new Date(2000,0,1,h,m).toLocaleTimeString("en-US", { hour:"numeric", minute:"2-digit" });
};
export const initials = (name: string) => name.split(" ").filter(Boolean).slice(-2).map(x => x[0]).join("").toUpperCase();
