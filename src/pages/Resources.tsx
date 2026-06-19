import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useResources } from "@/data/production";
import { toast } from "sonner";

const statusStyle: Record<string, string> = {
  Verfügbar: "bg-success/15 text-success",
  Belegt: "bg-peach text-ink",
  Wartung: "bg-destructive/15 text-destructive",
};

export default function Resources() {
  const { data: resources = [], isLoading } = useResources();
  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[{ label: "Produktion" }, { label: "Ressourcen" }]}
        title="Ressourcen"
        subtitle="Maschinen und Linien mit Kapazität und Auslastung."
        actions={<Button onClick={() => toast.success("Ressource angelegt")}><Plus className="mr-2 h-4 w-4" /> Neue Ressource</Button>}
      />
      <Card>
        <Table>
          <TableHeader><TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Gruppe</TableHead>
            <TableHead className="hidden text-right md:table-cell">Kapazität</TableHead>
            <TableHead className="w-[260px]">Auslastung</TableHead>
            <TableHead>Status</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow><TableCell colSpan={5} className="py-12 text-center text-sm text-muted-foreground">Lade Ressourcen…</TableCell></TableRow>
            )}
            {!isLoading && resources.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.name}</TableCell>
                <TableCell className="text-muted-foreground">{r.group}</TableCell>
                <TableCell className="hidden text-right font-mono text-xs md:table-cell">{r.capacityHours} h/Tag</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Progress value={r.utilization} className="w-40" />
                    <span className="font-mono text-xs">{r.utilization}%</span>
                  </div>
                </TableCell>
                <TableCell><Badge className={statusStyle[r.status]} variant="secondary">{r.status}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}