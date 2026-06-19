# Supabase Auth Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Secure all routes behind Supabase email+password auth — unauthenticated users always land on `/sign-in`.

**Architecture:** An `AuthContext` holds session state and listens to Supabase auth events. A `ProtectedRoute` component guards all app routes and redirects to `/sign-in` when no session exists. The existing `SignIn` page stub and `AppSidebar` logout button are wired to real Supabase calls.

**Tech Stack:** React 18, TypeScript, Vite, @supabase/supabase-js ^2, React Router DOM v6, Vitest + @testing-library/react (jsdom)

## Global Constraints

- Path alias `@` resolves to `src/` — always import with `@/`, never with relative `../..`
- Supabase client is at `@/integrations/supabase/client` — do not create a second client
- Test runner: `npm run test` (runs `vitest run`); single file: `npx vitest run src/path/to/file.test.tsx`
- Vitest globals are enabled — `describe`, `it`, `expect`, `vi`, `beforeEach` etc. need no import
- All user-facing strings in German (the app is German-language)
- No `React` default import needed — JSX transform is configured

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/contexts/AuthContext.tsx` | Create | Session state, `useAuth()` hook |
| `src/contexts/AuthContext.test.tsx` | Create | Unit tests for AuthContext |
| `src/components/ProtectedRoute.tsx` | Create | Route guard, redirect logic |
| `src/components/ProtectedRoute.test.tsx` | Create | Unit tests for ProtectedRoute |
| `src/main.tsx` | Modify | Wrap `<App>` with `<AuthProvider>` |
| `src/App.tsx` | Modify | Use `<ProtectedRoute>` to guard routes |
| `src/pages/SignIn.tsx` | Modify | Wire to `supabase.auth.signInWithPassword()` |
| `src/pages/SignIn.test.tsx` | Create | Unit tests for SignIn |
| `src/components/AppSidebar.tsx` | Modify | Show real user email, call `signOut()` |

---

## Task 1: AuthContext

**Files:**
- Create: `src/contexts/AuthContext.tsx`
- Create: `src/contexts/AuthContext.test.tsx`

**Interfaces:**
- Produces:
  - `AuthProvider: React.FC<{ children: React.ReactNode }>` — wrap app in `main.tsx`
  - `useAuth(): { session: Session | null; user: User | null; loading: boolean; signOut: () => Promise<void> }` — consume in any component

---

- [ ] **Step 1: Write the failing tests**

Create `src/contexts/AuthContext.test.tsx`:

```typescript
import { renderHook, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
      signOut: vi.fn(),
    },
  },
}));

import { supabase } from "@/integrations/supabase/client";

beforeEach(() => {
  vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
    data: { subscription: { unsubscribe: vi.fn() } },
  } as any);
});

