import { ChevronRight } from "lucide-react";
import { ReactNode } from "react";

interface Crumb {
  label: string;
  onClick?: () => void;
}

interface Props {
  breadcrumbs?: Crumb[];
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function PageHeader({ breadcrumbs, title, subtitle, actions }: Props) {
  return (
    <div className="mb-6 flex flex-col gap-3 border-b pb-4 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="mb-1 flex items-center gap-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            {breadcrumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && <ChevronRight className="h-3 w-3 opacity-60" />}
                {c.onClick ? (
                  <button
                    onClick={c.onClick}
                    className="hover:text-foreground transition-colors"
                  >
                    {c.label}
                  </button>
                ) : (
                  <span>{c.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <h1 className="text-xl md:text-2xl font-semibold tracking-tight truncate">{title}</h1>
        {subtitle && (
          <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
