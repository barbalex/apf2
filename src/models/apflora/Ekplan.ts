import type { TpopId } from './Tpop.ts';
import type { default as public_EkType } from '../public/EkType.ts';

/** Identifier type for apflora.ekplan */
export type EkplanId = string & { __brand: 'apflora.ekplan' };

/** Represents the table apflora.ekplan */
export default interface Ekplan {
  /** Primärschlüssel */
  id: EkplanId;

  /** Fremdschlüssel aus der Tabelle tpop */
  tpop_id: TpopId | null;

  /** Jahr, in dem eine EK geplant ist */
  jahr: number | null;

  /** ek oder ekf */
  typ: public_EkType | null;

  /** Von wem wurde der Datensatz zuletzt geändert? */
  changed_by: string | null;

  created_at: string;

  updated_at: string;

  old_id: string | null;
}

/** Represents the initializer for the table apflora.ekplan */
export interface EkplanInitializer {
  /**
   * Primärschlüssel
   * Default value: uuidv7()
   */
  id?: EkplanId;

  /** Fremdschlüssel aus der Tabelle tpop */
  tpop_id?: TpopId | null;

  /** Jahr, in dem eine EK geplant ist */
  jahr?: number | null;

  /** ek oder ekf */
  typ?: public_EkType | null;

  /**
   * Von wem wurde der Datensatz zuletzt geändert?
   * Default value: NULL::character varying
   */
  changed_by?: string | null;

  /** Default value: now() */
  created_at?: string;

  /** Default value: now() */
  updated_at?: string;

  old_id?: string | null;
}

/** Represents the mutator for the table apflora.ekplan */
export interface EkplanMutator {
  /** Primärschlüssel */
  id?: EkplanId;

  /** Fremdschlüssel aus der Tabelle tpop */
  tpop_id?: TpopId | null;

  /** Jahr, in dem eine EK geplant ist */
  jahr?: number | null;

  /** ek oder ekf */
  typ?: public_EkType | null;

  /** Von wem wurde der Datensatz zuletzt geändert? */
  changed_by?: string | null;

  created_at?: string;

  updated_at?: string;

  old_id?: string | null;
}