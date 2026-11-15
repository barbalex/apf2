/** Identifier type for apflora.saved_filter */
export type SavedFilterId = string & { __brand: 'apflora.saved_filter' };

/** Represents the table apflora.saved_filter */
export default interface SavedFilter {
  /** Primärschlüssel */
  id: SavedFilterId;

  /** Name des gespeicherten Filters */
  name: string;

  /** Kompletter Formulardaten-Filter (treeDataFilterAtom) */
  filter: Record<string, unknown>;

  /** Kontoname des Erstellers (serverseitig erzwungen) */
  created_by: string;

  created_at: string;

  updated_at: string;
}

/** Represents the initializer for the table apflora.saved_filter */
export interface SavedFilterInitializer {
  name: string;

  filter: Record<string, unknown>;
}
