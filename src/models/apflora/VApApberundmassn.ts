import type { ApId } from './Ap.ts';

/**
 * Represents the view apflora.v_ap_apberundmassn
 * (id) references ap (id)
 */
export default interface VApApberundmassn {
  id: ApId;

  massn_jahr: number | null;

  massn_anzahl: string;

  massn_anzahl_bisher: number;

  bericht_erstellt: string;
}