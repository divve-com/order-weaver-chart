import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Calendar,
  Copy,
  FileText,
  Receipt,
  Settings as SettingsIcon,
  StickyNote,
  User,
  Pencil,
  Upload,
  CheckCircle2,
  Mail,
  ShieldCheck,
  FileSignature,
  UserPlus,
} from "lucide-react";
import { Stepper } from "@/components/Stepper";
import { SubNav, type SubNavItem } from "@/components/SubNav";
import { toast } from "sonner";

const subNavItems: SubNavItem[] = [
  { key: "overview", label: "Übersicht", icon: User },
  { key: "contract", label: "Vertrag", icon: FileText },
  { key: "billing", label: "Abrechnung", icon: Receipt },
  { key: "config", label: "Konfiguration", icon: SettingsIcon },
  { key: "notes", label: "Notizen", icon: StickyNote },
  { key: "schedule", label: "Termine", icon: Calendar },
];

const steps = [
  { label: "Angelegt" },
  { label: "Konfiguriert" },
  { label: "Validiert" },
  { label: "Aktiviert" },
  { label: "Live" },
];

const configRows = [
  { name: "s1._domainkey", type: "CNAME", host: "s1._domainkey", value: "s1.domainkey.u123.wl.sendgrid.net", status: "OK" as const },
  { name: "s2._domainkey", type: "CNAME", host: "s2._domainkey", value: "s2.domainkey.u123.wl.sendgrid.net", status: "OK" as const },
  { name: "mail.acme.de", type: "CNAME", host: "mail", value: "u123.wl.sendgrid.net", status: "OK" as const },
  { name: "_dmarc", type: "TXT", host: "_dmarc", value: "v=DMARC1; p=quarantine; rua=...", status: "Pending" as const },
];

const auditLog = [
  { icon: Mail, color: "bg-lavender-300", title: "Mail-Test versendet", who: "Jana M.", when: "vor 12 Min." },
  { icon: ShieldCheck, color: "bg-success/30", title: "DNS validiert", who: "System", when: "vor 1 Std." },
  { icon: FileSignature, color: "bg-mint", title: "SEPA-Mandat unterschrieben", who: "Kunde", when: "vor 3 Std." },
  { icon: Receipt, color: "bg-peach", title: "Rechnung R-2026-0042 erzeugt", who: "Automatik", when: "gestern" },
  { icon: UserPlus, color: "bg-lavender-100", title: "Kunde angelegt", who: "Tom K.", when: "vor 4 Tagen" },
];

