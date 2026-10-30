import type { TpopkontrId } from './Tpopkontr.ts';

/** Identifier type for apflora.tpopkontr_file */
export type TpopkontrFileId = string & { __brand: 'apflora.tpopkontr_file' };

/** Represents the table apflora.tpopkontr_file */
export default interface TpopkontrFile {
  id: TpopkontrFileId;

  tpopkontr_id: TpopkontrId | null;

  file_id: string | null;

  file_mime_type: string | null;

  name: string | null;

  beschreibung: string | null;

  created_at: string;

  updated_at: string;

  old_id: string | null;
}

/** Represents the initializer for the table apflora.tpopkontr_file */
export interface TpopkontrFileInitializer {
  /** Default value: uuidv7() */
  id?: TpopkontrFileId;

  tpopkontr_id?: TpopkontrId | null;

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

/** Represents the mutator for the table apflora.tpopkontr_file */
export interface TpopkontrFileMutator {
  id?: TpopkontrFileId;

  tpopkontr_id?: TpopkontrId | null;

  file_id?: string | null;

  file_mime_type?: string | null;

  name?: string | null;

  beschreibung?: string | null;

  created_at?: string;

  updated_at?: string;

  old_id?: string | null;
}