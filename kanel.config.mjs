import { readFileSync } from 'node:fs'
import { makePgTsGenerator } from 'kanel'

// Kanel connects to the dev database from backend-dev/docker-compose.yml.
// It must be running: docker compose -f backend-dev/docker-compose.yml up -d db
// It connects as the postgres superuser: information_schema.views hides
// views the connecting role cannot read, and the restricted roles
// (authenticator/…) would crash the view parser on those.
// A config object is used instead of a URL because the password may
// contain URL-special characters.
const connection =
  process.env.KANEL_DATABASE_URL ||
  (() => {
    const env = readFileSync('backend-dev/.env', 'utf8')
    const vars = Object.fromEntries(
      env
        .split(/\r?\n/)
        .filter((line) => /^[A-Z]/.test(line))
        .map((line) => {
          const i = line.indexOf('=')
          return [line.slice(0, i), line.slice(i + 1).trim()]
        }),
    )
    return {
      host: 'localhost',
      port: 5432,
      user: 'postgres',
      password: vars.POSTGRES_PASSWORD,
      database: vars.DATABASE_URL.split('/').pop(),
    }
  })()

/** @type {import("kanel").Config} */
const config = {
  connection,
  schemaNames: ['apflora', 'auth', 'public', 'request'],
  filter: (pgType) =>
    !['spatial_ref_sys', 'geography_columns', 'geometry_columns'].includes(
      pgType.name,
    ),
  outputPath: './src/models',
  preDeleteOutputFolder: true,
  typescriptConfig: {
    tsModuleFormat: 'esm',
  },
  generators: [
    makePgTsGenerator({
      // rows reach the client exclusively as JSON (PostgREST responses):
      // timestamps are ISO strings, numerics are JSON numbers — never
      // Date objects or pg driver strings
      customTypeMap: {
        'pg_catalog.timestamp': 'string',
        'pg_catalog.timestamptz': 'string',
        'pg_catalog.date': 'string',
        'pg_catalog.numeric': 'number',
        'pg_catalog.citext': 'string',
        timestamp: 'string',
        'timestamp without time zone': 'string',
        timestamptz: 'string',
        date: 'string',
        numeric: 'number',
        citext: 'string',
        // PostgREST returns geometry as WKB hex by default, GeoJSON with
        // Accept: application/geo+json — typed per call site, not per model
        geometry: 'unknown',
      },
    }),
  ],
}

export default config
