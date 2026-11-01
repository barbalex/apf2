import type { BeobId } from './Beob.ts';
import type { AeTaxonomiesId } from './AeTaxonomies.ts';
import type { PopId } from './Pop.ts';
import type { TpopId } from './Tpop.ts';

/** Represents the view apflora.v_beob_art_changed */
export default interface VBeobArtChanged {
  id: BeobId;

  quelle: string | null;

  id_field: string | null;

  original_id: string;

  art_id_original: AeTaxonomiesId | null;

  artname_original: string | null;

  taxonomie_id_original: number | null;

  art_id: AeTaxonomiesId | null;

  artname: string | null;

  taxonomie_id: number | null;

  pop_id: PopId;

  pop_nr: number | null;

  tpop_id: TpopId;

  tpop_nr: number | null;

  tpop_status: string | null;

  tpop_gemeinde: string | null;

  tpop_flurname: string | null;

  x: number;

  y: number;

  distanz_zur_teilpopulation: number;

  datum: string | null;

  autor: string | null;

  nicht_zuordnen: boolean | null;

  geom_point: unknown | null;

  bemerkungen: string | null;

  created_at: string;

  updated_at: string;

  changed_by: string | null;
}