function AnimatedNumber({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const [n, setN] = useState(0);
  const raf = useRef<number>();
  useEffect(() => {
    const start = performance.now();
    const duration = 800;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setN(Math.round(value * (0.5 - Math.cos(p * Math.PI) / 2)));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => raf.current && cancelAnimationFrame(raf.current);
  }, [value]);
  return <span>{prefix}{n.toLocaleString("de-DE")}{suffix}</span>;
}

export default function DetailView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [section, setSection] = useState("overview");
  const [editOpen, setEditOpen] = useState(false);
  const [files, setFiles] = useState<{ name: string; size: string }[]>([
    { name: "vertrag-acme.pdf", size: "248 KB" },
  ]);
  const [dragOver, setDragOver] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: "Kunden", onClick: () => navigate("/list") },
          { label: `Acme GmbH` },
        ]}
        title={`Acme GmbH`}
        subtitle={`Customer-ID MST${(id ?? "1").padStart(3, "0")} · Live seit 04.06.2026`}
        actions={
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/list")}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Zurück
            </Button>
            <Sheet open={editOpen} onOpenChange={setEditOpen}>
              <SheetTrigger asChild>
                <Button><Pencil className="mr-2 h-4 w-4" /> Bearbeiten</Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Kunde bearbeiten</SheetTitle>
                  <SheetDescription>Stammdaten — Änderungen werden geloggt.</SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-6">
                  <div className="space-y-2">
                    <Label htmlFor="cname">Firmenname</Label>
                    <Input id="cname" defaultValue="Acme GmbH" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cmail">Kontakt-Mail</Label>
                    <Input id="cmail" type="email" defaultValue="ops@acme.de" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cnote">Interne Notiz</Label>
                    <Textarea id="cnote" rows={3} placeholder="Optional…" />
                  </div>
                </div>
                <SheetFooter>
                  <Button variant="outline" onClick={() => setEditOpen(false)}>Abbrechen</Button>
                  <Button onClick={() => { setEditOpen(false); toast.success("Änderungen gespeichert"); }}>Speichern</Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <SubNav
          title="Detailbereich"
          items={subNavItems}
          value={section}
          onChange={setSection}
        />

        <div className="min-w-0 space-y-6">
          <Card className="p-6">
            <Stepper steps={steps} current={3} />
          </Card>

          {section === "overview" && (
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Stammdaten</CardTitle>
                  <CardDescription>Kontaktinformationen und Referenzen.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Firmenname</Label>
                    <Input id="name" defaultValue="Acme GmbH" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ref">Customer-ID</Label>
                    <Input id="ref" defaultValue={`MST${(id ?? "1").padStart(3, "0")}`} readOnly />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="desc">Beschreibung</Label>
                    <Textarea id="desc" defaultValue="B2B-Versand für Newsletter und Transaktions-Mails. EU-Region." rows={4} />
                  </div>
                </CardContent>
              </Card>

              <Card className="h-fit">
                <CardHeader>
                  <CardTitle className="text-lg">Meta</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <Badge className="bg-success/15 text-success hover:bg-success/15"><span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-success" /> Aktiv</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Owner</span>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6"><AvatarFallback className="bg-lavender-100 text-ink text-[10px]">JM</AvatarFallback></Avatar>
                      <span>Jana Müller</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Angelegt</span>
                    <span>01.06.2026</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Live seit</span>
                    <span>04.06.2026</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Mails / 30T</span>
                    <span className="font-mono text-xs">412.220</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle className="text-lg">Audit-Log</CardTitle>
                  <CardDescription>Alle Änderungen und Systemereignisse dieses Kunden.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ol className="relative ml-3 space-y-4 border-l pl-6">
                    {auditLog.map((e, idx) => {
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
            </div>
          )}

          {section === "billing" && (
            <div className="grid gap-6 lg:grid-cols-3">
              <Card>
                <CardHeader><CardTitle className="text-sm font-medium text-muted-foreground">Umsatz YTD</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold"><AnimatedNumber value={18420} prefix="€ " /></p>
                  <p className="mt-1 text-xs text-success">+12 % vs. Vorjahr</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-sm font-medium text-muted-foreground">Offene Posten</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold"><AnimatedNumber value={1240} prefix="€ " /></p>
                  <p className="mt-1 text-xs text-muted-foreground">1 Rechnung · 12 Tage</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-sm font-medium text-muted-foreground">Kontingent (Juni)</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-3xl font-bold"><AnimatedNumber value={412220} /></p>
                  <Progress value={68} />
                  <p className="text-xs text-muted-foreground">68 % von 600.000 Mails</p>
                </CardContent>
              </Card>

              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle className="text-lg">Letzte Rechnungen</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nummer</TableHead>
                        <TableHead>Datum</TableHead>
                        <TableHead>Betrag</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        { nr: "R-2026-0042", date: "01.06.2026", amount: "€ 1.240,00", status: "Offen", variant: "secondary" as const },
                        { nr: "R-2026-0033", date: "01.05.2026", amount: "€ 1.180,00", status: "Bezahlt", variant: "default" as const },
                        { nr: "R-2026-0024", date: "01.04.2026", amount: "€ 1.180,00", status: "Bezahlt", variant: "default" as const },
                      ].map((r) => (
                        <TableRow key={r.nr}>
                          <TableCell className="font-mono text-xs">{r.nr}</TableCell>
                          <TableCell>{r.date}</TableCell>
                          <TableCell>{r.amount}</TableCell>
                          <TableCell><Badge variant={r.variant}>{r.status}</Badge></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {section === "config" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">DNS-Records</CardTitle>
                <CardDescription>SendGrid EU · region=eu · u123</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Typ</TableHead>
                      <TableHead>Host</TableHead>
                      <TableHead>Wert</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {configRows.map((r) => (
                      <TableRow key={r.name}>
                        <TableCell className="font-mono text-xs">{r.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{r.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center gap-1 font-mono text-xs">
                            {r.host}
                            <button onClick={() => { navigator.clipboard.writeText(r.host); toast.success("Kopiert"); }}>
                              <Copy className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                            </button>
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center gap-1 font-mono text-xs">
                            <span className="block max-w-[160px] truncate sm:max-w-[280px]">{r.value}</span>
                            <button onClick={() => { navigator.clipboard.writeText(r.value); toast.success("Kopiert"); }}>
                              <Copy className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                            </button>
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          {r.status === "OK" ? (
                            <Badge className="bg-success/15 text-success hover:bg-success/15"><CheckCircle2 className="mr-1 h-3 w-3" /> OK</Badge>
                          ) : (
                            <Badge variant="secondary">Pending</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {section === "notes" && (
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Interne Notizen</CardTitle>
                  <CardDescription>Sichtbar nur für das Team.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Textarea rows={4} placeholder="Neue Notiz hinzufügen…" />
                  <div className="flex justify-end"><Button size="sm" onClick={() => toast.success("Notiz gespeichert")}>Speichern</Button></div>
                  <Separator />
                  {[
                    { who: "Jana M.", when: "vor 2 Std.", text: "Kunde wünscht zusätzliche Subdomain für Newsletter." },
                    { who: "Tom K.", when: "gestern", text: "Telefonat: Setup wird intern bis Freitag fertiggestellt." },
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

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Anhänge</CardTitle>
                  <CardDescription>Verträge, NDAs, Mandate.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <label
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault(); setDragOver(false);
                      const f = e.dataTransfer.files?.[0];
                      if (f) { setFiles((cur) => [...cur, { name: f.name, size: `${Math.round(f.size / 1024)} KB` }]); toast.success("Datei hochgeladen"); }
                    }}
                    className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed p-6 text-center text-sm transition-colors ${dragOver ? "border-primary bg-lavender-100/40" : "hover:bg-muted/40"}`}
                  >
                    <Upload className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">Datei ablegen oder wählen</span>
                    <span className="text-xs text-muted-foreground">PDF, DOCX, max. 10 MB</span>
                    <input type="file" className="hidden" onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) { setFiles((cur) => [...cur, { name: f.name, size: `${Math.round(f.size / 1024)} KB` }]); toast.success("Datei hochgeladen"); }
                    }} />
                  </label>
                  <div className="space-y-1.5">
                    {files.map((f) => (
                      <div key={f.name} className="flex items-center justify-between rounded-md border p-2 text-sm">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span>{f.name}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{f.size}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {section === "contract" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Vertrag</CardTitle>
                <CardDescription>Laufzeit, Konditionen und Kündigungsfristen.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div><Label>Vertragsstart</Label><Input defaultValue="01.06.2026" readOnly /></div>
                <div><Label>Laufzeit</Label><Input defaultValue="12 Monate" readOnly /></div>
                <div><Label>Monatspreis</Label><Input defaultValue="€ 1.180,00" readOnly /></div>
                <div><Label>Kontingent</Label><Input defaultValue="600.000 Mails / Monat" readOnly /></div>
                <div className="md:col-span-2"><Label>Kündigungsfrist</Label><Input defaultValue="3 Monate zum Vertragsende" readOnly /></div>
              </CardContent>
            </Card>
          )}

          {section === "schedule" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Termine</CardTitle>
                <CardDescription>Anstehende Calls und Reviews.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { time: "Mo 15.06 · 10:00", title: "Monats-Review", who: "JM, TK" },
                  { time: "Do 18.06 · 14:30", title: "Demo neuer Newsletter-Flow", who: "SL" },
                  { time: "Di 30.06 · 09:00", title: "Quartals-Check", who: "JM" },
                ].map((t) => (
                  <div key={t.title} className="flex flex-col gap-2 rounded-md border p-3 sm:flex-row sm:items-center sm:gap-4">
                    <span className="font-mono text-xs text-muted-foreground sm:w-32 sm:shrink-0">{t.time}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{t.title}</p>
                      <p className="text-xs text-muted-foreground">Teilnehmer: {t.who}</p>
                    </div>
                    <Badge variant="secondary" className="self-start sm:self-auto">Bestätigt</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
}