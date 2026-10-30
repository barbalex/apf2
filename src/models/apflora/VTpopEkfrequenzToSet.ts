import type { ApId } from './Ap.ts';
import type { TpopId } from './Tpop.ts';
import type { default as public_EkKontrolljahreAb } from '../public/EkKontrolljahreAb.ts';

/** Represents the view apflora.v_tpop_ekfrequenz_to_set */
export default interface VTpopEkfrequenzToSet {
  artname: string | null;

  ap_id: ApId;

  pop_nr: number | null;

  pop_status: number | null;

  tpop_id: TpopId;

  tpop_nr: number | null;

  tpop_status: number | null;

  kontrolljahre_ab: public_EkKontrolljahreAb | null;

  ekfrequenz_startjahr: number;

  letzte_anzahl: number;

  ekfrequenz_code: string;

  ekfrequenz: string;
}