import { sum } from 'es-toolkit'

import { appBaseUrl } from '../../../modules/appBaseUrl.ts'
import {
  store,
  ekPlanEinheitsByApAtom,
  ekPlanShowCountAtom,
  ekPlanFieldsAtom,
  ekPlanShowEkAtom,
  ekPlanShowEkfAtom,
  ekPlanShowMassnAtom,
} from '../../../store/index.ts'

// node types of the export query (queryForExport.ts)
interface ExportTpopkontrzaehlNode {
  einheit: string | null
  anzahl: number | null
  tpopkontrzaehlEinheitWerteByEinheit: {
    ekzaehleinheitsByZaehleinheitId: {
      nodes: unknown[]
    }
  } | null
}

interface ExportTpopkontrNode {
  jahr: number | null
  typ: string | null
  tpopkontrzaehlsByTpopkontrId: {
    nodes: ExportTpopkontrzaehlNode[]
  }
}

interface ExportTpopmassnNode {
  jahr: number | null
  anzTriebe: number | null
  anzPflanzen: number | null
}

export interface ExportTpopNode {
  id: string
  nr: number | null
  gemeinde: string | null
  flurname: string | null
  lv95X: number | null
  lv95Y: number | null
  ekfrequenz: string | null
  ekfrequenzStartjahr: number | null
  ekfrequenzAbweichend: boolean | null
  bekanntSeit: number | null
  ekfrequenzByEkfrequenz: {
    ekAbrechnungstypWerteByEkAbrechnungstyp: { text: string | null } | null
  } | null
  popStatusWerteByStatus: { text: string | null } | null
  adresseByEkfKontrolleur: { name: string | null } | null
  popByPopId: {
    id: string
    nr: number | null
    name: string | null
    popStatusWerteByStatus: { text: string | null } | null
    apByApId: {
      id: string
      projId: string | null
      label: string | null
    } | null
  } | null
  ekplansByTpopId: {
    nodes: { jahr: number | null; typ: string | null }[]
  } | null
  tpopkontrsByTpopId: {
    nodes: ExportTpopkontrNode[]
  } | null
  tpopmassnsByTpopId: {
    nodes: ExportTpopmassnNode[]
  } | null
}

