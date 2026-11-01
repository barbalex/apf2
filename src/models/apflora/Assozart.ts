import type { AeTaxonomiesId } from './AeTaxonomies.ts';
import type { ApId } from './Ap.ts';

/** Identifier type for apflora.assozart */
export type AssozartId = string & { __brand: 'apflora.assozart' };

/** Represents the table apflora.assozart */
export default interface Assozart {
  /** Primärschlüssel */
  id: AssozartId;

  /** Bemerkungen zur Assoziation */
  bemerkungen: string | null;

  /** Wer hat den Datensatz zuletzt geändert? */
  changed_by: string | null;

  ae_id: AeTaxonomiesId | null;

  /** Zugehöriger Aktionsplan. Fremdschlüssel aus der Tabelle "ap" */
  ap_id: ApId | null;

  created_at: string;

  updated_at: string;

  old_id: string | null;
}

/** Represents the initializer for the table apflora.assozart */
export interface AssozartInitializer {
  /**
   * Primärschlüssel
   * Default value: uuidv7()
   */
  id?: AssozartId;

  /** Bemerkungen zur Assoziation */
  bemerkungen?: string | null;

  /**
   * Wer hat den Datensatz zuletzt geändert?
   * Default value: NULL::character varying
   */
  changed_by?: string | null;

  ae_id?: AeTaxonomiesId | null;

  /** Zugehöriger Aktionsplan. Fremdschlüssel aus der Tabelle "ap" */
  ap_id?: ApId | null;

  /** Default value: now() */
  created_at?: string;

  /** Default value: now() */
  updated_at?: string;

  old_id?: string | null;
}

/** Represents the mutator for the table apflora.assozart */
export interface AssozartMutator {
  /** Primärschlüssel */
  id?: AssozartId;

  /** Bemerkungen zur Assoziation */
  bemerkungen?: string | null;

  /** Wer hat den Datensatz zuletzt geändert? */
  changed_by?: string | null;

  ae_id?: AeTaxonomiesId | null;

  /** Zugehöriger Aktionsplan. Fremdschlüssel aus der Tabelle "ap" */
  ap_id?: ApId | null;

  created_at?: string;

  updated_at?: string;

  old_id?: string | null;
}