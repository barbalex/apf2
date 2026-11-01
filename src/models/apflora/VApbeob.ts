import type { BeobId } from './Beob.ts';
import type { AeTaxonomiesId } from './AeTaxonomies.ts';
import type { TpopId } from './Tpop.ts';
import type { ApId } from './Ap.ts';

/** Represents the view apflora.v_apbeob */
export default interface VApbeob {
  id: BeobId;

  quelle: string | null;

  id_field: string | null;

  art_id: AeTaxonomiesId | null;

  datum: string | null;

  autor: string | null;

  geom_point: unknown | null;

  data: unknown | null;

  tpop_id: TpopId | null;

  nicht_zuordnen: boolean | null;

  infoflora_informiert_datum: string | null;

  bemerkungen: string | null;

  changed_by: string | null;

  wgs84_lat: number;

  wgs84_long: number;

  ap_id: ApId | null;

  label: string;
}