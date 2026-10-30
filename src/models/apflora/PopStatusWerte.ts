/** Identifier type for apflora.pop_status_werte */
export type PopStatusWerteId = string & { __brand: 'apflora.pop_status_werte' };

/** Represents the table apflora.pop_status_werte */
export default interface PopStatusWerte {
  /** Primärschlüssel */
  id: PopStatusWerteId;

  code: number | null;

  /** Beschreibung der Herkunft */
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

/** Represents the initializer for the table apflora.pop_status_werte */
export interface PopStatusWerteInitializer {
  /**
   * Primärschlüssel
   * Default value: uuidv7()
   */
  id?: PopStatusWerteId;

  /** Default value: nextval('apflora.pop_status_werte_code_seq'::regclass) */
  code?: number | null;

  /**
   * Beschreibung der Herkunft
   * Default value: NULL::character varying
   */
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

/** Represents the mutator for the table apflora.pop_status_werte */
export interface PopStatusWerteMutator {
  /** Primärschlüssel */
  id?: PopStatusWerteId;

  code?: number | null;

  /** Beschreibung der Herkunft */
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