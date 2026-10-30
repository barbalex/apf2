import type { ApId } from './Ap.ts';

/** Identifier type for apflora.pop */
export type PopId = string & { __brand: 'apflora.pop' };

/** Represents the table apflora.pop */
export default interface Pop {
  /** Primärschlüssel der Tabelle "pop" */
  id: PopId;

  /** Nummer der Population */
  nr: number | null;

  /** Bezeichnung der Population */
  name: string | null;

  /** Herkunft der Population: autochthon oder angesiedelt? Auswahl aus der Tabelle "pop_status_werte" */
  status: number | null;

  /** Begründung, wieso die Herkunft unklar ist */
  status_unklar_begruendung: string | null;

  /** Seit wann ist die Population bekannt? */
  bekannt_seit: number | null;

  /** Von wem wurde der Datensatz zuletzt geändert? */
  changed_by: string | null;

  /** Zugehöriger Aktionsplan. Fremdschlüssel aus der Tabelle "ap" */
  ap_id: ApId | null;

  /** true = die Herkunft der Population ist unklar */
  status_unklar: boolean | null;

  geom_point: unknown | null;

  created_at: string;

  updated_at: string;

  old_id: string | null;
}

/** Represents the initializer for the table apflora.pop */
export interface PopInitializer {
  /**
   * Primärschlüssel der Tabelle "pop"
   * Default value: uuidv7()
   */
  id?: PopId;

  /** Nummer der Population */
  nr?: number | null;

  /**
   * Bezeichnung der Population
   * Default value: NULL::character varying
   */
  name?: string | null;

  /** Herkunft der Population: autochthon oder angesiedelt? Auswahl aus der Tabelle "pop_status_werte" */
  status?: number | null;

  /** Begründung, wieso die Herkunft unklar ist */
  status_unklar_begruendung?: string | null;

  /** Seit wann ist die Population bekannt? */
  bekannt_seit?: number | null;

  /**
   * Von wem wurde der Datensatz zuletzt geändert?
   * Default value: NULL::character varying
   */
  changed_by?: string | null;

  /** Zugehöriger Aktionsplan. Fremdschlüssel aus der Tabelle "ap" */
  ap_id?: ApId | null;

  /**
   * true = die Herkunft der Population ist unklar
   * Default value: false
   */
  status_unklar?: boolean | null;

  geom_point?: unknown | null;

  /** Default value: now() */
  created_at?: string;

  /** Default value: now() */
  updated_at?: string;

  old_id?: string | null;
}

/** Represents the mutator for the table apflora.pop */
export interface PopMutator {
  /** Primärschlüssel der Tabelle "pop" */
  id?: PopId;

  /** Nummer der Population */
  nr?: number | null;

  /** Bezeichnung der Population */
  name?: string | null;

  /** Herkunft der Population: autochthon oder angesiedelt? Auswahl aus der Tabelle "pop_status_werte" */
  status?: number | null;

  /** Begründung, wieso die Herkunft unklar ist */
  status_unklar_begruendung?: string | null;

  /** Seit wann ist die Population bekannt? */
  bekannt_seit?: number | null;

  /** Von wem wurde der Datensatz zuletzt geändert? */
  changed_by?: string | null;

  /** Zugehöriger Aktionsplan. Fremdschlüssel aus der Tabelle "ap" */
  ap_id?: ApId | null;

  /** true = die Herkunft der Population ist unklar */
  status_unklar?: boolean | null;

  geom_point?: unknown | null;

  created_at?: string;

  updated_at?: string;

  old_id?: string | null;
}