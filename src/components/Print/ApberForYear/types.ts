import type {
  ApberForApApberNode,
  ApberForApApNode,
  ApberForApJberAbcNode,
} from '../ApberForAp/types.ts'

// result of the apberuebersichtByIdQuery (../../Projekte/Daten/Apberuebersicht/query.ts)
// and of the apberuebersichtByIdForApberForYear query (index.tsx)
// jahr is typed non-null: it is passed on as $jahr: Int! to the queries
// loading the report data, so a null jahr makes those fail
// before any data is rendered
export interface ApberuebersichtQueryResult {
  apberuebersichtById: {
    jahr: number
  } | null
}

// ap node of allAps.nodes of the projektByIdForApberForYear query (query.ts);
// extends the ap node ApberForAp works with
export interface ApberForYearApNode extends ApberForApApNode {
  id: string
  bearbeitung: number | null
  aeTaxonomyByArtId: {
    artname: string | null
  } | null
  apbersByApId: {
    totalCount: number
    nodes: ApberForApApberNode[]
  } | null
}

// result of the projektByIdForApberForYear query (query.ts)
export interface ApberForYearQueryResult {
  apberuebersichtById: {
    bemerkungen: string | null
  } | null
  allAps: {
    nodes: ApberForYearApNode[]
  } | null
}

// result of the jberForApberForYear query (jberQuery.ts)
export interface JberQueryResult {
  jberAbc: {
    nodes: ApberForApJberAbcNode[]
  } | null
}
