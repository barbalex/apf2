/** Identifier type for public.migrations */
export type MigrationsId = number & { __brand: 'public.migrations' };

/** Represents the table public.migrations */
export default interface Migrations {
  id: MigrationsId;

  name: string;

  hash: string;

  executed_at: string | null;
}

/** Represents the initializer for the table public.migrations */
export interface MigrationsInitializer {
  id: MigrationsId;

  name: string;

  hash: string;

  /** Default value: now() */
  executed_at?: string | null;
}

/** Represents the mutator for the table public.migrations */
export interface MigrationsMutator {
  id?: MigrationsId;

  name?: string;

  hash?: string;

  executed_at?: string | null;
}