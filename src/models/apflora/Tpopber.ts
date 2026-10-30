import type { TpopId } from './Tpop.ts';

/** Identifier type for apflora.tpopber */
export type TpopberId = string & { __brand: 'apflora.tpopber' };

/**
 * Represents the table apflora.tpopber
 * (tpop_id) references tpop_history (id)
 */
export default interface Tpopber {
  id: TpopberId;

  /** Für welches Jahr gilt der Bericht? */
  jahr: number | null;

  /** Beurteilung der Populationsentwicklung: Auswahl aus Tabelle "tpop_entwicklung_werte" */
  entwicklung: number | null;

  /** Bemerkungen zur Beurteilung */
  bemerkungen: string | null;

  /** Von wem wurde der Datensatz zuletzt geändert? */
  changed_by: string | null;

  /** Zugehörige Teilpopulation. Fremdschlüssel der Tabelle "tpop" */
  tpop_id: TpopId | null;

  created_at: string;

  updated_at: string;

  old_id: string | null;
}

/**
 * Represents the initializer for the table apflora.tpopber
 * (tpop_id) references tpop_history (id)
 */
export interface TpopberInitializer {
  /** Default value: uuidv7() */
  id?: TpopberId;

  /** Für welches Jahr gilt der Bericht? */
  jahr?: number | null;

  /** Beurteilung der Populationsentwicklung: Auswahl aus Tabelle "tpop_entwicklung_werte" */
  entwicklung?: number | null;

  /** Bemerkungen zur Beurteilung */
  bemerkungen?: string | null;

  /**
   * Von wem wurde der Datensatz zuletzt geändert?
   * Default value: NULL::character varying
   */
  changed_by?: string | null;

  /** Zugehörige Teilpopulation. Fremdschlüssel der Tabelle "tpop" */
  tpop_id?: TpopId | null;

  /** Default value: now() */
  created_at?: string;

  /** Default value: now() */
  updated_at?: string;

  old_id?: string | null;
}

/**
 * Represents the mutator for the table apflora.tpopber
 * (tpop_id) references tpop_history (id)
 */
export interface TpopberMutator {
  id?: TpopberId;

  /** Für welches Jahr gilt der Bericht? */
  jahr?: number | null;

  /** Beurteilung der Populationsentwicklung: Auswahl aus Tabelle "tpop_entwicklung_werte" */
  entwicklung?: number | null;

  /** Bemerkungen zur Beurteilung */
  bemerkungen?: string | null;

  /** Von wem wurde der Datensatz zuletzt geändert? */
  changed_by?: string | null;

  /** Zugehörige Teilpopulation. Fremdschlüssel der Tabelle "tpop" */
  tpop_id?: TpopId | null;

  created_at?: string;

  updated_at?: string;

  old_id?: string | null;
}