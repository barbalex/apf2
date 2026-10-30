/** Identifier type for apflora.ek_abrechnungstyp_werte */
export type EkAbrechnungstypWerteId = string & { __brand: 'apflora.ek_abrechnungstyp_werte' };

/** Represents the table apflora.ek_abrechnungstyp_werte */
export default interface EkAbrechnungstypWerte {
  /** Primärschlüssel */
  id: EkAbrechnungstypWerteId;

  code: string | null;

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

/** Represents the initializer for the table apflora.ek_abrechnungstyp_werte */
export interface EkAbrechnungstypWerteInitializer {
  /**
   * Primärschlüssel
   * Default value: uuidv7()
   */
  id?: EkAbrechnungstypWerteId;

  code?: string | null;

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

/** Represents the mutator for the table apflora.ek_abrechnungstyp_werte */
export interface EkAbrechnungstypWerteMutator {
  /** Primärschlüssel */
  id?: EkAbrechnungstypWerteId;

  code?: string | null;

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