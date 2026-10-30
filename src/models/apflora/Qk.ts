/** Identifier type for apflora.qk */
export type QkName = string & { __brand: 'apflora.qk' };

/** Represents the table apflora.qk */
export default interface Qk {
  /** Primärschlüssel. Wird auch in Abfragen und createMessageFunctions benutzt */
  name: QkName;

  titel: string | null;

  beschreibung: string | null;

  sort: number | null;

  created_at: string;

  updated_at: string;
}

/** Represents the initializer for the table apflora.qk */
export interface QkInitializer {
  /** Primärschlüssel. Wird auch in Abfragen und createMessageFunctions benutzt */
  name: QkName;

  titel?: string | null;

  beschreibung?: string | null;

  sort?: number | null;

  /** Default value: now() */
  created_at?: string;

  /** Default value: now() */
  updated_at?: string;
}

/** Represents the mutator for the table apflora.qk */
export interface QkMutator {
  /** Primärschlüssel. Wird auch in Abfragen und createMessageFunctions benutzt */
  name?: QkName;

  titel?: string | null;

  beschreibung?: string | null;

  sort?: number | null;

  created_at?: string;

  updated_at?: string;
}