import type { TpopkontrId } from './Tpopkontr.ts';

/** Identifier type for apflora.tpopkontrzaehl */
export type TpopkontrzaehlId = string & { __brand: 'apflora.tpopkontrzaehl' };

/** Represents the table apflora.tpopkontrzaehl */
export default interface Tpopkontrzaehl {
  id: TpopkontrzaehlId;

  /** Anzahl Zaehleinheiten */
  anzahl: number | null;

  /** Verwendete Zaehleinheit. Auswahl aus Tabelle "tpopkontrzaehl_einheit_werte" */
  einheit: number | null;

  /** Verwendete Methodik. Auswahl aus Tabelle "tpopkontrzaehl_methode_werte" */
  methode: number | null;

  /** Von wem wurde der Datensatz zuletzt geändert? */
  changed_by: string | null;

  tpopkontr_id: TpopkontrId | null;

  created_at: string;

  updated_at: string;

  old_id: string | null;
}

/** Represents the initializer for the table apflora.tpopkontrzaehl */
export interface TpopkontrzaehlInitializer {
  /** Default value: uuidv7() */
  id?: TpopkontrzaehlId;

  /** Anzahl Zaehleinheiten */
  anzahl?: number | null;

  /** Verwendete Zaehleinheit. Auswahl aus Tabelle "tpopkontrzaehl_einheit_werte" */
  einheit?: number | null;

  /** Verwendete Methodik. Auswahl aus Tabelle "tpopkontrzaehl_methode_werte" */
  methode?: number | null;

  /**
   * Von wem wurde der Datensatz zuletzt geändert?
   * Default value: NULL::character varying
   */
  changed_by?: string | null;

  tpopkontr_id?: TpopkontrId | null;

  /** Default value: now() */
  created_at?: string;

  /** Default value: now() */
  updated_at?: string;

  old_id?: string | null;
}

/** Represents the mutator for the table apflora.tpopkontrzaehl */
export interface TpopkontrzaehlMutator {
  id?: TpopkontrzaehlId;

  /** Anzahl Zaehleinheiten */
  anzahl?: number | null;

  /** Verwendete Zaehleinheit. Auswahl aus Tabelle "tpopkontrzaehl_einheit_werte" */
  einheit?: number | null;

  /** Verwendete Methodik. Auswahl aus Tabelle "tpopkontrzaehl_methode_werte" */
  methode?: number | null;

  /** Von wem wurde der Datensatz zuletzt geändert? */
  changed_by?: string | null;

  tpopkontr_id?: TpopkontrId | null;

  created_at?: string;

  updated_at?: string;

  old_id?: string | null;
}