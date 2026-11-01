import type { ProjektId } from './Projekt.ts';
import type { ApId } from './Ap.ts';
import type { PopId } from './Pop.ts';
import type { TpopId } from './Tpop.ts';
import type { TpopmassnId } from './Tpopmassn.ts';

/** Represents the view apflora.v_q_anpflanzung_zielrelevante_anzahl_falsch */
export default interface VQAnpflanzungZielrelevanteAnzahlFalsch {
  proj_id: ProjektId | null;

  ap_id: ApId;

  pop_id: PopId;

  pop_nr: number | null;

  tpop_id: TpopId;

  tpop_nr: number | null;

  id: TpopmassnId;

  jahr: number | null;

  ek_zieleinheit: string | null;

  zieleinheit_anzahl: number | null;

  anzahl: number;
}