export const exportRowFromTpop = ({
  tpop,
  years,
  ekfrequenzs,
}: {
  // result of the dynamic queryForExport document
  tpop: ExportTpopNode
  years: number[]
  ekfrequenzs: { id: string; code: string | null }[]
}) => {
  const einheitsByAp = store.get(ekPlanEinheitsByApAtom)
  const showCount = store.get(ekPlanShowCountAtom)
  const fields = store.get(ekPlanFieldsAtom)
  const showEk = store.get(ekPlanShowEkAtom)
  const showEkf = store.get(ekPlanShowEkfAtom)
  const showMassn = store.get(ekPlanShowMassnAtom)
  const row: Record<string, unknown> = {
    apId: tpop?.popByPopId?.apByApId?.id,
  }
  if (fields.includes('ap')) {
    row.apName = tpop?.popByPopId?.apByApId?.label
  }
  row.popId = tpop?.popByPopId?.id
  if (fields.includes('popNr')) {
    row.popNr = tpop?.popByPopId?.nr ?? '-'
  }
  if (fields.includes('popName')) {
    row.popName = tpop?.popByPopId?.name ?? '-'
  }
  if (fields.includes('popStatus')) {
    row.popStatus = tpop?.popByPopId?.popStatusWerteByStatus?.text ?? '-'
  }
  row.tpopId = tpop.id
  if (fields.includes('nr')) {
    row.tpopNr = tpop?.nr ?? '-'
  }
  if (fields.includes('gemeinde')) {
    row.tpopGemeinde = tpop?.gemeinde ?? '-'
  }
  if (fields.includes('flurname')) {
    row.tpopFlurname = tpop?.flurname ?? '-'
  }
  if (fields.includes('status')) {
    row.tpopStatus = tpop?.popStatusWerteByStatus?.text ?? '-'
  }
  // check till here
  if (fields.includes('bekanntSeit')) {
    row.tpopBekanntSeit = tpop?.bekanntSeit ?? '-'
  }
  if (fields.includes('lv95X')) {
    row.lv95X = tpop?.lv95X ?? '-'
  }
  if (fields.includes('lv95Y')) {
    row.lv95Y = tpop?.lv95Y ?? '-'
  }
  if (fields.includes('ekfKontrolleur')) {
    row.ekfKontrolleur = tpop?.adresseByEkfKontrolleur?.name ?? '-'
  }
  if (fields.includes('link')) {
    row.tpopLink = `${appBaseUrl()}Daten/Projekte/${
      tpop.popByPopId?.apByApId?.projId
    }/Arten/${tpop.popByPopId?.apByApId?.id}/Populationen/${
      tpop.popByPopId?.id
    }/Teil-Populationen/${tpop.id}`
  }
  if (fields.includes('ekAbrechnungstyp')) {
    row.ekAbrechnungstyp =
      tpop?.ekfrequenzByEkfrequenz?.ekAbrechnungstypWerteByEkAbrechnungstyp
        ?.text ?? ''
  }
  if (fields.includes('ekfrequenz')) {
    let ekfrequenz: string | null = tpop?.ekfrequenz ?? null
    if (ekfrequenz) {
      ekfrequenz = ekfrequenzs.find((f) => f.id === ekfrequenz)?.code ?? null
    }
    row.ekfrequenz = ekfrequenz
  }
  if (fields.includes('ekfrequenzStartjahr')) {
    row.ekfrequenzStartjahr = tpop?.ekfrequenzStartjahr ?? null
  }
  if (fields.includes('ekfrequenzAbweichend')) {
    row.ekfrequenzAbweichend = tpop?.ekfrequenzAbweichend === true
  }

  const ekplans = tpop?.ekplansByTpopId?.nodes ?? []
  const kontrs = tpop?.tpopkontrsByTpopId?.nodes ?? []
  const ansiedlungs = tpop?.tpopmassnsByTpopId?.nodes ?? []
  const einheits = einheitsByAp[row.apId as string] ?? []

  years.forEach((year: number) => {
    if (showEk) {
      const ekplanCount = ekplans
        .filter((o) => o.jahr === year)
        .filter((o) => o.typ === 'EK').length
      row[`${year}_EK_geplant`] = ekplanCount > 0 ? ekplanCount : ''

      const eks = kontrs
        .filter((o) => o.jahr === year)
        .filter((o) => o.typ !== 'Freiwilligen-Kontrolle')
      const eksCount = eks.length
      row[`${year}_EK`] = eksCount > 0 ? eksCount : ''

      if (showCount) {
        const ekSumCounted = sum(
          eks.flatMap((ek) =>
            (ek?.tpopkontrzaehlsByTpopkontrId?.nodes ?? [])
              .filter(
                (z) =>
                  einheits.includes(z.einheit) &&
                  z.anzahl !== null &&
                  (
                    z?.tpopkontrzaehlEinheitWerteByEinheit
                      ?.ekzaehleinheitsByZaehleinheitId?.nodes ?? []
                  ).length > 0,
              )
              .flatMap((z) => (z.anzahl !== null ? [z.anzahl] : [])),
          ),
        )
        row[`${year}_EK_Anzahl`] = ekSumCounted > 0 ? ekSumCounted : ''
      }
    }

    if (showEkf) {
      const ekfPlanCount = ekplans
        .filter((o) => o.jahr === year)
        .filter((o) => o.typ === 'EKF').length
      row[`${year}_EKF_geplant`] = ekfPlanCount > 0 ? ekfPlanCount : ''

      const ekfs = kontrs
        .filter((o) => o.jahr === year)
        .filter((o) => o.typ === 'Freiwilligen-Kontrolle')
      const ekfsCount = ekfs.length
      row[`${year}_EKF`] = ekfsCount > 0 ? ekfsCount : ''

      if (showCount) {
        const ekfSumCounted = sum(
          ekfs.flatMap((ek) =>
            (ek?.tpopkontrzaehlsByTpopkontrId?.nodes ?? [])
              .filter(
                (z) =>
                  einheits.includes(z.einheit) &&
                  z.anzahl !== null &&
                  (
                    z?.tpopkontrzaehlEinheitWerteByEinheit
                      ?.ekzaehleinheitsByZaehleinheitId?.nodes ?? []
                  ).length > 0,
              )
              .flatMap((z) => (z.anzahl !== null ? [z.anzahl] : [])),
          ),
        )
        row[`${year}_EKF_Anzahl`] = ekfSumCounted > 0 ? ekfSumCounted : ''
      }
    }

    if (showMassn) {
      const ansiedlungsOfYear = ansiedlungs.filter((o) => o.jahr === year)
      const ansiedlungsCount = ansiedlungsOfYear.length
      row[`${year}_Ansiedlungen`] = ansiedlungsCount > 0 ? ansiedlungsCount : ''

      if (showCount) {
        const ansiedlungsSumCounted = sum(
          ansiedlungsOfYear
            .filter(
              (ans) => ans.anzTriebe !== null || ans.anzPflanzen !== null,
            )
            .map(
              (ans) =>
                (ans.anzTriebe !== null ? ans.anzTriebe : 0) +
                (ans.anzPflanzen !== null ? ans.anzPflanzen : 0),
            ),
        )
        row[`${year}_Ansiedlungen_Anzahl`] =
          ansiedlungsSumCounted > 0 ? ansiedlungsSumCounted : ''
      }
    }
  })
  return row
}
