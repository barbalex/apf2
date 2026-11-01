import type {
  ApberForApApberNode,
  ApberForApApNode,
  ApberForApJberAbcNode,
} from '../ApberForAp/types.ts'
import type { PopStatusQueryResult } from '../../Projekte/Daten/ApAuswertung/PopStatus/index.tsx'
import type { TpopKontrolliertQueryResult } from '../../Projekte/Daten/ApAuswertung/TpopKontrolliert/index.tsx'
import type { PopMengeQueryResult } from '../../Projekte/Daten/ApAuswertung/PopMenge/index.tsx'

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

// rows of the apber_charts_bulk rpc carry the chart components' node fields
// plus the apId tag the bulk groups by
export interface ApberChartBulkRow {
  apId: string
}

// per-ap slice of the bulk data, in the exact shape the three chart
// components expect as their data prop
export interface ChartsForAp {
  popStatus: PopStatusQueryResult
  tpopKontrolliert: TpopKontrolliertQueryResult
  popMenge: PopMengeQueryResult
}

export interface ApberChartsBulk {
  popStatus: (PopStatusQueryResult['popNachStatusForJber']['nodes'][number] &
    ApberChartBulkRow)[]
  tpopKontrolliert: (TpopKontrolliertQueryResult['tpopKontrolliertForJber']['nodes'][number] &
    ApberChartBulkRow)[]
  popMenge: (PopMengeQueryResult['apAuswPopMenge']['nodes'][number] &
    ApberChartBulkRow)[]
}

export type ApberEkzaehleinheits = (PopMengeQueryResult['allEkzaehleinheits']['nodes'][number] & {
  ap_id: string
})[]

export type ApberPops = (PopMengeQueryResult['allPops']['nodes'][number] & {
  ap_id: string
})[]
