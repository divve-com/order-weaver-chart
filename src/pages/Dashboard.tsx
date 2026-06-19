import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  ArrowUpRight, ArrowDownRight, Sparkles, AlertCircle, Plus, Download,
  Package, PlayCircle, CheckCircle2, FileSignature, CalendarClock, GanttChartSquare,
} from "lucide-react";
import { useOrders, useResources, type OrderStatus } from "@/data/production";

const stages: { stage: OrderStatus; color: string }[] = [
  { stage: "Geplant", color: "bg-muted text-muted-foreground" },
  { stage: "Freigegeben", color: "bg-lavender-100 text-ink" },
  { stage: "In Arbeit", color: "bg-peach text-ink" },
  { stage: "Fertig", color: "bg-success/15 text-success" },
  { stage: "Verspätet", color: "bg-destructive/15 text-destructive" },
];

const activity = [
  { icon: PlayCircle, color: "bg-lavender-300", title: "PA-2026-018 gestartet · CNC-Fräse 1", who: "Sara L.", when: "vor 6 Min." },
  { icon: CheckCircle2, color: "bg-success/30", title: "PA-2026-014 fertiggestellt · Linie A", who: "System", when: "vor 38 Min." },
  { icon: CalendarClock, color: "bg-peach", title: "Plan veröffentlicht · KW 25", who: "Jana M.", when: "vor 2 Std." },
  { icon: FileSignature, color: "bg-mint", title: "PA-2026-022 freigegeben", who: "Tom K.", when: "vor 4 Std." },
  { icon: Package, color: "bg-lavender-100", title: "Neuer Auftrag · Welle W-18 · 250 Stk.", who: "Ben H.", when: "gestern" },
];

function Sparkline({ data, positive }: { data: number[]; positive: boolean }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80;
  const h = 28;
  const step = w / (data.length - 1);
  const pts = data
    .map((v, i) => `${i * step},${h - ((v - min) / range) * h}`)
    .join(" ");
  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline
        fill="none"
        stroke={positive ? "hsl(var(--success))" : "hsl(var(--destructive))"}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={pts}
      />
    </svg>
  );
}

