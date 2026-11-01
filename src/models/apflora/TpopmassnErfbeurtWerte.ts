/** Identifier type for apflora.tpopmassn_erfbeurt_werte */
export type TpopmassnErfbeurtWerteId = string & { __brand: 'apflora.tpopmassn_erfbeurt_werte' };

/** Represents the table apflora.tpopmassn_erfbeurt_werte */
export default interface TpopmassnErfbeurtWerte {
  /** Primärschlüssel */
  id: TpopmassnErfbeurtWerteId;

  code: number | null;

  /** Wie werden die durchgefuehrten Massnahmen beurteilt? */
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

/** Represents the initializer for the table apflora.tpopmassn_erfbeurt_werte */
export interface TpopmassnErfbeurtWerteInitializer {
  /**
   * Primärschlüssel
   * Default value: uuidv7()
   */
  id?: TpopmassnErfbeurtWerteId;

  /** Default value: nextval('apflora.tpopmassn_erfbeurt_werte_code_seq'::regclass) */
  code?: number | null;

  /**
   * Wie werden die durchgefuehrten Massnahmen beurteilt?
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

/** Represents the mutator for the table apflora.tpopmassn_erfbeurt_werte */
export interface TpopmassnErfbeurtWerteMutator {
  /** Primärschlüssel */
  id?: TpopmassnErfbeurtWerteId;

  code?: number | null;

  /** Wie werden die durchgefuehrten Massnahmen beurteilt? */
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