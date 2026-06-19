import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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

// ---- DB <-> Domain mapping ---------------------------------------------------

type ResourceRow = {
  id: string; name: string; group_name: string;
  capacity_hours: number; utilization: number; status: Resource["status"];
};
type OrderRow = {
  id: string; number: string; article: string; qty: number; unit: string;
  customer: string; resource_id: string;
  start_at: string; end_at: string; due_at: string;
  progress: number; status: OrderStatus; priority: Priority;
  owner_name: string; owner_initials: string; load_hours: number;
};

const mapResource = (r: ResourceRow): Resource => ({
  id: r.id, name: r.name, group: r.group_name,
  capacityHours: r.capacity_hours, utilization: r.utilization, status: r.status,
});

const mapOrder = (o: OrderRow): Order => ({
  id: o.id, number: o.number, article: o.article, qty: o.qty, unit: o.unit,
  customer: o.customer, resourceId: o.resource_id,
  start: o.start_at, end: o.end_at, due: o.due_at,
  progress: o.progress, status: o.status, priority: o.priority,
  owner: { name: o.owner_name, initials: o.owner_initials },
  loadHours: o.load_hours,
});

const db = supabase as any;

// ---- Queries / Mutations -----------------------------------------------------

export function useResources() {
  return useQuery({
    queryKey: ["resources"],
    queryFn: async (): Promise<Resource[]> => {
      const { data, error } = await db.from("resources").select("*").order("id");
      if (error) throw error;
      return (data as ResourceRow[]).map(mapResource);
    },
  });
}

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async (): Promise<Order[]> => {
      const { data, error } = await db.from("orders").select("*").order("start_at");
      if (error) throw error;
      return (data as OrderRow[]).map(mapOrder);
    },
  });
}

export function useUpdateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (o: Order) => {
      const patch = {
        article: o.article, qty: o.qty, unit: o.unit, customer: o.customer,
        resource_id: o.resourceId, start_at: o.start, end_at: o.end, due_at: o.due,
        progress: o.progress, status: o.status, priority: o.priority,
        owner_name: o.owner.name, owner_initials: o.owner.initials,
        load_hours: o.loadHours,
      };
      const { error } = await db.from("orders").update(patch).eq("id", o.id);
      if (error) throw error;
      return o;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
}

export type NewOrderInput = {
  article: string; qty: number; customer?: string; resourceId: string;
  priority: Priority; due: string;
};

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: NewOrderInput) => {
      // Auto-number: count existing rows.
      const { count } = await db.from("orders").select("id", { count: "exact", head: true });
      const number = `PA-2026-${String(1000 + (count ?? 0)).slice(1)}`;
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const insert = {
        number, article: input.article, qty: input.qty, unit: "Stk.",
        customer: input.customer ?? "—", resource_id: input.resourceId,
        start_at: today.toISOString(), end_at: input.due, due_at: input.due,
        progress: 0, status: "Geplant" as OrderStatus, priority: input.priority,
        owner_name: "System", owner_initials: "SY", load_hours: 8,
      };
      const { error } = await db.from("orders").insert(insert);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
}

export function useDeleteOrders() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await db.from("orders").delete().in("id", ids);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
}

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