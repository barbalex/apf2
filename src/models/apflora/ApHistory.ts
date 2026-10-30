import type { ApId } from './Ap.ts';
import type { AeTaxonomiesId } from './AeTaxonomies.ts';
import type { ProjektId } from './Projekt.ts';
import type { AdresseId } from './Adresse.ts';

/** Identifier type for apflora.ap_history */
export type ApHistoryYear = number & { __brand: 'apflora.ap_history' };

/** Represents the table apflora.ap_history */
export default interface ApHistory {
  /** Jahr: ap_history wurde beim Erstellen des Jahresberichts im Februar des Folgejahrs von ap kopiert */
  year: ApHistoryYear;

  /** Primärschlüssel */
  id: ApId;

  /** Namensgebende Art. Unter ihrem Namen bzw. Nummer werden Kontrollen an InfoFlora geliefert */
  art_id: AeTaxonomiesId | null;

  /** Zugehöriges Projekt. Fremdschlüssel aus der Tabelle "proj" */
  proj_id: ProjektId | null;

  /** In welchem Bearbeitungsstand befindet sich der AP? */
  bearbeitung: number | null;

  /** Wann wurde mit der Umsetzung des Aktionsplans begonnen? */
  start_jahr: number | null;

  /** In welchem Umsetzungsstand befindet sich der AP? */
  umsetzung: number | null;

  /** Verantwortliche(r) für die Art */
  bearbeiter: AdresseId | null;

  /** bester Beobachtungszeitpunkt */
  ekf_beobachtungszeitpunkt: string | null;

  /** Von wem wurde der Datensatz zuletzt geändert? */
  changed_by: string | null;

  created_at: string;

  updated_at: string;
}

/** Represents the initializer for the table apflora.ap_history */
export interface ApHistoryInitializer {
  /** Jahr: ap_history wurde beim Erstellen des Jahresberichts im Februar des Folgejahrs von ap kopiert */
  year: ApHistoryYear;

  /** Primärschlüssel */
  id: ApId;

  /** Namensgebende Art. Unter ihrem Namen bzw. Nummer werden Kontrollen an InfoFlora geliefert */
  art_id?: AeTaxonomiesId | null;

  /** Zugehöriges Projekt. Fremdschlüssel aus der Tabelle "proj" */
  proj_id?: ProjektId | null;

  /** In welchem Bearbeitungsstand befindet sich der AP? */
  bearbeitung?: number | null;

  /** Wann wurde mit der Umsetzung des Aktionsplans begonnen? */
  start_jahr?: number | null;

  /** In welchem Umsetzungsstand befindet sich der AP? */
  umsetzung?: number | null;

  /** Verantwortliche(r) für die Art */
  bearbeiter?: AdresseId | null;

  /** bester Beobachtungszeitpunkt */
  ekf_beobachtungszeitpunkt?: string | null;

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

/** Represents the mutator for the table apflora.ap_history */
export interface ApHistoryMutator {
  /** Jahr: ap_history wurde beim Erstellen des Jahresberichts im Februar des Folgejahrs von ap kopiert */
  year?: ApHistoryYear;

  /** Primärschlüssel */
  id?: ApId;

  /** Namensgebende Art. Unter ihrem Namen bzw. Nummer werden Kontrollen an InfoFlora geliefert */
  art_id?: AeTaxonomiesId | null;

  /** Zugehöriges Projekt. Fremdschlüssel aus der Tabelle "proj" */
  proj_id?: ProjektId | null;

  /** In welchem Bearbeitungsstand befindet sich der AP? */
  bearbeitung?: number | null;

  /** Wann wurde mit der Umsetzung des Aktionsplans begonnen? */
  start_jahr?: number | null;

  /** In welchem Umsetzungsstand befindet sich der AP? */
  umsetzung?: number | null;

  /** Verantwortliche(r) für die Art */
  bearbeiter?: AdresseId | null;

  /** bester Beobachtungszeitpunkt */
  ekf_beobachtungszeitpunkt?: string | null;

  /** Von wem wurde der Datensatz zuletzt geändert? */
  changed_by?: string | null;

  created_at?: string;

  updated_at?: string;
}