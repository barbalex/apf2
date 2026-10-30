import type { ProjektId } from './Projekt.ts';
import type { ApId } from './Ap.ts';
import type { PopId } from './Pop.ts';
import type { TpopId } from './Tpop.ts';

/** Represents the view apflora.v_q_tpop_erloschen_mit_ekplan_nach_letztem_tpopber */
export default interface VQTpopErloschenMitEkplanNachLetztemTpopber {
  proj_id: ProjektId;

  ap_id: ApId;

  pop_id: PopId;

  pop_nr: number | null;

  id: TpopId;

  nr: number | null;
}