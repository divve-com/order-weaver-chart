import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SortableTableHead, useTableSort } from "@/components/SortableTableHead";
import { TablePagination } from "@/components/TablePagination";
import {
  Plus,
  Search,
  MoreHorizontal,
  Mail,
  Download,
  Trash2,
  Pencil,
  Eye,
  FilterX,
} from "lucide-react";
import { toast } from "sonner";

const companies = [
  "Acme GmbH", "Beta KG", "Gamma AG", "Delta SE", "Epsilon UG",
  "Zeta UG", "Eta AG", "Theta GmbH", "Iota KG", "Kappa SE",
];
const owners = [
  { name: "Jana M.", initials: "JM" },
  { name: "Tom K.", initials: "TK" },
  { name: "Sara L.", initials: "SL" },
  { name: "Ben H.", initials: "BH" },
];

const rows = Array.from({ length: 47 }).map((_, i) => ({
  id: String(i + 1),
  name: companies[i % companies.length] + (i >= companies.length ? ` ${Math.floor(i / companies.length) + 1}` : ""),
  owner: owners[i % owners.length],
  status: ["Aktiv", "Onboarding", "Entwurf"][i % 3] as "Aktiv" | "Onboarding" | "Entwurf",
  mails: 1000 + ((i * 1337) % 90000),
  updated: `${String((i % 28) + 1).padStart(2, "0")}.06.2026`,
}));

const statusDot: Record<string, string> = {
  Aktiv: "bg-success",
  Onboarding: "bg-warning",
  Entwurf: "bg-muted-foreground",
};

type Col = "name" | "owner" | "status" | "mails" | "updated";

