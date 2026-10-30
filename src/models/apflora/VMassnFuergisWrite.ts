import type { TpopId } from './Tpop.ts';
import type { AdresseId } from './Adresse.ts';

/** Represents the view apflora.v_massn_fuergis_write */
export default interface VMassnFuergisWrite {
  tpop_id: TpopId | null;

  massn_id: string;

  massn_typ: number | null;

  massn_jahr: number | null;

  massn_datum: string;

  massn_bearbeiter: AdresseId | null;

  massn_beschreibung: string | null;

  massn_plan_vorhanden: boolean | null;

  massn_plan_bezeichnung: string | null;

  massn_flaeche: number | null;

  massn_form: string | null;

  massn_pflanzanordnung: string | null;

  massn_markierung: string | null;

  massn_anz_triebe: number | null;

  massn_anz_pflanzen: number | null;

  massn_anz_pflanzstellen: number | null;

  massn_zieleinheit_einheit: number | null;

  massn_zieleinheit_anzahl: number | null;

  massn_wirtspflanze: string | null;

  massn_herkunft_pop: string | null;

  massn_sammeldatum: string | null;

  massn_von_anzahl_individuen: number | null;

  massn_bemerkungen: string | null;

  massn_created_at: string;

  massn_updated_at: string;

  massn_changed_by: string | null;
}