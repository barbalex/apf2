/** Identifier type for apflora.tpopkontr_idbiotuebereinst_werte */
export type TpopkontrIdbiotuebereinstWerteId = string & { __brand: 'apflora.tpopkontr_idbiotuebereinst_werte' };

/** Represents the table apflora.tpopkontr_idbiotuebereinst_werte */
export default interface TpopkontrIdbiotuebereinstWerte {
  /** Primärschlüssel */
  id: TpopkontrIdbiotuebereinstWerteId;

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

/** Represents the initializer for the table apflora.tpopkontr_idbiotuebereinst_werte */
export interface TpopkontrIdbiotuebereinstWerteInitializer {
  /**
   * Primärschlüssel
   * Default value: uuidv7()
   */
  id?: TpopkontrIdbiotuebereinstWerteId;

  /** Default value: nextval('apflora.tpopkontr_idbiotuebereinst_werte_code_seq'::regclass) */
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

/** Represents the mutator for the table apflora.tpopkontr_idbiotuebereinst_werte */
export interface TpopkontrIdbiotuebereinstWerteMutator {
  /** Primärschlüssel */
  id?: TpopkontrIdbiotuebereinstWerteId;

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