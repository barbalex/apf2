import type { ApId } from './Ap.ts';
import type { PopId } from './Pop.ts';
import type { PopberId } from './Popber.ts';

/**
 * Represents the view apflora.v_pop_mit_letzter_popber
 * (pop_id) references pop (id)
 */
export default interface VPopMitLetzterPopber {
  ap_id: ApId;

  artname: string | null;

  ap_bearbeitung: string | null;

  ap_start_jahr: number | null;

  ap_umsetzung: string | null;

  pop_id: PopId;

  pop_nr: number | null;

  pop_name: string | null;

  pop_status: string | null;

  pop_bekannt_seit: number | null;

  pop_status_unklar: boolean | null;

  pop_status_unklar_begruendung: string | null;

  pop_x: number;

  pop_y: number;

  tpops_apber_relevant: string;

  tpops_apber_relevant_grund: string;

  pop_relevant_fuer_projektdoku_karten: string;

  pop_created_at: string;

  pop_updated_at: string;

  pop_changed_by: string | null;

  popber_id: PopberId;

  popber_jahr: number | null;

  popber_entwicklung: string | null;

  popber_bemerkungen: string | null;

  popber_created_at: string;

  popber_updated_at: string;

  popber_changed_by: string | null;
}