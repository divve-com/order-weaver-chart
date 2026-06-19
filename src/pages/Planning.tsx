import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { GanttChart } from "@/components/GanttChart";
import {
  statusStyles, priorityStyles, formatDate, type Order,
  useOrders, useResources, useUpdateOrder,
} from "@/data/production";
import { Plus } from "lucide-react";
import { toast } from "sonner";

const rangeDaysMap = { day: 7, week: 21, month: 42 } as const;

export default function Planning() {
  const { data: orders = [] } = useOrders();
  const { data: resources = [] } = useResources();
  const updateOrderMut = useUpdateOrder();
  const [items, setItems] = useState<Order[]>([]);
  useEffect(() => { setItems(orders); }, [orders]);
  const [range, setRange] = useState<keyof typeof rangeDaysMap>("week");
  const [active, setActive] = useState<Order | null>(null);

  const planned = items.filter((o) => o.status !== "Geplant").length;
  const conflicts = useMemo(() => {
    const set = new Set<string>();
    const byRes = new Map<string, Order[]>();
    items.forEach((o) => byRes.set(o.resourceId, [...(byRes.get(o.resourceId) ?? []), o]));
    byRes.forEach((list) => {
      const sorted = [...list].sort((a, b) => +new Date(a.start) - +new Date(b.start));
      for (let i = 1; i < sorted.length; i++)
        if (+new Date(sorted[i].start) < +new Date(sorted[i - 1].end)) { set.add(sorted[i].id); set.add(sorted[i-1].id); }
    });
    return set.size;
  }, [items]);
  const avgUtil = resources.length ? Math.round(resources.reduce((a, r) => a + r.utilization, 0) / resources.length) : 0;

  const overloadedRes = useMemo(() => {
    const DAY = 86_400_000;
    const horizon = 60;
    const origin = new Date(); origin.setHours(0,0,0,0); origin.setDate(origin.getDate() - 30);
    const loads = new Map<string, number[]>();
    resources.forEach((r) => loads.set(r.id, new Array(horizon).fill(0)));
    items.forEach((o) => {
      const arr = loads.get(o.resourceId); if (!arr) return;
      const s = Math.max(0, Math.floor((+new Date(o.start) - +origin) / DAY));
      const e = Math.min(horizon, Math.floor((+new Date(o.end) - +origin) / DAY));
      for (let i = s; i < e; i++) arr[i] += o.loadHours;
    });
    let count = 0;
    resources.forEach((r) => { if ((loads.get(r.id) ?? []).some((v) => v > r.capacityHours)) count++; });
    return count;
  }, [items]);

  const updateOrder = (next: Order) => {
    setItems((arr) => arr.map((o) => (o.id === next.id ? next : o)));
    updateOrderMut.mutate(next, {
      onSuccess: () => toast.success(`${next.number} verschoben`),
      onError: (e: any) => toast.error("Speichern fehlgeschlagen", { description: e?.message }),
    });
  };

  const handleOverload = ({ order, resource, days }: { order: Order; resource: { name: string; capacityHours: number }; days: { date: string; load: number; capacity: number }[] }) => {
    const worst = days.reduce((m, d) => (d.load > m.load ? d : m), days[0]);
    toast.warning(`Überlastung auf ${resource.name}`, {
      description: `${order.number}: ${days.length} Tag(e) über Kapazität — Spitze ${worst.load} h / ${worst.capacity} h am ${new Date(worst.date).toLocaleDateString("de-DE")}.`,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[{ label: "Produktion" }, { label: "Planung" }]}
        title="Planung"
        subtitle="Read-Only-Demo: Auftragsdaten werden gelesen, Änderungen sind ohne Login deaktiviert."
        actions={
          <>
            <ToggleGroup type="single" value={range} onValueChange={(v) => v && setRange(v as keyof typeof rangeDaysMap)} size="sm" variant="outline">
              <ToggleGroupItem value="day">Tag</ToggleGroupItem>
              <ToggleGroupItem value="week">Woche</ToggleGroupItem>
              <ToggleGroupItem value="month">Monat</ToggleGroupItem>
            </ToggleGroup>
            <Button onClick={() => toast.success("Plan veröffentlicht")}><Plus className="mr-2 h-4 w-4" /> Veröffentlichen</Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: "Eingeplant", value: planned, sub: `von ${items.length} Aufträgen` },
          { label: "Konflikte", value: conflicts, sub: "Überschneidungen" },
          { label: "Überlastete Ressourcen", value: overloadedRes, sub: `von ${resources.length}` },
          { label: "Auslastung", value: `${avgUtil} %`, sub: "Durchschnitt" },
        ].map((k) => (
          <Card key={k.label}>
            <CardContent className="pt-6">
              <p className="text-xs text-muted-foreground">{k.label}</p>
              <p className="text-2xl font-bold">{k.value}</p>
              <p className="text-xs text-muted-foreground">{k.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          <GanttChart
            orders={items}
            resources={resources}
            rangeDays={rangeDaysMap[range]}
            startOffsetDays={range === "day" ? -2 : range === "week" ? -7 : -14}
            onSelect={setActive}
            onOverload={handleOverload}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-wrap items-center gap-3 py-4 text-xs">
          <span className="text-muted-foreground">Legende:</span>
          {(Object.keys(statusStyles) as Array<keyof typeof statusStyles>).map((k) => (
            <span key={k} className="flex items-center gap-1.5">
              <span className={`inline-block h-3 w-5 rounded ${statusStyles[k].bar}`} />
              <span>{k}</span>
            </span>
          ))}
          <span className="ml-4 flex items-center gap-1.5">
            <span className="inline-block h-3 w-5 rounded ring-2 ring-destructive" />
            <span>Konflikt</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-5 rounded bg-destructive/15" />
            <span>Überlastung (h &gt; Kapazität)</span>
          </span>
        </CardContent>
      </Card>

      <Sheet open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <SheetContent>
          {active && (
            <>
              <SheetHeader>
                <SheetTitle>{active.number}</SheetTitle>
                <SheetDescription>{active.article} · {active.qty} {active.unit} für {active.customer}</SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-6">
                <div className="flex items-center gap-2">
                  <Badge className={statusStyles[active.status].badge}>{active.status}</Badge>
                  <Badge variant="secondary" className={priorityStyles[active.priority]}>{active.priority}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2"><Label>Start</Label><Input type="date" defaultValue={active.start.slice(0,10)} onChange={(e) => setActive({ ...active, start: new Date(e.target.value).toISOString() })} /></div>
                  <div className="space-y-2"><Label>Ende</Label><Input type="date" defaultValue={active.end.slice(0,10)} onChange={(e) => setActive({ ...active, end: new Date(e.target.value).toISOString() })} /></div>
                </div>
                <div className="space-y-2">
                  <Label>Ressource</Label>
                  <Select value={active.resourceId} onValueChange={(v) => setActive({ ...active, resourceId: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{resources.map((r) => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="text-sm text-muted-foreground">Geplant: {formatDate(active.start)} – {formatDate(active.end)}</div>
              </div>
              <SheetFooter>
                <Button variant="outline" onClick={() => setActive(null)}>Schließen</Button>
                <Button onClick={() => { updateOrder(active); setActive(null); }}>Speichern</Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}