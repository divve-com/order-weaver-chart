import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Phone, Video, Mail, MapPin } from "lucide-react";
import { toast } from "sonner";

type EventType = "Call" | "Demo" | "Mail-Test" | "Vor-Ort";

const typeStyles: Record<EventType, { dot: string; badge: string; icon: typeof Phone }> = {
  Call: { dot: "bg-lavender-300", badge: "bg-lavender-100 text-ink", icon: Phone },
  Demo: { dot: "bg-success", badge: "bg-success/15 text-success", icon: Video },
  "Mail-Test": { dot: "bg-warning", badge: "bg-peach text-ink", icon: Mail },
  "Vor-Ort": { dot: "bg-destructive", badge: "bg-destructive/15 text-destructive", icon: MapPin },
};

const events = [
  { time: "09:00", title: "Kickoff-Call · Acme GmbH", type: "Call" as EventType, attendees: ["JM", "TK"] },
  { time: "11:30", title: "Produkt-Demo · Beta KG", type: "Demo" as EventType, attendees: ["SL"] },
  { time: "14:00", title: "Mail-Test Review · Gamma AG", type: "Mail-Test" as EventType, attendees: ["JM", "BH", "TK"] },
  { time: "16:15", title: "Vor-Ort-Termin · Delta SE", type: "Vor-Ort" as EventType, attendees: ["BH"] },
];

export default function CalendarView() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[{ label: "Kalender" }]}
        title="Kalender"
        subtitle="Termine, Mail-Tests und Demos im Team."
        actions={
          <Popover>
            <PopoverTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" /> Neuer Termin</Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 space-y-3">
              <div className="space-y-1">
                <p className="text-sm font-semibold">Termin anlegen</p>
                <p className="text-xs text-muted-foreground">Schnellerfassung — Details später ergänzen.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Titel</Label>
                <Input id="title" placeholder="z. B. Demo Beta KG" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="time">Zeit</Label>
                  <Input id="time" type="time" defaultValue="10:00" />
                </div>
                <div className="space-y-2">
                  <Label>Typ</Label>
                  <Select defaultValue="Call">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Call">Call</SelectItem>
                      <SelectItem value="Demo">Demo</SelectItem>
                      <SelectItem value="Mail-Test">Mail-Test</SelectItem>
                      <SelectItem value="Vor-Ort">Vor-Ort</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button className="w-full" onClick={() => toast.success("Termin angelegt")}>Anlegen</Button>
            </PopoverContent>
          </Popover>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: "Heute", value: events.length, sub: "Termine" },
          { label: "Diese Woche", value: 17, sub: "Termine" },
          { label: "Demos offen", value: 4, sub: "ausstehend" },
          { label: "No-Show-Quote", value: "3 %", sub: "30 Tage" },
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

      <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
        <Card className="h-fit">
          <CardContent className="p-3">
            <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {date?.toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long" }) ?? "Datum wählen"}
            </CardTitle>
            <CardDescription>{events.length} Termine · {events.filter((e) => e.type === "Demo").length} Demo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {events.map((e) => {
              const style = typeStyles[e.type];
              const Icon = style.icon;
              return (
                <div key={e.time} className="flex items-center gap-3 rounded-md border p-3 transition-colors hover:bg-muted/40 sm:gap-4">
                  <span className="w-12 shrink-0 font-mono text-sm text-muted-foreground sm:w-14">{e.time}</span>
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${style.badge}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full ${style.dot}`} />
                      <p className="truncate font-medium">{e.title}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{e.type}</p>
                  </div>
                  <div className="hidden -space-x-2 sm:flex">
                    {e.attendees.map((a) => (
                      <Avatar key={a} className="h-7 w-7 border-2 border-background">
                        <AvatarFallback className="bg-lavender-100 text-ink text-[10px]">{a}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  <Badge variant="secondary" className="hidden sm:inline-flex">Bestätigt</Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}