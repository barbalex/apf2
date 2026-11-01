import type { ProjektId } from './Projekt.ts';
import type { ApId } from './Ap.ts';
import type { EkzaehleinheitId } from './Ekzaehleinheit.ts';

/** Represents the view apflora.v_q_ekzieleinheit_ohne_massn_zaehleinheit */
export default interface VQEkzieleinheitOhneMassnZaehleinheit {
  proj_id: ProjektId | null;

  ap_id: ApId;

  id: EkzaehleinheitId;

  artname: string | null;

  zaehleinheit: string | null;
}