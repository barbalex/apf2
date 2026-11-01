import type { ProjektId } from './Projekt.ts';

/** Identifier type for apflora.apberuebersicht */
export type ApberuebersichtId = string & { __brand: 'apflora.apberuebersicht' };

/** Represents the table apflora.apberuebersicht */
export default interface Apberuebersicht {
  /** Primärschlüssel */
  id: ApberuebersichtId;

  /** Berichtsjahr. Zusammen mit proj_id eindeutig */
  jahr: number | null;

  /** Bemerkungen zur Artübersicht */
  bemerkungen: string | null;

  /** Von wem wurde der Datensatz zuletzt geändert? */
  changed_by: string | null;

  /** Zugehöriger Aktionsplan. Fremdschlüssel aus der Tabelle "projekt" */
  proj_id: ProjektId | null;

  /** Datum, an dem die Daten von AP, Pop und TPop historisiert wurden */
  history_date: string | null;

  created_at: string;

  updated_at: string;

  history_fixed: boolean | null;

  old_id: string | null;
}

/** Represents the initializer for the table apflora.apberuebersicht */
export interface ApberuebersichtInitializer {
  /**
   * Primärschlüssel
   * Default value: uuidv7()
   */
  id?: ApberuebersichtId;

  /** Berichtsjahr. Zusammen mit proj_id eindeutig */
  jahr?: number | null;

  /** Bemerkungen zur Artübersicht */
  bemerkungen?: string | null;

  /**
   * Von wem wurde der Datensatz zuletzt geändert?
   * Default value: NULL::character varying
   */
  changed_by?: string | null;

  /** Zugehöriger Aktionsplan. Fremdschlüssel aus der Tabelle "projekt" */
  proj_id?: ProjektId | null;

  /** Datum, an dem die Daten von AP, Pop und TPop historisiert wurden */
  history_date?: string | null;

  /** Default value: now() */
  created_at?: string;

  /** Default value: now() */
  updated_at?: string;

  /** Default value: false */
  history_fixed?: boolean | null;

  old_id?: string | null;
}

/** Represents the mutator for the table apflora.apberuebersicht */
export interface ApberuebersichtMutator {
  /** Primärschlüssel */
  id?: ApberuebersichtId;

  /** Berichtsjahr. Zusammen mit proj_id eindeutig */
  jahr?: number | null;

  /** Bemerkungen zur Artübersicht */
  bemerkungen?: string | null;

  /** Von wem wurde der Datensatz zuletzt geändert? */
  changed_by?: string | null;

  /** Zugehöriger Aktionsplan. Fremdschlüssel aus der Tabelle "projekt" */
  proj_id?: ProjektId | null;

  /** Datum, an dem die Daten von AP, Pop und TPop historisiert wurden */
  history_date?: string | null;

  created_at?: string;

  updated_at?: string;

  history_fixed?: boolean | null;

  old_id?: string | null;
}