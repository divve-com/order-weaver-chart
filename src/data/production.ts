export type OrderStatus = "Geplant" | "Freigegeben" | "In Arbeit" | "Fertig" | "Verspätet";
export type Priority = "Niedrig" | "Normal" | "Hoch" | "Kritisch";

export interface Resource {
  id: string;
  name: string;
  group: string;
  capacityHours: number;
  utilization: number;
  status: "Verfügbar" | "Belegt" | "Wartung";
}

export interface Order {
  id: string;
  number: string;
  article: string;
  qty: number;
  unit: string;
  customer: string;
  resourceId: string;
  start: string; // ISO date
  end: string;   // ISO date
  progress: number; // 0..100
  status: OrderStatus;
  priority: Priority;
  owner: { name: string; initials: string };
  due: string;
  /** Stunden pro Tag, die dieser Auftrag die Ressource belegt. */
  loadHours: number;
}

export const resources: Resource[] = [
  { id: "L1", name: "Linie A · Montage", group: "Montage", capacityHours: 16, utilization: 78, status: "Belegt" },
  { id: "L2", name: "Linie B · Montage", group: "Montage", capacityHours: 16, utilization: 54, status: "Verfügbar" },
  { id: "M1", name: "CNC-Fräse 1", group: "Zerspanung", capacityHours: 20, utilization: 92, status: "Belegt" },
  { id: "M2", name: "CNC-Fräse 2", group: "Zerspanung", capacityHours: 20, utilization: 31, status: "Verfügbar" },
  { id: "L3", name: "Lackierung", group: "Oberfläche", capacityHours: 12, utilization: 67, status: "Belegt" },
  { id: "L4", name: "Prüfstand", group: "Qualität", capacityHours: 8, utilization: 12, status: "Wartung" },
];

const owners = [
  { name: "Jana M.", initials: "JM" },
  { name: "Tom K.", initials: "TK" },
  { name: "Sara L.", initials: "SL" },
  { name: "Ben H.", initials: "BH" },
];

const articles = [
  "Gehäuse GH-220", "Welle W-18", "Pumpe P-7", "Ventilblock VB-3",
  "Halterung HX-9", "Adapterring AR-2", "Sensorkopf SK-5", "Zahnrad Z-44",
  "Kupplung K-12", "Leiterplatte LP-S2",
];
const customers = ["Müller AG", "Schmidt KG", "Weber GmbH", "Hoffmann SE", "Becker UG", "Lange & Co."];
const statuses: OrderStatus[] = ["Geplant", "Freigegeben", "In Arbeit", "Fertig", "Verspätet"];
const priorities: Priority[] = ["Niedrig", "Normal", "Hoch", "Kritisch"];

function isoDay(offset: number) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + offset);
  return d.toISOString();
}

export const orders: Order[] = Array.from({ length: 28 }).map((_, i) => {
  const startOff = -7 + ((i * 3) % 21);
  const duration = 1 + (i % 5);
  const status = statuses[i % statuses.length];
  const progress = status === "Fertig" ? 100 : status === "In Arbeit" ? 30 + ((i * 17) % 60) : status === "Verspätet" ? 40 + ((i * 11) % 40) : 0;
  const loadHours = [4, 6, 8, 10, 12][i % 5];
  return {
    id: String(i + 1),
    number: `PA-2026-${String(1000 + i).slice(1)}`,
    article: articles[i % articles.length],
    qty: 25 + ((i * 37) % 475),
    unit: "Stk.",
    customer: customers[i % customers.length],
    resourceId: resources[i % resources.length].id,
    start: isoDay(startOff),
    end: isoDay(startOff + duration),
    progress,
    status,
    priority: priorities[i % priorities.length],
    owner: owners[i % owners.length],
    due: isoDay(startOff + duration + (i % 3)),
    loadHours,
  };
});

export const statusStyles: Record<OrderStatus, { dot: string; badge: string; bar: string }> = {
  Geplant:     { dot: "bg-muted-foreground", badge: "bg-muted text-foreground", bar: "bg-lavender-300" },
  Freigegeben: { dot: "bg-lavender-500",     badge: "bg-lavender-100 text-ink", bar: "bg-lavender-500" },
  "In Arbeit": { dot: "bg-warning",          badge: "bg-peach text-ink",         bar: "bg-warning" },
  Fertig:      { dot: "bg-success",          badge: "bg-success/15 text-success", bar: "bg-success" },
  Verspätet:   { dot: "bg-destructive",      badge: "bg-destructive/15 text-destructive", bar: "bg-destructive" },
};

export const priorityStyles: Record<Priority, string> = {
  Niedrig:  "bg-muted text-muted-foreground",
  Normal:   "bg-lavender-50 text-ink",
  Hoch:     "bg-peach text-ink",
  Kritisch: "bg-destructive/15 text-destructive",
};

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function daysBetween(a: string, b: string) {
  return Math.max(1, Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86_400_000));
}