import type { ApId } from './Ap.ts';

/**
 * Represents the view apflora.v_ap_anzmassn
 * (id) references ap (id)
 */
export default interface VApAnzmassn {
  id: ApId;

  anzahl_massnahmen: string;
}