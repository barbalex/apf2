import type { ApId } from './Ap.ts';
import type { AeTaxonomiesId } from './AeTaxonomies.ts';

/** Identifier type for apflora.apart */
export type ApartId = string & { __brand: 'apflora.apart' };

/** Represents the table apflora.apart */
export default interface Apart {
  /** Primärschlüssel */
  id: ApartId;

  /** Wer hat den Datensatz zuletzt geändert? */
  changed_by: string | null;

  /** Zugehöriger Aktionsplan. Fremdschlüssel aus der Tabelle "ap" */
  ap_id: ApId | null;

  art_id: AeTaxonomiesId | null;

  created_at: string;

  updated_at: string | null;

  old_id: string | null;
}

/** Represents the initializer for the table apflora.apart */
export interface ApartInitializer {
  /**
   * Primärschlüssel
   * Default value: uuidv7()
   */
  id?: ApartId;

  /**
   * Wer hat den Datensatz zuletzt geändert?
   * Default value: NULL::character varying
   */
  changed_by?: string | null;

  /** Zugehöriger Aktionsplan. Fremdschlüssel aus der Tabelle "ap" */
  ap_id?: ApId | null;

  art_id?: AeTaxonomiesId | null;

  /** Default value: now() */
  created_at?: string;

  /** Default value: now() */
  updated_at?: string | null;

  old_id?: string | null;
}

/** Represents the mutator for the table apflora.apart */
export interface ApartMutator {
  /** Primärschlüssel */
  id?: ApartId;

  /** Wer hat den Datensatz zuletzt geändert? */
  changed_by?: string | null;

  /** Zugehöriger Aktionsplan. Fremdschlüssel aus der Tabelle "ap" */
  ap_id?: ApId | null;

  art_id?: AeTaxonomiesId | null;

  created_at?: string;

  updated_at?: string | null;

  old_id?: string | null;
}