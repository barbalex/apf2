import type { ProjektId } from './Projekt.ts';
import type { ApId } from './Ap.ts';
import type { PopId } from './Pop.ts';

/** Represents the view apflora.v_q_pop_urspruenglich_wiederauferstanden */
export default interface VQPopUrspruenglichWiederauferstanden {
  proj_id: ProjektId;

  artname: string | null;

  ap_id: ApId;

  id: PopId;

  nr: number | null;

  jahr: number | null;
}