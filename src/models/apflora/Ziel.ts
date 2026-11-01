import type { ApId } from './Ap.ts';

/** Identifier type for apflora.ziel */
export type ZielId = string & { __brand: 'apflora.ziel' };

/**
 * Represents the table apflora.ziel
 * (ap_id,jahr) references ap_history (id,year)
 */
export default interface Ziel {
  /** Primärschlüssel */
  id: ZielId;

  /** Typ des Ziels. Z.B. Zwischenziel, Gesamtziel. Auswahl aus Tabelle "ziel_typ_werte" */
  typ: number | null;

  /** In welchem Jahr soll das Ziel erreicht werden? */
  jahr: number;

  /** Textliche Beschreibung des Ziels */
  bezeichnung: string | null;

  /** Von wem wurde der Datensatz zuletzt geändert? */
  changed_by: string | null;

  /** Zugehöriger Aktionsplan. Fremdschlüssel aus der Tabelle "ap" */
  ap_id: ApId | null;

  created_at: string;

  updated_at: string;

  erreichung: string | null;

  bemerkungen: string | null;

  old_id: string | null;
}

/**
 * Represents the initializer for the table apflora.ziel
 * (ap_id,jahr) references ap_history (id,year)
 */
export interface ZielInitializer {
  /**
   * Primärschlüssel
   * Default value: uuidv7()
   */
  id?: ZielId;

  /** Typ des Ziels. Z.B. Zwischenziel, Gesamtziel. Auswahl aus Tabelle "ziel_typ_werte" */
  typ?: number | null;

  /**
   * In welchem Jahr soll das Ziel erreicht werden?
   * Default value: 1
   */
  jahr?: number;

  /** Textliche Beschreibung des Ziels */
  bezeichnung?: string | null;

  /**
   * Von wem wurde der Datensatz zuletzt geändert?
   * Default value: NULL::character varying
   */
  changed_by?: string | null;

  /** Zugehöriger Aktionsplan. Fremdschlüssel aus der Tabelle "ap" */
  ap_id?: ApId | null;

  /** Default value: now() */
  created_at?: string;

  /** Default value: now() */
  updated_at?: string;

  erreichung?: string | null;

  bemerkungen?: string | null;

  old_id?: string | null;
}

/**
 * Represents the mutator for the table apflora.ziel
 * (ap_id,jahr) references ap_history (id,year)
 */
export interface ZielMutator {
  /** Primärschlüssel */
  id?: ZielId;

  /** Typ des Ziels. Z.B. Zwischenziel, Gesamtziel. Auswahl aus Tabelle "ziel_typ_werte" */
  typ?: number | null;

  /** In welchem Jahr soll das Ziel erreicht werden? */
  jahr?: number;

  /** Textliche Beschreibung des Ziels */
  bezeichnung?: string | null;

  /** Von wem wurde der Datensatz zuletzt geändert? */
  changed_by?: string | null;

  /** Zugehöriger Aktionsplan. Fremdschlüssel aus der Tabelle "ap" */
  ap_id?: ApId | null;

  created_at?: string;

  updated_at?: string;

  erreichung?: string | null;

  bemerkungen?: string | null;

  old_id?: string | null;
}