import { useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { statusStyles, type Order, type Resource } from "@/data/production";
import { AlertTriangle } from "lucide-react";

interface Props {
  orders: Order[];
  resources: Resource[];
  rangeDays?: number;
  startOffsetDays?: number;
  onSelect?: (order: Order) => void;
  onChange?: (order: Order) => void;
  /** Wird aufgerufen, wenn ein verschobener Auftrag eine Überlastung erzeugt. */
  onOverload?: (info: { order: Order; resource: Resource; days: { date: string; load: number; capacity: number }[] }) => void;
}

const DAY = 86_400_000;

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function GanttChart({
  orders,
  resources,
  rangeDays = 21,
  startOffsetDays = -7,
  onSelect,
  onChange,
}: Props) {
  const origin = useMemo(() => {
    const t = startOfDay(new Date());
    t.setDate(t.getDate() + startOffsetDays);
    return t;
  }, [startOffsetDays]);

  const COL = 44; // px per day
  const ROW = 56; // px per resource row
  const totalWidth = COL * rangeDays;

  const days = useMemo(
    () => Array.from({ length: rangeDays }).map((_, i) => {
      const d = new Date(origin);
      d.setDate(d.getDate() + i);
      return d;
    }),
    [origin, rangeDays],
  );

  const dayIndex = (iso: string) => Math.round((startOfDay(new Date(iso)).getTime() - origin.getTime()) / DAY);

  const todayIdx = dayIndex(new Date().toISOString());

  // Conflict detection: orders on same resource overlapping
  const conflicts = useMemo(() => {
    const set = new Set<string>();
    const byRes = new Map<string, Order[]>();
    orders.forEach((o) => {
      const arr = byRes.get(o.resourceId) ?? [];
      arr.push(o);
      byRes.set(o.resourceId, arr);
    });
    byRes.forEach((list) => {
      const sorted = [...list].sort((a, b) => +new Date(a.start) - +new Date(b.start));
      for (let i = 1; i < sorted.length; i++) {
        if (+new Date(sorted[i].start) < +new Date(sorted[i - 1].end)) {
          set.add(sorted[i].id);
          set.add(sorted[i - 1].id);
        }
      }
    });
    return set;
  }, [orders]);

  const dragRef = useRef<{ id: string; mode: "move" | "resize-l" | "resize-r"; startX: number; origStart: number; origEnd: number } | null>(null);
  const [tempPos, setTempPos] = useState<Record<string, { start: string; end: string }>>({});

  const onPointerDown = (e: React.PointerEvent, o: Order, mode: "move" | "resize-l" | "resize-r") => {
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = {
      id: o.id,
      mode,
      startX: e.clientX,
      origStart: +new Date(o.start),
      origEnd: +new Date(o.end),
    };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    const dxDays = Math.round((e.clientX - d.startX) / COL);
    if (!dxDays && !tempPos[d.id]) return;
    let s = d.origStart, en = d.origEnd;
    if (d.mode === "move") { s += dxDays * DAY; en += dxDays * DAY; }
    if (d.mode === "resize-l") s = Math.min(en - DAY, s + dxDays * DAY);
    if (d.mode === "resize-r") en = Math.max(s + DAY, en + dxDays * DAY);
    setTempPos((p) => ({ ...p, [d.id]: { start: new Date(s).toISOString(), end: new Date(en).toISOString() } }));
  };
  const onPointerUp = () => {
    const d = dragRef.current;
    dragRef.current = null;
    if (!d) return;
    const upd = tempPos[d.id];
    if (upd && onChange) {
      const o = orders.find((x) => x.id === d.id);
      if (o) {
        const next = { ...o, start: upd.start, end: upd.end };
        onChange(next);
        if (onOverload) {
          const res = resources.find((r) => r.id === next.resourceId);
          if (res) {
            const overloadedDays = daysSpanning(next).map((iso) => {
              const load = orders.reduce((sum, x) => {
                const eff = x.id === next.id ? next : (tempPos[x.id] ? { ...x, ...tempPos[x.id] } : x);
                if (eff.resourceId !== res.id) return sum;
                return touchesDay(eff, iso) ? sum + eff.loadHours : sum;
              }, 0);
              return { date: iso, load, capacity: res.capacityHours };
            }).filter((x) => x.load > x.capacity);
            if (overloadedDays.length) onOverload({ order: next, resource: res, days: overloadedDays });
          }
        }
      }
    }
    setTempPos((p) => { const n = { ...p }; delete n[d.id]; return n; });
  };

  const resolved = (o: Order) => {
    const t = tempPos[o.id];
    return t ? { ...o, start: t.start, end: t.end } : o;
  };

  // Per (resource, day-index) Load-Summe inkl. aktiver Drag-Position
  const loadByResDay = useMemo(() => {
    const m = new Map<string, number[]>();
    resources.forEach((r) => m.set(r.id, new Array(rangeDays).fill(0)));
    orders.forEach((raw) => {
      const o = resolved(raw);
      const arr = m.get(o.resourceId);
      if (!arr) return;
      const s = Math.max(0, dayIndex(o.start));
      const e = Math.min(rangeDays, dayIndex(o.end));
      for (let i = s; i < e; i++) arr[i] += o.loadHours;
    });
    return m;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders, resources, rangeDays, tempPos]);

  const overloadedResources = useMemo(() => {
    const set = new Set<string>();
    resources.forEach((r) => {
      const arr = loadByResDay.get(r.id) ?? [];
      if (arr.some((v) => v > r.capacityHours)) set.add(r.id);
    });
    return set;
  }, [loadByResDay, resources]);

  function daysSpanning(o: Order): string[] {
    const out: string[] = [];
    const s = startOfDay(new Date(o.start)).getTime();
    const e = startOfDay(new Date(o.end)).getTime();
    for (let t = s; t < e; t += DAY) out.push(new Date(t).toISOString());
    return out;
  }
  function touchesDay(o: Order, isoDay: string): boolean {
    const d = +startOfDay(new Date(isoDay));
    return +startOfDay(new Date(o.start)) <= d && d < +startOfDay(new Date(o.end));
  }

  return (
    <TooltipProvider delayDuration={150}>
      <div className="overflow-auto" onPointerMove={onPointerMove} onPointerUp={onPointerUp}>
        <div className="flex min-w-fit">
          {/* Left sticky column */}
          <div className="sticky left-0 z-10 w-48 shrink-0 border-r bg-card">
            <div className="h-12 border-b px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Ressource
            </div>
            {resources.map((r) => (
              <div key={r.id} style={{ height: ROW }} className="flex items-center gap-2 border-b px-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.group} · {r.capacityHours} h/Tag</p>
                </div>
                {overloadedResources.has(r.id) && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-destructive/15 text-destructive">
                        <AlertTriangle className="h-3.5 w-3.5" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>Überlastung in diesem Zeitraum</TooltipContent>
                  </Tooltip>
                )}
              </div>
            ))}
          </div>

          {/* Timeline */}
          <div className="relative" style={{ width: totalWidth }}>
            {/* Day headers */}
            <div className="sticky top-0 z-10 flex h-12 border-b bg-card">
              {days.map((d, i) => {
                const isWeekend = d.getDay() === 0 || d.getDay() === 6;
                const isToday = i === todayIdx;
                return (
                  <div
                    key={i}
                    style={{ width: COL }}
                    className={cn(
                      "flex shrink-0 flex-col items-center justify-center border-r text-[10px]",
                      isWeekend && "bg-muted/40",
                      isToday && "bg-lavender-100",
                    )}
                  >
                    <span className="text-muted-foreground">
                      {d.toLocaleDateString("de-DE", { weekday: "short" })}
                    </span>
                    <span className="font-mono font-semibold">{d.getDate()}</span>
                  </div>
                );
              })}
            </div>

            {/* Grid + bars */}
            <div className="relative">
              {/* Today vertical line */}
              {todayIdx >= 0 && todayIdx < rangeDays && (
                <div
                  className="pointer-events-none absolute top-0 z-20 w-px bg-destructive"
                  style={{ left: todayIdx * COL + COL / 2, height: ROW * resources.length }}
                />
              )}

              {resources.map((r, rowIdx) => (
                <div
                  key={r.id}
                  style={{ height: ROW }}
                  className={cn("relative border-b", rowIdx % 2 === 1 && "bg-muted/20")}
                >
                  {/* Day column lines */}
                  {days.map((d, i) => {
                    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
                    const load = loadByResDay.get(r.id)?.[i] ?? 0;
                    const overloaded = load > r.capacityHours;
                    return (
                      <Tooltip key={i}>
                        <TooltipTrigger asChild>
                          <div
                            style={{ left: i * COL, width: COL }}
                            className={cn(
                              "absolute top-0 h-full border-r border-border/50",
                              isWeekend && "bg-muted/30",
                              overloaded && "bg-destructive/15",
                            )}
                          />
                        </TooltipTrigger>
                        {load > 0 && (
                          <TooltipContent>
                            <p className="text-xs">
                              {d.toLocaleDateString("de-DE", { weekday: "short", day: "2-digit", month: "2-digit" })}
                            </p>
                            <p className={cn("text-xs", overloaded && "font-semibold text-destructive")}>
                              Last: {load} h / {r.capacityHours} h
                              {overloaded && ` · +${load - r.capacityHours} h Überlast`}
                            </p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    );
                  })}

                  {/* Bars */}
                  {orders.filter((o) => o.resourceId === r.id).map((raw) => {
                    const o = resolved(raw);
                    const s = dayIndex(o.start);
                    const e = dayIndex(o.end);
                    const left = s * COL + 2;
                    const width = Math.max(COL - 4, (e - s) * COL - 4);
                    if (e < 0 || s > rangeDays) return null;
                    const style = statusStyles[o.status];
                    const conflict = conflicts.has(o.id);
                    return (
                      <Tooltip key={o.id}>
                        <TooltipTrigger asChild>
                          <div
                            onPointerDown={(ev) => onPointerDown(ev, raw, "move")}
                            onClick={() => onSelect?.(raw)}
                            style={{ left, width, top: 8, height: ROW - 16 }}
                            className={cn(
                              "group absolute flex cursor-grab items-center overflow-hidden rounded-md text-xs text-ink shadow-sm transition-shadow hover:shadow-md active:cursor-grabbing",
                              style.bar,
                              conflict && "ring-2 ring-destructive",
                            )}
                          >
                            {/* progress fill */}
                            <div
                              className="absolute inset-y-0 left-0 bg-white/30"
                              style={{ width: `${o.progress}%` }}
                            />
                            {/* left handle */}
                            <span
                              onPointerDown={(ev) => onPointerDown(ev, raw, "resize-l")}
                              className="absolute inset-y-0 left-0 w-1.5 cursor-ew-resize bg-black/10 opacity-0 group-hover:opacity-100"
                            />
                            <span className="relative z-10 truncate px-2 font-medium">
                              {o.number} · {o.article}
                            </span>
                            <span
                              onPointerDown={(ev) => onPointerDown(ev, raw, "resize-r")}
                              className="absolute inset-y-0 right-0 w-1.5 cursor-ew-resize bg-black/10 opacity-0 group-hover:opacity-100"
                            />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="font-medium">{o.number} · {o.article}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(o.start).toLocaleDateString("de-DE")} – {new Date(o.end).toLocaleDateString("de-DE")}
                          </p>
                          <p className="text-xs">Status: {o.status} · {o.progress}%</p>
                          {conflict && <p className="text-xs text-destructive">Konflikt auf {r.name}</p>}
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}