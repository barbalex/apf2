/** Identifier type for apflora.projekt */
export type ProjektId = string & { __brand: 'apflora.projekt' };

/** Represents the table apflora.projekt */
export default interface Projekt {
  id: ProjektId;

  name: string | null;

  /** Von wem wurde der Datensatz zuletzt geändert? */
  changed_by: string | null;

  created_at: string;

  updated_at: string;

  old_id: string | null;
}

/** Represents the initializer for the table apflora.projekt */
export interface ProjektInitializer {
  /** Default value: uuidv7() */
  id?: ProjektId;

  /** Default value: NULL::character varying */
  name?: string | null;

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

/** Represents the mutator for the table apflora.projekt */
export interface ProjektMutator {
  id?: ProjektId;

  name?: string | null;

  /** Von wem wurde der Datensatz zuletzt geändert? */
  changed_by?: string | null;

  created_at?: string;

  updated_at?: string;

  old_id?: string | null;
}