/** Identifier type for apflora.currentissue */
export type CurrentissueId = string & { __brand: 'apflora.currentissue' };

/** Represents the table apflora.currentissue */
export default interface Currentissue {
  id: CurrentissueId;

  sort: number | null;

  title: string | null;

  /** Bekannter Fehler */
  issue: string | null;

  old_id: string | null;
}

/** Represents the initializer for the table apflora.currentissue */
export interface CurrentissueInitializer {
  /** Default value: uuidv7() */
  id?: CurrentissueId;

  sort?: number | null;

  title?: string | null;

  /** Bekannter Fehler */
  issue?: string | null;

  old_id?: string | null;
}

/** Represents the mutator for the table apflora.currentissue */
export interface CurrentissueMutator {
  id?: CurrentissueId;

  sort?: number | null;

  title?: string | null;

  /** Bekannter Fehler */
  issue?: string | null;

  old_id?: string | null;
}