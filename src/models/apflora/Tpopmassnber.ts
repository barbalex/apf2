import type { TpopId } from './Tpop.ts';

/** Identifier type for apflora.tpopmassnber */
export type TpopmassnberId = string & { __brand: 'apflora.tpopmassnber' };

/** Represents the table apflora.tpopmassnber */
export default interface Tpopmassnber {
  id: TpopmassnberId;

  /** Jahr, für den der Bericht gilt */
  jahr: number | null;

  /** Beurteilung des Erfolgs. Auswahl aus Tabelle "tpopmassn_erfbeurt_werte" */
  beurteilung: number | null;

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

/** Represents the initializer for the table apflora.tpopmassnber */
export interface TpopmassnberInitializer {
  /** Default value: uuidv7() */
  id?: TpopmassnberId;

  /** Jahr, für den der Bericht gilt */
  jahr?: number | null;

  /** Beurteilung des Erfolgs. Auswahl aus Tabelle "tpopmassn_erfbeurt_werte" */
  beurteilung?: number | null;

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

/** Represents the mutator for the table apflora.tpopmassnber */
export interface TpopmassnberMutator {
  id?: TpopmassnberId;

  /** Jahr, für den der Bericht gilt */
  jahr?: number | null;

  /** Beurteilung des Erfolgs. Auswahl aus Tabelle "tpopmassn_erfbeurt_werte" */
  beurteilung?: number | null;

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