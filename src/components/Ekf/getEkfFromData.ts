import { sortBy } from 'es-toolkit'

import type { UserId } from '../../models/apflora/User.ts'
import type { AdresseId } from '../../models/apflora/Adresse.ts'
import type { TpopkontrId } from '../../models/apflora/Tpopkontr.ts'
import type { TpopId } from '../../models/apflora/Tpop.ts'
import type { PopId } from '../../models/apflora/Pop.ts'
import type { ApId } from '../../models/apflora/Ap.ts'
import type { ProjektId } from '../../models/apflora/Projekt.ts'

interface AeTaxonomyNode {
  id: string
  artname: string | null
}

interface ProjektNode {
  id: ProjektId
  name: string | null
}

interface ApNode {
  id: ApId
  aeTaxonomyByArtId: AeTaxonomyNode | null
  projektByProjId: ProjektNode | null
}

interface PopNode {
  id: PopId
  nr: number | null
  name: string | null
  apByApId: ApNode | null
}

interface TpopNode {
  id: TpopId
  nr: number | null
  flurname: string | null
  gemeinde: string | null
  popByPopId: PopNode | null
}

interface TpopkontrNode {
  id: TpopkontrId
  datum: string | null
  tpopByTpopId: TpopNode | null
}

interface AdresseNode {
  id: AdresseId
  tpopkontrsByBearbeiter: {
    nodes: TpopkontrNode[]
  } | null
}

interface UserNode {
  id: UserId
  adresseByAdresseId: AdresseNode | null
}

export interface EkfQueryResult {
  userById: UserNode | null
}

export const getEkfFromData = ({ data }: { data?: EkfQueryResult | undefined }) => {
  const ekfNodes =
    data?.userById?.adresseByAdresseId?.tpopkontrsByBearbeiter?.nodes ?? []

  const ekf = ekfNodes.map((e: TpopkontrNode) => ({
    projekt: e?.tpopByTpopId?.popByPopId?.apByApId?.projektByProjId?.name ?? '',
    projId: e?.tpopByTpopId?.popByPopId?.apByApId?.projektByProjId?.id,
    art:
      e?.tpopByTpopId?.popByPopId?.apByApId?.aeTaxonomyByArtId?.artname ?? '',
    apId: e?.tpopByTpopId?.popByPopId?.apByApId?.id,
    pop: `${e?.tpopByTpopId?.popByPopId?.nr ?? '(keine Nr)'}: ${
      e?.tpopByTpopId?.popByPopId?.name ?? '(kein Name)'
    }`,
    popId: e?.tpopByTpopId?.popByPopId?.id,
    popSort: e?.tpopByTpopId?.popByPopId?.nr ?? '(keine Nr)',
    tpop: `${e?.tpopByTpopId?.nr ?? '(keine Nr)'}: ${
      e?.tpopByTpopId?.flurname ?? '(kein Flurname)'
    }`,
    tpopId: e?.tpopByTpopId?.id,
    tpopSort: e?.tpopByTpopId?.nr ?? '(keine Nr)',
    id: e.id,
  }))

  return sortBy(ekf, ['projekt', 'art', 'popSort', 'tpopSort'])
}



export type EkfRow = ReturnType<typeof getEkfFromData>[number]
