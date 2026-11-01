import type { TpopId } from './Tpop.ts';

/** Represents the view apflora.v_tpop_ohneapberichtrelevant */
export default interface VTpopOhneapberichtrelevant {
  Artname: string | null;

  pop_nr: number | null;

  pop_name: string | null;

  id: TpopId;

  nr: number | null;

  gemeinde: string | null;

  flurname: string | null;

  apber_relevant: boolean | null;

  apber_relevant_grund: number | null;

  x: number;

  y: number;
}