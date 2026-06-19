import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";
import {
  ArrowLeft, FileText, Settings as SettingsIcon, StickyNote, User, Pencil,
  ListTree, Wrench, CalendarClock, ClipboardCheck, CheckCircle2, PlayCircle, FileSignature, Package,
} from "lucide-react";
import { Stepper } from "@/components/Stepper";
import { SubNav, type SubNavItem } from "@/components/SubNav";
import { toast } from "sonner";
import { statusStyles, priorityStyles, formatDate, useOrders, useResources } from "@/data/production";

const subNavItems: SubNavItem[] = [
  { key: "overview", label: "Übersicht", icon: User },
  { key: "bom", label: "Stückliste", icon: ListTree },
  { key: "ops", label: "Arbeitsgänge", icon: Wrench },
  { key: "planning", label: "Planung", icon: CalendarClock },
  { key: "notes", label: "Notizen", icon: StickyNote },
  { key: "history", label: "Historie", icon: ClipboardCheck },
];

const steps = [
  { label: "Angelegt" },
  { label: "Freigegeben" },
  { label: "Eingeplant" },
  { label: "In Arbeit" },
  { label: "Fertig" },
];

const statusToStep: Record<string, number> = {
  Geplant: 1, Freigegeben: 2, "In Arbeit": 4, Fertig: 5, Verspätet: 4,
};

const bom = [
  { pos: "10", part: "ROH-44", desc: "Rohling 44 mm", qty: 1, unit: "Stk." },
  { pos: "20", part: "DICH-7", desc: "Dichtung 7 mm", qty: 2, unit: "Stk." },
  { pos: "30", part: "SCHR-M6", desc: "Schraube M6×20", qty: 8, unit: "Stk." },
  { pos: "40", part: "LACK-RAL5010", desc: "Lack RAL 5010", qty: 0.05, unit: "L" },
];

const ops = [
  { ag: "010", desc: "Drehen", machine: "CNC-Fräse 1", setup: 15, run: 45 },
  { ag: "020", desc: "Fräsen", machine: "CNC-Fräse 2", setup: 20, run: 60 },
  { ag: "030", desc: "Lackieren", machine: "Lackierung", setup: 10, run: 90 },
  { ag: "040", desc: "Endprüfung", machine: "Prüfstand", setup: 5, run: 20 },
];

