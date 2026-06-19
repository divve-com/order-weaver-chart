import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  GanttChartSquare,
  Factory,
  BarChart3,
  Settings,
  LogOut,
  HelpCircle,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { to: "/", label: "Übersicht", icon: LayoutDashboard, end: true, activePaths: ["/"] },
  { to: "/orders", label: "Aufträge", icon: ClipboardList, activePaths: ["/orders"] },
  { to: "/planning", label: "Planung", icon: GanttChartSquare, activePaths: ["/planning"] },
  { to: "/resources", label: "Ressourcen", icon: Factory, activePaths: ["/resources"] },
  { to: "/reports", label: "Auswertungen", icon: BarChart3, activePaths: ["/reports"] },
];

const AutomattersLogo = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg viewBox="0 0 35 39" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path
      d="M25.0714 31.44H25.9614C31.7214 31.44 35.6214 25.57 33.3814 20.26L24.8714 0.0799999C24.8514 0.0299999 24.8014 0 24.7414 0H16.3514C16.2914 0 16.2414 0.0299999 16.2214 0.0799999L0.011445 38.29C-0.028555 38.38 0.0414461 38.48 0.141446 38.48H9.02145C9.08145 38.48 9.13144 38.44 9.15144 38.39C10.7514 34.21 14.7714 31.44 19.2514 31.44H21.9314H25.0814H25.0714ZM20.6814 8.65L24.8914 20.28C25.6214 22.29 24.1314 24.41 21.9914 24.41H14.6514C14.5514 24.41 14.4914 24.31 14.5214 24.22L20.4214 8.65C20.4714 8.53 20.6414 8.53 20.6814 8.65Z"
      fill="hsl(var(--lavender-50))"
    />
  </svg>
);

export function AppSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();
  const isRouteActive = (paths: string[]) => paths.some((path) => (path === "/" ? pathname === "/" : pathname.startsWith(path)));
  const settingsActive = pathname.startsWith("/settings");
  const { user, signOut } = useAuth();
  const userEmail = user?.email ?? "";
  const initials = userEmail.slice(0, 2).toUpperCase();

  return (
    <>
      <TooltipProvider delayDuration={0}>
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-16 flex-col items-center justify-between border-r border-border bg-card py-4 md:flex">
          <NavLink
            to="/"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-primary-foreground transition hover:bg-ink-deep focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label="Startseite"
          >
            <AutomattersLogo />
          </NavLink>

          <nav className="mt-6 flex flex-1 flex-col items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isRouteActive(item.activePaths);
              return (
                <Tooltip key={item.to}>
                  <TooltipTrigger asChild>
                    <NavLink
                      to={item.to}
                      end={item.end}
                      className={cn(
                        "flex h-11 w-11 items-center justify-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        active ? "bg-lavender-100 text-ink" : "text-muted-foreground hover:bg-lavender-50 hover:text-ink"
                      )}
                      aria-label={item.label}
                    >
                      <Icon className="h-5 w-5" />
                    </NavLink>
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              );
            })}
          </nav>

          <div className="flex flex-col items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <NavLink
                  to="/settings"
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    settingsActive ? "bg-lavender-100 text-ink" : "text-muted-foreground hover:bg-lavender-50 hover:text-ink"
                  )}
                  aria-label="Einstellungen"
                >
                  <Settings className="h-5 w-5" />
                </NavLink>
              </TooltipTrigger>
              <TooltipContent side="right">Einstellungen</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-lavender-50 hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="Hilfe"
                >
                  <HelpCircle className="h-5 w-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Hilfe</TooltipContent>
            </Tooltip>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="mt-1 flex h-10 w-10 items-center justify-center rounded-full transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  aria-label="Konto"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-ink text-primary-foreground text-xs font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">Mein Konto</p>
                    <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <NavLink to="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Einstellungen
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive cursor-pointer"
                  onClick={() => void signOut()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Abmelden
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </aside>
      </TooltipProvider>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-card px-3 md:hidden">
        <NavLink
          to="/"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-primary-foreground"
          aria-label="Startseite"
        >
          <AutomattersLogo className="h-4 w-4" />
        </NavLink>
        <p className="text-sm font-semibold tracking-tight">Produktionsplanung</p>
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <button
              className="flex h-10 w-10 items-center justify-center rounded-full text-foreground hover:bg-lavender-50"
              aria-label="Menü"
            >
              <Menu className="h-5 w-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] p-0">
            <div className="flex h-full flex-col">
              <div className="flex items-center gap-3 border-b px-4 py-4">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-ink text-primary-foreground text-xs font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-sm font-medium">Mein Konto</p>
                  <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
                </div>
              </div>

              <nav className="flex-1 space-y-1 overflow-y-auto p-3">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isRouteActive(item.activePaths);
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-left transition-colors",
                        active ? "bg-lavender-100 text-ink font-semibold" : "text-foreground hover:bg-lavender-50"
                      )}
                    >
                      <span className={cn("flex h-8 w-8 items-center justify-center rounded-full", active ? "bg-lavender-300 text-ink" : "bg-lavender-50 text-ink")}>
                        <Icon className="h-4 w-4" />
                      </span>
                      {item.label}
                    </NavLink>
                  );
                })}

                <div className="my-2 h-px bg-border" />

                <NavLink
                  to="/settings"
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",
                      isActive
                        ? "bg-lavender-100 text-ink font-semibold"
                        : "text-foreground hover:bg-lavender-50"
                    )
                  }
                >
                  <span
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full text-ink",
                      settingsActive ? "bg-lavender-300" : "bg-lavender-50"
                    )}
                  >
                    <Settings className="h-4 w-4" />
                  </span>
                  Einstellungen
                </NavLink>
              </nav>

              <div className="border-t p-3">
                <button
                  onClick={() => { setMobileOpen(false); void signOut(); }}
                  className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="h-4 w-4" /> Abmelden
                </button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </header>
    </>
  );
}