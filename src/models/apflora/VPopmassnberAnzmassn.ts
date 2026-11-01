import type { ApId } from './Ap.ts';
import type { PopId } from './Pop.ts';
import type { PopmassnberId } from './Popmassnber.ts';

/**
 * Represents the view apflora.v_popmassnber_anzmassn
 * (id) references popmassnber (id)
 */
export default interface VPopmassnberAnzmassn {
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

  id: PopmassnberId;

  jahr: number | null;

  entwicklung: string | null;

  bemerkungen: string | null;

  created_at: string;

  updated_at: string;

  changed_by: string | null;

  anzahl_massnahmen: string;
}