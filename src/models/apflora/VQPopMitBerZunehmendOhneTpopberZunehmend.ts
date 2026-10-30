import type { ProjektId } from './Projekt.ts';
import type { ApId } from './Ap.ts';
import type { PopId } from './Pop.ts';

/** Represents the view apflora.v_q_pop_mit_ber_zunehmend_ohne_tpopber_zunehmend */
export default interface VQPopMitBerZunehmendOhneTpopberZunehmend {
  proj_id: ProjektId | null;

  ap_id: ApId;

  id: PopId;

  nr: number | null;

  berichtjahr: number | null;
}