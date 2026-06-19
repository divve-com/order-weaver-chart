import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { SortableTableHead, useTableSort } from "@/components/SortableTableHead";
import { TablePagination } from "@/components/TablePagination";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { toast as sonnerToast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Activity,
  ArrowLeft,
  ArrowUpRight,
  ChevronRight,
  Copy,
  FileText,
  Info,
  Plus,
  Search,
  Settings as SettingsIcon,
  Sparkles,
  TrendingUp,
  User,
  Users,
  Calendar as CalendarIcon,
  MoreHorizontal,
  Trash2,
  RefreshCw,
  Download,
  Upload,
  Save,
  Pencil,
  X,
  Check,
  Send,
  Filter,
  Loader2,
  Eye,
  Mail,
  CalendarClock,
  Receipt,
  Inbox,
  Phone,
  MapPin,
  Globe,
  KeyRound,
  ShieldCheck,
  ShieldAlert,
  CircleDot,
  ArrowDownRight,
  TrendingDown,
  Building2,
  UploadCloud,
  FileImage,
  FileSignature,
  ListChecks,
  Bell,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Command as CommandIcon,
  ZoomIn,
  ZoomOut,
  Printer,
  Maximize2,
  ChevronLeft,
  LogIn,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader as PageHeaderDemo } from "@/components/PageHeader";
import { Stepper } from "@/components/Stepper";
import { SubNav } from "@/components/SubNav";
import { useEffect, useRef, useState } from "react";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

const tokens = [
  { name: "Primary", varName: "--primary", hex: "#07071A" },
  { name: "Lavender 500", varName: "--lavender-500", hex: "#AE8DE9" },
  { name: "Lavender 300", varName: "--lavender-300", hex: "#C8AFFC" },
  { name: "Lavender 100", varName: "--lavender-100", hex: "#EEE6FE" },
  { name: "Mint", varName: "--mint", hex: "#AFE4DD" },
  { name: "Peach", varName: "--peach", hex: "#FFC2A9" },
  { name: "Background", varName: "--background", hex: "#FFFFFF" },
  { name: "Muted", varName: "--muted", hex: "#F4EDFF" },
];

