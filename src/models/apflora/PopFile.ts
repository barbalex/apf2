import type { PopId } from './Pop.ts';

/** Identifier type for apflora.pop_file */
export type PopFileId = string & { __brand: 'apflora.pop_file' };

/** Represents the table apflora.pop_file */
export default interface PopFile {
  id: PopFileId;

  pop_id: PopId | null;

  file_id: string | null;

  file_mime_type: string | null;

  name: string | null;

  beschreibung: string | null;

  created_at: string;

  updated_at: string;

  old_id: string | null;
}

/** Represents the initializer for the table apflora.pop_file */
export interface PopFileInitializer {
  /** Default value: uuidv7() */
  id?: PopFileId;

  pop_id?: PopId | null;

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

/** Represents the mutator for the table apflora.pop_file */
export interface PopFileMutator {
  id?: PopFileId;

  pop_id?: PopId | null;

  file_id?: string | null;

  file_mime_type?: string | null;

  name?: string | null;

  beschreibung?: string | null;

  created_at?: string;

  updated_at?: string;

  old_id?: string | null;
}