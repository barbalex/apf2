import type { ApId } from './Ap.ts';
import type { QkName } from './Qk.ts';

/** Represents the table apflora.apqk */
export default interface Apqk {
  ap_id: ApId;

  qk_name: QkName;

  created_at: string;

  updated_at: string;
}

/** Represents the initializer for the table apflora.apqk */
export interface ApqkInitializer {
  ap_id: ApId;

  qk_name: QkName;

  /** Default value: now() */
  created_at?: string;

  /** Default value: now() */
  updated_at?: string;
}

/** Represents the mutator for the table apflora.apqk */
export interface ApqkMutator {
  ap_id?: ApId;

  qk_name?: QkName;

  created_at?: string;

  updated_at?: string;
}