export default function Components() {
  const [section, setSection] = useState("one");
  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[{ label: "Design system" }, { label: "Components" }]}
        title="Components"
        subtitle="A showcase of the building blocks available in this template."
      />

      <Tabs defaultValue="tokens">
        <TabsList>
          <TabsTrigger value="tokens">Tokens</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
        </TabsList>

        <TabsContent value="tokens" className="pt-4 space-y-6">
          <Section title="Colors">
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
              {tokens.map((t) => (
                <div key={t.name} className="overflow-hidden rounded-lg border">
                  <div
                    className="h-20 w-full"
                    style={{ backgroundColor: t.hex }}
                  />
                  <div className="p-3">
                    <p className="font-medium text-sm">{t.name}</p>
                    <p className="font-mono text-xs text-muted-foreground">{t.varName}</p>
                    <p className="font-mono text-xs text-muted-foreground">{t.hex}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Typography">
            <div className="space-y-3">
              <h1 className="text-4xl">Heading 1 · Display font</h1>
              <h2 className="text-3xl">Heading 2 · Display font</h2>
              <h3 className="text-2xl">Heading 3 · Display font</h3>
              <p className="text-base">Body — Manrope. The quick brown fox jumps over the lazy dog.</p>
              <p className="text-sm text-muted-foreground">Small — used for hints and metadata.</p>
              <p className="font-mono text-sm">Mono — JetBrains Mono · 0123456789</p>
            </div>
          </Section>

          <Section title="Radius & spacing">
            <div className="flex flex-wrap gap-4">
              {[
                ["rounded-sm", "sm"],
                ["rounded-md", "md"],
                ["rounded-lg", "lg"],
                ["rounded-pill", "pill"],
              ].map(([cls, label]) => (
                <div key={cls} className="text-center">
                  <div className={`h-16 w-16 bg-lavender-300 ${cls}`} />
                  <p className="mt-2 text-xs text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
          </Section>
        </TabsContent>

        <TabsContent value="components" className="pt-4 space-y-6">
          <Section title="Buttons">
            <div className="flex flex-wrap gap-2">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="link">Link</Button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm">Small</Button>
              <Button>Default</Button>
              <Button size="lg">Large</Button>
              <Button disabled>Disabled</Button>
            </div>

            <p className="mt-6 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Aktions-Buttons mit Icon
            </p>
            <div className="flex flex-wrap gap-2">
              <Button><Plus className="mr-2 h-4 w-4" /> Neu</Button>
              <Button variant="outline"><Pencil className="mr-2 h-4 w-4" /> Bearbeiten</Button>
              <Button><Save className="mr-2 h-4 w-4" /> Speichern</Button>
              <Button variant="outline"><X className="mr-2 h-4 w-4" /> Abbrechen</Button>
              <Button variant="destructive"><Trash2 className="mr-2 h-4 w-4" /> Löschen</Button>
              <Button variant="outline"><RefreshCw className="mr-2 h-4 w-4" /> Aktualisieren</Button>
              <Button variant="secondary"><Check className="mr-2 h-4 w-4" /> Bestätigen</Button>
              <Button variant="outline"><Eye className="mr-2 h-4 w-4" /> Ansehen</Button>
            </div>

            <p className="mt-6 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Daten & Versand
            </p>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Exportieren</Button>
              <Button variant="outline"><Upload className="mr-2 h-4 w-4" /> Importieren</Button>
              <Button><Send className="mr-2 h-4 w-4" /> Versenden</Button>
              <Button variant="outline"><Mail className="mr-2 h-4 w-4" /> E-Mail senden</Button>
              <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Filter</Button>
              <Button variant="outline"><Copy className="mr-2 h-4 w-4" /> Kopieren</Button>
            </div>

            <p className="mt-6 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Zustände
            </p>
            <div className="flex flex-wrap gap-2">
              <Button disabled><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Wird gespeichert...</Button>
              <Button variant="outline" disabled><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Lädt...</Button>
              <Button variant="secondary">
                Mit Badge
                <Badge variant="outline" className="ml-2 bg-background">12</Badge>
              </Button>
              <Button variant="outline" className="justify-between w-56">
                Mit Trailing Icon <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>

            <p className="mt-6 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Icon-only
            </p>
            <div className="flex flex-wrap gap-2">
              <Button size="icon" variant="outline"><Pencil className="h-4 w-4" /></Button>
              <Button size="icon" variant="outline"><RefreshCw className="h-4 w-4" /></Button>
              <Button size="icon" variant="outline"><Copy className="h-4 w-4" /></Button>
              <Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
              <Button size="icon" variant="destructive"><Trash2 className="h-4 w-4" /></Button>
              <Button size="icon"><Plus className="h-4 w-4" /></Button>
            </div>
          </Section>

          <Section title="Badges">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Basis-Varianten
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Destructive</Badge>
            </div>

            <p className="mt-6 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Status (Soft)
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-success/15 text-success hover:bg-success/15">Aktiv</Badge>
              <Badge className="bg-success/15 text-success hover:bg-success/15">
                <CheckCircle2 className="mr-1 h-3 w-3" /> Erledigt
              </Badge>
              <Badge className="bg-success/15 text-success hover:bg-success/15">Bezahlt</Badge>
              <Badge className="bg-lavender-100 text-ink hover:bg-lavender-100">Versendet</Badge>
              <Badge className="bg-lavender-100 text-ink hover:bg-lavender-100">In Bearbeitung</Badge>
              <Badge className="bg-warning/15 text-warning hover:bg-warning/15">
                <AlertTriangle className="mr-1 h-3 w-3" /> Pending
              </Badge>
              <Badge className="bg-warning/15 text-warning hover:bg-warning/15">Validierung</Badge>
              <Badge className="bg-destructive/15 text-destructive hover:bg-destructive/15">
                <XCircle className="mr-1 h-3 w-3" /> Fehlgeschlagen
              </Badge>
              <Badge className="bg-destructive/15 text-destructive hover:bg-destructive/15">Überfällig</Badge>
              <Badge className="bg-muted text-muted-foreground hover:bg-muted">Entwurf</Badge>
              <Badge className="bg-muted text-muted-foreground hover:bg-muted">Pausiert</Badge>
              <Badge className="bg-muted text-muted-foreground hover:bg-muted">Archiviert</Badge>
            </div>

            <p className="mt-6 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Status (Solid)
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-success text-success-foreground hover:bg-success">Aktiv</Badge>
              <Badge className="bg-warning text-warning-foreground hover:bg-warning">Pending</Badge>
              <Badge className="bg-destructive text-destructive-foreground hover:bg-destructive">Fehler</Badge>
              <Badge className="bg-ink text-primary-foreground hover:bg-ink">Live</Badge>
              <Badge className="bg-lavender-500 text-ink hover:bg-lavender-500">Neu</Badge>
              <Badge className="bg-mint text-ink hover:bg-mint">Setup</Badge>
              <Badge className="bg-peach text-ink hover:bg-peach">Trial</Badge>
            </div>

            <p className="mt-6 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Outline mit Farb-Akzent
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="border-success/40 text-success">Aktiv</Badge>
              <Badge variant="outline" className="border-warning/50 text-warning">Pending</Badge>
              <Badge variant="outline" className="border-destructive/40 text-destructive">Fehler</Badge>
              <Badge variant="outline" className="border-lavender-300 text-ink">Neu</Badge>
            </div>

            <p className="mt-6 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Mit Dot
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="gap-1.5 border-success/40 text-success">
                <span className="h-1.5 w-1.5 rounded-full bg-success" /> Online
              </Badge>
              <Badge variant="outline" className="gap-1.5 border-warning/50 text-warning">
                <span className="h-1.5 w-1.5 rounded-full bg-warning" /> Wartet
              </Badge>
              <Badge variant="outline" className="gap-1.5 border-destructive/40 text-destructive">
                <span className="h-1.5 w-1.5 rounded-full bg-destructive" /> Offline
              </Badge>
              <Badge variant="outline" className="gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60" /> Inaktiv
              </Badge>
            </div>

            <p className="mt-6 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Mit Icon
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-success/15 text-success hover:bg-success/15">
                <ShieldCheck className="mr-1 h-3 w-3" /> DNS ok
              </Badge>
              <Badge className="bg-warning/15 text-warning hover:bg-warning/15">
                <ShieldAlert className="mr-1 h-3 w-3" /> DNS pending
              </Badge>
              <Badge className="bg-lavender-100 text-ink hover:bg-lavender-100">
                <Mail className="mr-1 h-3 w-3" /> Mail-Test versendet
              </Badge>
              <Badge className="bg-muted text-muted-foreground hover:bg-muted">
                <Loader2 className="mr-1 h-3 w-3 animate-spin" /> wird geprüft
              </Badge>
            </div>

            <p className="mt-6 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Counter & Mono
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-ink text-primary-foreground hover:bg-ink">12</Badge>
              <Badge className="bg-destructive text-destructive-foreground hover:bg-destructive">3</Badge>
              <Badge variant="secondary" className="font-mono text-[10px]">MST980</Badge>
              <Badge variant="outline" className="font-mono text-[10px]">v1.4.2</Badge>
              <Badge variant="outline" className="rounded-sm font-mono text-[10px]">CNAME</Badge>
              <Badge variant="outline" className="rounded-sm font-mono text-[10px]">TXT</Badge>
            </div>

            <p className="mt-6 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Mit Close-Button (Filter-Chips)
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge className="gap-1 bg-lavender-100 text-ink hover:bg-lavender-100">
                Status: Aktiv <button className="rounded-full p-0.5 hover:bg-lavender-300"><X className="h-3 w-3" /></button>
              </Badge>
              <Badge className="gap-1 bg-lavender-100 text-ink hover:bg-lavender-100">
                Region: EU <button className="rounded-full p-0.5 hover:bg-lavender-300"><X className="h-3 w-3" /></button>
              </Badge>
            </div>
          </Section>

          <Section title="Form controls">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="text">Text input</Label>
                <Input id="text" placeholder="Placeholder" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sel">Select</Label>
                <Select>
                  <SelectTrigger id="sel">
                    <SelectValue placeholder="Choose an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="one">Option one</SelectItem>
                    <SelectItem value="two">Option two</SelectItem>
                    <SelectItem value="three">Option three</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="ta">Textarea</Label>
                <Textarea id="ta" placeholder="Lorem ipsum..." rows={3} />
              </div>
              <div className="flex items-center gap-3">
                <Switch id="sw" defaultChecked />
                <Label htmlFor="sw">Switch</Label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox id="cb" defaultChecked />
                <Label htmlFor="cb">Checkbox</Label>
              </div>
              <RadioGroup defaultValue="a" className="flex gap-4">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="a" id="ra" />
                  <Label htmlFor="ra">Option A</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="b" id="rb" />
                  <Label htmlFor="rb">Option B</Label>
                </div>
              </RadioGroup>
              <div className="space-y-2">
                <Label>Slider</Label>
                <Slider defaultValue={[40]} max={100} step={1} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Progress</Label>
                <Progress value={62} />
              </div>
            </div>
          </Section>

          <Section title="Avatars">
            <div className="flex items-center gap-3">
              <Avatar><AvatarFallback>AB</AvatarFallback></Avatar>
              <Avatar><AvatarFallback className="bg-lavender-300 text-ink">CD</AvatarFallback></Avatar>
              <Avatar><AvatarFallback className="bg-mint text-ink">EF</AvatarFallback></Avatar>
              <Avatar><AvatarFallback className="bg-peach text-ink">GH</AvatarFallback></Avatar>
              <Avatar><AvatarFallback className="bg-ink text-primary-foreground">IJ</AvatarFallback></Avatar>
            </div>
          </Section>

          <Section title="Cards">
            <div className="grid gap-3 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <CardTitle>Card title {i}</CardTitle>
                    <CardDescription>Card description</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Section>

          <Section title="Stepper">
            <Stepper
              steps={[
                { label: "Step one" },
                { label: "Step two" },
                { label: "Step three" },
                { label: "Step four" },
                { label: "Step five" },
              ]}
              current={3}
            />
          </Section>

          <Section title="Sub navigation">
            <div className="max-w-xs">
              <SubNav
                title="Sections"
                value={section}
                onChange={setSection}
                items={[
                  { key: "one", label: "Section one", icon: User },
                  { key: "two", label: "Section two", icon: FileText },
                  { key: "three", label: "Section three", icon: SettingsIcon },
                ]}
              />
            </div>
          </Section>

          <Section title="Breadcrumbs">
            <nav className="flex items-center gap-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              <span>Workspace</span>
              <ChevronRight className="h-3 w-3 opacity-60" />
              <span>Section</span>
              <ChevronRight className="h-3 w-3 opacity-60" />
              <span className="text-foreground">Current page</span>
            </nav>
          </Section>

          <Section title="Page header">
            <div className="rounded-lg border p-4">
              <PageHeaderDemo
                breadcrumbs={[{ label: "Workspace" }, { label: "Page header" }]}
                title="Page title"
                subtitle="Subtitle describing this view."
                actions={
                  <>
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button>Primary action</Button>
                  </>
                }
              />
            </div>
          </Section>

          <Section title="Stat cards">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {[
                { label: "Metric one", value: "1,284", delta: "+12%", icon: Activity },
                { label: "Metric two", value: "342", delta: "+4%", icon: Users },
                { label: "Metric three", value: "87", delta: "+18%", icon: Sparkles },
                { label: "Metric four", value: "96%", delta: "+2%", icon: TrendingUp },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <Card key={s.label}>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-lavender-100">
                          <Icon className="h-5 w-5 text-ink" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{s.value}</p>
                          <p className="text-xs text-muted-foreground">{s.label}</p>
                        </div>
                        <Badge variant="secondary" className="ml-auto">{s.delta}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </Section>

          <Section title="List row">
            <div className="space-y-2">
              {[
                { title: "Item one", meta: "Lorem ipsum dolor", date: "12.06.2026" },
                { title: "Item two", meta: "Consectetur adipiscing", date: "11.06.2026" },
                { title: "Item three", meta: "Sed do eiusmod tempor", date: "10.06.2026" },
              ].map((i) => (
                <div
                  key={i.title}
                  className="flex items-center justify-between rounded-md border p-3 transition-colors hover:bg-muted/50"
                >
                  <div>
                    <p className="font-medium">{i.title}</p>
                    <p className="text-xs text-muted-foreground">{i.meta}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{i.date}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section title="List row mit Aktions-Buttons (anstehend, gestrichelt)">
            <p className="mb-3 text-xs text-muted-foreground">
              Gestrichelter Rand für „anstehende"/„noch nicht erzeugte" Einträge. Aktionen rechtsbündig.
            </p>
            <div className="space-y-2">
              {[
                { customer: "Acme GmbH", label: "Hosting Basic", due: "15.06.2026", amount: "€ 49,00", overdue: false },
                { customer: "Beispiel AG", label: "Mail Premium", due: "10.06.2026", amount: "€ 129,00", overdue: true },
                { customer: "Mustermann KG", label: "Setup-Gebühr", due: "20.06.2026", amount: "€ 250,00", overdue: false },
              ].map((u) => (
                <div
                  key={u.customer}
                  className="flex flex-col gap-3 rounded-md border border-dashed p-3 transition-colors hover:bg-muted/30 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <CalendarClock className={`h-4 w-4 shrink-0 ${u.overdue ? "text-destructive" : "text-lavender-500"}`} />
                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {u.customer}{" "}
                        <span className="font-normal text-muted-foreground">· {u.label}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Fällig {u.due} · monatlich
                        {u.overdue && (
                          <span className="ml-2 font-medium text-destructive">überfällig</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-sm sm:gap-3">
                    <span className="font-semibold">{u.amount}</span>
                    <Badge variant="outline">noch keine Nr.</Badge>
                    <Button size="sm" variant="outline">
                      <Eye className="mr-1 h-4 w-4" /> Vorschau
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="List row mit Aktions-Buttons (erzeugt)">
            <p className="mb-3 text-xs text-muted-foreground">
              Durchgezogener Rand für bestehende Einträge. Status-Badge + Vorschau + Download.
            </p>
            <div className="space-y-2">
              {[
                { nr: "R-2026-0042", customer: "Acme GmbH", date: "01.06.2026", amount: "€ 49,00", status: "bezahlt", statusClass: "bg-success/15 text-success" },
                { nr: "R-2026-0041", customer: "Beispiel AG", date: "01.06.2026", amount: "€ 129,00", status: "versendet", statusClass: "bg-lavender-100 text-ink" },
                { nr: "Entwurf", customer: "Mustermann KG", date: "31.05.2026", amount: "€ 250,00", status: "entwurf", statusClass: "bg-muted text-muted-foreground" },
              ].map((r) => (
                <div
                  key={r.nr + r.customer}
                  className="flex flex-col gap-3 rounded-md border p-3 transition-colors hover:bg-muted/40 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <Receipt className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0">
                      <p className="truncate font-medium">{r.nr}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {r.customer} · {r.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-sm sm:gap-4">
                    <span className="font-semibold">{r.amount}</span>
                    <Badge className={r.statusClass}>{r.status}</Badge>
                    <Button size="sm" variant="outline">
                      <Eye className="mr-1 h-4 w-4" /> Vorschau
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Data table mit Filter, Sortierung & Pagination">
            <DataTableDemo />
          </Section>

          <Section title="Reference table with copy">
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { name: "record_a", type: "type-a", value: "value-a.example.net" },
                    { name: "record_b", type: "type-a", value: "value-b.example.net" },
                    { name: "record_c", type: "type-b", value: "value-c.example.net" },
                  ].map((r) => (
                    <TableRow key={r.name}>
                      <TableCell className="font-mono text-xs">{r.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{r.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(r.value);
                            sonnerToast.success("Wert kopiert");
                          }}
                          className="inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 font-mono text-xs transition-colors hover:bg-muted"
                          title="In Zwischenablage kopieren"
                        >
                          {r.value}
                          <Copy className="h-3 w-3 text-muted-foreground" />
                        </button>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge>OK</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </Section>

          <Section title="Quick action button">
            <div className="grid gap-2 sm:grid-cols-2">
              <Button className="w-full justify-between">
                Action one <ArrowUpRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="w-full justify-between">
                Action two <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>
          </Section>

          <Section title="Meta panel">
            <Card className="max-w-sm">
              <CardHeader>
                <CardTitle className="text-lg">Meta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {[
                  ["Status", "Active"],
                  ["Owner", "Jane Doe"],
                  ["Created", "01.06.2026"],
                  ["Updated", "11.06.2026"],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between">
                    <span className="text-muted-foreground">{k}</span>
                    <span>{v}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </Section>

          <Section title="Dialog (Popup)">
            <div className="flex flex-wrap gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Sparkles className="mr-2 h-4 w-4" /> Monatlichen Regeltermin
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-lavender-500" />
                      Monatlichen Regeltermin vorschlagen
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="dlg-title">Titel</Label>
                      <Input id="dlg-title" defaultValue="Monatlicher Regeltermin" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="dlg-dur">Dauer (Minuten)</Label>
                        <Input id="dlg-dur" type="number" defaultValue={30} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dlg-slot">Vorgeschlagener Slot</Label>
                        <Input id="dlg-slot" defaultValue="12.06.2026, 09:00" />
                      </div>
                    </div>
                    <div className="rounded-md bg-lavender-50 p-3 text-sm">
                      <p className="flex items-center gap-2 font-medium text-ink">
                        <CalendarIcon className="h-4 w-4" /> Freitag, 12. Juni · 09:00 Uhr
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Berücksichtigt 0 bestehende Termine in den nächsten 4 Wochen. Wiederholt sich monatlich.
                      </p>
                    </div>
                  </div>
                  <DialogFooter className="gap-2 sm:gap-2">
                    <Button variant="outline">Abbrechen</Button>
                    <Button variant="outline">
                      <Sparkles className="mr-2 h-4 w-4" /> Anderen Slot
                    </Button>
                    <Button>Anlegen</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Simple dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you sure?</DialogTitle>
                    <DialogDescription>
                      A short confirmation message goes here.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button>Confirm</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </Section>

          <Section title="Alert dialog (destructive confirm)">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" /> Eintrag löschen
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Eintrag wirklich löschen?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Diese Aktion kann nicht rückgängig gemacht werden.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                  <AlertDialogAction>Löschen</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </Section>

          <Section title="Sheet (Side panel)">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">Open sheet</Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Details bearbeiten</SheetTitle>
                  <SheetDescription>
                    Schmaler Seitendialog für sekundäre Aktionen.
                  </SheetDescription>
                </SheetHeader>
                <div className="space-y-4 py-6">
                  <div className="space-y-2">
                    <Label htmlFor="sheet-name">Name</Label>
                    <Input id="sheet-name" defaultValue="Beispielwert" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sheet-notes">Notizen</Label>
                    <Textarea id="sheet-notes" rows={4} />
                  </div>
                </div>
                <SheetFooter>
                  <Button variant="outline">Abbrechen</Button>
                  <Button>Speichern</Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </Section>

          <Section title="Popover, Tooltip & Dropdown">
            <div className="flex flex-wrap items-center gap-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">Open popover</Button>
                </PopoverTrigger>
                <PopoverContent className="w-72">
                  <p className="text-sm font-medium">Schneller Hinweis</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Inhaltliche Popovers nutzen die gleiche Card-Optik wie die App.
                  </p>
                </PopoverContent>
              </Popover>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Info className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Hilfreicher Hinweistext</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Aktionen</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Bearbeiten</DropdownMenuItem>
                  <DropdownMenuItem>Duplizieren</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">Löschen</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="secondary"
                onClick={() =>
                  toast({
                    title: "Gespeichert ✅",
                    description: "Deine Änderungen wurden übernommen.",
                  })
                }
              >
                Show toast
              </Button>
            </div>
          </Section>

          {/* ============== NEU: Feedback & Status ============== */}
          <Section title="Empty states">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="flex flex-col items-center rounded-lg border border-dashed p-8 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-lavender-100">
                  <Inbox className="h-6 w-6 text-ink" />
                </div>
                <p className="mt-3 font-semibold">Noch keine Rechnungen</p>
                <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                  Sobald du den ersten Abrechnungslauf startest, erscheinen die Rechnungen hier.
                </p>
                <Button className="mt-4" size="sm">
                  <Plus className="mr-2 h-4 w-4" /> Abrechnungslauf starten
                </Button>
              </div>
              <div className="flex flex-col items-center rounded-lg border border-dashed p-8 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-mint/40">
                  <Search className="h-6 w-6 text-ink" />
                </div>
                <p className="mt-3 font-semibold">Keine Treffer</p>
                <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                  Passe deine Filter an oder suche mit einem anderen Begriff.
                </p>
                <Button className="mt-4" size="sm" variant="outline">
                  <X className="mr-2 h-4 w-4" /> Filter zurücksetzen
                </Button>
              </div>
            </div>
          </Section>

          <Section title="Skeleton loader">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3 rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
                <Skeleton className="h-3 w-3/4" />
              </div>
              <div className="space-y-2 rounded-lg border p-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between gap-3">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}
              </div>
            </div>
          </Section>

          <Section title="Inline alerts (4 Varianten)">
            <div className="space-y-3">
              <Alert className="border-lavender-300 bg-lavender-50">
                <Info className="h-4 w-4 text-ink" />
                <AlertTitle>Info</AlertTitle>
                <AlertDescription>SendGrid-Daten wurden aktualisiert.</AlertDescription>
              </Alert>
              <Alert className="border-success/40 bg-success/10 text-foreground">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <AlertTitle>Erfolg</AlertTitle>
                <AlertDescription>Domain wurde erfolgreich validiert.</AlertDescription>
              </Alert>
              <Alert className="border-warning/40 bg-warning/10 text-foreground">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <AlertTitle>Warnung</AlertTitle>
                <AlertDescription>SPF-Eintrag ist gesetzt, aber nicht hart (`~all`).</AlertDescription>
              </Alert>
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Fehler</AlertTitle>
                <AlertDescription>Subuser konnte nicht erstellt werden.</AlertDescription>
              </Alert>
            </div>
          </Section>

          <Section title="Toast-Varianten (sonner)">
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => toast({ title: "Info", description: "Vorgang gestartet" })}>Info</Button>
              <Button variant="outline" onClick={() => toast({ title: "Erfolg ✅", description: "Alles gespeichert" })}>Erfolg</Button>
              <Button variant="outline" onClick={() => toast({ title: "Warnung", description: "DNS noch nicht vollständig" })}>Warnung</Button>
              <Button variant="destructive" onClick={() => toast({ title: "Fehler", description: "Verbindung fehlgeschlagen", variant: "destructive" })}>Fehler</Button>
              <Button onClick={() => toast({ title: "Eintrag gelöscht", description: "Der Datensatz wurde entfernt.", action: <Button size="sm" variant="outline">Rückgängig</Button> as any })}>Mit Action</Button>
            </div>
          </Section>

          <Section title="Status-Dots">
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <StatusDot color="bg-success" label="Online" pulse />
              <StatusDot color="bg-warning" label="In Bearbeitung" pulse />
              <StatusDot color="bg-destructive" label="Fehler" />
              <StatusDot color="bg-muted-foreground/50" label="Offline" />
              <StatusDot color="bg-lavender-500" label="Wartet auf Validierung" pulse />
            </div>
          </Section>

          <Section title="Progress (linear & circular)">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <div>
                  <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                    <span>Onboarding-Fortschritt</span><span>4 / 6</span>
                  </div>
                  <Progress value={66} />
                </div>
                <div>
                  <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                    <span>Speicherplatz</span><span>82%</span>
                  </div>
                  <Progress value={82} className="[&>div]:bg-warning" />
                </div>
              </div>
              <div className="flex items-center gap-6">
                <CircularProgress value={72} label="Setup" />
                <CircularProgress value={45} label="DNS" />
                <CircularProgress value={100} label="Mail" />
              </div>
            </div>
          </Section>

          {/* ============== NEU: Daten ============== */}
          <Section title="KPI cards mit Sparkline & Trend">
            <div className="grid gap-3 md:grid-cols-3">
              <KPI title="Aktive Kunden" value="128" trend="+8,2%" up data={[5,6,4,7,8,7,9,11,10,13]} />
              <KPI title="MRR" value="€ 18.420" trend="+3,1%" up data={[10,11,12,12,13,12,14,14,15,16]} />
              <KPI title="Bounce-Rate" value="0,42%" trend="-0,9%" up={false} data={[8,7,7,6,7,5,6,5,4,3]} />
            </div>
          </Section>

          <Section title="Mini-Charts (Bar & Donut)">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-lg border p-4">
                <p className="mb-3 text-sm font-medium">Versand pro Tag</p>
                <MiniBars data={[14, 22, 18, 30, 26, 35, 28]} />
              </div>
              <div className="rounded-lg border p-4">
                <p className="mb-3 text-sm font-medium">Domain-Status</p>
                <Donut segments={[{ value: 62, color: "hsl(var(--success))" }, { value: 24, color: "hsl(var(--warning))" }, { value: 14, color: "hsl(var(--destructive))" }]} />
              </div>
            </div>
          </Section>

          <Section title="Timeline / Activity feed">
            <ol className="relative ml-3 space-y-4 border-l pl-6">
              {[
                { icon: Mail, color: "bg-lavender-300", title: "Mail-Test versendet", who: "Jana M.", when: "vor 12 Min." },
                { icon: ShieldCheck, color: "bg-success/30", title: "DNS validiert (acme.de)", who: "System", when: "vor 1 Std." },
                { icon: FileSignature, color: "bg-mint", title: "SEPA-Mandat unterschrieben", who: "Acme GmbH", when: "vor 3 Std." },
                { icon: Receipt, color: "bg-peach", title: "Rechnung R-2026-0042 erzeugt", who: "Automatik", when: "gestern" },
              ].map((e, idx) => {
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
          </Section>

          <Section title="Kanban-Spalten">
            <div className="grid gap-3 md:grid-cols-3">
              {[
                { title: "Neu", count: 3, items: ["Acme GmbH", "Beta KG", "Gamma AG"], color: "bg-muted text-muted-foreground" },
                { title: "In Setup", count: 2, items: ["Delta SE", "Epsilon GmbH"], color: "bg-lavender-100 text-ink" },
                { title: "Live", count: 4, items: ["Zeta UG", "Eta AG", "Theta GmbH", "Iota KG"], color: "bg-success/15 text-success" },
              ].map((col) => (
                <div key={col.title} className="rounded-lg bg-muted/40 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-semibold">{col.title}</p>
                    <Badge className={col.color}>{col.count}</Badge>
                  </div>
                  <div className="space-y-2">
                    {col.items.map((i) => (
                      <div key={i} className="rounded-md border bg-background p-2 text-sm shadow-sm">{i}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Pagination">
            <Pagination>
              <PaginationContent>
                <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
                <PaginationItem><PaginationLink href="#">1</PaginationLink></PaginationItem>
                <PaginationItem><PaginationLink href="#" isActive>2</PaginationLink></PaginationItem>
                <PaginationItem><PaginationLink href="#">3</PaginationLink></PaginationItem>
                <PaginationItem><PaginationEllipsis /></PaginationItem>
                <PaginationItem><PaginationLink href="#">12</PaginationLink></PaginationItem>
                <PaginationItem><PaginationNext href="#" /></PaginationItem>
              </PaginationContent>
            </Pagination>
          </Section>

          <Section title="Bulk-Actions-Bar">
            <div className="flex items-center justify-between rounded-md border bg-ink px-4 py-2 text-primary-foreground">
              <p className="text-sm"><span className="font-semibold">3</span> ausgewählt</p>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" className="text-primary-foreground hover:bg-white/10"><Mail className="mr-2 h-4 w-4" /> Versenden</Button>
                <Button size="sm" variant="ghost" className="text-primary-foreground hover:bg-white/10"><Download className="mr-2 h-4 w-4" /> Export</Button>
                <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/20"><Trash2 className="mr-2 h-4 w-4" /> Löschen</Button>
              </div>
            </div>
          </Section>

          {/* ============== NEU: Formulare ============== */}
          <Section title="Multi-step wizard">
            <WizardDemo />
          </Section>

          <Section title="OTP-Input">
            <InputOTP maxLength={6}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </Section>

          <Section title="Password strength">
            <PasswordStrengthDemo />
          </Section>

          <Section title="Combobox (searchable select)">
            <ComboboxDemo />
          </Section>

          <Section title="Multi-Select mit Chips">
            <MultiSelectChips />
          </Section>

          <Section title="Tag-Input">
            <TagInputDemo />
          </Section>

          <Section title="Currency input">
            <div className="grid gap-3 md:grid-cols-2 max-w-md">
              <div className="space-y-2">
                <Label>Monatlicher Preis</Label>
                <div className="relative">
                  <Input defaultValue="49,00" className="pr-10 text-right" />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">€</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>USt-Satz</Label>
                <div className="relative">
                  <Input defaultValue="19" className="pr-10 text-right" />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span>
                </div>
              </div>
            </div>
          </Section>

          <Section title="File upload (dropzone)">
            <FileUploadDemo />
          </Section>

          <Section title="Inline edit">
            <InlineEditDemo />
          </Section>

          <Section title="Toggle-Group / Segmented control">
            <div className="space-y-3">
              <ToggleGroup type="single" defaultValue="month" variant="outline">
                <ToggleGroupItem value="day">Tag</ToggleGroupItem>
                <ToggleGroupItem value="week">Woche</ToggleGroupItem>
                <ToggleGroupItem value="month">Monat</ToggleGroupItem>
                <ToggleGroupItem value="year">Jahr</ToggleGroupItem>
              </ToggleGroup>
              <ToggleGroup type="multiple" defaultValue={["bold"]} variant="outline">
                <ToggleGroupItem value="bold">B</ToggleGroupItem>
                <ToggleGroupItem value="italic"><em>I</em></ToggleGroupItem>
                <ToggleGroupItem value="underline"><u>U</u></ToggleGroupItem>
              </ToggleGroup>
            </div>
          </Section>

          {/* ============== NEU: Navigation ============== */}
          <Section title="Command palette (⌘K)">
            <CommandPaletteDemo />
          </Section>

          <Section title="Breadcrumbs mit Dropdown">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem><BreadcrumbLink href="#">Kunden</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-1">
                      <BreadcrumbEllipsis className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem>Region EU</DropdownMenuItem>
                      <DropdownMenuItem>DE</DropdownMenuItem>
                      <DropdownMenuItem>Berlin</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbLink href="#">Acme GmbH</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbPage>Abrechnung</BreadcrumbPage></BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </Section>

          <Section title="Tabs in 2 Stilen">
            <div className="space-y-6">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Underline</p>
                <div className="border-b">
                  <nav className="flex gap-4">
                    {["Übersicht", "Details", "Verlauf"].map((t, i) => (
                      <button key={t} className={`-mb-px border-b-2 px-1 pb-2 text-sm ${i === 0 ? "border-ink font-semibold text-ink" : "border-transparent text-muted-foreground hover:text-foreground"}`}>{t}</button>
                    ))}
                  </nav>
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Boxed</p>
                <div className="inline-flex rounded-md border p-1">
                  {["Tag", "Woche", "Monat"].map((t, i) => (
                    <button key={t} className={`rounded px-3 py-1 text-sm ${i === 1 ? "bg-ink text-primary-foreground" : "text-foreground hover:bg-muted"}`}>{t}</button>
                  ))}
                </div>
              </div>
            </div>
          </Section>

          <Section title="Accordion">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="a">
                <AccordionTrigger>Wie wird ein Subuser angelegt?</AccordionTrigger>
                <AccordionContent>Über die Kundenseite mit der vergebenen Customer-ID.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="b">
                <AccordionTrigger>Welche Region wird genutzt?</AccordionTrigger>
                <AccordionContent>Ausschließlich EU (api.eu.sendgrid.com).</AccordionContent>
              </AccordionItem>
              <AccordionItem value="c">
                <AccordionTrigger>Wie laufen DNS-Validierungen?</AccordionTrigger>
                <AccordionContent>Automatisch alle 6 Stunden oder manuell über „Aktualisieren".</AccordionContent>
              </AccordionItem>
            </Accordion>
          </Section>

          {/* ============== NEU: Overlays & Spezial-Bausteine ============== */}
          <Section title="Confirm dialog (Type-to-confirm)">
            <ConfirmTypeToDelete />
          </Section>

          <Section title="Hover-Card (Kundenvorschau)">
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="link" className="px-0">@acme-gmbh</Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-72">
                <div className="flex items-start gap-3">
                  <Avatar><AvatarFallback className="bg-lavender-300 text-ink">AG</AvatarFallback></Avatar>
                  <div>
                    <p className="font-semibold">Acme GmbH</p>
                    <p className="text-xs text-muted-foreground">Kunden-ID MST980 · Hosting Basic</p>
                    <p className="mt-2 text-xs">Aktiv seit 12.03.2025 · 3 Domains</p>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </Section>

          <Section title="Avatar-Group (stacked)">
            <div className="flex -space-x-2">
              {["AB", "CD", "EF", "GH"].map((n, i) => (
                <Avatar key={n} className="border-2 border-background">
                  <AvatarFallback className={["bg-lavender-300", "bg-mint", "bg-peach", "bg-lavender-100"][i] + " text-ink"}>{n}</AvatarFallback>
                </Avatar>
              ))}
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-semibold">+5</div>
            </div>
          </Section>

          <Section title="Customer-Card">
            <div className="grid gap-3 md:grid-cols-2">
              <Card>
                <CardContent className="flex items-start gap-3 pt-6">
                  <Avatar className="h-12 w-12"><AvatarFallback className="bg-lavender-300 text-ink">AG</AvatarFallback></Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-semibold">Acme GmbH</p>
                      <Badge className="bg-success/15 text-success">aktiv</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">MST980 · Hosting Basic</p>
                    <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                      <Phone className="h-3 w-3" /> +49 30 1234 · <Mail className="h-3 w-3" /> info@acme.de
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Öffnen</DropdownMenuItem>
                      <DropdownMenuItem>Domain hinzufügen</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Pausieren</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="space-y-2 pt-6">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-semibold">Rechnungsadresse</p>
                    <Button size="icon" variant="ghost" className="ml-auto h-9 w-9"><Copy className="h-4 w-4" /></Button>
                  </div>
                  <p className="text-sm leading-relaxed">
                    Acme GmbH<br />
                    Musterstraße 12<br />
                    10115 Berlin · DE
                  </p>
                </CardContent>
              </Card>
            </div>
          </Section>

          <Section title="Invoice-Preview-Card">
            <div className="grid gap-3 md:grid-cols-2">
              <Card>
                <CardContent className="flex gap-3 pt-6">
                  <div className="flex h-20 w-16 shrink-0 items-center justify-center rounded border bg-muted">
                    <FileText className="h-7 w-7 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">R-2026-0042</p>
                    <p className="text-xs text-muted-foreground">Acme GmbH · 01.06.2026</p>
                    <p className="mt-1 text-lg font-bold">€ 49,00</p>
                    <div className="mt-2 flex gap-2">
                      <Button size="sm" variant="outline"><Eye className="mr-1 h-3.5 w-3.5" /> Vorschau</Button>
                      <Button size="sm" variant="ghost"><Download className="h-3.5 w-3.5" /></Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Section>

          <Section title="Audit-Log-Entry">
            <div className="space-y-2">
              {[
                { who: "Jana M.", what: "Status geändert", from: "neu", to: "vertrag", when: "vor 12 Min." },
                { who: "System", what: "Tax-Rate geändert", from: "19 %", to: "7 %", when: "gestern" },
              ].map((e, i) => (
                <div key={i} className="flex items-center justify-between rounded-md border p-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8"><AvatarFallback>{e.who.slice(0,2)}</AvatarFallback></Avatar>
                    <div>
                      <p className="text-sm"><span className="font-semibold">{e.who}</span> · {e.what}</p>
                      <p className="text-xs text-muted-foreground">
                        <span className="line-through">{e.from}</span> → <span className="font-medium text-foreground">{e.to}</span>
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{e.when}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Dokument-Vorschau (Split-Screen)">
            <DocumentPreviewDemo />
          </Section>

          <Section title="API-Key reveal">
            <ApiKeyReveal value="SG.eU-XXXX-real-key-7f9a3c-eu-region-419dDEMO0" />
          </Section>

          <Section title="DNS-Record-Box">
            <div className="space-y-2">
              {[
                { type: "CNAME", host: "em1234.acme.de", value: "u123.wl.sendgrid.net", ok: true },
                { type: "CNAME", host: "s1._domainkey.acme.de", value: "s1.domainkey.u123.wl.sendgrid.net", ok: true },
                { type: "TXT", host: "_dmarc.acme.de", value: "v=DMARC1; p=none;", ok: false },
              ].map((r, i) => (
                <div key={i} className="flex flex-col gap-2 rounded-md border p-3 sm:flex-row sm:items-center">
                  <Badge variant="outline" className="w-fit font-mono text-[10px]">{r.type}</Badge>
                  <div className="min-w-0 flex-1 grid gap-1 sm:grid-cols-2">
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase text-muted-foreground">Host</p>
                      <p className="truncate font-mono text-xs">{r.host}</p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase text-muted-foreground">Value</p>
                      <p className="truncate font-mono text-xs">{r.value}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {r.ok
                      ? <Badge className="bg-success/15 text-success"><ShieldCheck className="mr-1 h-3 w-3" /> ok</Badge>
                      : <Badge className="bg-warning/15 text-warning"><ShieldAlert className="mr-1 h-3 w-3" /> pending</Badge>}
                    <Button size="icon" variant="ghost" className="h-9 w-9"><Copy className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Global banner">
            <div className="flex items-center gap-3 rounded-md border-l-4 border-warning bg-warning/10 px-4 py-3 text-sm">
              <Bell className="h-4 w-4 text-warning" />
              <span><span className="font-semibold">Wartung</span> · am 20.06.2026 zwischen 22:00 und 23:00 Uhr.</span>
              <Button size="sm" variant="ghost" className="ml-auto">Mehr</Button>
              <Button size="icon" variant="ghost" className="h-9 w-9"><X className="h-4 w-4" /></Button>
            </div>
          </Section>

          <Section title="Copy-to-Clipboard">
            <CopyButtonDemo value="MST980-API-KEY-DEMO" />
          </Section>

          <Section title="Loading button mit Success">
            <LoadingSuccessButton />
          </Section>

          <Section title="Animated counter">
            <div className="flex flex-wrap gap-6">
              <CounterCard value={1284} label="Versendete Mails" />
              <CounterCard value={342} label="Domains" />
              <CounterCard value={96} suffix="%" label="Deliverability" />
            </div>
          </Section>

          <Section title="Snackbar mit Undo">
            <Button onClick={() => toast({ title: "1 Eintrag gelöscht", description: "Du hast 5 Sek. Zeit zum Rückgängig-Machen.", action: <Button size="sm" variant="outline">Rückgängig</Button> as any })}>
              Eintrag löschen
            </Button>
          </Section>

          {/* ============== NEU: App-spezifische Layouts ============== */}
          <Section title="Login-Card (Vollbild-Auth)">
            <div className="flex items-center justify-center rounded-lg border bg-muted p-8">
              <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
                    <LogIn className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-2xl">Anmelden</CardTitle>
                  <CardDescription>KI-Vertriebssystem · interner Zugang</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div className="space-y-2">
                      <Label htmlFor="login-email">E-Mail</Label>
                      <Input id="login-email" type="email" placeholder="name@kiv.io" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-pw">Passwort</Label>
                      <Input id="login-pw" type="password" placeholder="••••••••" />
                    </div>
                    <Button type="submit" className="w-full"><LogIn className="mr-2 h-4 w-4" /> Anmelden</Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </Section>

          <Section title="Kalender-Widget (embedded)">
            <Card className="w-fit">
              <CardContent className="p-3">
                <Calendar mode="single" selected={new Date()} className="rounded-md" />
              </CardContent>
            </Card>
          </Section>

          <Section title="Termin-Zeile (Tagesplan)">
            <div className="space-y-2">
              {[
                { time: "09:00", title: "Kickoff-Call · Acme GmbH", type: "Call", dot: "bg-lavender-300", badge: "bg-lavender-100 text-ink", icon: Phone, attendees: ["JM", "TK"] },
                { time: "11:30", title: "Produkt-Demo · Beta KG", type: "Demo", dot: "bg-success", badge: "bg-success/15 text-success", icon: Eye, attendees: ["SL"] },
                { time: "14:00", title: "Mail-Test · Gamma AG", type: "Mail-Test", dot: "bg-warning", badge: "bg-peach text-ink", icon: Mail, attendees: ["JM", "BH", "TK"] },
              ].map((e) => {
                const Icon = e.icon;
                return (
                  <div key={e.time} className="flex items-center gap-4 rounded-md border p-3 transition-colors hover:bg-muted/40">
                    <span className="font-mono text-sm text-muted-foreground w-14">{e.time}</span>
                    <span className={`flex h-8 w-8 items-center justify-center rounded-full ${e.badge}`}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`inline-block h-1.5 w-1.5 rounded-full ${e.dot}`} />
                        <p className="font-medium">{e.title}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">{e.type}</p>
                    </div>
                    <div className="flex -space-x-2">
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
            </div>
          </Section>

          <Section title="Integrations-Card-Grid">
            <div className="grid gap-3 md:grid-cols-2">
              {[
                { name: "SendGrid EU", desc: "Versand-Backend (region=eu).", status: "Verbunden", enabled: true },
                { name: "Slack", desc: "Benachrichtigungen in #ops.", status: "Nicht verbunden", enabled: false },
                { name: "Stripe", desc: "Zahlungsabwicklung.", status: "Verbunden", enabled: true },
                { name: "Lovable Cloud", desc: "Auth, DB und Storage.", status: "Verbunden", enabled: true },
              ].map((i) => (
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
            </div>
          </Section>

          <Section title="Team-Mitglieder-Zeile">
            <div className="space-y-2">
              {[
                { name: "Jana Müller", email: "jana@kiv.io", role: "Admin", initials: "JM" },
                { name: "Tom Krause", email: "tom@kiv.io", role: "Kundenbetreuer", initials: "TK" },
                { name: "Ben Hartmann", email: "ben@kiv.io", role: "Read-only", initials: "BH" },
              ].map((m) => (
                <div key={m.email} className="flex items-center gap-3 rounded-md border p-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-lavender-100 text-ink text-xs">{m.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{m.name}</p>
                    <p className="text-xs text-muted-foreground">{m.email}</p>
                  </div>
                  <Badge variant={m.role === "Admin" ? "default" : "secondary"}>{m.role}</Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-9 w-9"><MoreHorizontal className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Rolle ändern</DropdownMenuItem>
                      <DropdownMenuItem>Passwort zurücksetzen</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Entfernen</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Avatar-Group mit Header-Aktion">
            <div className="flex items-center justify-between rounded-md border p-4">
              <div>
                <p className="font-semibold">Team · 4 Mitglieder</p>
                <p className="text-xs text-muted-foreground">1 Admin · 2 Kundenbetreuer · 1 Read-only</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {["JM", "TK", "SL", "BH"].map((a) => (
                    <Avatar key={a} className="h-8 w-8 border-2 border-background">
                      <AvatarFallback className="bg-lavender-100 text-ink text-xs">{a}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <Button size="sm">Einladen</Button>
              </div>
            </div>
          </Section>

          <Section title="Pipeline-Stufen-Liste">
            <Card>
              <CardContent className="space-y-2 pt-6">
                {[
                  { stage: "Lead", count: 14, color: "bg-muted text-muted-foreground" },
                  { stage: "Onboarding", count: 6, color: "bg-lavender-100 text-ink" },
                  { stage: "Validierung", count: 4, color: "bg-peach text-ink" },
                  { stage: "Live", count: 23, color: "bg-success/15 text-success" },
                ].map((p) => (
                  <div key={p.stage} className="flex items-center justify-between rounded-md border p-2.5">
                    <span className="text-sm">{p.stage}</span>
                    <Badge className={p.color}>{p.count}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </Section>

          <Section title="System-Health-Liste">
            <Card>
              <CardContent className="space-y-3 pt-6">
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
          </Section>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* =============== Helpers / Demo-Komponenten =============== */

function StatusDot({ color, label, pulse = false }: { color: string; label: string; pulse?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="relative inline-flex h-2.5 w-2.5">
        {pulse && <span className={`absolute inset-0 animate-ping rounded-full opacity-60 ${color}`} />}
        <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${color}`} />
      </span>
      {label}
    </span>
  );
}

function CircularProgress({ value, label }: { value: number; label: string }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  const off = c - (value / 100) * c;
  return (
    <div className="flex flex-col items-center">
      <svg width="64" height="64" viewBox="0 0 64 64" className="-rotate-90">
        <circle cx="32" cy="32" r={r} stroke="hsl(var(--muted))" strokeWidth="6" fill="none" />
        <circle cx="32" cy="32" r={r} stroke="hsl(var(--ink))" strokeWidth="6" fill="none" strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round" />
      </svg>
      <p className="-mt-10 text-sm font-semibold">{value}%</p>
      <p className="mt-7 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function Sparkline({ data, color = "hsl(var(--ink))" }: { data: number[]; color?: string }) {
  const w = 120, h = 36;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");
  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline fill="none" stroke={color} strokeWidth="2" points={pts} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function KPI({ title, value, trend, up, data }: { title: string; value: string; trend: string; up: boolean; data: number[] }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{title}</p>
        <div className="mt-1 flex items-end justify-between gap-3">
          <p className="text-2xl font-bold">{value}</p>
          <Sparkline data={data} color={up ? "hsl(var(--success))" : "hsl(var(--destructive))"} />
        </div>
        <div className="mt-2 flex items-center gap-1 text-xs">
          {up ? <TrendingUp className="h-3 w-3 text-success" /> : <TrendingDown className="h-3 w-3 text-destructive" />}
          <span className={up ? "text-success" : "text-destructive"}>{trend}</span>
          <span className="text-muted-foreground">vs. letzten Monat</span>
        </div>
      </CardContent>
    </Card>
  );
}

function MiniBars({ data }: { data: number[] }) {
  const max = Math.max(...data);
  return (
    <div className="flex h-32 items-end gap-2">
      {data.map((v, i) => (
        <div key={i} className="flex flex-1 flex-col items-center gap-1">
          <div className="w-full rounded-t bg-lavender-300" style={{ height: `${(v / max) * 100}%` }} />
          <span className="text-[10px] text-muted-foreground">{["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"][i]}</span>
        </div>
      ))}
    </div>
  );
}

function Donut({ segments }: { segments: { value: number; color: string }[] }) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  const r = 40, c = 2 * Math.PI * r;
  let acc = 0;
  return (
    <div className="flex items-center gap-6">
      <svg width="120" height="120" viewBox="0 0 120 120" className="-rotate-90">
        <circle cx="60" cy="60" r={r} stroke="hsl(var(--muted))" strokeWidth="14" fill="none" />
        {segments.map((s, i) => {
          const len = (s.value / total) * c;
          const dash = `${len} ${c - len}`;
          const off = -acc;
          acc += len;
          return <circle key={i} cx="60" cy="60" r={r} stroke={s.color} strokeWidth="14" fill="none" strokeDasharray={dash} strokeDashoffset={off} />;
        })}
      </svg>
      <div className="space-y-1 text-sm">
        {segments.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
            <span>{s.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function WizardDemo() {
  const [step, setStep] = useState(1);
  const labels = ["Kundendaten", "Vertrag", "Konfiguration", "Bestätigung"];
  return (
    <div className="space-y-4">
      <Stepper steps={labels.map((l) => ({ label: l }))} current={step} />
      <div className="rounded-md border p-4 text-sm">
        Inhalt von Schritt <span className="font-semibold">{step}</span> · {labels[step - 1]}
      </div>
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1}>Zurück</Button>
        <Button onClick={() => setStep((s) => Math.min(labels.length, s + 1))} disabled={step === labels.length}>Weiter</Button>
      </div>
    </div>
  );
}

function PasswordStrengthDemo() {
  const [v, setV] = useState("");
  const score = Math.min(4, Math.floor(v.length / 3) + (/[A-Z]/.test(v) ? 1 : 0) + (/\d/.test(v) ? 1 : 0));
  const colors = ["bg-muted", "bg-destructive", "bg-warning", "bg-warning", "bg-success"];
  const label = ["Leer", "Schwach", "OK", "Gut", "Stark"][score];
  return (
    <div className="max-w-sm space-y-2">
      <Input type="password" value={v} onChange={(e) => setV(e.target.value)} placeholder="Passwort" />
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`h-1.5 flex-1 rounded ${i < score ? colors[score] : "bg-muted"}`} />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function ComboboxDemo() {
  const [open, setOpen] = useState(false);
  const [val, setVal] = useState<string | null>(null);
  const opts = ["Acme GmbH", "Beispiel AG", "Mustermann KG", "Delta SE", "Epsilon GmbH"];
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[260px] justify-between">
          {val ?? "Kunde wählen…"}
          <ChevronRight className="h-4 w-4 rotate-90 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[260px] p-0">
        <Command>
          <CommandInput placeholder="Suchen…" />
          <CommandList>
            <CommandEmpty>Keine Treffer.</CommandEmpty>
            <CommandGroup>
              {opts.map((o) => (
                <CommandItem key={o} onSelect={() => { setVal(o); setOpen(false); }}>{o}</CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function MultiSelectChips() {
  const all = ["Hosting", "Mail", "DNS", "Setup", "Premium"];
  const [sel, setSel] = useState<string[]>(["Hosting", "Mail"]);
  return (
    <div className="max-w-md space-y-2">
      <div className="flex flex-wrap items-center gap-1 rounded-md border p-2">
        {sel.map((s) => (
          <Badge key={s} className="bg-lavender-100 text-ink">
            {s}
            <button className="ml-1" onClick={() => setSel(sel.filter((x) => x !== s))}><X className="h-3 w-3" /></button>
          </Badge>
        ))}
        <input className="flex-1 bg-transparent px-1 text-sm outline-none" placeholder="Hinzufügen…" />
      </div>
      <div className="flex flex-wrap gap-1">
        {all.filter((a) => !sel.includes(a)).map((a) => (
          <Button key={a} size="sm" variant="outline" onClick={() => setSel([...sel, a])}>
            <Plus className="mr-1 h-3 w-3" /> {a}
          </Button>
        ))}
      </div>
    </div>
  );
}

function TagInputDemo() {
  const [tags, setTags] = useState(["acme.de", "beispiel.de"]);
  const [v, setV] = useState("");
  return (
    <div className="flex max-w-md flex-wrap items-center gap-1 rounded-md border p-2">
      {tags.map((t) => (
        <Badge key={t} variant="secondary">
          {t}
          <button className="ml-1" onClick={() => setTags(tags.filter((x) => x !== t))}><X className="h-3 w-3" /></button>
        </Badge>
      ))}
      <input
        value={v}
        onChange={(e) => setV(e.target.value)}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === ",") && v.trim()) {
            e.preventDefault();
            setTags([...tags, v.trim()]);
            setV("");
          }
        }}
        className="flex-1 bg-transparent px-1 text-sm outline-none"
        placeholder="Domain + Enter…"
      />
    </div>
  );
}

function FileUploadDemo() {
  const [drag, setDrag] = useState(false);
  const [file, setFile] = useState<string | null>(null);
  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); setFile(e.dataTransfer.files[0]?.name ?? null); }}
      className={`flex flex-col items-center rounded-lg border-2 border-dashed p-8 text-center transition-colors ${drag ? "border-lavender-500 bg-lavender-50" : "border-border"}`}
    >
      <UploadCloud className="h-8 w-8 text-muted-foreground" />
      <p className="mt-2 text-sm font-medium">Datei hierher ziehen</p>
      <p className="text-xs text-muted-foreground">oder klicke zum Auswählen · PDF, PNG, JPG bis 10 MB</p>
      {file && (
        <div className="mt-3 flex items-center gap-2 rounded-md bg-muted px-3 py-1 text-xs">
          <FileImage className="h-3 w-3" /> {file}
          <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setFile(null)}><X className="h-3 w-3" /></Button>
        </div>
      )}
    </div>
  );
}

function InlineEditDemo() {
  const [editing, setEditing] = useState(false);
  const [v, setV] = useState("Acme GmbH");
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { if (editing) inputRef.current?.focus(); }, [editing]);
  return (
    <div className="max-w-sm">
      {editing ? (
        <div className="flex gap-2">
          <Input ref={inputRef} value={v} onChange={(e) => setV(e.target.value)} onBlur={() => setEditing(false)} onKeyDown={(e) => e.key === "Enter" && setEditing(false)} />
          <Button size="icon" variant="outline" onClick={() => setEditing(false)}><Check className="h-4 w-4" /></Button>
        </div>
      ) : (
        <button onClick={() => setEditing(true)} className="group flex w-full items-center justify-between rounded-md px-2 py-1 text-left hover:bg-muted">
          <span className="font-medium">{v}</span>
          <Pencil className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100" />
        </button>
      )}
    </div>
  );
}

function CommandPaletteDemo() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <CommandIcon className="mr-2 h-4 w-4" /> Search…
        <kbd className="ml-3 rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px]">⌘K</kbd>
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0">
          <Command>
            <CommandInput placeholder="Suchen oder springen zu…" />
            <CommandList>
              <CommandEmpty>Keine Ergebnisse.</CommandEmpty>
              <CommandGroup heading="Navigation">
                <CommandItem><User className="mr-2 h-4 w-4" /> Kunden</CommandItem>
                <CommandItem><Globe className="mr-2 h-4 w-4" /> Domains</CommandItem>
                <CommandItem><Receipt className="mr-2 h-4 w-4" /> Abrechnung</CommandItem>
              </CommandGroup>
              <CommandGroup heading="Aktionen">
                <CommandItem><Plus className="mr-2 h-4 w-4" /> Neuen Kunden anlegen</CommandItem>
                <CommandItem><RefreshCw className="mr-2 h-4 w-4" /> SendGrid neu synchronisieren</CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}

function ConfirmTypeToDelete() {
  const [v, setV] = useState("");
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive"><Trash2 className="mr-2 h-4 w-4" /> Kunde löschen</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Kunde unwiderruflich löschen?</AlertDialogTitle>
          <AlertDialogDescription>
            Tippe <span className="font-mono font-semibold text-foreground">LÖSCHEN</span>, um zu bestätigen.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Input value={v} onChange={(e) => setV(e.target.value)} placeholder="LÖSCHEN" />
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setV("")}>Abbrechen</AlertDialogCancel>
          <AlertDialogAction disabled={v !== "LÖSCHEN"} className="bg-destructive hover:bg-destructive/90">Endgültig löschen</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function ApiKeyReveal({ value }: { value: string }) {
  const [show, setShow] = useState(false);
  const masked = "•".repeat(value.length - 4) + value.slice(-4);
  return (
    <div className="flex max-w-xl items-center gap-2 rounded-md border p-2">
      <KeyRound className="h-4 w-4 text-muted-foreground" />
      <code className="flex-1 truncate font-mono text-xs">{show ? value : masked}</code>
      <Button size="sm" variant="ghost" onClick={() => setShow((s) => !s)}>
        <Eye className="mr-1 h-4 w-4" /> {show ? "Verbergen" : "Anzeigen"}
      </Button>
      <Button size="icon" variant="ghost" onClick={() => { navigator.clipboard?.writeText(value); toast({ title: "Kopiert" }); }}>
        <Copy className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="ghost"><RefreshCw className="h-4 w-4" /></Button>
    </div>
  );
}

function CopyButtonDemo({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-center gap-2">
      <code className="rounded bg-muted px-2 py-1 font-mono text-xs">{value}</code>
      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          navigator.clipboard?.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
      >
        {copied ? <><Check className="mr-1 h-4 w-4 text-success" /> Kopiert</> : <><Copy className="mr-1 h-4 w-4" /> Kopieren</>}
      </Button>
    </div>
  );
}

function DocumentPreviewDemo() {
  const totalPages = 3;
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b bg-muted/30 px-3 py-2">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">RE-2026-0058.pdf</span>
          <Badge variant="outline" className="text-[10px]">PDF · 248 KB</Badge>
        </div>
        <div className="flex items-center gap-1">
          <Button size="icon" variant="ghost" className="h-9 w-9" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="px-2 text-xs tabular-nums text-muted-foreground">
            Seite {page} / {totalPages}
          </span>
          <Button size="icon" variant="ghost" className="h-9 w-9" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Separator orientation="vertical" className="mx-1 h-5" />
          <Button size="icon" variant="ghost" className="h-9 w-9" onClick={() => setZoom((z) => Math.max(50, z - 10))}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="w-12 text-center text-xs tabular-nums text-muted-foreground">{zoom}%</span>
          <Button size="icon" variant="ghost" className="h-9 w-9" onClick={() => setZoom((z) => Math.min(200, z + 10))}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Separator orientation="vertical" className="mx-1 h-5" />
          <Button size="icon" variant="ghost" className="h-9 w-9" onClick={() => sonnerToast.success("Druck-Dialog geöffnet")}>
            <Printer className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" className="h-9 w-9" onClick={() => sonnerToast.success("Download gestartet")}>
            <Download className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" className="h-9 w-9" onClick={() => sonnerToast("Vollbild")}>
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Split body */}
      <div className="grid gap-0 md:grid-cols-[1fr_300px]">
        {/* Preview pane */}
        <div className="relative flex min-h-[420px] items-start justify-center overflow-auto bg-muted/40 p-6">
          <div
            className="origin-top bg-white shadow-lg ring-1 ring-border transition-transform"
            style={{
              width: 380,
              transform: `scale(${zoom / 100})`,
            }}
          >
            <div className="space-y-4 p-8 text-[10px] leading-relaxed text-ink">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[8px] uppercase tracking-wider text-muted-foreground">Rechnung</p>
                  <p className="text-sm font-bold">RE-2026-0058</p>
                </div>
                <div className="text-right">
                  <p className="text-[8px] uppercase tracking-wider text-muted-foreground">Datum</p>
                  <p className="text-xs font-medium">11.06.2026</p>
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-[8px] uppercase tracking-wider text-muted-foreground">Empfänger</p>
                <p className="font-medium">Acme GmbH</p>
                <p className="text-muted-foreground">Marienplatz 1 · 80331 München</p>
              </div>
              <div className="space-y-1.5">
                <div className="grid grid-cols-[1fr_auto] border-b pb-1 text-[8px] uppercase tracking-wider text-muted-foreground">
                  <span>Position</span><span>Betrag</span>
                </div>
                {[
                  ["Setup-Pauschale", "490,00 €"],
                  ["Monatspaket Pro", "199,00 €"],
                  ["Zusatz-Subuser (3)", "57,00 €"],
                ].map(([l, v]) => (
                  <div key={l} className="grid grid-cols-[1fr_auto] text-[10px]">
                    <span>{l}</span><span className="tabular-nums">{v}</span>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="grid grid-cols-[1fr_auto] text-[11px] font-semibold">
                <span>Gesamt (inkl. 19 % USt.)</span>
                <span className="tabular-nums">888,02 €</span>
              </div>
              <p className="pt-6 text-center text-[8px] text-muted-foreground">— Seite {page} von {totalPages} —</p>
            </div>
          </div>
        </div>

        {/* Meta / actions pane */}
        <div className="border-t md:border-l md:border-t-0">
          <div className="space-y-4 p-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Details</p>
              <dl className="mt-2 space-y-2 text-sm">
                <div className="flex justify-between"><dt className="text-muted-foreground">Kunde</dt><dd className="font-medium">Acme GmbH</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Status</dt><dd><Badge className="bg-success/15 text-success hover:bg-success/15">Bezahlt</Badge></dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Betrag</dt><dd className="font-mono">888,02 €</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Fällig</dt><dd>25.06.2026</dd></div>
              </dl>
            </div>
            <Separator />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Aktionen</p>
              <div className="mt-2 space-y-2">
                <Button size="sm" className="w-full justify-start"><Send className="mr-2 h-4 w-4" /> An Kunde senden</Button>
                <Button size="sm" variant="outline" className="w-full justify-start"><Download className="mr-2 h-4 w-4" /> Herunterladen</Button>
                <Button size="sm" variant="ghost" className="w-full justify-start text-destructive hover:text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Löschen</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingSuccessButton() {
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  return (
    <Button
      onClick={() => {
        setState("loading");
        setTimeout(() => setState("done"), 1200);
        setTimeout(() => setState("idle"), 2600);
      }}
      disabled={state !== "idle"}
      className="min-w-[160px]"
    >
      {state === "idle" && <><Save className="mr-2 h-4 w-4" /> Speichern</>}
      {state === "loading" && <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Speichert…</>}
      {state === "done" && <><Check className="mr-2 h-4 w-4" /> Gespeichert</>}
    </Button>
  );
}

function CounterCard({ value, label, suffix = "" }: { value: number; label: string; suffix?: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const dur = 900;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setN(Math.round(p * value));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return (
    <div className="rounded-lg border p-4">
      <p className="text-3xl font-bold tabular-nums">{n.toLocaleString("de-DE")}{suffix}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

type DemoCol = "name" | "owner" | "status" | "updated";
const demoRows = Array.from({ length: 23 }).map((_, i) => ({
  id: String(i + 1),
  name: `Item ${String(i + 1).padStart(2, "0")}`,
  owner: ["Alex", "Sam", "Jordan", "Riley", "Mika"][i % 5],
  status: ["Active", "Pending", "Draft"][i % 3] as "Active" | "Pending" | "Draft",
  updated: `0${(i % 9) + 1}.06.2026`,
}));

function DataTableDemo() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { sortKey, sortDir, toggle } = useTableSort<DemoCol>({ key: "updated", dir: "desc" });

  const filtered = demoRows.filter(
    (r) =>
      r.name.toLowerCase().includes(q.toLowerCase()) &&
      (status === "all" || r.status.toLowerCase() === status),
  );
  const sorted = [...filtered].sort((a, b) => {
    if (!sortKey || !sortDir) return 0;
    const av = String(a[sortKey]).toLowerCase();
    const bv = String(b[sortKey]).toLowerCase();
    return av < bv ? (sortDir === "asc" ? -1 : 1) : av > bv ? (sortDir === "asc" ? 1 : -1) : 0;
  });
  const paged = sorted.slice((page - 1) * pageSize, page * pageSize);

  return (
    <Card>
      <div className="flex flex-col gap-2 border-b p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1); }}
            placeholder="Search items..."
            className="pl-9"
          />
        </div>
        <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Neu
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <SortableTableHead column="name" sortKey={sortKey} sortDir={sortDir} onSort={toggle}>Name</SortableTableHead>
            <SortableTableHead column="owner" sortKey={sortKey} sortDir={sortDir} onSort={toggle}>Owner</SortableTableHead>
            <SortableTableHead column="status" sortKey={sortKey} sortDir={sortDir} onSort={toggle}>Status</SortableTableHead>
            <SortableTableHead column="updated" sortKey={sortKey} sortDir={sortDir} onSort={toggle}>Updated</SortableTableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paged.map((r) => (
            <TableRow key={r.id}>
              <TableCell className="font-medium">{r.name}</TableCell>
              <TableCell>{r.owner}</TableCell>
              <TableCell>
                <Badge variant="outline">{r.status}</Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">{r.updated}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm">Open</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        page={page}
        pageSize={pageSize}
        total={sorted.length}
        onPageChange={setPage}
        onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
      />
    </Card>
  );
}