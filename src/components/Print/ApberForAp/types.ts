import type { ApberId } from '../../../models/apflora/Apber.ts'
import type { ErfkritId } from '../../../models/apflora/Erfkrit.ts'
import type { TpopmassnId } from '../../../models/apflora/Tpopmassn.ts'
import type { ZielId } from '../../../models/apflora/Ziel.ts'

// node types of the queries feeding ApberForAp:
// ApberForApFromAp/apByIdJahr.ts and ApberForYear/query.ts

export interface ApberForApApErfkritWerteNode {
  id: number
  text: string | null
  sort: number | null
}

export interface ApberForApErfkritNode {
  id: ErfkritId
  kriterien: string | null
  apErfkritWerteByErfolg: ApberForApApErfkritWerteNode | null
}

export interface ApberForApZielTypWerteNode {
  id: number
  text: string | null
  sort: number | null
}

export interface ApberForApZielNode {
  id: ZielId
  bezeichnung: string | null
  erreichung: string | null
  bemerkungen: string | null
  zielTypWerteByTyp: ApberForApZielTypWerteNode | null
}

export interface ApberForApApberNode {
  id: ApberId
  datum: Date | null
  biotopeNeue: string | null
  biotopeOptimieren: string | null
  massnahmenPlanungVsAusfuehrung: string | null
  massnahmenOptimieren: string | null
  massnahmenApBearb: string | null
  vergleichVorjahrGesamtziel: string | null
  wirkungAufArt: string | null
  apberAnalyse: string | null
  konsequenzenUmsetzung: string | null
  konsequenzenErfolgskontrolle: string | null
  apErfkritWerteByBeurteilung: ApberForApApErfkritWerteNode | null
}

export interface ApberForApTpopmassnTypWerteNode {
  id: number
  text: string | null
}

export interface ApberForApTpopmassnNode {
  id: TpopmassnId
  datum: string | null
  tpopmassnTypWerteByTyp: ApberForApTpopmassnTypWerteNode | null
  beschreibung: string | null
  tpopByTpopId: {
    id: string
    nr: number | null
    flurname: string | null
    popByPopId: {
      id: string
      nr: number | null
      name: string | null
    } | null
  } | null
}

export interface ApberForApTpopNode {
  id: string
  tpopmassnsByTpopId: {
    nodes: ApberForApTpopmassnNode[]
  }
}

export interface ApberForApPopNode {
  id: string
  tpopsByPopId: {
    nodes: ApberForApTpopNode[]
  }
}

// the ap node ApberForAp works with:
// apById of the apByIdJahr query or an element of allAps.nodes of ApberForYear
export interface ApberForApApNode {
  apbersByApId?: {
    nodes: ApberForApApberNode[]
  } | null
  erfkritsByApId?: {
    nodes: ApberForApErfkritNode[]
  } | null
  zielsByApId?: {
    nodes: ApberForApZielNode[]
  } | null
  popsByApId?: {
    nodes: ApberForApPopNode[]
  } | null
}

// node type of the jberAbcByApId / jberAbc queries (view apflora.jber_abc)
export interface ApberForApJberAbcNode {
  // ap.id of the ap the data was computed for
  id: string
  artname: string | null
  startJahr: number | null
  bearbeiter: string | null
  // only selected by the jberAbc query of ApberForYear
  bearbeitung?: number | null
  a3LPop: number | null
  a3LTpop: number | null
  a4LPop: number | null
  a4LTpop: number | null
  a5LPop: number | null
  a5LTpop: number | null
  a7LPop: number | null
  a7LTpop: number | null
  a8LPop: number | null
  a8LTpop: number | null
  a9LPop: number | null
  a9LTpop: number | null
  b1LPop: number | null
  b1LTpop: number | null
  b1FirstYear: number | null
  b1RPop: number | null
  b1RTpop: number | null
  c1LPop: number | null
  c1LTpop: number | null
  c1RPop: number | null
  c1RTpop: number | null
  c1FirstYear: number | null
  firstMassn: number | null
  c2RPop: number | null
  c2RTpop: number | null
  c3RPop: number | null
  c3RTpop: number | null
  c4RPop: number | null
  c4RTpop: number | null
  c5RPop: number | null
  c5RTpop: number | null
  c6RPop: number | null
  c6RTpop: number | null
  c7RPop: number | null
  c7RTpop: number | null
  erfolg: number | null
  erfolgVorjahr: number | null
}

export interface ApberForApProps {
  apId?: string | undefined
  jahr?: number | undefined
  /**
   * when ApberForAp is called from ApberForApFromAp
   * the result of the apByIdJahr query is passed
   * and the ap node lives in apById;
   * when ApberForAp is called from ApberForYear (isSubReport)
   * the ap node itself is passed
   */
  apData?:
    | { apById?: ApberForApApNode | null }
    | ApberForApApNode
    | undefined
  node?: ApberForApJberAbcNode | undefined
  /**
   * when ApberForAp is called from ApberForYear
   * isSubReport is passed
   */
  isSubReport?: boolean
  // and need to build print button only once
  // so only when index is 0
  subReportIndex?: number
}
