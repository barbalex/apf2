import type { TpopId } from './Tpop.ts';

/** Represents the view apflora.v_tpop_ohnebekanntseit */
export default interface VTpopOhnebekanntseit {
  artname: string | null;

  ap_bearbeitung: string | null;

  pop_nr: number | null;

  pop_name: string | null;

  nr: number | null;

  gemeinde: string | null;

  flurname: string | null;

  bekannt_seit: number | null;

  id: TpopId;

  x: number;

  y: number;
}