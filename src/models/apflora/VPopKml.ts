import type { PopId } from './Pop.ts';

/**
 * Represents the view apflora.v_pop_kml
 * (id) references pop (id)
 */
export default interface VPopKml {
  art: string | null;

  label: number | null;

  inhalte: string;

  url: string;

  id: PopId;

  wgs84_lat: number;

  wgs84_long: number;
}