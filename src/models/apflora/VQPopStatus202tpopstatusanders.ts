import type { ProjektId } from './Projekt.ts';
import type { ApId } from './Ap.ts';
import type { PopId } from './Pop.ts';

/** Represents the view apflora.v_q_pop_status202tpopstatusanders */
export default interface VQPopStatus202tpopstatusanders {
  proj_id: ProjektId;

  ap_id: ApId;

  id: PopId;

  nr: number | null;
}