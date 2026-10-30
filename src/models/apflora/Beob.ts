import type { AeTaxonomiesId } from './AeTaxonomies.ts';
import type { TpopId } from './Tpop.ts';

/** Identifier type for apflora.beob */
export type BeobId = string & { __brand: 'apflora.beob' };

/** Represents the table apflora.beob */
export default interface Beob {
  /** Primärschlüssel */
  id: BeobId;

  id_field: string | null;

  datum: string | null;

  autor: string | null;

  data: unknown | null;

  art_id: AeTaxonomiesId | null;

  /** Dieser Teilpopulation wurde die Beobachtung zugeordnet. Fremdschlüssel aus der Tabelle "tpop" */
  tpop_id: TpopId | null;

  /** Wird ja gesetzt, wenn eine Beobachtung keiner Teilpopulation zugeordnet werden kann. Sollte im Bemerkungsfeld begründet werden. In der Regel ist die Artbestimmung zweifelhaft. Oder die Beobachtung ist nicht (genau genug) lokalisierbar */
  nicht_zuordnen: boolean | null;

  /** Bemerkungen zur Zuordnung */
  bemerkungen: string | null;

  /** Von wem wurde der Datensatz zuletzt geändert? */
  changed_by: string | null;

  art_id_original: AeTaxonomiesId | null;

  geom_point: unknown | null;

  /** Datum, an dem Info Flora über die Verifikation der Beobachtung informiert wurde */
  infoflora_informiert_datum: string | null;

  /** Woher stammt die Beobachtung? Bitte prägnant und kurz formulieren, ähnlich einem Literaturzitat, z.B. "Info Flora 2017" */
  quelle: string | null;

  id_original: string | null;

  /** Einmalig? für die Bereinigung von Beobachtungen benutzt, die von Info Flora von EvAB her kamen */
  id_evab: string | null;

  /** Einmalig? für die Bereinigung von Beobachtungen benutzt, die von Info Flora von EvAB her kamen */
  id_evab_lc: string | null;

  obs_id: string | null;

  created_at: string;

  updated_at: string;

  absenz: boolean | null;
}

/** Represents the initializer for the table apflora.beob */
export interface BeobInitializer {
  /**
   * Primärschlüssel
   * Default value: uuidv7()
   */
  id?: BeobId;

  /** Default value: NULL::character varying */
  id_field?: string | null;

  datum?: string | null;

  /** Default value: NULL::character varying */
  autor?: string | null;

  data?: unknown | null;

  art_id?: AeTaxonomiesId | null;

  /** Dieser Teilpopulation wurde die Beobachtung zugeordnet. Fremdschlüssel aus der Tabelle "tpop" */
  tpop_id?: TpopId | null;

  /**
   * Wird ja gesetzt, wenn eine Beobachtung keiner Teilpopulation zugeordnet werden kann. Sollte im Bemerkungsfeld begründet werden. In der Regel ist die Artbestimmung zweifelhaft. Oder die Beobachtung ist nicht (genau genug) lokalisierbar
   * Default value: false
   */
  nicht_zuordnen?: boolean | null;

  /** Bemerkungen zur Zuordnung */
  bemerkungen?: string | null;

  /**
   * Von wem wurde der Datensatz zuletzt geändert?
   * Default value: NULL::character varying
   */
  changed_by?: string | null;

  art_id_original?: AeTaxonomiesId | null;

  geom_point?: unknown | null;

  /** Datum, an dem Info Flora über die Verifikation der Beobachtung informiert wurde */
  infoflora_informiert_datum?: string | null;

  /** Woher stammt die Beobachtung? Bitte prägnant und kurz formulieren, ähnlich einem Literaturzitat, z.B. "Info Flora 2017" */
  quelle?: string | null;

  id_original?: string | null;

  /** Einmalig? für die Bereinigung von Beobachtungen benutzt, die von Info Flora von EvAB her kamen */
  id_evab?: string | null;

  /** Einmalig? für die Bereinigung von Beobachtungen benutzt, die von Info Flora von EvAB her kamen */
  id_evab_lc?: string | null;

  obs_id?: string | null;

  /** Default value: now() */
  created_at?: string;

  /** Default value: now() */
  updated_at?: string;

  /** Default value: false */
  absenz?: boolean | null;
}

/** Represents the mutator for the table apflora.beob */
export interface BeobMutator {
  /** Primärschlüssel */
  id?: BeobId;

  id_field?: string | null;

  datum?: string | null;

  autor?: string | null;

  data?: unknown | null;

  art_id?: AeTaxonomiesId | null;

  /** Dieser Teilpopulation wurde die Beobachtung zugeordnet. Fremdschlüssel aus der Tabelle "tpop" */
  tpop_id?: TpopId | null;

  /** Wird ja gesetzt, wenn eine Beobachtung keiner Teilpopulation zugeordnet werden kann. Sollte im Bemerkungsfeld begründet werden. In der Regel ist die Artbestimmung zweifelhaft. Oder die Beobachtung ist nicht (genau genug) lokalisierbar */
  nicht_zuordnen?: boolean | null;

  /** Bemerkungen zur Zuordnung */
  bemerkungen?: string | null;

  /** Von wem wurde der Datensatz zuletzt geändert? */
  changed_by?: string | null;

  art_id_original?: AeTaxonomiesId | null;

  geom_point?: unknown | null;

  /** Datum, an dem Info Flora über die Verifikation der Beobachtung informiert wurde */
  infoflora_informiert_datum?: string | null;

  /** Woher stammt die Beobachtung? Bitte prägnant und kurz formulieren, ähnlich einem Literaturzitat, z.B. "Info Flora 2017" */
  quelle?: string | null;

  id_original?: string | null;

  /** Einmalig? für die Bereinigung von Beobachtungen benutzt, die von Info Flora von EvAB her kamen */
  id_evab?: string | null;

  /** Einmalig? für die Bereinigung von Beobachtungen benutzt, die von Info Flora von EvAB her kamen */
  id_evab_lc?: string | null;

  obs_id?: string | null;

  created_at?: string;

  updated_at?: string;

  absenz?: boolean | null;
}