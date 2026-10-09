import type { TpopId } from '../../../../models/apflora/Tpop.ts'
import type { PopId } from '../../../../models/apflora/Pop.ts'
import type { ApId } from '../../../../models/apflora/Ap.ts'
import type { ProjektId } from '../../../../models/apflora/Projekt.ts'
import type { TpopkontrId } from '../../../../models/apflora/Tpopkontr.ts'
import type { TpopmassnId } from '../../../../models/apflora/Tpopmassn.ts'
import type { AdresseId } from '../../../../models/apflora/Adresse.ts'
import type { TpopkontrzaehlEinheitWerteId } from '../../../../models/apflora/TpopkontrzaehlEinheitWerte.ts'
import type { TpopkontrzaehlMethodeWerteId } from '../../../../models/apflora/TpopkontrzaehlMethodeWerte.ts'

// node types of the tpop query of the year cell menu (CellForYearMenu/queryTpop.ts)
export interface MenuTpopkontrzaehlEinheitWerteNode {
  id: TpopkontrzaehlEinheitWerteId
  text: string | null
}

export interface MenuTpopkontrzaehlMethodeWerteNode {
  id: TpopkontrzaehlMethodeWerteId
  text: string | null
}

export interface MenuTpopkontrzaehlNode {
  id: string
  anzahl: number | null
  einheit?: TpopkontrzaehlEinheitWerteId | null
  tpopkontrzaehlEinheitWerteByEinheit: MenuTpopkontrzaehlEinheitWerteNode | null
  tpopkontrzaehlMethodeWerteByMethode: MenuTpopkontrzaehlMethodeWerteNode | null
}

export interface MenuAdresseNode {
  id: AdresseId
  name: string | null
}

export interface MenuTpopkontrNode {
  id: TpopkontrId
  datum: Date | null
  typ: string | null
  adresseByBearbeiter: MenuAdresseNode | null
  tpopkontrzaehlsByTpopkontrId: {
    nodes: MenuTpopkontrzaehlNode[]
  }
}

export interface MenuTpopmassnTypWerteNode {
  id: string
  text: string | null
}

export interface MenuTpopmassnNode {
  id: TpopmassnId
  datum: Date | null
  tpopmassnTypWerteByTyp: MenuTpopmassnTypWerteNode | null
  beschreibung: string | null
  anzTriebe: number | null
  anzPflanzen: number | null
  zieleinheitAnzahl: number | null
  tpopkontrzaehlEinheitWerteByZieleinheitEinheit: MenuTpopkontrzaehlEinheitWerteNode | null
  bemerkungen: string | null
  adresseByBearbeiter: MenuAdresseNode | null
}

export interface MenuApNode {
  id: ApId
  projId: ProjektId | null
}

export interface MenuPopNode {
  id: PopId
  apByApId: MenuApNode | null
}

export interface MenuTpopNode {
  id: TpopId
  eks: {
    nodes: MenuTpopkontrNode[]
  }
  ekfs: {
    nodes: MenuTpopkontrNode[]
  }
  massns: {
    nodes: MenuTpopmassnNode[]
  }
  popByPopId: MenuPopNode | null
}

export interface EkplanmenuTpopQueryResult {
  tpopById: MenuTpopNode | null
}
