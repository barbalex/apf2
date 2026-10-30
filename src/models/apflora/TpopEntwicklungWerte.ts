/** Identifier type for apflora.tpop_entwicklung_werte */
export type TpopEntwicklungWerteId = string & { __brand: 'apflora.tpop_entwicklung_werte' };

/** Represents the table apflora.tpop_entwicklung_werte */
export default interface TpopEntwicklungWerte {
  /** Primärschlüssel */
  id: TpopEntwicklungWerteId;

  code: number | null;

  text: string | null;

  sort: number | null;

  /** Von wem wurde der Datensatz zuletzt geändert? */
  changed_by: string | null;

  /** Wert wird nur angezeigt, wenn er in den Daten (noch) enthalten ist. Wird in Auswahl-Listen nicht mehr angeboten */
  historic: boolean | null;

  created_at: string;

  updated_at: string;

  old_id: string | null;
}

/** Represents the initializer for the table apflora.tpop_entwicklung_werte */
export interface TpopEntwicklungWerteInitializer {
  /**
   * Primärschlüssel
   * Default value: uuidv7()
   */
  id?: TpopEntwicklungWerteId;

  /** Default value: nextval('apflora.tpop_entwicklung_werte_code_seq'::regclass) */
  code?: number | null;

  /** Default value: NULL::character varying */
  text?: string | null;

  sort?: number | null;

  /**
   * Von wem wurde der Datensatz zuletzt geändert?
   * Default value: NULL::character varying
   */
  changed_by?: string | null;

  /**
   * Wert wird nur angezeigt, wenn er in den Daten (noch) enthalten ist. Wird in Auswahl-Listen nicht mehr angeboten
   * Default value: false
   */
  historic?: boolean | null;

  /** Default value: now() */
  created_at?: string;

  /** Default value: now() */
  updated_at?: string;

  old_id?: string | null;
}

/** Represents the mutator for the table apflora.tpop_entwicklung_werte */
export interface TpopEntwicklungWerteMutator {
  /** Primärschlüssel */
  id?: TpopEntwicklungWerteId;

  code?: number | null;

  text?: string | null;

  sort?: number | null;

  /** Von wem wurde der Datensatz zuletzt geändert? */
  changed_by?: string | null;

  /** Wert wird nur angezeigt, wenn er in den Daten (noch) enthalten ist. Wird in Auswahl-Listen nicht mehr angeboten */
  historic?: boolean | null;

  created_at?: string;

  updated_at?: string;

  old_id?: string | null;
}