import type { MessageId } from './Message.ts';

/** Identifier type for apflora.usermessage */
export type UsermessageId = string & { __brand: 'apflora.usermessage' };

/** Represents the table apflora.usermessage */
export default interface Usermessage {
  id: UsermessageId;

  user_name: string;

  /** Zugehörige Nachricht. Fremdschlüssel aus der Tabelle "message" */
  message_id: MessageId | null;

  old_id: string | null;
}

/** Represents the initializer for the table apflora.usermessage */
export interface UsermessageInitializer {
  /** Default value: uuidv7() */
  id?: UsermessageId;

  user_name: string;

  /** Zugehörige Nachricht. Fremdschlüssel aus der Tabelle "message" */
  message_id?: MessageId | null;

  old_id?: string | null;
}

/** Represents the mutator for the table apflora.usermessage */
export interface UsermessageMutator {
  id?: UsermessageId;

  user_name?: string;

  /** Zugehörige Nachricht. Fremdschlüssel aus der Tabelle "message" */
  message_id?: MessageId | null;

  old_id?: string | null;
}