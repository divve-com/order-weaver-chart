import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useState } from "react";
import {
  ArrowUpRight,
  ArrowDownRight,
  Mail,
  ShieldCheck,
  FileSignature,
  Receipt,
  Sparkles,
  AlertCircle,
  Plus,
  Send,
  UserPlus,
  Download,
} from "lucide-react";

const kpis = [
  { label: "Aktive Kunden", value: "284", delta: 12, spark: [4, 6, 5, 8, 7, 9, 11] },
  { label: "Domains live", value: "1.842", delta: 4, spark: [12, 13, 12, 14, 15, 14, 16] },
  { label: "Mails / 24h", value: "98.412", delta: 18, spark: [20, 30, 28, 40, 50, 48, 62] },
  { label: "Zustellrate", value: "99,4 %", delta: -1, spark: [60, 58, 59, 57, 56, 58, 57] },
];

const pipeline = [
  { stage: "Lead", count: 14, color: "bg-muted text-muted-foreground" },
  { stage: "Onboarding", count: 6, color: "bg-lavender-100 text-ink" },
  { stage: "Validierung", count: 4, color: "bg-peach text-ink" },
  { stage: "Live", count: 23, color: "bg-success/15 text-success" },
];

const activity = [
  { icon: Mail, color: "bg-lavender-300", title: "Mail-Test versendet · acme.de", who: "Jana M.", when: "vor 8 Min." },
  { icon: ShieldCheck, color: "bg-success/30", title: "DNS validiert · beta-corp.de", who: "System", when: "vor 42 Min." },
  { icon: FileSignature, color: "bg-mint", title: "SEPA-Mandat unterschrieben · Gamma GmbH", who: "Kunde", when: "vor 2 Std." },
  { icon: Receipt, color: "bg-peach", title: "Rechnung R-2026-0058 erzeugt · Delta SE", who: "Automatik", when: "vor 5 Std." },
  { icon: UserPlus, color: "bg-lavender-100", title: "Neuer Kunde angelegt · Epsilon UG", who: "Tom K.", when: "gestern" },
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
  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[{ label: "Übersicht" }]}
        title="Dashboard"
        subtitle="Live-Status aller Kunden, Domains und Versand-Pipelines."
        actions={
          <>
            <ToggleGroup type="single" value={range} onValueChange={(v) => v && setRange(v)} size="sm" variant="outline">
              <ToggleGroupItem value="day">Tag</ToggleGroupItem>
              <ToggleGroupItem value="week">Woche</ToggleGroupItem>
              <ToggleGroupItem value="month">Monat</ToggleGroupItem>
            </ToggleGroup>
            <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export</Button>
            <Button><Plus className="mr-2 h-4 w-4" /> Neuer Kunde</Button>
          </>
        }
      />

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>2 DNS-Records warten auf Validierung</AlertTitle>
        <AlertDescription>
          Bei <span className="font-medium">beta-corp.de</span> und <span className="font-medium">zeta-ug.de</span> sind SPF/DKIM noch nicht propagiert. Letzte Prüfung vor 4 Min.
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
              <CardDescription>Live-Stream aus Versand, DNS und Onboarding.</CardDescription>
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
              <CardTitle className="text-lg">Pipeline</CardTitle>
              <CardDescription>Kunden nach Onboarding-Stufe.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {pipeline.map((p) => (
                <div key={p.stage} className="flex items-center justify-between rounded-md border p-2.5">
                  <span className="text-sm">{p.stage}</span>
                  <Badge className={p.color}>{p.count}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Schnellaktionen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-between"><span className="flex items-center"><UserPlus className="mr-2 h-4 w-4" /> Kunde anlegen</span> <ArrowUpRight className="h-4 w-4" /></Button>
              <Button variant="outline" className="w-full justify-between"><span className="flex items-center"><Send className="mr-2 h-4 w-4" /> Mail-Test</span> <ArrowUpRight className="h-4 w-4" /></Button>
              <Button variant="secondary" className="w-full justify-between"><span className="flex items-center"><Sparkles className="mr-2 h-4 w-4" /> KI-Vorschlag</span> <ArrowUpRight className="h-4 w-4" /></Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Monats-Kontingent</CardTitle>
            <CardDescription>Versendete Mails im Juni 2026.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-end justify-between">
              <p className="text-3xl font-bold">2,84 M</p>
              <p className="text-sm text-muted-foreground">von 5 M</p>
            </div>
            <Progress value={57} />
            <p className="text-xs text-muted-foreground">57 % verbraucht · 11 Tage verbleibend</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top-Versender</CardTitle>
            <CardDescription>Diese Woche.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { name: "Acme GmbH", mails: "412.220", initials: "AC" },
              { name: "Beta KG", mails: "298.104", initials: "BK" },
              { name: "Gamma AG", mails: "187.560", initials: "GA" },
              { name: "Delta SE", mails: "142.001", initials: "DS" },
            ].map((t) => (
              <div key={t.name} className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-lavender-100 text-ink text-xs">{t.initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.mails} Mails</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">System-Health</CardTitle>
            <CardDescription>EU-Infrastruktur.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { name: "SendGrid EU", status: "Operational", dot: "bg-success" },
              { name: "Webhook-Receiver", status: "Operational", dot: "bg-success" },
              { name: "DNS-Validator", status: "Degraded", dot: "bg-warning" },
              { name: "PDF-Service", status: "Operational", dot: "bg-success" },
            ].map((s) => (
              <div key={s.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`inline-block h-2 w-2 rounded-full ${s.dot}`} />
                  <span className="text-sm">{s.name}</span>
                </div>
                <span className="text-xs text-muted-foreground">{s.status}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}