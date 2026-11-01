import type { ApId } from './Ap.ts';
import type { ApHistoryYear } from './ApHistory.ts';

/** Represents the view apflora.v_ap_ausw_pop_status */
export default interface VApAuswPopStatus {
  ap_id: ApId | null;

  jahr: ApHistoryYear;

  values: unknown;
}