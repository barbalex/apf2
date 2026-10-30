import type { ApId } from './Ap.ts';

/** Represents the view apflora.v_pop_fuergis_read */
export default interface VPopFuergisRead {
  ap_id: ApId;

  artname: string | null;

  ap_bearbeitung: string | null;

  ap_start_jahr: number | null;

  ap_umsetzung: string | null;

  id: string;

  nr: number | null;

  name: string | null;

  status: string | null;

  bekannt_seit: number | null;

  status_unklar: boolean | null;

  status_unklar_begruendung: string | null;

  x: number;

  y: number;

  created_at: string;

  updated_at: string;

  changed_by: string | null;
}