import type { TpopId } from './Tpop.ts';

/** Identifier type for apflora.tpop_file */
export type TpopFileId = string & { __brand: 'apflora.tpop_file' };

/** Represents the table apflora.tpop_file */
export default interface TpopFile {
  id: TpopFileId;

  tpop_id: TpopId | null;

  file_id: string | null;

  file_mime_type: string | null;

  name: string | null;

  beschreibung: string | null;

  created_at: string;

  updated_at: string;

  old_id: string | null;
}

/** Represents the initializer for the table apflora.tpop_file */
export interface TpopFileInitializer {
  /** Default value: uuidv7() */
  id?: TpopFileId;

  tpop_id?: TpopId | null;

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

/** Represents the mutator for the table apflora.tpop_file */
export interface TpopFileMutator {
  id?: TpopFileId;

  tpop_id?: TpopId | null;

  file_id?: string | null;

  file_mime_type?: string | null;

  name?: string | null;

  beschreibung?: string | null;

  created_at?: string;

  updated_at?: string;

  old_id?: string | null;
}