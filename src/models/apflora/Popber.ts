import type { PopId } from './Pop.ts';

/** Identifier type for apflora.popber */
export type PopberId = string & { __brand: 'apflora.popber' };

/** Represents the table apflora.popber */
export default interface Popber {
  /** Primärschlüssel */
  id: PopberId;

  /** Für welches Jahr gilt der Bericht? */
  jahr: number | null;

  /** Beurteilung der Populationsentwicklung: Auswahl aus Tabelle "tpop_entwicklung_werte" */
  entwicklung: number | null;

  /** Bemerkungen zur Beurteilung */
  bemerkungen: string | null;

  /** Von wem wurde der Datensatz zuletzt geändert? */
  changed_by: string | null;

  /** Zugehörige Population. Fremdschlüssel aus der Tabelle "pop" */
  pop_id: PopId | null;

  created_at: string;

  updated_at: string;

  old_id: string | null;
}

/** Represents the initializer for the table apflora.popber */
export interface PopberInitializer {
  /**
   * Primärschlüssel
   * Default value: uuidv7()
   */
  id?: PopberId;

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

  /** Zugehörige Population. Fremdschlüssel aus der Tabelle "pop" */
  pop_id?: PopId | null;

  /** Default value: now() */
  created_at?: string;

  /** Default value: now() */
  updated_at?: string;

  old_id?: string | null;
}

/** Represents the mutator for the table apflora.popber */
export interface PopberMutator {
  /** Primärschlüssel */
  id?: PopberId;

  /** Für welches Jahr gilt der Bericht? */
  jahr?: number | null;

  /** Beurteilung der Populationsentwicklung: Auswahl aus Tabelle "tpop_entwicklung_werte" */
  entwicklung?: number | null;

  /** Bemerkungen zur Beurteilung */
  bemerkungen?: string | null;

  /** Von wem wurde der Datensatz zuletzt geändert? */
  changed_by?: string | null;

  /** Zugehörige Population. Fremdschlüssel aus der Tabelle "pop" */
  pop_id?: PopId | null;

  created_at?: string;

  updated_at?: string;

  old_id?: string | null;
}