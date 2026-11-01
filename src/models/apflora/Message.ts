/** Identifier type for apflora.message */
export type MessageId = string & { __brand: 'apflora.message' };

/** Represents the table apflora.message */
export default interface Message {
  id: MessageId;

  /** Nachricht an die Benutzer */
  message: string;

  time: string;

  active: boolean;

  old_id: string | null;
}

/** Represents the initializer for the table apflora.message */
export interface MessageInitializer {
  /** Default value: uuidv7() */
  id?: MessageId;

  /** Nachricht an die Benutzer */
  message: string;

  /** Default value: now() */
  time?: string;

  /** Default value: true */
  active?: boolean;

  old_id?: string | null;
}

/** Represents the mutator for the table apflora.message */
export interface MessageMutator {
  id?: MessageId;

  /** Nachricht an die Benutzer */
  message?: string;

  time?: string;

  active?: boolean;

  old_id?: string | null;
}