/** Identifier type for apflora.adresse */
export type AdresseId = string & { __brand: 'apflora.adresse' };

/**
 * Represents the table apflora.adresse
 * Adressen, die in anderen Tabellen zugeordent werden können. Nicht zu verwechseln mit Konten, welche den Zugriff auf apflora.ch ermöglichen (Tabelle apflora.user)
 */
export default interface Adresse {
  /** Primärschlüssel */
  id: AdresseId;

  /** Vor- und Nachname */
  name: string | null;

  /** Strasse, PLZ und Ort */
  adresse: string | null;

  /** Telefonnummer */
  telefon: string | null;

  /** Email */
  email: string | null;

  /** Von wem wurde der Datensatz zuletzt geändert? */
  changed_by: string | null;

  /** Ist die Person freiwillige(r) Kontrolleur(in) */
  freiw_erfko: boolean | null;

  created_at: string;

  updated_at: string;

  old_id: string | null;
}

/**
 * Represents the initializer for the table apflora.adresse
 * Adressen, die in anderen Tabellen zugeordent werden können. Nicht zu verwechseln mit Konten, welche den Zugriff auf apflora.ch ermöglichen (Tabelle apflora.user)
 */
export interface AdresseInitializer {
  /**
   * Primärschlüssel
   * Default value: uuidv7()
   */
  id?: AdresseId;

  /** Vor- und Nachname */
  name?: string | null;

  /** Strasse, PLZ und Ort */
  adresse?: string | null;

  /** Telefonnummer */
  telefon?: string | null;

  /** Email */
  email?: string | null;

  /**
   * Von wem wurde der Datensatz zuletzt geändert?
   * Default value: NULL::character varying
   */
  changed_by?: string | null;

  /**
   * Ist die Person freiwillige(r) Kontrolleur(in)
   * Default value: false
   */
  freiw_erfko?: boolean | null;

  /** Default value: now() */
  created_at?: string;

  /** Default value: now() */
  updated_at?: string;

  old_id?: string | null;
}

/**
 * Represents the mutator for the table apflora.adresse
 * Adressen, die in anderen Tabellen zugeordent werden können. Nicht zu verwechseln mit Konten, welche den Zugriff auf apflora.ch ermöglichen (Tabelle apflora.user)
 */
export interface AdresseMutator {
  /** Primärschlüssel */
  id?: AdresseId;

  /** Vor- und Nachname */
  name?: string | null;

  /** Strasse, PLZ und Ort */
  adresse?: string | null;

  /** Telefonnummer */
  telefon?: string | null;

  /** Email */
  email?: string | null;

  /** Von wem wurde der Datensatz zuletzt geändert? */
  changed_by?: string | null;

  /** Ist die Person freiwillige(r) Kontrolleur(in) */
  freiw_erfko?: boolean | null;

  created_at?: string;

  updated_at?: string;

  old_id?: string | null;
}