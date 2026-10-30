import type { PopId } from './Pop.ts';

/** Identifier type for apflora.popmassnber */
export type PopmassnberId = string & { __brand: 'apflora.popmassnber' };

/** Represents the table apflora.popmassnber */
export default interface Popmassnber {
  /** Primärschlüssel */
  id: PopmassnberId;

  /** Für welches Jahr gilt der Bericht? */
  jahr: number | null;

  /** Wie wird die Wirkung aller im Rahmen des AP durchgeführten Massnahmen beurteilt? */
  beurteilung: number | null;

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

/** Represents the initializer for the table apflora.popmassnber */
export interface PopmassnberInitializer {
  /**
   * Primärschlüssel
   * Default value: uuidv7()
   */
  id?: PopmassnberId;

  /** Für welches Jahr gilt der Bericht? */
  jahr?: number | null;

  /** Wie wird die Wirkung aller im Rahmen des AP durchgeführten Massnahmen beurteilt? */
  beurteilung?: number | null;

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

/** Represents the mutator for the table apflora.popmassnber */
export interface PopmassnberMutator {
  /** Primärschlüssel */
  id?: PopmassnberId;

  /** Für welches Jahr gilt der Bericht? */
  jahr?: number | null;

  /** Wie wird die Wirkung aller im Rahmen des AP durchgeführten Massnahmen beurteilt? */
  beurteilung?: number | null;

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