-- Issue 847: Ziel-Einheit von Anpflanzungen wird nicht immer automatisch gesetzt.
-- Bisher setzte nur das Formular (Tpopmassn.tsx) zieleinheit_einheit/zieleinheit_anzahl —
-- racy (Typ und Anzahl Triebe/Pflanzen kurz hintereinander gespeichert liest je das
-- noch alte row des anderen Feldes) und wirkungslos für alle anderen Schreibwege
-- (Kopieren, Verschieben, Imports, historische Daten).
-- Der Trigger verlagert die Logik in die Datenbank und gilt für jeden Schreibweg:
-- - Typ Anpflanzung (tpopmassn_typ_werte.anpflanzung) + Art hat zielrelevante
--   Zähleinheit (max. eine, Unique-Index) → zieleinheit_einheit wird gesetzt
--   bei neu / Typ-Wechsel / TPop-Wechsel
-- - zieleinheit_anzahl spiegelt anz_triebe bzw. anz_pflanzen, wenn die
--   Zähleinheit einen der beiden Korrespondenz-Flags hat und die Art nicht
--   bewusst not_massn_count_unit gesetzt hat
-- - nur bei Änderung der steuernden Felder; manuell erfasste Werte überleben
--   sonstige Speicherungen unverändert (wie bisher im Formular)

DROP TRIGGER IF EXISTS tpopmassn_set_zieleinheit ON apflora.tpopmassn;

DROP FUNCTION IF EXISTS apflora.tpopmassn_set_zieleinheit ();

CREATE FUNCTION apflora.tpopmassn_set_zieleinheit ()
  RETURNS TRIGGER
  AS $tpopmassn_set_zieleinheit$
DECLARE
  zieleinheit_code integer;
  entspricht_anz_triebe boolean;
  entspricht_anz_pflanzen boolean;
  not_massn_count_unit boolean;
BEGIN
  -- ohne Änderung eines steuernden Feldes nichts ableiten
  IF TG_OP = 'UPDATE' AND NEW.typ IS NOT DISTINCT FROM OLD.typ
    AND NEW.tpop_id IS NOT DISTINCT FROM OLD.tpop_id
    AND NEW.anz_triebe IS NOT DISTINCT FROM OLD.anz_triebe
    AND NEW.anz_pflanzen IS NOT DISTINCT FROM OLD.anz_pflanzen
    AND NEW.zieleinheit_einheit IS NOT DISTINCT FROM OLD.zieleinheit_einheit THEN
    RETURN NEW;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM apflora.tpopmassn_typ_werte w
    WHERE w.code = NEW.typ AND w.anpflanzung = TRUE) THEN
    RETURN NEW;
  END IF;

  SELECT
    einheit_werte.code,
    einheit_werte.corresponds_to_massn_anz_triebe,
    einheit_werte.corresponds_to_massn_anz_pflanzen,
    COALESCE(ekzaehleinheit.not_massn_count_unit, FALSE)
  INTO
    zieleinheit_code,
    entspricht_anz_triebe,
    entspricht_anz_pflanzen,
    not_massn_count_unit
  FROM
    apflora.tpop tpop
    INNER JOIN apflora.pop pop ON pop.id = tpop.pop_id
    INNER JOIN apflora.ap ap ON ap.id = pop.ap_id
    INNER JOIN apflora.ekzaehleinheit ekzaehleinheit
      ON ekzaehleinheit.ap_id = ap.id AND ekzaehleinheit.zielrelevant = TRUE
    INNER JOIN apflora.tpopkontrzaehl_einheit_werte einheit_werte
      ON einheit_werte.id = ekzaehleinheit.zaehleinheit_id
  WHERE tpop.id = NEW.tpop_id;

  -- Art ohne zielrelevante Zähleinheit: nichts ableitbar
  IF zieleinheit_code IS NULL THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' OR NEW.typ IS DISTINCT FROM OLD.typ OR NEW.tpop_id IS DISTINCT FROM OLD.tpop_id THEN
    NEW.zieleinheit_einheit := zieleinheit_code;
  END IF;

  IF NOT not_massn_count_unit AND NEW.zieleinheit_einheit = zieleinheit_code THEN
    IF entspricht_anz_triebe THEN
      NEW.zieleinheit_anzahl := NEW.anz_triebe;
    ELSIF entspricht_anz_pflanzen THEN
      NEW.zieleinheit_anzahl := NEW.anz_pflanzen;
    END IF;
  END IF;

  RETURN NEW;
END;
$tpopmassn_set_zieleinheit$
LANGUAGE plpgsql;

CREATE TRIGGER tpopmassn_set_zieleinheit
  BEFORE UPDATE OR INSERT ON apflora.tpopmassn
  FOR EACH ROW
  EXECUTE PROCEDURE apflora.tpopmassn_set_zieleinheit ();
