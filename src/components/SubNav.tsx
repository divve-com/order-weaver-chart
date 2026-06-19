import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface SubNavItem {
  key: string;
  label: string;
  icon?: LucideIcon;
}

interface SubNavProps {
  title?: string;
  items: SubNavItem[];
  value: string;
  onChange: (key: string) => void;
  className?: string;
}

export function SubNav({ title, items, value, onChange, className }: SubNavProps) {
  return (
    <Card className={cn("h-fit min-w-0 max-w-full md:sticky md:top-6", className)}>
      {title && (
        <CardHeader className="pb-3">
          <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">
            {title}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className="p-2">
        <nav className="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible">
          {items.map((item) => {
            const Icon = item.icon;
            const active = item.key === value;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onChange(item.key)}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  active
                    ? "bg-lavender-100 text-ink font-semibold"
                    : "text-foreground hover:bg-lavender-50",
                )}
              >
                {Icon && (
                  <span
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full",
                      active ? "bg-lavender-300 text-ink" : "bg-lavender-50 text-ink",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                )}
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </CardContent>
    </Card>
  );
}