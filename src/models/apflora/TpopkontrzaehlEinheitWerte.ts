/** Identifier type for apflora.tpopkontrzaehl_einheit_werte */
export type TpopkontrzaehlEinheitWerteId = string & { __brand: 'apflora.tpopkontrzaehl_einheit_werte' };

/** Represents the table apflora.tpopkontrzaehl_einheit_werte */
export default interface TpopkontrzaehlEinheitWerte {
  /** Primärschlüssel */
  id: TpopkontrzaehlEinheitWerteId;

  code: number | null;

  text: string | null;

  sort: number | null;

  /** Von wem wurde der Datensatz zuletzt geändert? */
  changed_by: string | null;

  /** Wert wird nur angezeigt, wenn er in den Daten (noch) enthalten ist. Wird in Auswahl-Listen nicht mehr angeboten */
  historic: boolean | null;

  /** Entspricht den "Anzahl Triebe" bei Massnahmen. Ermöglicht es, tpopmassn.zieleinheit_anzahl automatisch zu setzen */
  corresponds_to_massn_anz_triebe: boolean | null;

  /** Entspricht den "Anzahl Pflanzen" bei Massnahmen. Ermöglicht es, tpopmassn.zieleinheit_anzahl automatisch zu setzen */
  corresponds_to_massn_anz_pflanzen: boolean | null;

  created_at: string;

  updated_at: string;

  needs_no_methode_anzahl: boolean | null;

  old_id: string | null;
}

/** Represents the initializer for the table apflora.tpopkontrzaehl_einheit_werte */
export interface TpopkontrzaehlEinheitWerteInitializer {
  /**
   * Primärschlüssel
   * Default value: uuidv7()
   */
  id?: TpopkontrzaehlEinheitWerteId;

  /** Default value: nextval('apflora.tpopkontrzaehl_einheit_werte_code_seq'::regclass) */
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

  /**
   * Entspricht den "Anzahl Triebe" bei Massnahmen. Ermöglicht es, tpopmassn.zieleinheit_anzahl automatisch zu setzen
   * Default value: false
   */
  corresponds_to_massn_anz_triebe?: boolean | null;

  /**
   * Entspricht den "Anzahl Pflanzen" bei Massnahmen. Ermöglicht es, tpopmassn.zieleinheit_anzahl automatisch zu setzen
   * Default value: false
   */
  corresponds_to_massn_anz_pflanzen?: boolean | null;

  /** Default value: now() */
  created_at?: string;

  /** Default value: now() */
  updated_at?: string;

  /** Default value: false */
  needs_no_methode_anzahl?: boolean | null;

  old_id?: string | null;
}

/** Represents the mutator for the table apflora.tpopkontrzaehl_einheit_werte */
export interface TpopkontrzaehlEinheitWerteMutator {
  /** Primärschlüssel */
  id?: TpopkontrzaehlEinheitWerteId;

  code?: number | null;

  text?: string | null;

  sort?: number | null;

  /** Von wem wurde der Datensatz zuletzt geändert? */
  changed_by?: string | null;

  /** Wert wird nur angezeigt, wenn er in den Daten (noch) enthalten ist. Wird in Auswahl-Listen nicht mehr angeboten */
  historic?: boolean | null;

  /** Entspricht den "Anzahl Triebe" bei Massnahmen. Ermöglicht es, tpopmassn.zieleinheit_anzahl automatisch zu setzen */
  corresponds_to_massn_anz_triebe?: boolean | null;

  /** Entspricht den "Anzahl Pflanzen" bei Massnahmen. Ermöglicht es, tpopmassn.zieleinheit_anzahl automatisch zu setzen */
  corresponds_to_massn_anz_pflanzen?: boolean | null;

  created_at?: string;

  updated_at?: string;

  needs_no_methode_anzahl?: boolean | null;

  old_id?: string | null;
}