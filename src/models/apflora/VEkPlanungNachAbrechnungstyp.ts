import type { ApId } from './Ap.ts';

/** Represents the view apflora.v_ek_planung_nach_abrechnungstyp */
export default interface VEkPlanungNachAbrechnungstyp {
  artname: string | null;

  ap_id: ApId;

  artverantwortlich: string | null;

  jahr: number | null;

  a: number;

  b: number;

  d: number;

  ekf: number;
}