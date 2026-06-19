# Auth Design — Supabase Auth Integration

**Datum:** 2026-06-19  
**Status:** Genehmigt

## Ziel

Die Anwendung soll vollständig hinter einer Authentifizierung gesichert werden. Kein öffentlicher Zugang — jeder Benutzer muss sich anmelden. Benutzer werden von Admins direkt im Supabase Dashboard angelegt. Kein Registrierungsformular, kein Self-Service-Passwort-Reset.

## Entscheidungen

| Thema | Entscheidung |
|---|---|
| Auth-Methode | E-Mail + Passwort |
| Benutzererstellung | Nur über Supabase Dashboard |
| Passwort-Reset | Nur über Supabase Dashboard (Admin) |
| Rollen | Vorerst eine Rolle (alles erlaubt) — RBAC kommt später |

## Architektur

```
Supabase Auth
    │
    ▼
AuthContext (src/contexts/AuthContext.tsx)
 ├─ session: Session | null
 ├─ user: User | null
 ├─ loading: boolean
 └─ signOut(): Promise<void>
    │
    ├── useAuth() — überall in der App nutzbar
    │
    ▼
App.tsx
 ├─ /sign-in  →  <SignIn />          (öffentlich)
 ├─ /*        →  <ProtectedRoute>    (geschützt)
 │               └─ <AppLayout>
 │                  └─ alle Seiten
 └─ *         →  <NotFound />
```

## Neue Dateien

### `src/contexts/AuthContext.tsx`
- React Context mit `session`, `user`, `loading`, `signOut`
- Initialisierung via `supabase.auth.getSession()`
- Reaktiv via `supabase.auth.onAuthStateChange()`
- Exportiert `useAuth()` Hook

### `src/components/ProtectedRoute.tsx`
- `loading === true` → rendert nichts (verhindert Login-Flash)
- `session === null` → Redirect zu `/sign-in?redirect=<aktueller Pfad>`
- `session` vorhanden → rendert `<Outlet />`

## Geänderte Dateien

| Datei | Änderung |
|---|---|
| `src/main.tsx` | `<AuthProvider>` um `<App>` |
| `src/App.tsx` | `<ProtectedRoute>` statt direktem `<AppLayout>` |
| `src/pages/SignIn.tsx` | `supabase.auth.signInWithPassword()`, Fehleranzeige, Redirect nach Login |
| `src/components/AppSidebar.tsx` | `useAuth()`: echte E-Mail, Initialen, `signOut()` |

## Flows

### Login
1. Nicht angemeldeter User → `ProtectedRoute` → `/sign-in?redirect=/ursprung`
2. E-Mail + Passwort eingeben → `supabase.auth.signInWithPassword()`
3. Erfolg → Redirect zum ursprünglichen Ziel (Fallback: `/`)
4. Fehler → Fehlermeldung direkt unter dem Formular

### Logout
1. "Abmelden" im Sidebar-Dropdown → `signOut()` aus `useAuth()`
2. `supabase.auth.signOut()` → `session = null` via `onAuthStateChange`
3. `ProtectedRoute` → automatischer Redirect zu `/sign-in`

### Session-Ablauf
- Token wird automatisch refresht (`autoRefreshToken: true` bereits konfiguriert)
- Abgelaufener Refresh-Token → `session = null` → Redirect zu `/sign-in`

## Fehlerbehandlung

- **Falsches Passwort / unbekannte E-Mail:** Rote Fehlermeldung unter dem Formular
- **Netzwerkfehler:** Generische Fehlermeldung unter dem Formular
- **Doppelklick:** Submit-Button während API-Call deaktiviert
- **Loading-Flash:** `ProtectedRoute` rendert nichts während `loading === true`

## Nicht im Scope

- Registrierungsformular
- Self-Service Passwort-Reset
- Rollenbasierte Berechtigungen (kommt später)
- Social Login / Magic Link
