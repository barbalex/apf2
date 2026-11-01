import type { ApId } from './Ap.ts';

/** Identifier type for apflora.idealbiotop */
export type IdealbiotopId = string & { __brand: 'apflora.idealbiotop' };

/** Represents the table apflora.idealbiotop */
export default interface Idealbiotop {
  /** Primärschlüssel */
  id: IdealbiotopId;

  /** Erstelldatum */
  erstelldatum: string | null;

  /** Höhenlage */
  hoehenlage: string | null;

  /** Region */
  region: string | null;

  /** Exposition */
  exposition: string | null;

  /** Besonnung */
  besonnung: string | null;

  /** Hangneigung */
  hangneigung: string | null;

  /** Bodentyp */
  boden_typ: string | null;

  /** Kalkgehalt im Boden */
  boden_kalkgehalt: string | null;

  /** Bodendurchlässigkeit */
  boden_durchlaessigkeit: string | null;

  /** Bodenhumusgehalt */
  boden_humus: string | null;

  /** Bodennährstoffgehalt */
  boden_naehrstoffgehalt: string | null;

  /** Wasserhaushalt */
  wasserhaushalt: string | null;

  /** Konkurrenz */
  konkurrenz: string | null;

  /** Moosschicht */
  moosschicht: string | null;

  /** Krautschicht */
  krautschicht: string | null;

  /** Strauchschicht */
  strauchschicht: string | null;

  /** Baumschicht */
  baumschicht: string | null;

  /** Bemerkungen */
  bemerkungen: string | null;

  /** Wer hat den Datensatz zuletzt verändert? */
  changed_by: string | null;

  /** Zugehöriger Aktionsplan. Fremdschlüssel aus der Tabelle "ap" */
  ap_id: ApId | null;

  created_at: string;

  updated_at: string;

  old_id: string | null;
}

/** Represents the initializer for the table apflora.idealbiotop */
export interface IdealbiotopInitializer {
  /**
   * Primärschlüssel
   * Default value: uuidv7()
   */
  id?: IdealbiotopId;

  /** Erstelldatum */
  erstelldatum?: string | null;

  /** Höhenlage */
  hoehenlage?: string | null;

  /** Region */
  region?: string | null;

  /** Exposition */
  exposition?: string | null;

  /** Besonnung */
  besonnung?: string | null;

  /** Hangneigung */
  hangneigung?: string | null;

  /** Bodentyp */
  boden_typ?: string | null;

  /** Kalkgehalt im Boden */
  boden_kalkgehalt?: string | null;

  /** Bodendurchlässigkeit */
  boden_durchlaessigkeit?: string | null;

  /** Bodenhumusgehalt */
  boden_humus?: string | null;

  /** Bodennährstoffgehalt */
  boden_naehrstoffgehalt?: string | null;

  /** Wasserhaushalt */
  wasserhaushalt?: string | null;

  /** Konkurrenz */
  konkurrenz?: string | null;

  /** Moosschicht */
  moosschicht?: string | null;

  /** Krautschicht */
  krautschicht?: string | null;

  /** Strauchschicht */
  strauchschicht?: string | null;

  /** Baumschicht */
  baumschicht?: string | null;

  /** Bemerkungen */
  bemerkungen?: string | null;

  /**
   * Wer hat den Datensatz zuletzt verändert?
   * Default value: NULL::character varying
   */
  changed_by?: string | null;

  /** Zugehöriger Aktionsplan. Fremdschlüssel aus der Tabelle "ap" */
  ap_id?: ApId | null;

  /** Default value: now() */
  created_at?: string;

  /** Default value: now() */
  updated_at?: string;

  old_id?: string | null;
}

/** Represents the mutator for the table apflora.idealbiotop */
export interface IdealbiotopMutator {
  /** Primärschlüssel */
  id?: IdealbiotopId;

  /** Erstelldatum */
  erstelldatum?: string | null;

  /** Höhenlage */
  hoehenlage?: string | null;

  /** Region */
  region?: string | null;

  /** Exposition */
  exposition?: string | null;

  /** Besonnung */
  besonnung?: string | null;

  /** Hangneigung */
  hangneigung?: string | null;

  /** Bodentyp */
  boden_typ?: string | null;

  /** Kalkgehalt im Boden */
  boden_kalkgehalt?: string | null;

  /** Bodendurchlässigkeit */
  boden_durchlaessigkeit?: string | null;

  /** Bodenhumusgehalt */
  boden_humus?: string | null;

  /** Bodennährstoffgehalt */
  boden_naehrstoffgehalt?: string | null;

  /** Wasserhaushalt */
  wasserhaushalt?: string | null;

  /** Konkurrenz */
  konkurrenz?: string | null;

  /** Moosschicht */
  moosschicht?: string | null;

  /** Krautschicht */
  krautschicht?: string | null;

  /** Strauchschicht */
  strauchschicht?: string | null;

  /** Baumschicht */
  baumschicht?: string | null;

  /** Bemerkungen */
  bemerkungen?: string | null;

  /** Wer hat den Datensatz zuletzt verändert? */
  changed_by?: string | null;

  /** Zugehöriger Aktionsplan. Fremdschlüssel aus der Tabelle "ap" */
  ap_id?: ApId | null;

  created_at?: string;

  updated_at?: string;

  old_id?: string | null;
}