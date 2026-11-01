import type { IdealbiotopId } from './Idealbiotop.ts';

/** Identifier type for apflora.idealbiotop_file */
export type IdealbiotopFileId = string & { __brand: 'apflora.idealbiotop_file' };

/** Represents the table apflora.idealbiotop_file */
export default interface IdealbiotopFile {
  id: IdealbiotopFileId;

  idealbiotop_id: IdealbiotopId | null;

  file_id: string | null;

  file_mime_type: string | null;

  name: string | null;

  beschreibung: string | null;

  created_at: string;

  updated_at: string;

  old_id: string | null;
}

/** Represents the initializer for the table apflora.idealbiotop_file */
export interface IdealbiotopFileInitializer {
  /** Default value: uuidv7() */
  id?: IdealbiotopFileId;

  idealbiotop_id?: IdealbiotopId | null;

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

/** Represents the mutator for the table apflora.idealbiotop_file */
export interface IdealbiotopFileMutator {
  id?: IdealbiotopFileId;

  idealbiotop_id?: IdealbiotopId | null;

  file_id?: string | null;

  file_mime_type?: string | null;

  name?: string | null;

  beschreibung?: string | null;

  created_at?: string;

  updated_at?: string;

  old_id?: string | null;
}