import type { ApId } from './Ap.ts';

/** Identifier type for apflora.ap_user */
export type ApUserId = string & { __brand: 'apflora.ap_user' };

/** Represents the table apflora.ap_user */
export default interface ApUser {
  id: ApUserId;

  ap_id: ApId | null;

  user_name: string | null;

  created_at: string;

  updated_at: string;

  old_id: string | null;
}

/** Represents the initializer for the table apflora.ap_user */
export interface ApUserInitializer {
  /** Default value: uuidv7() */
  id?: ApUserId;

  ap_id?: ApId | null;

  user_name?: string | null;

  /** Default value: now() */
  created_at?: string;

  /** Default value: now() */
  updated_at?: string;

  old_id?: string | null;
}

/** Represents the mutator for the table apflora.ap_user */
export interface ApUserMutator {
  id?: ApUserId;

  ap_id?: ApId | null;

  user_name?: string | null;

  created_at?: string;

  updated_at?: string;

  old_id?: string | null;
}