import type { TpopFilter } from '../../../gql/graphql.ts'

import type { TpopId } from '../../../models/apflora/Tpop.ts'
import type { PopId } from '../../../models/apflora/Pop.ts'
import type { ApId } from '../../../models/apflora/Ap.ts'
import type { ProjektId } from '../../../models/apflora/Projekt.ts'
import type { TpopkontrId } from '../../../models/apflora/Tpopkontr.ts'
import type { TpopmassnId } from '../../../models/apflora/Tpopmassn.ts'
import type { TpopkontrzaehlId } from '../../../models/apflora/Tpopkontrzaehl.ts'
import type { EkfrequenzId } from '../../../models/apflora/Ekfrequenz.ts'
import type { TpopkontrzaehlEinheitWerteId } from '../../../models/apflora/TpopkontrzaehlEinheitWerte.ts'

import type { EkPlanField } from './fields.ts'

export type EkPlanTpopFilter = TpopFilter

export interface HeaderField {
  name: string
  label: string
  sort: number
  width: number
  alwaysShow?: boolean
  value?: unknown
  tpopId?: unknown
  ansiedlungYear?: number
  kontrolleYear?: number
}

export interface Years {
  year: number
  ansiedlungYear: number
  kontrolleYear: number
  ekplanYear: number
}

// node types of the row query (Row/queryRow.ts)
interface EkzaehleinheitCount {
  totalCount: number
}

interface RowTpopkontrzaehlEinheitWerteNode {
  id: TpopkontrzaehlEinheitWerteId
  ekzaehleinheitsByZaehleinheitId: EkzaehleinheitCount
}

export interface RowTpopkontrzaehlNode {
  id: TpopkontrzaehlId
  einheit: TpopkontrzaehlEinheitWerteId | null
  anzahl: number | null
  tpopkontrzaehlEinheitWerteByEinheit: RowTpopkontrzaehlEinheitWerteNode | null
}

export interface RowTpopkontrNode {
  id: TpopkontrId
  jahr: number | null
  tpopkontrzaehlsByTpopkontrId: {
    nodes: RowTpopkontrzaehlNode[]
  }
}

export interface RowTpopmassnNode {
  id: TpopmassnId
  jahr: number | null
  zieleinheitAnzahl: number | null
}

interface RowEkplanNode {
  jahr: number | null
}

interface RowPopStatusWerteNode {
  code: number | null
  text: string | null
}

interface RowEkAbrechnungstypWerteNode {
  id: string
  text: string | null
}

interface RowTpopEkfrequenzNode {
  id: EkfrequenzId
  ekAbrechnungstyp: string | null
  ekAbrechnungstypWerteByEkAbrechnungstyp: RowEkAbrechnungstypWerteNode | null
}

interface RowAdresseNode {
  name: string | null
}

interface RowApNode {
  id: ApId
  projId: ProjektId | null
  label: string | null
}

interface RowPopNode {
  id: PopId
  nr: number | null
  name: string | null
  popStatusWerteByStatus: RowPopStatusWerteNode | null
  apByApId: RowApNode | null
}

export interface RowTpopNode {
  id: TpopId
  nr: number | null
  gemeinde: string | null
  flurname: string | null
  lv95X: number | null
  lv95Y: number | null
  ekfrequenz: EkfrequenzId | null
  ekfrequenzStartjahr: number | null
  ekfrequenzAbweichend: boolean | null
  ekfrequenzByEkfrequenz: RowTpopEkfrequenzNode | null
  popStatusWerteByStatus: RowPopStatusWerteNode | null
  bekanntSeit: number | null
  adresseByEkfKontrolleur: RowAdresseNode | null
  popByPopId: RowPopNode | null
  ekPlans: {
    nodes: RowEkplanNode[]
  }
  ekfPlans: {
    nodes: RowEkplanNode[]
  }
  eks: {
    nodes: RowTpopkontrNode[]
  }
  ekfs: {
    nodes: RowTpopkontrNode[]
  }
  ansiedlungs: {
    nodes: RowTpopmassnNode[]
  }
}

export interface RowEkfrequenzNode {
  id: EkfrequenzId
  code: string | null
  anwendungsfall: string | null
  ekAbrechnungstyp: string | null
  ekAbrechnungstypWerteByEkAbrechnungstyp: RowEkAbrechnungstypWerteNode | null
}

export interface RowQueryForEkPlanResult {
  allEkfrequenzs: {
    nodes: RowEkfrequenzNode[]
  }
  tpopById: RowTpopNode | null
}

// row of column cells, built by Row/tpopRowFromTpop.ts
export interface TpopRow {
  id: TpopId
  tpop: RowTpopNode
  apId?: ApId | undefined
  ap?: EkPlanField
  popNr: EkPlanField
  popName?: EkPlanField
  popStatus?: EkPlanField
  nr: EkPlanField
  gemeinde?: EkPlanField
  flurname?: EkPlanField
  status?: EkPlanField
  bekanntSeit?: EkPlanField
  lv95X?: EkPlanField
  lv95Y?: EkPlanField
  link?: EkPlanField
  ekfKontrolleur?: EkPlanField
  ekAbrechnungstyp?: EkPlanField
  ekfrequenz?: EkPlanField
  ekfrequenzStartjahr?: EkPlanField
  ekfrequenzAbweichend?: EkPlanField
  yearTitle: EkPlanField
  [key: string]: unknown
}
