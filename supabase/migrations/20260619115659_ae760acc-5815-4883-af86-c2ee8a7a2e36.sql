
-- Resources
CREATE TABLE public.resources (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  group_name TEXT NOT NULL,
  capacity_hours INTEGER NOT NULL DEFAULT 8,
  utilization INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Verfügbar',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.resources TO anon, authenticated;
GRANT ALL ON public.resources TO service_role;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read resources"   ON public.resources FOR SELECT USING (true);
CREATE POLICY "Public can insert resources" ON public.resources FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update resources" ON public.resources FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public can delete resources" ON public.resources FOR DELETE USING (true);

-- Orders
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  number TEXT NOT NULL UNIQUE,
  article TEXT NOT NULL,
  qty INTEGER NOT NULL DEFAULT 0,
  unit TEXT NOT NULL DEFAULT 'Stk.',
  customer TEXT NOT NULL,
  resource_id TEXT NOT NULL REFERENCES public.resources(id) ON DELETE RESTRICT,
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ NOT NULL,
  due_at TIMESTAMPTZ NOT NULL,
  progress INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Geplant',
  priority TEXT NOT NULL DEFAULT 'Normal',
  owner_name TEXT NOT NULL,
  owner_initials TEXT NOT NULL,
  load_hours INTEGER NOT NULL DEFAULT 8,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO anon, authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read orders"   ON public.orders FOR SELECT USING (true);
CREATE POLICY "Public can insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update orders" ON public.orders FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public can delete orders" ON public.orders FOR DELETE USING (true);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER trg_resources_updated BEFORE UPDATE ON public.resources
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_orders_updated BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Seed resources
INSERT INTO public.resources (id, name, group_name, capacity_hours, utilization, status) VALUES
  ('L1','Linie A · Montage','Montage',16,78,'Belegt'),
  ('L2','Linie B · Montage','Montage',16,54,'Verfügbar'),
  ('M1','CNC-Fräse 1','Zerspanung',20,92,'Belegt'),
  ('M2','CNC-Fräse 2','Zerspanung',20,31,'Verfügbar'),
  ('L3','Lackierung','Oberfläche',12,67,'Belegt'),
  ('L4','Prüfstand','Qualität',8,12,'Wartung');

-- Seed orders
INSERT INTO public.orders (number, article, qty, unit, customer, resource_id, start_at, end_at, due_at, progress, status, priority, owner_name, owner_initials, load_hours) VALUES
('PA-2026-000','Gehäuse GH-220',25,'Stk.','Müller AG','L1',(now()::date + -7)::timestamptz,(now()::date + -6)::timestamptz,(now()::date + -6)::timestamptz,0,'Geplant','Niedrig','Jana M.','JM',4),
('PA-2026-001','Welle W-18',62,'Stk.','Schmidt KG','L2',(now()::date + -4)::timestamptz,(now()::date + -2)::timestamptz,(now()::date + -1)::timestamptz,0,'Freigegeben','Normal','Tom K.','TK',6),
('PA-2026-002','Pumpe P-7',99,'Stk.','Weber GmbH','M1',(now()::date + -1)::timestamptz,(now()::date + 2)::timestamptz,(now()::date + 4)::timestamptz,64,'In Arbeit','Hoch','Sara L.','SL',8),
('PA-2026-003','Ventilblock VB-3',136,'Stk.','Hoffmann SE','M2',(now()::date + 2)::timestamptz,(now()::date + 6)::timestamptz,(now()::date + 6)::timestamptz,100,'Fertig','Kritisch','Ben H.','BH',10),
('PA-2026-004','Halterung HX-9',173,'Stk.','Becker UG','L3',(now()::date + 5)::timestamptz,(now()::date + 10)::timestamptz,(now()::date + 11)::timestamptz,44,'Verspätet','Niedrig','Jana M.','JM',12),
('PA-2026-005','Adapterring AR-2',210,'Stk.','Lange & Co.','L4',(now()::date + 8)::timestamptz,(now()::date + 9)::timestamptz,(now()::date + 11)::timestamptz,0,'Geplant','Normal','Tom K.','TK',4),
('PA-2026-006','Sensorkopf SK-5',247,'Stk.','Müller AG','L1',(now()::date + 11)::timestamptz,(now()::date + 13)::timestamptz,(now()::date + 13)::timestamptz,0,'Freigegeben','Hoch','Sara L.','SL',6),
('PA-2026-007','Zahnrad Z-44',284,'Stk.','Schmidt KG','L2',(now()::date + -7)::timestamptz,(now()::date + -4)::timestamptz,(now()::date + -3)::timestamptz,89,'In Arbeit','Kritisch','Ben H.','BH',8),
('PA-2026-008','Kupplung K-12',321,'Stk.','Weber GmbH','M1',(now()::date + -4)::timestamptz,(now()::date + 0)::timestamptz,(now()::date + 2)::timestamptz,100,'Fertig','Niedrig','Jana M.','JM',10),
('PA-2026-009','Leiterplatte LP-S2',358,'Stk.','Hoffmann SE','M2',(now()::date + -1)::timestamptz,(now()::date + 4)::timestamptz,(now()::date + 4)::timestamptz,59,'Verspätet','Normal','Tom K.','TK',12),
('PA-2026-010','Gehäuse GH-220',395,'Stk.','Becker UG','L3',(now()::date + 2)::timestamptz,(now()::date + 3)::timestamptz,(now()::date + 4)::timestamptz,0,'Geplant','Hoch','Sara L.','SL',4),
('PA-2026-011','Welle W-18',432,'Stk.','Lange & Co.','L4',(now()::date + 5)::timestamptz,(now()::date + 7)::timestamptz,(now()::date + 9)::timestamptz,0,'Freigegeben','Kritisch','Ben H.','BH',6),
('PA-2026-012','Pumpe P-7',469,'Stk.','Müller AG','L1',(now()::date + 8)::timestamptz,(now()::date + 11)::timestamptz,(now()::date + 11)::timestamptz,54,'In Arbeit','Niedrig','Jana M.','JM',8),
('PA-2026-013','Ventilblock VB-3',31,'Stk.','Schmidt KG','L2',(now()::date + 11)::timestamptz,(now()::date + 15)::timestamptz,(now()::date + 16)::timestamptz,100,'Fertig','Normal','Tom K.','TK',10),
('PA-2026-014','Halterung HX-9',68,'Stk.','Weber GmbH','M1',(now()::date + -7)::timestamptz,(now()::date + -2)::timestamptz,(now()::date + 0)::timestamptz,74,'Verspätet','Hoch','Sara L.','SL',12),
('PA-2026-015','Adapterring AR-2',105,'Stk.','Hoffmann SE','M2',(now()::date + -4)::timestamptz,(now()::date + -3)::timestamptz,(now()::date + -3)::timestamptz,0,'Geplant','Kritisch','Ben H.','BH',4),
('PA-2026-016','Sensorkopf SK-5',142,'Stk.','Becker UG','L3',(now()::date + -1)::timestamptz,(now()::date + 1)::timestamptz,(now()::date + 2)::timestamptz,0,'Freigegeben','Niedrig','Jana M.','JM',6),
('PA-2026-017','Zahnrad Z-44',179,'Stk.','Lange & Co.','L4',(now()::date + 2)::timestamptz,(now()::date + 5)::timestamptz,(now()::date + 7)::timestamptz,79,'In Arbeit','Normal','Tom K.','TK',8),
('PA-2026-018','Kupplung K-12',216,'Stk.','Müller AG','L1',(now()::date + 5)::timestamptz,(now()::date + 9)::timestamptz,(now()::date + 9)::timestamptz,100,'Fertig','Hoch','Sara L.','SL',10),
('PA-2026-019','Leiterplatte LP-S2',253,'Stk.','Schmidt KG','L2',(now()::date + 8)::timestamptz,(now()::date + 13)::timestamptz,(now()::date + 14)::timestamptz,49,'Verspätet','Kritisch','Ben H.','BH',12),
('PA-2026-020','Gehäuse GH-220',290,'Stk.','Weber GmbH','M1',(now()::date + 11)::timestamptz,(now()::date + 12)::timestamptz,(now()::date + 14)::timestamptz,0,'Geplant','Niedrig','Jana M.','JM',4),
('PA-2026-021','Welle W-18',327,'Stk.','Hoffmann SE','M2',(now()::date + -7)::timestamptz,(now()::date + -5)::timestamptz,(now()::date + -5)::timestamptz,0,'Freigegeben','Normal','Tom K.','TK',6),
('PA-2026-022','Pumpe P-7',364,'Stk.','Becker UG','L3',(now()::date + -4)::timestamptz,(now()::date + -1)::timestamptz,(now()::date + 0)::timestamptz,44,'In Arbeit','Hoch','Sara L.','SL',8),
('PA-2026-023','Ventilblock VB-3',401,'Stk.','Lange & Co.','L4',(now()::date + -1)::timestamptz,(now()::date + 3)::timestamptz,(now()::date + 5)::timestamptz,100,'Fertig','Kritisch','Ben H.','BH',10),
('PA-2026-024','Halterung HX-9',438,'Stk.','Müller AG','L1',(now()::date + 2)::timestamptz,(now()::date + 7)::timestamptz,(now()::date + 7)::timestamptz,64,'Verspätet','Niedrig','Jana M.','JM',12),
('PA-2026-025','Adapterring AR-2',475,'Stk.','Schmidt KG','L2',(now()::date + 5)::timestamptz,(now()::date + 6)::timestamptz,(now()::date + 7)::timestamptz,0,'Geplant','Normal','Tom K.','TK',4),
('PA-2026-026','Sensorkopf SK-5',37,'Stk.','Weber GmbH','M1',(now()::date + 8)::timestamptz,(now()::date + 10)::timestamptz,(now()::date + 12)::timestamptz,0,'Freigegeben','Hoch','Sara L.','SL',6),
('PA-2026-027','Zahnrad Z-44',74,'Stk.','Hoffmann SE','M2',(now()::date + 11)::timestamptz,(now()::date + 14)::timestamptz,(now()::date + 14)::timestamptz,69,'In Arbeit','Kritisch','Ben H.','BH',8);
