import type { ApId } from './Ap.ts';

/**
 * Represents the view apflora.v_ap_anzkontr
 * (id) references ap (id)
 */
export default interface VApAnzkontr {
  id: ApId;

  anzahl_kontrollen: string;
}