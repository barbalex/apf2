import type { ApId } from './Ap.ts';
import type { ApHistoryYear } from './ApHistory.ts';

/**
 * Represents the view apflora.v_ap_pop_ek_prio
 * (ap_id) references ap (id)
 */
export default interface VApPopEkPrio {
  ap_id: ApId;

  artname: string | null;

  jahr_zuvor: ApHistoryYear;

  jahr_zuletzt: ApHistoryYear;

  anz_pop_urspr_zuvor: string;

  anz_pop_anges_zuvor: string;

  anz_pop_aktuell_zuvor: string;

  anz_pop_urspr_zuletzt: string;

  anz_pop_anges_zuletzt: string;

  anz_pop_aktuell_zuletzt: string;

  diff_pop_urspr: string;

  diff_pop_anges: string;

  diff_pop_aktuell: string;

  beurteilung_zuletzt: string | null;
}