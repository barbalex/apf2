import type { AdresseId } from './Adresse.ts';

/** Identifier type for apflora.user */
export type UserId = string & { __brand: 'apflora.user' };

/**
 * Represents the table apflora.user
 * Konten, um den Zugriff auf apflora.ch zu regeln
 */
export default interface User {
  id: UserId;

  name: string | null;

  email: string | null;

  role: unknown;

  pass: string | null;

  /** Datensatz bzw. Fremdschlüssel des Users in der Tabelle "adresse". Wird benutzt, damit die EKF-Kontrollen von Freiwilligen-Kontrolleurinnen gefiltert werden können */
  adresse_id: AdresseId | null;

  require_new_password_on_next_login: boolean | null;

  old_id: string | null;
}

/**
 * Represents the initializer for the table apflora.user
 * Konten, um den Zugriff auf apflora.ch zu regeln
 */
export interface UserInitializer {
  /** Default value: uuidv7() */
  id?: UserId;

  name?: string | null;

  email?: string | null;

  /** Default value: 'apflora_ap_reader'::name */
  role?: unknown;

  pass?: string | null;

  /** Datensatz bzw. Fremdschlüssel des Users in der Tabelle "adresse". Wird benutzt, damit die EKF-Kontrollen von Freiwilligen-Kontrolleurinnen gefiltert werden können */
  adresse_id?: AdresseId | null;

  /** Default value: true */
  require_new_password_on_next_login?: boolean | null;

  old_id?: string | null;
}

/**
 * Represents the mutator for the table apflora.user
 * Konten, um den Zugriff auf apflora.ch zu regeln
 */
export interface UserMutator {
  id?: UserId;

  name?: string | null;

  email?: string | null;

  role?: unknown;

  pass?: string | null;

  /** Datensatz bzw. Fremdschlüssel des Users in der Tabelle "adresse". Wird benutzt, damit die EKF-Kontrollen von Freiwilligen-Kontrolleurinnen gefiltert werden können */
  adresse_id?: AdresseId | null;

  require_new_password_on_next_login?: boolean | null;

  old_id?: string | null;
}