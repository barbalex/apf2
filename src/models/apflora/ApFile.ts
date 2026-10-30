import type { ApId } from './Ap.ts';

/** Identifier type for apflora.ap_file */
export type ApFileId = string & { __brand: 'apflora.ap_file' };

/** Represents the table apflora.ap_file */
export default interface ApFile {
  id: ApFileId;

  ap_id: ApId | null;

  file_id: string | null;

  file_mime_type: string | null;

  name: string | null;

  beschreibung: string | null;

  created_at: string;

  updated_at: string;

  old_id: string | null;
}

/** Represents the initializer for the table apflora.ap_file */
export interface ApFileInitializer {
  /** Default value: uuidv7() */
  id?: ApFileId;

  ap_id?: ApId | null;

  file_id?: string | null;

  file_mime_type?: string | null;

  name?: string | null;

  beschreibung?: string | null;

  /** Default value: now() */
  created_at?: string;

  /** Default value: now() */
  updated_at?: string;

  old_id?: string | null;
}

/** Represents the mutator for the table apflora.ap_file */
export interface ApFileMutator {
  id?: ApFileId;

  ap_id?: ApId | null;

  file_id?: string | null;

  file_mime_type?: string | null;

  name?: string | null;

  beschreibung?: string | null;

  created_at?: string;

  updated_at?: string;

  old_id?: string | null;
}