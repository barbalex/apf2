import type { ApId } from './Ap.ts';
import type { PopId } from './Pop.ts';
import type { PopmassnberId } from './Popmassnber.ts';

/**
 * Represents the view apflora.v_pop_mit_letzter_popmassnber
 * (pop_id) references pop (id)
 */
export default interface VPopMitLetzterPopmassnber {
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

  pop_created_at: string;

  pop_updated_at: string;

  pop_changed_by: string | null;

  popmassnber_id: PopmassnberId;

  popmassnber_jahr: number | null;

  popmassnber_entwicklung: string | null;

  popmassnber_bemerkungen: string | null;

  popmassnber_created_at: string;

  popmassnber_updated_at: string;

  popmassnber_changed_by: string | null;
}