describe("AuthContext", () => {
  it("starts loading, then resolves session", async () => {
    const mockSession = { user: { id: "1", email: "test@example.com" } } as any;
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: mockSession },
      error: null,
    } as any);

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.session).toEqual(mockSession);
    expect(result.current.user).toEqual(mockSession.user);
  });

  it("calls supabase.auth.signOut when signOut is called", async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: null },
      error: null,
    } as any);
    vi.mocked(supabase.auth.signOut).mockResolvedValue({ error: null } as any);

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    await waitFor(() => expect(result.current.loading).toBe(false));

    await result.current.signOut();

    expect(supabase.auth.signOut).toHaveBeenCalledOnce();
  });

  it("throws when used outside AuthProvider", () => {
    expect(() => renderHook(() => useAuth())).toThrow(
      "useAuth must be used within AuthProvider"
    );
  });
});
```

- [ ] **Step 2: Run tests — confirm they fail**

```
npx vitest run src/contexts/AuthContext.test.tsx
```

Expected: FAIL — `Cannot find module '@/contexts/AuthContext'`

- [ ] **Step 3: Implement AuthContext**

Create `src/contexts/AuthContext.tsx`:

```typescript
import { createContext, useContext, useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{ session, user: session?.user ?? null, loading, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
```

- [ ] **Step 4: Run tests — confirm they pass**

```
npx vitest run src/contexts/AuthContext.test.tsx
```

Expected: PASS — 3 tests

- [ ] **Step 5: Commit**

```bash
git add src/contexts/AuthContext.tsx src/contexts/AuthContext.test.tsx
git commit -m "feat: add AuthContext with session management and useAuth hook"
```

---

## Task 2: ProtectedRoute

**Files:**
- Create: `src/components/ProtectedRoute.tsx`
- Create: `src/components/ProtectedRoute.test.tsx`

**Interfaces:**
- Consumes: `useAuth()` from `@/contexts/AuthContext`
- Produces: `ProtectedRoute: React.FC` — used as a wrapping `<Route element>` in `App.tsx`

---

- [ ] **Step 1: Write the failing tests**

Create `src/components/ProtectedRoute.test.tsx`:

```typescript
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi, describe, it, expect } from "vitest";
import { ProtectedRoute } from "@/components/ProtectedRoute";

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from "@/contexts/AuthContext";

function renderWithRouter(authState: { session: any; loading: boolean }) {
  vi.mocked(useAuth).mockReturnValue({
    session: authState.session,
    user: authState.session?.user ?? null,
    loading: authState.loading,
    signOut: vi.fn(),
  });

  return render(
    <MemoryRouter initialEntries={["/dashboard"]}>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<div>Protected Content</div>} />
        </Route>
        <Route path="/sign-in" element={<div>Sign In Page</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("ProtectedRoute", () => {
  it("renders outlet when session exists", () => {
    renderWithRouter({ session: { user: { email: "a@b.com" } }, loading: false });
    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("redirects to /sign-in when no session", () => {
    renderWithRouter({ session: null, loading: false });
    expect(screen.getByText("Sign In Page")).toBeInTheDocument();
  });

  it("renders nothing while loading", () => {
    renderWithRouter({ session: null, loading: true });
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
    expect(screen.queryByText("Sign In Page")).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests — confirm they fail**

```
npx vitest run src/components/ProtectedRoute.test.tsx
```

Expected: FAIL — `Cannot find module '@/components/ProtectedRoute'`

- [ ] **Step 3: Implement ProtectedRoute**

Create `src/components/ProtectedRoute.tsx`:

```typescript
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function ProtectedRoute() {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (!session) {
    return (
      <Navigate
        to={`/sign-in?redirect=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  return <Outlet />;
}
```

- [ ] **Step 4: Run tests — confirm they pass**

```
npx vitest run src/components/ProtectedRoute.test.tsx
```

Expected: PASS — 3 tests

- [ ] **Step 5: Commit**

```bash
git add src/components/ProtectedRoute.tsx src/components/ProtectedRoute.test.tsx
git commit -m "feat: add ProtectedRoute guard with redirect to sign-in"
```

---

## Task 3: Wire App-Level Providers and Routes

**Files:**
- Modify: `src/main.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `AuthProvider` from `@/contexts/AuthContext`, `ProtectedRoute` from `@/components/ProtectedRoute`

No new unit tests — the behavior is covered by Task 1 and Task 2 tests. Manual verification is in Task 6.

---

- [ ] **Step 1: Wrap App with AuthProvider in main.tsx**

Replace the full content of `src/main.tsx` with:

```typescript
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./contexts/AuthContext";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
```

- [ ] **Step 2: Guard routes with ProtectedRoute in App.tsx**

Replace the full content of `src/App.tsx` with:

```typescript
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppLayout } from "@/components/AppLayout";
import Dashboard from "./pages/Dashboard";
import OrdersList from "./pages/OrdersList";
import OrderDetail from "./pages/OrderDetail";
import Planning from "./pages/Planning";
import Resources from "./pages/Resources";
import Reports from "./pages/Reports";
import SettingsView from "./pages/SettingsView";
import Components from "./pages/Components";
import SignIn from "./pages/SignIn";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/sign-in" element={<SignIn />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/orders" element={<OrdersList />} />
              <Route path="/orders/:id" element={<OrderDetail />} />
              <Route path="/planning" element={<Planning />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<SettingsView />} />
              <Route path="/components" element={<Components />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
```

- [ ] **Step 3: Run all tests to check nothing broke**

```
npm run test
```

Expected: PASS — all existing tests still pass

- [ ] **Step 4: Commit**

```bash
git add src/main.tsx src/App.tsx
git commit -m "feat: wire AuthProvider and ProtectedRoute into app shell"
```

---

## Task 4: Wire SignIn Page

**Files:**
- Modify: `src/pages/SignIn.tsx`
- Create: `src/pages/SignIn.test.tsx`

**Interfaces:**
- Consumes: `supabase.auth.signInWithPassword` from `@/integrations/supabase/client`, `useNavigate` and `useSearchParams` from `react-router-dom`

---

- [ ] **Step 1: Write the failing tests**

Create `src/pages/SignIn.test.tsx`:

```typescript
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import SignIn from "@/pages/SignIn";

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
    },
  },
}));

import { supabase } from "@/integrations/supabase/client";

function renderSignIn(initialPath = "/sign-in") {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/" element={<div>Dashboard</div>} />
        <Route path="/planning" element={<div>Planning</div>} />
      </Routes>
    </MemoryRouter>
  );
}

function fillAndSubmit(email = "test@example.com", password = "password123") {
  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: email },
  });
  fireEvent.change(screen.getByLabelText(/passwort/i), {
    target: { value: password },
  });
  fireEvent.click(screen.getByRole("button", { name: /anmelden/i }));
}

describe("SignIn", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls signInWithPassword with form values", async () => {
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: { session: {} as any, user: {} as any },
      error: null,
    } as any);

    renderSignIn();
    fillAndSubmit("user@example.com", "secret123");

    await waitFor(() =>
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: "user@example.com",
        password: "secret123",
      })
    );
  });

  it("shows error message when credentials are wrong", async () => {
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: { session: null, user: null },
      error: { message: "Invalid login credentials" } as any,
    } as any);

    renderSignIn();
    fillAndSubmit();

    await waitFor(() =>
      expect(
        screen.getByText("E-Mail oder Passwort ungültig.")
      ).toBeInTheDocument()
    );
  });

  it("disables submit button while loading", async () => {
    vi.mocked(supabase.auth.signInWithPassword).mockImplementation(
      () => new Promise(() => {})
    );

    renderSignIn();
    fillAndSubmit();

    expect(screen.getByRole("button", { name: /anmelden/i })).toBeDisabled();
  });

  it("redirects to / by default after successful login", async () => {
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: { session: {} as any, user: {} as any },
      error: null,
    } as any);

    renderSignIn();
    fillAndSubmit();

    await waitFor(() =>
      expect(screen.getByText("Dashboard")).toBeInTheDocument()
    );
  });

  it("redirects to redirect param after successful login", async () => {
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: { session: {} as any, user: {} as any },
      error: null,
    } as any);

    renderSignIn("/sign-in?redirect=%2Fplanning");
    fillAndSubmit();

    await waitFor(() =>
      expect(screen.getByText("Planning")).toBeInTheDocument()
    );
  });
});
```

- [ ] **Step 2: Run tests — confirm they fail**

```
npx vitest run src/pages/SignIn.test.tsx
```

Expected: FAIL — button text mismatch, no error element, no real auth call

- [ ] **Step 3: Implement the wired SignIn page**

Replace the full content of `src/pages/SignIn.tsx` with:

```typescript
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogIn } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function SignIn() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (
      form.elements.namedItem("password") as HTMLInputElement
    ).value;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("E-Mail oder Passwort ungültig.");
      setLoading(false);
      return;
    }

    const redirect = searchParams.get("redirect") ?? "/";
    navigate(redirect);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <LogIn className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Anmelden</CardTitle>
          <CardDescription>
            Melde dich mit deiner E-Mail-Adresse und deinem Passwort an.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">E-Mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Passwort</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              <LogIn className="mr-2 h-4 w-4" />
              {loading ? "Wird angemeldet…" : "Anmelden"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
```

- [ ] **Step 4: Run tests — confirm they pass**

```
npx vitest run src/pages/SignIn.test.tsx
```

Expected: PASS — 5 tests

- [ ] **Step 5: Commit**

```bash
git add src/pages/SignIn.tsx src/pages/SignIn.test.tsx
git commit -m "feat: wire SignIn page to Supabase auth with error handling"
```

---

## Task 5: Wire AppSidebar to Auth

**Files:**
- Modify: `src/components/AppSidebar.tsx`

**Interfaces:**
- Consumes: `useAuth()` from `@/contexts/AuthContext` — `user.email`, `signOut`

No new unit tests — the auth behavior is already tested in Task 1. The sidebar changes are UI wiring.

---

- [ ] **Step 1: Add useAuth import and wire user email + logout**

In `src/components/AppSidebar.tsx`, make the following changes:

1. Add the import at the top (after existing imports):

```typescript
import { useAuth } from "@/contexts/AuthContext";
```

2. Inside `AppSidebar()`, add after the existing state/hooks:

```typescript
const { user, signOut } = useAuth();
const userEmail = user?.email ?? "";
const initials = userEmail.slice(0, 2).toUpperCase();
```

3. Replace the desktop sidebar "Abmelden" `DropdownMenuItem` (currently a `NavLink` to `/sign-in`) with:

```typescript
<DropdownMenuItem
  className="text-destructive focus:text-destructive cursor-pointer"
  onClick={() => void signOut()}
>
  <LogOut className="mr-2 h-4 w-4" />
  Abmelden
</DropdownMenuItem>
```

4. Replace both occurrences of the hardcoded `AvatarFallback` text `AB` with `{initials}`.

5. Replace both occurrences of the hardcoded `email@example.com` with `{userEmail}`.

6. Replace the mobile "Abmelden" `NavLink` (to `/sign-in`) with a `<button>`:

```typescript
<button
  onClick={() => { setMobileOpen(false); void signOut(); }}
  className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
>
  <LogOut className="h-4 w-4" /> Abmelden
</button>
```

- [ ] **Step 2: Run all tests**

```
npm run test
```

Expected: PASS — all tests pass

- [ ] **Step 3: Commit**

```bash
git add src/components/AppSidebar.tsx
git commit -m "feat: wire AppSidebar to auth — show real user email and call signOut"
```

---

## Task 6: Manual End-to-End Verification

No code changes — this task verifies the complete flow works in the browser.

- [ ] **Step 1: Start the dev server**

```
npm run dev
```

- [ ] **Step 2: Verify redirect when not logged in**

Open `http://localhost:8080/`. Confirm you are redirected to `/sign-in?redirect=%2F`.

- [ ] **Step 3: Verify login with wrong credentials**

Enter any email + wrong password. Confirm the error message "E-Mail oder Passwort ungültig." appears below the form and the button re-enables.

- [ ] **Step 4: Verify login with correct credentials**

Enter a valid user's credentials (created in Supabase Dashboard). Confirm you land on `/` (Dashboard).

- [ ] **Step 5: Verify sidebar shows correct user**

Confirm the avatar in the sidebar shows the first two letters of your email address, and the dropdown shows your full email.

- [ ] **Step 6: Verify logout**

Click "Abmelden" in the sidebar dropdown. Confirm you are redirected to `/sign-in` and cannot access `/` without logging in again.

- [ ] **Step 7: Verify redirect param is preserved**

Log out. Manually navigate to `http://localhost:8080/planning`. Confirm redirect to `/sign-in?redirect=%2Fplanning`. Log in — confirm you land on `/planning`.

- [ ] **Step 8: Final commit if any fixes were needed**

If you made any fixes during manual testing, commit them now:

```bash
git add -p
git commit -m "fix: <describe what was fixed>"
```
