import type { TpopId } from './Tpop.ts';
import type { EkfrequenzId } from './Ekfrequenz.ts';

/** Represents the view apflora.v_tpop_ekfrequenz_to_set_nie */
export default interface VTpopEkfrequenzToSetNie {
  artname: string | null;

  pop_nr: number | null;

  id: TpopId;

  nr: number | null;

  status_code: number | null;

  status_text: string | null;

  status_code_2019: number | null;

  status_text_2019: string | null;

  ekfrequenz_id: EkfrequenzId | null;

  ekfrequenz_code: string | null;

  ekfrequenz_to_set_id: EkfrequenzId;

  ekfrequenz_to_set_code: string | null;
}