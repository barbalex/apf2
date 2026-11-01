import type { ProjektId } from './Projekt.ts';
import type { ApId } from './Ap.ts';
import type { PopId } from './Pop.ts';
import type { TpopId } from './Tpop.ts';

/** Represents the view apflora.v_q_tpop_mitstatuspotentiellundzaehlungmitanzahl */
export default interface VQTpopMitstatuspotentiellundzaehlungmitanzahl {
  proj_id: ProjektId;

  ap_id: ApId | null;

  pop_id: PopId;

  pop_nr: number | null;

  id: TpopId;

  nr: number | null;
}