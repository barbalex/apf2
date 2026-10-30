import type { ProjektId } from './Projekt.ts';
import type { ApId } from './Ap.ts';
import type { PopId } from './Pop.ts';

/** Represents the view apflora.v_q_pop_koordentsprechenkeinertpop */
export default interface VQPopKoordentsprechenkeinertpop {
  proj_id: ProjektId | null;

  ap_id: ApId | null;

  id: PopId;

  nr: number | null;

  x: number;

  y: number;
}