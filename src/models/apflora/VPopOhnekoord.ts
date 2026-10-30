import type { ApId } from './Ap.ts';
import type { PopId } from './Pop.ts';

/**
 * Represents the view apflora.v_pop_ohnekoord
 * (id) references pop (id)
 */
export default interface VPopOhnekoord {
  ap_id: ApId;

  artname: string | null;

  ap_bearbeitung: string | null;

  ap_start_jahr: number | null;

  ap_umsetzung: string | null;

  id: PopId;

  nr: number | null;

  name: string | null;

  status: string | null;

  bekannt_seit: number | null;

  status_unklar: boolean | null;

  status_unklar_begruendung: string | null;

  x: number;

  y: number;

  created_at: string;

  updated_at: string;

  changed_by: string | null;
}