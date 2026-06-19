
# Produktionsauftragsplanung

Eine App zur Planung von Produktionsaufträgen, aufgebaut komplett auf den vorhandenen Template-Komponenten. Sidebar, PageHeader, Card, Table, SortableTableHead, TablePagination, Badge, Dialog/Sheet, Select, Stepper, SubNav, Toast werden wiederverwendet. Nur **eine neue Komponente** wird ergänzt: ein Gantt-Chart, da im Template kein Pendant existiert.

## Navigation (Sidebar umlabeln)

Die bestehende Sidebar wird zu Produktionskontext umgelabelt — Routen und Icons bleiben:

- `/` Dashboard → "Übersicht" (Produktions-KPIs)
- `/orders` (vorher `/customers`/`/list`) → "Aufträge", Icon `ClipboardList`
- `/planning` (vorher `/calendar`) → "Planung" (Gantt), Icon `GanttChartSquare`
- `/resources` (vorher `/contracts`) → "Ressourcen" (Maschinen/Linien)
- `/reports` (vorher `/invoices`) → "Auswertungen"
- `/settings` bleibt

## Seiten

### 1. Dashboard `/` — Übersicht
Wiederverwendung des vorhandenen Dashboard-Layouts, neuer Inhalt:
- KPI-Karten: Offene Aufträge, In Produktion, Verspätet, Auslastung (%)
- Pipeline-Karte → Statusverteilung: Geplant / Freigegeben / In Arbeit / Fertig
- Aktivitätsstream → letzte Status-/Planungsereignisse
- Schnellaktionen: Neuer Auftrag, Plan aktualisieren

### 2. Aufträge `/orders` — Auftragsliste
Komplett auf `ListView`-Muster:
- Spalten: Auftrags-Nr., Artikel, Menge, Kunde, Linie/Maschine, Start, Ende, Status, Priorität
- Filter: Status (Geplant/Freigegeben/In Arbeit/Fertig/Verspätet), Linie, Suche
- Bulk-Auswahl mit Aktionsleiste: Freigeben, Auf Plan übernehmen, Löschen
- Sortierung, Pagination, Row-Click → `/orders/:id`
- "Neuer Auftrag" → `Sheet` mit Formular (Artikel, Menge, Wunschtermin, Linie, Priorität, Notiz)

### 3. Auftrags-Detail `/orders/:id`
Wiederverwendung von `DetailView` + `SubNav` + `Stepper`:
- Stepper-Phasen: Angelegt → Freigegeben → Eingeplant → In Arbeit → Fertig
- Tabs (SubNav): Übersicht, Stückliste, Arbeitsgänge, Planung, Notizen, Historie
- Übersicht: Stammdaten (Artikel, Menge, Kunde, Termin), Meta-Card (Owner, Status, Priorität, geplante Dauer)
- Arbeitsgänge: Table mit Schritten (AG-Nr., Beschreibung, Maschine, Rüst-/Bearbeitungszeit)
- Audit-Log wie im Template

### 4. Planung `/planning` — Gantt
- PageHeader mit Zeitraum-`ToggleGroup` (Tag/Woche/Monat) und "Neuer Auftrag"-Button
- KPI-Cards (Aufträge geplant, freie Kapazität, Konflikte, Auslastung)
- **Neue Komponente** `GanttChart` (siehe unten) in einer `Card`
- Seitenpanel/`Sheet` beim Klick auf einen Balken: Auftragsdetails + Bearbeiten

### 5. Ressourcen `/resources`
ListView-Muster, Tabelle der Maschinen/Linien (Name, Kapazität h/Tag, aktuelle Auslastung als `Progress`, Status).

### 6. Auswertungen `/reports`
Kartenraster mit einfachen KPI-Übersichten und Sparkline (aus dem Template).

## Neue Komponente: `GanttChart`

Datei: `src/components/GanttChart.tsx` (einziger zwingender Neubau — im Template ist kein Gantt vorhanden).

Eigenschaften:
- Props: `tasks: { id, label, resource, start: Date, end: Date, progress: number, status }[]`, `resources: string[]`, `range: 'day'|'week'|'month'`
- Linke Spalte = Ressourcen-/Auftragsliste (sticky), rechte Fläche = Zeitachse mit Tagesspalten
- Balken farblich nach Status (Tokens: `bg-lavender-300`, `bg-success`, `bg-warning`, `bg-destructive`), `Progress`-Anteil als helle Innenfüllung
- Drag-to-move und Resize an den Enden via Pointer-Events; Konflikte (Überlappung pro Ressource) werden rot umrandet
- Heute-Marker (vertikale Linie)
- Tooltip via vorhandener `Tooltip`-Komponente
- Klick auf Balken öffnet `Sheet` zum Bearbeiten (Start/Ende/Ressource/Status)

Nur Tailwind + Template-Tokens, keine zusätzlichen Libraries.

## Daten (Mock, in-memory)

Wie im Template: konstante Mock-Arrays in den Page-Files. Kein Backend, kein localStorage. Zustand pro Session über `useState`. Toasts via vorhandenem `sonner`.

## Technische Details

- Routen in `src/App.tsx` ergänzen/umbenennen (`/orders`, `/orders/:id`, `/planning`, `/resources`, `/reports`)
- `AppSidebar.tsx` Labels/Icons/Pfade anpassen
- Texte komplett auf Deutsch (wie Template)
- Keine neuen Dependencies
- Keine Token-Änderungen in `index.css`/`tailwind.config.ts`

## Out of scope

- Persistenz / Lovable Cloud (kann später ergänzt werden)
- Authentifizierung über die vorhandene SignIn-Seite hinaus
- Echte Optimierungs-/Solver-Logik für die Reihenfolgeplanung
