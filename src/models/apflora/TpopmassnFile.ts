import type { TpopmassnId } from './Tpopmassn.ts';

/** Identifier type for apflora.tpopmassn_file */
export type TpopmassnFileId = string & { __brand: 'apflora.tpopmassn_file' };

/** Represents the table apflora.tpopmassn_file */
export default interface TpopmassnFile {
  id: TpopmassnFileId;

  tpopmassn_id: TpopmassnId | null;

  file_id: string | null;

  file_mime_type: string | null;

  name: string | null;

  beschreibung: string | null;

  created_at: string;

  updated_at: string;

  old_id: string | null;
}

/** Represents the initializer for the table apflora.tpopmassn_file */
export interface TpopmassnFileInitializer {
  /** Default value: uuidv7() */
  id?: TpopmassnFileId;

  tpopmassn_id?: TpopmassnId | null;

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

/** Represents the mutator for the table apflora.tpopmassn_file */
export interface TpopmassnFileMutator {
  id?: TpopmassnFileId;

  tpopmassn_id?: TpopmassnId | null;

  file_id?: string | null;

  file_mime_type?: string | null;

  name?: string | null;

  beschreibung?: string | null;

  created_at?: string;

  updated_at?: string;

  old_id?: string | null;
}