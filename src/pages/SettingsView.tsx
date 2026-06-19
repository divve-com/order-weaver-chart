import { useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, EyeOff, Copy, MoreHorizontal, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

const team = [
  { name: "Jana Müller", email: "jana@kiv.io", role: "Admin", initials: "JM" },
  { name: "Tom Krause", email: "tom@kiv.io", role: "Kundenbetreuer", initials: "TK" },
  { name: "Sara Lang", email: "sara@kiv.io", role: "Kundenbetreuer", initials: "SL" },
  { name: "Ben Hartmann", email: "ben@kiv.io", role: "Read-only", initials: "BH" },
];

const integrations = [
  { name: "SendGrid EU", desc: "Versand-Backend (region=eu).", status: "Verbunden", enabled: true },
  { name: "Lovable Cloud", desc: "Auth, DB und Storage.", status: "Verbunden", enabled: true },
  { name: "Slack", desc: "Benachrichtigungen in #ops.", status: "Nicht verbunden", enabled: false },
  { name: "Stripe", desc: "Zahlungsabwicklung.", status: "Verbunden", enabled: true },
];

function passwordScore(pw: string) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^a-zA-Z0-9]/.test(pw)) s++;
  return s;
}
const scoreLabels = ["Sehr schwach", "Schwach", "Okay", "Gut", "Stark", "Sehr stark"];
const scoreColors = ["bg-destructive", "bg-destructive", "bg-warning", "bg-warning", "bg-success", "bg-success"];

export default function SettingsView() {
  const [pw, setPw] = useState("");
  const [reveal, setReveal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const score = useMemo(() => passwordScore(pw), [pw]);
  const apiKey = "sk_live_eu_4f2d8a1c9b3e7f0a6d2c8e1b9a4f7d3e";

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[{ label: "Einstellungen" }]}
        title="Einstellungen"
        subtitle="Profil, Team, Integrationen und Sicherheit."
      />

      <Tabs defaultValue="profile">
        <div className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
          <TabsList className="w-max md:w-auto">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="preferences">Präferenzen</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="integrations">Integrationen</TabsTrigger>
            <TabsTrigger value="security">Sicherheit</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="profile" className="pt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Profil</CardTitle>
              <CardDescription>Persönliche Daten und Login.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstname">Vorname</Label>
                <Input id="firstname" defaultValue="Jana" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastname">Nachname</Label>
                <Input id="lastname" defaultValue="Müller" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="email">E-Mail</Label>
                <Input id="email" type="email" defaultValue="jana@kiv.io" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="pt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Präferenzen</CardTitle>
              <CardDescription>Benachrichtigungen und Darstellung.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "E-Mail-Benachrichtigungen", desc: "Tägliche Zusammenfassung um 08:00." },
                { name: "Slack-Push bei DNS-Fehlern", desc: "Sofortige Meldung an #ops." },
                { name: "Wochen-Report als PDF", desc: "Jeden Montag automatisch." },
              ].map((s, i) => (
                <div key={s.name}>
                  {i > 0 && <Separator className="mb-4" />}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.desc}</p>
                    </div>
                    <Switch defaultChecked={i === 0} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="pt-4">
          <Card>
            <CardHeader className="flex flex-col items-start justify-between gap-3 space-y-0 sm:flex-row sm:items-center">
              <div>
                <CardTitle className="text-lg">Team</CardTitle>
                <CardDescription>{team.length} Mitglieder · 1 Admin</CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {team.map((m) => (
                    <Avatar key={m.email} className="h-8 w-8 border-2 border-background">
                      <AvatarFallback className="bg-lavender-100 text-ink text-xs">{m.initials}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <Button size="sm" onClick={() => toast.success("Einladung versendet")}>Einladen</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {team.map((m) => (
                <div key={m.email} className="flex items-center gap-3 rounded-md border p-3">
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarFallback className="bg-lavender-100 text-ink text-xs">{m.initials}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{m.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{m.email}</p>
                  </div>
                  <Badge variant={m.role === "Admin" ? "default" : "secondary"} className="hidden sm:inline-flex">{m.role}</Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => toast.success("Rolle geändert")}>Rolle ändern</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toast.success("Passwort-Reset versendet")}>Passwort zurücksetzen</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => toast.error("Mitglied entfernt")}>Entfernen</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Integrationen</CardTitle>
              <CardDescription>Externe Systeme verbinden und steuern.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              {integrations.map((i) => (
                <div key={i.name} className="flex items-start gap-3 rounded-md border p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-lavender-100 text-ink font-semibold">
                    {i.name[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{i.name}</p>
                      <Badge variant={i.enabled ? "default" : "outline"} className="text-[10px]">{i.status}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{i.desc}</p>
                  </div>
                  <Switch defaultChecked={i.enabled} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="pt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Passwort ändern</CardTitle>
              <CardDescription>Mindestens 12 Zeichen, Gross-/Kleinbuchstaben, Zahl, Sonderzeichen.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 max-w-md">
              <div className="space-y-2">
                <Label htmlFor="pw">Neues Passwort</Label>
                <div className="relative">
                  <Input id="pw" type={reveal ? "text" : "password"} value={pw} onChange={(e) => setPw(e.target.value)} placeholder="••••••••••••" />
                  <button type="button" onClick={() => setReveal((r) => !r)} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {reveal ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              {pw && (
                <div className="space-y-1">
                  <div className="flex gap-1">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div key={i} className={`h-1.5 flex-1 rounded-full ${i < score ? scoreColors[score] : "bg-muted"}`} />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">Stärke: {scoreLabels[score]}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">API-Key</CardTitle>
              <CardDescription>Nur einmalig sichtbar — sicher speichern.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 rounded-md border bg-muted/30 p-2 font-mono text-xs">
                <span className="flex-1 truncate">{reveal ? apiKey : "•".repeat(apiKey.length)}</span>
                <Button size="sm" variant="ghost" onClick={() => setReveal((r) => !r)}>
                  {reveal ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => { navigator.clipboard.writeText(apiKey); toast.success("Kopiert"); }}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="outline" size="sm" onClick={() => toast.success("Neuer Key generiert")}>Neuen Key generieren</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">2-Faktor-Authentifizierung</CardTitle>
              <CardDescription>Zusätzlicher Schutz per Authenticator-App.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-success" />
                  <span className="text-sm">Aktiviert für jana@kiv.io</span>
                </div>
                <Switch defaultChecked />
              </div>
              <Progress value={100} className="h-1" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2">
        <Button variant="outline">Abbrechen</Button>
        <Button
          disabled={saving}
          onClick={() => {
            setSaving(true);
            setSaved(false);
            setTimeout(() => {
              setSaving(false);
              setSaved(true);
              toast.success("Einstellungen gespeichert");
              setTimeout(() => setSaved(false), 2000);
            }, 1200);
          }}
        >
          {saving ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Speichern…</>
          ) : saved ? (
            <><Check className="mr-2 h-4 w-4" /> Gespeichert</>
          ) : (
            "Speichern"
          )}
        </Button>
      </div>
    </div>
  );
}