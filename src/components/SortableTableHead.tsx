import { useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { TableHead } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export type SortDir = "asc" | "desc" | null;

interface Props<K extends string> {
  column: K;
  sortKey: K | null;
  sortDir: SortDir;
  onSort: (key: K) => void;
  className?: string;
  align?: "left" | "right";
  children: React.ReactNode;
}

export function SortableTableHead<K extends string>({
  column,
  sortKey,
  sortDir,
  onSort,
  className,
  align = "left",
  children,
}: Props<K>) {
  const active = sortKey === column && sortDir !== null;
  const Icon = !active ? ArrowUpDown : sortDir === "asc" ? ArrowUp : ArrowDown;
  return (
    <TableHead className={cn(align === "right" && "text-right", className)}>
      <button
        type="button"
        onClick={() => onSort(column)}
        className={cn(
          "inline-flex items-center gap-1.5 rounded px-1 -mx-1 py-0.5 transition-colors hover:text-foreground",
          align === "right" && "ml-auto",
          active && "text-foreground",
        )}
      >
        <span>{children}</span>
        <Icon className={cn("h-3 w-3 transition-opacity", active ? "opacity-100" : "opacity-40")} />
      </button>
    </TableHead>
  );
}

export function useTableSort<K extends string>(initial?: { key: K; dir: SortDir }) {
  const [sortKey, setSortKey] = useState<K | null>(initial?.key ?? null);
  const [sortDir, setSortDir] = useState<SortDir>(initial?.dir ?? null);
  const toggle = (key: K) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("asc");
    } else if (sortDir === "asc") {
      setSortDir("desc");
    } else {
      setSortKey(null);
      setSortDir(null);
    }
  };
  return { sortKey, sortDir, toggle } as const;
}