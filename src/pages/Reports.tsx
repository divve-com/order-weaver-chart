import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { statusStyles, useOrders, useResources, type OrderStatus } from "@/data/production";

function Sparkline({ data }: { data: number[] }) {
  const max = Math.max(...data), min = Math.min(...data);
  const range = max - min || 1, w = 120, h = 32;
  const step = w / (data.length - 1);
  const pts = data.map((v, i) => `${i * step},${h - ((v - min) / range) * h}`).join(" ");
  return <svg width={w} height={h}><polyline fill="none" stroke="hsl(var(--lavender-500))" strokeWidth="2" strokeLinecap="round" points={pts} /></svg>;
}

export default function Reports() {
  const { data: orders = [] } = useOrders();
  const { data: resources = [] } = useResources();
  const total = orders.length;
  const byStatus = (Object.keys(statusStyles) as OrderStatus[]).map((k) => ({
    status: k,
    count: orders.filter((o) => o.status === k).length,
  }));
  const onTime = orders.filter((o) => o.status === "Fertig").length;
  const late = orders.filter((o) => o.status === "Verspätet").length;
  const avgUtil = resources.length ? Math.round(resources.reduce((a, r) => a + r.utilization, 0) / resources.length) : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[{ label: "Produktion" }, { label: "Auswertungen" }]}
        title="Auswertungen"
        subtitle="Kennzahlen zu Aufträgen, Auslastung und Termintreue."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader><CardTitle className="text-lg">Aufträge gesamt</CardTitle><CardDescription>Letzte 30 Tage</CardDescription></CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-bold">{total}</p>
              <Sparkline data={[8, 10, 9, 12, 14, 13, 16, 18, 17, 20]} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-lg">Termintreue</CardTitle><CardDescription>{onTime} fertig · {late} verspätet</CardDescription></CardHeader>
          <CardContent className="space-y-2">
            <p className="text-3xl font-bold">{total ? Math.round((onTime / (onTime + late || 1)) * 100) : 0} %</p>
            <Progress value={total ? (onTime / (onTime + late || 1)) * 100 : 0} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-lg">Ø Auslastung</CardTitle><CardDescription>Alle Ressourcen</CardDescription></CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{avgUtil} %</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-lg">Status-Verteilung</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {byStatus.map((s) => (
              <div key={s.status} className="flex items-center justify-between rounded-md border p-2.5">
                <div className="flex items-center gap-2">
                  <span className={`inline-block h-2 w-2 rounded-full ${statusStyles[s.status].dot}`} />
                  <span className="text-sm">{s.status}</span>
                </div>
                <Badge className={statusStyles[s.status].badge}>{s.count}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-lg">Auslastung je Ressource</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {resources.map((r) => (
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
      </div>
    </div>
  );
}