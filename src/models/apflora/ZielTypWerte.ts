/** Identifier type for apflora.ziel_typ_werte */
export type ZielTypWerteId = string & { __brand: 'apflora.ziel_typ_werte' };

/** Represents the table apflora.ziel_typ_werte */
export default interface ZielTypWerte {
  /** Primärschlüssel */
  id: ZielTypWerteId;

  code: number | null;

  /** Beschreibung des Ziels */
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

/** Represents the initializer for the table apflora.ziel_typ_werte */
export interface ZielTypWerteInitializer {
  /**
   * Primärschlüssel
   * Default value: uuidv7()
   */
  id?: ZielTypWerteId;

  /** Default value: nextval('apflora.ziel_typ_werte_code_seq'::regclass) */
  code?: number | null;

  /**
   * Beschreibung des Ziels
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

/** Represents the mutator for the table apflora.ziel_typ_werte */
export interface ZielTypWerteMutator {
  /** Primärschlüssel */
  id?: ZielTypWerteId;

  code?: number | null;

  /** Beschreibung des Ziels */
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