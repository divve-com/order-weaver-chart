import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SortableTableHead, useTableSort } from "@/components/SortableTableHead";
import { TablePagination } from "@/components/TablePagination";
import {
  Plus, Search, MoreHorizontal, Trash2, Pencil, Eye, FilterX, CheckCircle2, GanttChartSquare,
} from "lucide-react";
import { toast } from "sonner";
import {
  statusStyles, priorityStyles, formatDate, type Order, type Priority,
  useOrders, useResources, useCreateOrder, useDeleteOrders,
} from "@/data/production";

type Col = "number" | "article" | "qty" | "customer" | "resourceId" | "start" | "end" | "status" | "priority";

export default function OrdersList() {
  const { data: rows = [], isLoading } = useOrders();
  const { data: resources = [] } = useResources();
  const createOrder = useCreateOrder();
  const deleteOrders = useDeleteOrders();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [resource, setResource] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [createOpen, setCreateOpen] = useState(false);
  const [draft, setDraft] = useState<{ article: string; qty: number; due: string; resourceId: string; priority: Priority }>({
    article: "", qty: 100, due: "", resourceId: "", priority: "Normal",
  });
  const { sortKey, sortDir, toggle } = useTableSort<Col>({ key: "start", dir: "asc" });
  const navigate = useNavigate();

  const filtered = useMemo(() => rows.filter((r) =>
    (r.number.toLowerCase().includes(q.toLowerCase()) ||
     r.article.toLowerCase().includes(q.toLowerCase()) ||
     r.customer.toLowerCase().includes(q.toLowerCase())) &&
    (status === "all" || r.status === status) &&
    (resource === "all" || r.resourceId === resource)
  ), [rows, q, status, resource]);

  const sorted = useMemo(() => {
    if (!sortKey || !sortDir) return filtered;
    const arr = [...filtered];
    arr.sort((a, b) => {
      const av = (a as any)[sortKey];
      const bv = (b as any)[sortKey];
      const A = typeof av === "number" ? av : String(av).toLowerCase();
      const B = typeof bv === "number" ? bv : String(bv).toLowerCase();
      if (A < B) return sortDir === "asc" ? -1 : 1;
      if (A > B) return sortDir === "asc" ? 1 : -1;
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
  const clearFilters = () => { setQ(""); setStatus("all"); setResource("all"); setPage(1); };
  const resName = (id: string) => resources.find((r) => r.id === id)?.name ?? "—";

  const submitCreate = async () => {
    if (!draft.article || !draft.resourceId || !draft.due) {
      toast.error("Bitte Artikel, Ressource und Wunschtermin angeben.");
      return;
    }
    try {
      await createOrder.mutateAsync({
        article: draft.article, qty: draft.qty, resourceId: draft.resourceId,
        priority: draft.priority, due: new Date(draft.due).toISOString(),
      });
      setCreateOpen(false);
      setDraft({ article: "", qty: 100, due: "", resourceId: "", priority: "Normal" });
      toast.success("Auftrag angelegt");
    } catch (e: any) {
      toast.error("Anlegen fehlgeschlagen", { description: e?.message });
    }
  };

  const removeMany = async (ids: string[]) => {
    try {
      await deleteOrders.mutateAsync(ids);
      setSelected(new Set());
      toast(`${ids.length} Aufträge gelöscht`);
    } catch (e: any) {
      toast.error("Löschen fehlgeschlagen", { description: e?.message });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[{ label: "Produktion" }, { label: "Aufträge" }]}
        title="Produktionsaufträge"
        subtitle="Alle Fertigungsaufträge mit Status, Ressource und Terminen."
        actions={
          <Sheet open={createOpen} onOpenChange={setCreateOpen}>
            <SheetTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" /> Neuer Auftrag</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Neuer Produktionsauftrag</SheetTitle>
                <SheetDescription>Stammdaten — Planung erfolgt im Anschluss.</SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-6">
                <div className="space-y-2"><Label>Artikel</Label><Input placeholder="z. B. Welle W-18" value={draft.article} onChange={(e) => setDraft({ ...draft, article: e.target.value })} /></div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2"><Label>Menge</Label><Input type="number" value={draft.qty} onChange={(e) => setDraft({ ...draft, qty: Number(e.target.value) || 0 })} /></div>
                  <div className="space-y-2"><Label>Wunschtermin</Label><Input type="date" value={draft.due} onChange={(e) => setDraft({ ...draft, due: e.target.value })} /></div>
                </div>
                <div className="space-y-2">
                  <Label>Linie / Maschine</Label>
                  <Select value={draft.resourceId} onValueChange={(v) => setDraft({ ...draft, resourceId: v })}>
                    <SelectTrigger><SelectValue placeholder="Ressource wählen" /></SelectTrigger>
                    <SelectContent>{resources.map((r) => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Priorität</Label>
                  <Select value={draft.priority} onValueChange={(v) => setDraft({ ...draft, priority: v as Priority })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Niedrig">Niedrig</SelectItem>
                      <SelectItem value="Normal">Normal</SelectItem>
                      <SelectItem value="Hoch">Hoch</SelectItem>
                      <SelectItem value="Kritisch">Kritisch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Notiz</Label><Textarea rows={3} placeholder="Optional…" /></div>
              </div>
              <SheetFooter>
                <Button variant="outline" onClick={() => setCreateOpen(false)}>Abbrechen</Button>
                <Button onClick={submitCreate} disabled={createOrder.isPending}>{createOrder.isPending ? "Speichere…" : "Anlegen"}</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        }
      />

      {selected.size > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border bg-ink px-3 py-2 text-primary-foreground sm:px-4">
          <p className="text-sm"><span className="font-semibold">{selected.size}</span> ausgewählt</p>
          <div className="flex flex-wrap items-center gap-1 sm:gap-2">
            <Button size="sm" variant="ghost" className="text-primary-foreground hover:bg-white/10" onClick={() => toast.success(`${selected.size} Aufträge freigegeben`)}>
              <CheckCircle2 className="h-4 w-4 sm:mr-2" /> <span className="hidden sm:inline">Freigeben</span>
            </Button>
            <Button size="sm" variant="ghost" className="text-primary-foreground hover:bg-white/10" onClick={() => navigate("/planning")}>
              <GanttChartSquare className="h-4 w-4 sm:mr-2" /> <span className="hidden sm:inline">Auf Plan</span>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/20">
                  <Trash2 className="h-4 w-4 sm:mr-2" /> <span className="hidden sm:inline">Löschen</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{selected.size} Aufträge löschen?</AlertDialogTitle>
                  <AlertDialogDescription>Diese Aktion kann nicht rückgängig gemacht werden.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => removeMany(Array.from(selected))}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >Löschen</AlertDialogAction>
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
            <Input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Auftrag, Artikel oder Kunde suchen…" className="pl-9" />
          </div>
          <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
            <SelectTrigger className="w-full sm:w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Status</SelectItem>
              <SelectItem value="Geplant">Geplant</SelectItem>
              <SelectItem value="Freigegeben">Freigegeben</SelectItem>
              <SelectItem value="In Arbeit">In Arbeit</SelectItem>
              <SelectItem value="Fertig">Fertig</SelectItem>
              <SelectItem value="Verspätet">Verspätet</SelectItem>
            </SelectContent>
          </Select>
          <Select value={resource} onValueChange={(v) => { setResource(v); setPage(1); }}>
            <SelectTrigger className="w-full sm:w-[200px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Ressourcen</SelectItem>
              {resources.map((r) => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10"><Checkbox checked={allOnPageSelected} onCheckedChange={togglePage} /></TableHead>
              <SortableTableHead column="number" sortKey={sortKey} sortDir={sortDir} onSort={toggle}>Auftrag</SortableTableHead>
              <SortableTableHead column="article" sortKey={sortKey} sortDir={sortDir} onSort={toggle}>Artikel</SortableTableHead>
              <SortableTableHead column="qty" sortKey={sortKey} sortDir={sortDir} onSort={toggle} className="hidden text-right md:table-cell">Menge</SortableTableHead>
              <SortableTableHead column="customer" sortKey={sortKey} sortDir={sortDir} onSort={toggle} className="hidden lg:table-cell">Kunde</SortableTableHead>
              <SortableTableHead column="resourceId" sortKey={sortKey} sortDir={sortDir} onSort={toggle} className="hidden xl:table-cell">Ressource</SortableTableHead>
              <SortableTableHead column="start" sortKey={sortKey} sortDir={sortDir} onSort={toggle} className="hidden sm:table-cell">Start</SortableTableHead>
              <SortableTableHead column="end" sortKey={sortKey} sortDir={sortDir} onSort={toggle} className="hidden md:table-cell">Ende</SortableTableHead>
              <SortableTableHead column="status" sortKey={sortKey} sortDir={sortDir} onSort={toggle}>Status</SortableTableHead>
              <SortableTableHead column="priority" sortKey={sortKey} sortDir={sortDir} onSort={toggle} className="hidden md:table-cell">Priorität</SortableTableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.length === 0 && (
              <TableRow>
                <TableCell colSpan={11}>
                  <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
                    <FilterX className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm font-medium">{isLoading ? "Lade Aufträge…" : "Keine Treffer"}</p>
                    <Button size="sm" variant="outline" onClick={clearFilters}>Filter zurücksetzen</Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {paged.map((row) => {
              const s = statusStyles[row.status];
              return (
                <TableRow key={row.id} className="cursor-pointer" onClick={() => navigate(`/orders/${row.id}`)} data-state={selected.has(row.id) ? "selected" : undefined}>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox checked={selected.has(row.id)} onCheckedChange={() => toggleRow(row.id)} />
                  </TableCell>
                  <TableCell className="font-mono text-xs font-medium">{row.number}</TableCell>
                  <TableCell className="font-medium">{row.article}</TableCell>
                  <TableCell className="hidden text-right font-mono text-xs md:table-cell">{row.qty.toLocaleString("de-DE")} {row.unit}</TableCell>
                  <TableCell className="hidden lg:table-cell">{row.customer}</TableCell>
                  <TableCell className="hidden text-sm xl:table-cell">{resName(row.resourceId)}</TableCell>
                  <TableCell className="hidden text-muted-foreground sm:table-cell">{formatDate(row.start)}</TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">{formatDate(row.end)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={`inline-block h-1.5 w-1.5 rounded-full ${s.dot}`} />
                      <span className="text-sm">{row.status}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge className={priorityStyles[row.priority]} variant="secondary">{row.priority}</Badge>
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/orders/${row.id}`)}><Eye className="mr-2 h-4 w-4" /> Öffnen</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.success("Freigegeben")}><CheckCircle2 className="mr-2 h-4 w-4" /> Freigeben</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate("/planning")}><GanttChartSquare className="mr-2 h-4 w-4" /> Im Plan zeigen</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.success("Bearbeiten geöffnet")}><Pencil className="mr-2 h-4 w-4" /> Bearbeiten</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => removeMany([row.id])}><Trash2 className="mr-2 h-4 w-4" /> Löschen</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <TablePagination page={page} pageSize={pageSize} total={sorted.length} onPageChange={setPage} onPageSizeChange={(s) => { setPageSize(s); setPage(1); }} />
      </Card>
    </div>
  );
}