export default function Dashboard() {
  const [range, setRange] = useState("week");
  const navigate = useNavigate();
  const { data: orders = [] } = useOrders();
  const { data: resources = [] } = useResources();
  const totalOrders = orders.length;
  const inProgress = orders.filter((o) => o.status === "In Arbeit").length;
  const late = orders.filter((o) => o.status === "Verspätet").length;
  const open = orders.filter((o) => o.status === "Geplant" || o.status === "Freigegeben").length;
  const avgUtil = resources.length ? Math.round(resources.reduce((a, r) => a + r.utilization, 0) / resources.length) : 0;
  const kpis = [
    { label: "Offene Aufträge", value: String(open), delta: 8, spark: [4, 6, 5, 8, 7, 9, 11] },
    { label: "In Produktion", value: String(inProgress), delta: 4, spark: [3, 4, 4, 5, 5, 6, 6] },
    { label: "Verspätet", value: String(late), delta: -2, spark: [6, 5, 5, 4, 4, 3, 3] },
    { label: "Ø Auslastung", value: `${avgUtil} %`, delta: 6, spark: [50, 55, 58, 60, 65, 62, 68] },
  ];
  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[{ label: "Produktion" }, { label: "Übersicht" }]}
        title="Übersicht"
        subtitle="Status aller Produktionsaufträge, Linien und Termine."
        actions={
          <>
            <ToggleGroup type="single" value={range} onValueChange={(v) => v && setRange(v)} size="sm" variant="outline">
              <ToggleGroupItem value="day">Tag</ToggleGroupItem>
              <ToggleGroupItem value="week">Woche</ToggleGroupItem>
              <ToggleGroupItem value="month">Monat</ToggleGroupItem>
            </ToggleGroup>
            <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export</Button>
            <Button onClick={() => navigate("/orders")}><Plus className="mr-2 h-4 w-4" /> Neuer Auftrag</Button>
          </>
        }
      />

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{late} Aufträge in Verzug</AlertTitle>
        <AlertDescription>
          Liefertermine überschritten. Prüfe Priorisierung und Ressourcenverfügbarkeit in der <button className="font-medium underline" onClick={() => navigate("/planning")}>Planung</button>.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {kpis.map((k) => {
          const positive = k.delta >= 0;
          return (
            <Card key={k.label}>
              <CardContent className="pt-6">
                <p className="text-xs text-muted-foreground">{k.label}</p>
                <div className="mt-1 flex items-end justify-between">
                  <p className="text-2xl font-bold">{k.value}</p>
                  <Sparkline data={k.spark} positive={positive} />
                </div>
                <div className="mt-2 flex items-center gap-1 text-xs">
                  {positive ? (
                    <ArrowUpRight className="h-3.5 w-3.5 text-success" />
                  ) : (
                    <ArrowDownRight className="h-3.5 w-3.5 text-destructive" />
                  )}
                  <span className={positive ? "text-success" : "text-destructive"}>
                    {positive ? "+" : ""}{k.delta}%
                  </span>
                  <span className="text-muted-foreground">vs. Vorwoche</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-lg">Letzte Aktivitäten</CardTitle>
              <CardDescription>Ereignisse aus Produktion und Planung.</CardDescription>
            </div>
            <Badge variant="secondary"><span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> Live</Badge>
          </CardHeader>
          <CardContent>
            <ol className="relative ml-3 space-y-4 border-l pl-6">
              {activity.map((e, idx) => {
                const Icon = e.icon;
                return (
                  <li key={idx}>
                    <span className={`absolute -left-4 flex h-8 w-8 items-center justify-center rounded-full ring-4 ring-background ${e.color}`}>
                      <Icon className="h-4 w-4 text-ink" />
                    </span>
                    <p className="text-sm font-medium">{e.title}</p>
                    <p className="text-xs text-muted-foreground">{e.who} · {e.when}</p>
                  </li>
                );
              })}
            </ol>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status-Pipeline</CardTitle>
              <CardDescription>Aufträge nach Bearbeitungsstand.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {stages.map((p) => {
                const c = orders.filter((o) => o.status === p.stage).length;
                return (
                  <div key={p.stage} className="flex items-center justify-between rounded-md border p-2.5">
                    <span className="text-sm">{p.stage}</span>
                    <Badge className={p.color}>{c}</Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Schnellaktionen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-between" onClick={() => navigate("/orders")}><span className="flex items-center"><Plus className="mr-2 h-4 w-4" /> Auftrag anlegen</span> <ArrowUpRight className="h-4 w-4" /></Button>
              <Button variant="outline" className="w-full justify-between" onClick={() => navigate("/planning")}><span className="flex items-center"><GanttChartSquare className="mr-2 h-4 w-4" /> Plan öffnen</span> <ArrowUpRight className="h-4 w-4" /></Button>
              <Button variant="secondary" className="w-full justify-between" onClick={() => navigate("/reports")}><span className="flex items-center"><Sparkles className="mr-2 h-4 w-4" /> Auswertungen</span> <ArrowUpRight className="h-4 w-4" /></Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Monats-Auslastung</CardTitle>
            <CardDescription>Kapazitätsnutzung Juni 2026.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-end justify-between">
              <p className="text-3xl font-bold">{avgUtil} %</p>
              <p className="text-sm text-muted-foreground">Ø über alle Linien</p>
            </div>
            <Progress value={avgUtil} />
            <p className="text-xs text-muted-foreground">{totalOrders} Aufträge im Zeitraum · 11 Tage verbleibend</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top-Ressourcen</CardTitle>
            <CardDescription>Höchste Auslastung diese Woche.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[...resources].sort((a,b) => b.utilization - a.utilization).slice(0,4).map((r) => (
              <div key={r.id} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{r.name}</span>
                  <span className="font-mono text-xs">{r.utilization}%</span>
                </div>
                <Progress value={r.utilization} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ressourcen-Status</CardTitle>
            <CardDescription>Live-Übersicht.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {resources.map((r) => (
              <div key={r.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`inline-block h-2 w-2 rounded-full ${r.status === "Verfügbar" ? "bg-success" : r.status === "Belegt" ? "bg-warning" : "bg-destructive"}`} />
                  <span className="text-sm">{r.name}</span>
                </div>
                <span className="text-xs text-muted-foreground">{r.status}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}