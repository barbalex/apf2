import type { ApId } from './Ap.ts';
import type { PopId } from './Pop.ts';

/**
 * Represents the view apflora.v_pop_vonapohnestatus
 * (id) references pop (id)
 */
export default interface VPopVonapohnestatus {
  ap_id: ApId;

  artname: string | null;

  ap_bearbeitung: number | null;

  id: PopId;

  nr: number | null;

  name: string | null;

  status: number | null;

  x: number;

  y: number;
}