const history = [
  { icon: Package, color: "bg-lavender-100", title: "Auftrag angelegt", who: "Tom K.", when: "vor 5 Tagen" },
  { icon: FileSignature, color: "bg-mint", title: "Freigabe erteilt", who: "Jana M.", when: "vor 4 Tagen" },
  { icon: CalendarClock, color: "bg-peach", title: "Eingeplant auf CNC-Fräse 1", who: "System", when: "vor 3 Tagen" },
  { icon: PlayCircle, color: "bg-lavender-300", title: "Produktion gestartet", who: "Sara L.", when: "vor 1 Tag" },
  { icon: CheckCircle2, color: "bg-success/30", title: "AG 010 abgeschlossen", who: "Sara L.", when: "vor 4 Std." },
];

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: orders = [], isLoading } = useOrders();
  const { data: resources = [] } = useResources();
  const [section, setSection] = useState("overview");
  const [editOpen, setEditOpen] = useState(false);

  const order = orders.find((o) => o.id === id) ?? orders[0];
  if (isLoading || !order) {
    return <div className="p-6 text-sm text-muted-foreground">Lade Auftrag…</div>;
  }
  const resource = resources.find((r) => r.id === order.resourceId);
  const s = statusStyles[order.status];

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: "Aufträge", onClick: () => navigate("/orders") },
          { label: order.number },
        ]}
        title={`${order.number} · ${order.article}`}
        subtitle={`${order.qty} ${order.unit} für ${order.customer} · ${formatDate(order.start)} – ${formatDate(order.end)}`}
        actions={
          <>
            <Button variant="ghost" size="sm" onClick={() => navigate("/orders")} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" /> Zurück
            </Button>
            <Sheet open={editOpen} onOpenChange={setEditOpen}>
              <SheetTrigger asChild><Button><Pencil className="mr-2 h-4 w-4" /> Bearbeiten</Button></SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Auftrag bearbeiten</SheetTitle>
                  <SheetDescription>Änderungen werden protokolliert.</SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-6">
                  <div className="space-y-2"><Label>Artikel</Label><Input defaultValue={order.article} /></div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2"><Label>Menge</Label><Input type="number" defaultValue={order.qty} /></div>
                    <div className="space-y-2"><Label>Kunde</Label><Input defaultValue={order.customer} /></div>
                  </div>
                  <div className="space-y-2"><Label>Notiz</Label><Textarea rows={3} placeholder="Optional…" /></div>
                </div>
                <SheetFooter>
                  <Button variant="outline" onClick={() => setEditOpen(false)}>Abbrechen</Button>
                  <Button onClick={() => { setEditOpen(false); toast.success("Gespeichert"); }}>Speichern</Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <SubNav title="Auftrag" items={subNavItems} value={section} onChange={setSection} />

        <div className="min-w-0 space-y-6">
          <Card className="p-6">
            <Stepper steps={steps} current={statusToStep[order.status] ?? 1} />
          </Card>

          {section === "overview" && (
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Stammdaten</CardTitle>
                  <CardDescription>Artikel, Menge und Lieferdaten.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2"><Label>Auftrags-Nr.</Label><Input defaultValue={order.number} readOnly /></div>
                  <div className="space-y-2"><Label>Artikel</Label><Input defaultValue={order.article} /></div>
                  <div className="space-y-2"><Label>Menge</Label><Input defaultValue={`${order.qty} ${order.unit}`} /></div>
                  <div className="space-y-2"><Label>Kunde</Label><Input defaultValue={order.customer} /></div>
                  <div className="space-y-2"><Label>Start</Label><Input defaultValue={formatDate(order.start)} /></div>
                  <div className="space-y-2"><Label>Ende</Label><Input defaultValue={formatDate(order.end)} /></div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Notiz</Label>
                    <Textarea rows={3} defaultValue="Standardvorgaben. Toleranzklasse mittel." />
                  </div>
                </CardContent>
              </Card>

              <Card className="h-fit">
                <CardHeader><CardTitle className="text-lg">Meta</CardTitle></CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <Badge className={s.badge}><span className={`mr-1 inline-block h-1.5 w-1.5 rounded-full ${s.dot}`} /> {order.status}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Priorität</span>
                    <Badge variant="secondary" className={priorityStyles[order.priority]}>{order.priority}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Owner</span>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6"><AvatarFallback className="bg-lavender-100 text-ink text-[10px]">{order.owner.initials}</AvatarFallback></Avatar>
                      <span>{order.owner.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Ressource</span>
                    <span>{resource?.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Liefertermin</span>
                    <span>{formatDate(order.due)}</span>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Fortschritt</span>
                      <span className="font-mono text-xs">{order.progress}%</span>
                    </div>
                    <Progress value={order.progress} />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {section === "bom" && (
            <Card>
              <CardHeader><CardTitle className="text-lg">Stückliste</CardTitle><CardDescription>Komponenten und Materialbedarf.</CardDescription></CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader><TableRow>
                    <TableHead className="w-16">Pos.</TableHead>
                    <TableHead>Teile-Nr.</TableHead>
                    <TableHead>Bezeichnung</TableHead>
                    <TableHead className="text-right">Menge</TableHead>
                    <TableHead>Einheit</TableHead>
                  </TableRow></TableHeader>
                  <TableBody>
                    {bom.map((b) => (
                      <TableRow key={b.pos}>
                        <TableCell className="font-mono text-xs">{b.pos}</TableCell>
                        <TableCell className="font-mono text-xs">{b.part}</TableCell>
                        <TableCell>{b.desc}</TableCell>
                        <TableCell className="text-right">{b.qty}</TableCell>
                        <TableCell>{b.unit}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {section === "ops" && (
            <Card>
              <CardHeader><CardTitle className="text-lg">Arbeitsgänge</CardTitle><CardDescription>Reihenfolge, Maschine und Zeiten in Minuten.</CardDescription></CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader><TableRow>
                    <TableHead>AG</TableHead>
                    <TableHead>Beschreibung</TableHead>
                    <TableHead>Maschine</TableHead>
                    <TableHead className="text-right">Rüsten</TableHead>
                    <TableHead className="text-right">Bearbeiten</TableHead>
                  </TableRow></TableHeader>
                  <TableBody>
                    {ops.map((o) => (
                      <TableRow key={o.ag}>
                        <TableCell className="font-mono text-xs">{o.ag}</TableCell>
                        <TableCell className="font-medium">{o.desc}</TableCell>
                        <TableCell>{o.machine}</TableCell>
                        <TableCell className="text-right font-mono text-xs">{o.setup} min</TableCell>
                        <TableCell className="text-right font-mono text-xs">{o.run} min</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {section === "planning" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Planung</CardTitle>
                <CardDescription>Termin- und Ressourcenzuordnung.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2"><Label>Start</Label><Input type="date" defaultValue={order.start.slice(0,10)} /></div>
                <div className="space-y-2"><Label>Ende</Label><Input type="date" defaultValue={order.end.slice(0,10)} /></div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Ressource</Label>
                  <Input defaultValue={resource?.name} />
                </div>
                <div className="md:col-span-2 flex justify-end gap-2">
                  <Button variant="outline" onClick={() => navigate("/planning")}>Im Gantt anzeigen</Button>
                  <Button onClick={() => toast.success("Plan gespeichert")}>Speichern</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {section === "notes" && (
            <Card>
              <CardHeader><CardTitle className="text-lg">Interne Notizen</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <Textarea rows={4} placeholder="Neue Notiz…" />
                <div className="flex justify-end"><Button size="sm" onClick={() => toast.success("Notiz gespeichert")}>Speichern</Button></div>
                <Separator />
                {[
                  { who: "Jana M.", when: "vor 1 Std.", text: "Kunde wünscht Vorzug — Priorität auf Hoch gesetzt." },
                  { who: "Sara L.", when: "gestern", text: "Material vollständig, Linie A vorbereitet." },
                ].map((n, i) => (
                  <div key={i} className="rounded-md border p-3">
                    <div className="mb-1 flex items-center gap-2">
                      <Avatar className="h-6 w-6"><AvatarFallback className="bg-lavender-100 text-ink text-[10px]">{n.who.split(" ")[0][0]}{n.who.split(" ")[1][0]}</AvatarFallback></Avatar>
                      <span className="text-xs font-medium">{n.who}</span>
                      <span className="text-xs text-muted-foreground">· {n.when}</span>
                    </div>
                    <p className="text-sm">{n.text}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {section === "history" && (
            <Card>
              <CardHeader><CardTitle className="text-lg">Historie</CardTitle><CardDescription>Alle Ereignisse zu diesem Auftrag.</CardDescription></CardHeader>
              <CardContent>
                <ol className="relative ml-3 space-y-4 border-l pl-6">
                  {history.map((e, idx) => {
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
          )}
        </div>
      </div>
    </div>
  );
}