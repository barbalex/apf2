import type { ApHistoryYear } from './ApHistory.ts';
import type { ApId } from './Ap.ts';

/** Identifier type for apflora.pop_history */
export type PopHistoryId = string & { __brand: 'apflora.pop_history' };

/** Represents the table apflora.pop_history */
export default interface PopHistory {
  /** Jahr: pop_history wurde beim Erstellen des Jahresberichts im Februar des Folgejahrs von pop kopiert */
  year: ApHistoryYear;

  /** Primärschlüssel der Tabelle "pop" */
  id: PopHistoryId;

  /** Zugehöriger Aktionsplan. Fremdschlüssel aus der Tabelle "ap" */
  ap_id: ApId | null;

  /** Nummer der Population */
  nr: number | null;

  /** Bezeichnung der Population */
  name: string | null;

  /** Herkunft der Population: autochthon oder angesiedelt? Auswahl aus der Tabelle "pop_status_werte" */
  status: number | null;

  /** true = die Herkunft der Population ist unklar */
  status_unklar: boolean | null;

  /** Begründung, wieso die Herkunft unklar ist */
  status_unklar_begruendung: string | null;

  /** Seit wann ist die Population bekannt? */
  bekannt_seit: number | null;

  geom_point: unknown | null;

  /** Von wem wurde der Datensatz zuletzt geändert? */
  changed_by: string | null;

  created_at: string;

  updated_at: string;
}

/** Represents the initializer for the table apflora.pop_history */
export interface PopHistoryInitializer {
  /** Jahr: pop_history wurde beim Erstellen des Jahresberichts im Februar des Folgejahrs von pop kopiert */
  year: ApHistoryYear;

  /** Primärschlüssel der Tabelle "pop" */
  id: PopHistoryId;

  /** Zugehöriger Aktionsplan. Fremdschlüssel aus der Tabelle "ap" */
  ap_id?: ApId | null;

  /** Nummer der Population */
  nr?: number | null;

  /**
   * Bezeichnung der Population
   * Default value: NULL::character varying
   */
  name?: string | null;

  /** Herkunft der Population: autochthon oder angesiedelt? Auswahl aus der Tabelle "pop_status_werte" */
  status?: number | null;

  /**
   * true = die Herkunft der Population ist unklar
   * Default value: false
   */
  status_unklar?: boolean | null;

  /** Begründung, wieso die Herkunft unklar ist */
  status_unklar_begruendung?: string | null;

  /** Seit wann ist die Population bekannt? */
  bekannt_seit?: number | null;

  /** Default value: NULL::geometry */
  geom_point?: unknown | null;

  /**
   * Von wem wurde der Datensatz zuletzt geändert?
   * Default value: NULL::character varying
   */
  changed_by?: string | null;

  /** Default value: now() */
  created_at?: string;

  /** Default value: now() */
  updated_at?: string;
}

/** Represents the mutator for the table apflora.pop_history */
export interface PopHistoryMutator {
  /** Jahr: pop_history wurde beim Erstellen des Jahresberichts im Februar des Folgejahrs von pop kopiert */
  year?: ApHistoryYear;

  /** Primärschlüssel der Tabelle "pop" */
  id?: PopHistoryId;

  /** Zugehöriger Aktionsplan. Fremdschlüssel aus der Tabelle "ap" */
  ap_id?: ApId | null;

  /** Nummer der Population */
  nr?: number | null;

  /** Bezeichnung der Population */
  name?: string | null;

  /** Herkunft der Population: autochthon oder angesiedelt? Auswahl aus der Tabelle "pop_status_werte" */
  status?: number | null;

  /** true = die Herkunft der Population ist unklar */
  status_unklar?: boolean | null;

  /** Begründung, wieso die Herkunft unklar ist */
  status_unklar_begruendung?: string | null;

  /** Seit wann ist die Population bekannt? */
  bekannt_seit?: number | null;

  geom_point?: unknown | null;

  /** Von wem wurde der Datensatz zuletzt geändert? */
  changed_by?: string | null;

  created_at?: string;

  updated_at?: string;
}