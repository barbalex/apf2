import type { ApId } from './Ap.ts';
import type { TpopkontrzaehlEinheitWerteId } from './TpopkontrzaehlEinheitWerte.ts';

/** Identifier type for apflora.ekzaehleinheit */
export type EkzaehleinheitId = string & { __brand: 'apflora.ekzaehleinheit' };

/** Represents the table apflora.ekzaehleinheit */
export default interface Ekzaehleinheit {
  /** Primärschlüssel */
  id: EkzaehleinheitId;

  /** Zugehöriger Aktionsplan. Fremdschlüssel aus der Tabelle "ap" */
  ap_id: ApId;

  /** Zugehörige Zähleinheit. Fremdschlüssel aus der Tabelle "tpopkontrzaehl_einheit_werte" */
  zaehleinheit_id: TpopkontrzaehlEinheitWerteId | null;

  /** Ob die Zähleinheit zielrelevant ist */
  zielrelevant: boolean | null;

  /** Um die Zähleinheiten untereinander zu sortieren */
  sort: number | null;

  /** Bemerkungen zur EK-Zähleinheit */
  bemerkungen: string | null;

  /** Wer hat den Datensatz zuletzt geändert? */
  changed_by: string | null;

  /** Deklariert, dass bewusst keine der zwei Zähleinheiten von Massnahmen gewählt wurde. Ermöglicht, dass eine Qualitätskontrolle auflistet, wo unbewusst Zieleinheiten gewählt wurden, welche keiner der zwei Zähleinheiten von Massnahmen entsprechen */
  not_massn_count_unit: boolean | null;

  created_at: string;

  updated_at: string;

  old_id: string | null;
}

/** Represents the initializer for the table apflora.ekzaehleinheit */
export interface EkzaehleinheitInitializer {
  /**
   * Primärschlüssel
   * Default value: uuidv7()
   */
  id?: EkzaehleinheitId;

  /** Zugehöriger Aktionsplan. Fremdschlüssel aus der Tabelle "ap" */
  ap_id: ApId;

  /** Zugehörige Zähleinheit. Fremdschlüssel aus der Tabelle "tpopkontrzaehl_einheit_werte" */
  zaehleinheit_id?: TpopkontrzaehlEinheitWerteId | null;

  /**
   * Ob die Zähleinheit zielrelevant ist
   * Default value: false
   */
  zielrelevant?: boolean | null;

  /** Um die Zähleinheiten untereinander zu sortieren */
  sort?: number | null;

  /** Bemerkungen zur EK-Zähleinheit */
  bemerkungen?: string | null;

  /**
   * Wer hat den Datensatz zuletzt geändert?
   * Default value: NULL::character varying
   */
  changed_by?: string | null;

  /**
   * Deklariert, dass bewusst keine der zwei Zähleinheiten von Massnahmen gewählt wurde. Ermöglicht, dass eine Qualitätskontrolle auflistet, wo unbewusst Zieleinheiten gewählt wurden, welche keiner der zwei Zähleinheiten von Massnahmen entsprechen
   * Default value: false
   */
  not_massn_count_unit?: boolean | null;

  /** Default value: now() */
  created_at?: string;

  /** Default value: now() */
  updated_at?: string;

  old_id?: string | null;
}

/** Represents the mutator for the table apflora.ekzaehleinheit */
export interface EkzaehleinheitMutator {
  /** Primärschlüssel */
  id?: EkzaehleinheitId;

  /** Zugehöriger Aktionsplan. Fremdschlüssel aus der Tabelle "ap" */
  ap_id?: ApId;

  /** Zugehörige Zähleinheit. Fremdschlüssel aus der Tabelle "tpopkontrzaehl_einheit_werte" */
  zaehleinheit_id?: TpopkontrzaehlEinheitWerteId | null;

  /** Ob die Zähleinheit zielrelevant ist */
  zielrelevant?: boolean | null;

  /** Um die Zähleinheiten untereinander zu sortieren */
  sort?: number | null;

  /** Bemerkungen zur EK-Zähleinheit */
  bemerkungen?: string | null;

  /** Wer hat den Datensatz zuletzt geändert? */
  changed_by?: string | null;

  /** Deklariert, dass bewusst keine der zwei Zähleinheiten von Massnahmen gewählt wurde. Ermöglicht, dass eine Qualitätskontrolle auflistet, wo unbewusst Zieleinheiten gewählt wurden, welche keiner der zwei Zähleinheiten von Massnahmen entsprechen */
  not_massn_count_unit?: boolean | null;

  created_at?: string;

  updated_at?: string;

  old_id?: string | null;
}