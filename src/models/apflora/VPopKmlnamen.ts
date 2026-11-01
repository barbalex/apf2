import type { PopId } from './Pop.ts';

/**
 * Represents the view apflora.v_pop_kmlnamen
 * (id) references pop (id)
 */
export default interface VPopKmlnamen {
  art: string | null;

  label: string;

  inhalte: string;

  url: string;

  id: PopId;

  wgs84_lat: number;

  wgs84_long: number;
}