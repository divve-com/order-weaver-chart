
## Ziel
Bevor eine Domain einem Kunden zugeordnet wird, prüfen, ob sie bereits einem anderen Kunden zugeordnet ist. Bei Konflikt einen Dialog zeigen, in dem der Nutzer entscheidet, was passieren soll.

## Wo greift die Prüfung
Im Flow „Domain hinzufügen" im Kunden-Tab SendGrid (`src/components/CustomerSendgridTab.tsx` → `handleDomainAdded`) und im `AddDomainForm` direkt nach Eingabe. Die Prüfung läuft **vor** dem Aufruf der Edge Function `sendgrid-domain-auth` bzw. vor dem finalen `UPDATE … customer_id`.

## Ablauf

1. **Pre-Check (vor dem Anlegen)** in `AddDomainForm.handleOpenDialog`:
   - Query: `SELECT id, customer_id, status FROM domains WHERE lower(domain) = lower(<input>)`.
   - Drei Fälle:
     - **Keine Treffer** → wie bisher Bestätigungsdialog für Link-Tracking, dann anlegen.
     - **Treffer, `customer_id = aktueller Kunde`** → Hinweis „Diese Domain ist diesem Kunden bereits zugeordnet" → Abbruch.
     - **Treffer, `customer_id != null` und anderer Kunde** → **Konflikt-Dialog** öffnen (siehe unten), Anlage pausieren.
     - **Treffer mit `customer_id = null`** → erlaubt (Import/Reassign-Pfad wie bisher).

2. **Konflikt-Dialog** (neue Komponente `DomainConflictDialog`):
   - Zeigt:
     - Domain
     - Aktuell zugeordneter Kunde (Firmenname + Customer-Code), Status der bestehenden Domain
     - Aktueller Kontext: Zielkunde (Firmenname + Code)
   - Aktionen:
     - **Abbrechen** (Default) – nichts passiert.
     - **Auf diesen Kunden umziehen** – setzt `customer_id` des bestehenden Datensatzes auf den aktuellen Kunden, kein zweiter DB-Eintrag. Optional: warnt, falls Status `subuser_active` (dann ist auch SendGrid-Reassign nötig → Hinweistext mit Verweis auf bestehende Reassign-Logik; eigentlicher SG-Reassign bleibt manuell/aus diesem Ticket ausgeklammert).
     - *(Kein „Trotzdem neu anlegen"-Pfad – Duplikate sollen genau vermieden werden.)*

3. **Post-Check (Sicherheitsnetz)** in `CustomerSendgridTab.handleDomainAdded`, bevor das `UPDATE domains SET customer_id = …` ausgeführt wird:
   - Nochmal prüfen, ob es bereits einen Datensatz mit dieser Domain + anderer `customer_id` gibt (Race-Condition oder Edge-Function-Import-Pfad).
   - Falls ja → gleichen Konflikt-Dialog zeigen statt blind zu überschreiben.

## Technische Details

- Neue Datei: `src/components/DomainConflictDialog.tsx`
- Änderungen:
  - `src/components/AddDomainForm.tsx` – Pre-Check + Dialog-Ansteuerung; akzeptiert neuen Callback `onConflict(existing, newDomain)`.
  - `src/components/CustomerSendgridTab.tsx` – Post-Check, Dialog rendern, „Umziehen"-Handler (Update auf bestehende Zeile statt neue Zuordnung).
- Keine Schema- oder Edge-Function-Änderungen.
- Keine Auto-Reassign auf SendGrid-Seite in diesem Ticket – nur DB-Zuordnung. Wenn die bestehende Domain bereits `subuser_active` ist, blendet der Dialog einen Warnhinweis ein, dass danach ggf. ein SendGrid-Reassign nötig ist.

## Out of Scope
- Bereinigung historischer Duplikate.
- Automatischer SendGrid-Subuser-Reassign.
