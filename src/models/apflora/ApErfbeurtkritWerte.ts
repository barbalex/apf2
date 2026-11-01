/** Identifier type for apflora.ap_erfbeurtkrit_werte */
export type ApErfbeurtkritWerteId = string & { __brand: 'apflora.ap_erfbeurtkrit_werte' };

/** Represents the table apflora.ap_erfbeurtkrit_werte */
export default interface ApErfbeurtkritWerte {
  /** Primärschlüssel */
  id: ApErfbeurtkritWerteId;

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

/** Represents the initializer for the table apflora.ap_erfbeurtkrit_werte */
export interface ApErfbeurtkritWerteInitializer {
  /**
   * Primärschlüssel
   * Default value: uuidv7()
   */
  id?: ApErfbeurtkritWerteId;

  /** Default value: nextval('apflora.ap_erfbeurtkrit_werte_code_seq'::regclass) */
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

/** Represents the mutator for the table apflora.ap_erfbeurtkrit_werte */
export interface ApErfbeurtkritWerteMutator {
  /** Primärschlüssel */
  id?: ApErfbeurtkritWerteId;

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