export default function ListView() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { sortKey, sortDir, toggle } = useTableSort<Col>({ key: "updated", dir: "desc" });
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  const filtered = useMemo(
    () =>
      rows.filter(
        (r) =>
          r.name.toLowerCase().includes(q.toLowerCase()) &&
          (status === "all" || r.status === status),
      ),
    [q, status],
  );

  const sorted = useMemo(() => {
    if (!sortKey || !sortDir) return filtered;
    const arr = [...filtered];
    arr.sort((a, b) => {
      const rawA = sortKey === "owner" ? a.owner.name : (a as any)[sortKey];
      const rawB = sortKey === "owner" ? b.owner.name : (b as any)[sortKey];
      const av = typeof rawA === "number" ? rawA : String(rawA).toLowerCase();
      const bv = typeof rawB === "number" ? rawB : String(rawB).toLowerCase();
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  const paged = sorted.slice((page - 1) * pageSize, page * pageSize);
  const pagedIds = paged.map((r) => r.id);
  const allOnPageSelected = pagedIds.length > 0 && pagedIds.every((id) => selected.has(id));

  const togglePage = () => {
    const next = new Set(selected);
    if (allOnPageSelected) pagedIds.forEach((id) => next.delete(id));
    else pagedIds.forEach((id) => next.add(id));
    setSelected(next);
  };
  const toggleRow = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };
  const clearFilters = () => { setQ(""); setStatus("all"); setPage(1); };

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[{ label: "Workspace" }, { label: "Kunden" }]}
        title="Kunden"
        subtitle="Alle Vertragskunden mit Status, Owner und Mailvolumen."
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Neuer Kunde
          </Button>
        }
      />

      {selected.size > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border bg-ink px-3 py-2 text-primary-foreground sm:px-4">
          <p className="text-sm"><span className="font-semibold">{selected.size}</span> ausgewählt</p>
          <div className="flex flex-wrap items-center gap-1 sm:gap-2">
            <Button size="sm" variant="ghost" className="text-primary-foreground hover:bg-white/10" onClick={() => toast.success(`Mail an ${selected.size} Kunden versendet`)}>
              <Mail className="h-4 w-4 sm:mr-2" /> <span className="hidden sm:inline">Versenden</span>
            </Button>
            <Button size="sm" variant="ghost" className="text-primary-foreground hover:bg-white/10" onClick={() => toast.success("Export gestartet")}>
              <Download className="h-4 w-4 sm:mr-2" /> <span className="hidden sm:inline">Export</span>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/20">
                  <Trash2 className="h-4 w-4 sm:mr-2" /> <span className="hidden sm:inline">Löschen</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{selected.size} Einträge löschen?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Diese Aktion kann innerhalb von 5 Sekunden rückgängig gemacht werden.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      const n = selected.size;
                      setSelected(new Set());
                      toast(`${n} Einträge gelöscht`, {
                        description: "Du hast 5 Sek. zum Rückgängig-Machen.",
                        action: { label: "Rückgängig", onClick: () => toast.success("Wiederhergestellt") },
                      });
                    }}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Löschen
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      )}

      <Card>
        <div className="flex flex-col gap-2 border-b p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1 sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => { setQ(e.target.value); setPage(1); }}
              placeholder="Kunde suchen..."
              className="pl-9"
            />
          </div>
          <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Status</SelectItem>
              <SelectItem value="Aktiv">Aktiv</SelectItem>
              <SelectItem value="Onboarding">Onboarding</SelectItem>
              <SelectItem value="Entwurf">Entwurf</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Checkbox checked={allOnPageSelected} onCheckedChange={togglePage} aria-label="Alle auswählen" />
              </TableHead>
              <SortableTableHead column="name" sortKey={sortKey} sortDir={sortDir} onSort={toggle}>Kunde</SortableTableHead>
              <SortableTableHead column="owner" sortKey={sortKey} sortDir={sortDir} onSort={toggle} className="hidden md:table-cell">Owner</SortableTableHead>
              <SortableTableHead column="status" sortKey={sortKey} sortDir={sortDir} onSort={toggle}>Status</SortableTableHead>
              <SortableTableHead column="mails" sortKey={sortKey} sortDir={sortDir} onSort={toggle} className="hidden text-right lg:table-cell">Mails / 30T</SortableTableHead>
              <SortableTableHead column="updated" sortKey={sortKey} sortDir={sortDir} onSort={toggle} className="hidden sm:table-cell">Aktualisiert</SortableTableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.length === 0 && (
              <TableRow>
                <TableCell colSpan={7}>
                  <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
                    <FilterX className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm font-medium">Keine Treffer</p>
                    <p className="text-xs text-muted-foreground">Passe Suche oder Filter an.</p>
                    <Button size="sm" variant="outline" onClick={clearFilters} className="mt-1">Filter zurücksetzen</Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {paged.map((row) => (
              <TableRow
                key={row.id}
                className="cursor-pointer"
                onClick={() => navigate(`/list/${row.id}`)}
                data-state={selected.has(row.id) ? "selected" : undefined}
              >
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox checked={selected.has(row.id)} onCheckedChange={() => toggleRow(row.id)} aria-label={`${row.name} auswählen`} />
                </TableCell>
                <TableCell className="font-medium">
                  <HoverCard openDelay={200}>
                    <HoverCardTrigger asChild>
                      <span className="hover:underline">{row.name}</span>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-72">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-lavender-100 text-ink text-xs">
                            {row.name.split(" ").map((s) => s[0]).slice(0, 2).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-semibold">{row.name}</p>
                          <p className="text-xs text-muted-foreground">Customer-ID: MST{row.id.padStart(3, "0")}</p>
                          <div className="mt-2 flex items-center gap-2 text-xs">
                            <span className={`inline-block h-1.5 w-1.5 rounded-full ${statusDot[row.status]}`} />
                            <span>{row.status}</span>
                          </div>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="bg-lavender-100 text-ink text-[10px]">{row.owner.initials}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{row.owner.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className={`inline-block h-1.5 w-1.5 rounded-full ${statusDot[row.status]}`} />
                    <span className="text-sm">{row.status}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden text-right font-mono text-xs lg:table-cell">{row.mails.toLocaleString("de-DE")}</TableCell>
                <TableCell className="hidden text-muted-foreground sm:table-cell">{row.updated}</TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => navigate(`/list/${row.id}`)}><Eye className="mr-2 h-4 w-4" /> Öffnen</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toast.success("Bearbeiten geöffnet")}><Pencil className="mr-2 h-4 w-4" /> Bearbeiten</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toast.success("Test-Mail gesendet")}><Mail className="mr-2 h-4 w-4" /> Mail-Test</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={() => toast.error("Gelöscht")}><Trash2 className="mr-2 h-4 w-4" /> Löschen</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
    </div>
  );
}