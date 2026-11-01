/** Identifier type for apflora.detailplaene */
export type DetailplaeneId = string & { __brand: 'apflora.detailplaene' };

/** Represents the table apflora.detailplaene */
export default interface Detailplaene {
  id: DetailplaeneId;

  data: unknown | null;

  geom: unknown | null;

  created_at: string;

  updated_at: string;

  changed_by: string | null;

  old_id: string | null;
}

/** Represents the initializer for the table apflora.detailplaene */
export interface DetailplaeneInitializer {
  /** Default value: uuidv7() */
  id?: DetailplaeneId;

  data?: unknown | null;

  /** Default value: NULL::geometry */
  geom?: unknown | null;

  /** Default value: now() */
  created_at?: string;

  /** Default value: now() */
  updated_at?: string;

  /** Default value: NULL::character varying */
  changed_by?: string | null;

  old_id?: string | null;
}

/** Represents the mutator for the table apflora.detailplaene */
export interface DetailplaeneMutator {
  id?: DetailplaeneId;

  data?: unknown | null;

  geom?: unknown | null;

  created_at?: string;

  updated_at?: string;

  changed_by?: string | null;

  old_id?: string | null;
}