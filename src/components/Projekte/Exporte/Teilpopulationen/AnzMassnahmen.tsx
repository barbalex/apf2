import { useState } from 'react'
import { useSetAtom } from 'jotai'
import { sortBy } from 'es-toolkit'
import { gql } from '@apollo/client'
import Button from '@mui/material/Button'
import { useApolloClient } from '@apollo/client/react'

import { exportModule } from '../../../../modules/export.ts'

import type { ApId } from '../../../../models/apflora/public/ApId.ts'
import type { PopId } from '../../../../models/apflora/public/PopId.ts'
import type { TpopId } from '../../../../models/apflora/public/TpopId.ts'

import styles from '../index.module.css'

import { addNotificationAtom } from '../../../../JotaiStore/index.ts'

interface TPopAnzMassnsQueryResult {
  allTpops: {
    totalCount: number
    nodes: {
      id: TpopId
      vTpopAnzmassnsById: {
        nodes: {
          apId: ApId
          familie: string | null
          artname: string | null
          apBearbeitung: string | null
          apStartJahr: number | null
          apUmsetzung: string | null
          popId: PopId
          popNr: number | null
          popName: string | null
          popStatus: string | null
          popBekanntSeit: number | null
          popStatusUnklar: boolean | null
          popStatusUnklarBegruendung: string | null
          popX: number | null
          popY: number | null
          id: TpopId
          nr: number | null
          gemeinde: string | null
          flurname: string | null
          status: string | null
          bekanntSeit: number | null
          statusUnklar: boolean | null
          statusUnklarGrund: string | null
          x: number | null
          y: number | null
          radius: number | null
          hoehe: number | null
          exposition: string | null
          klima: string | null
          neigung: string | null
          beschreibung: string | null
          katasterNr: string | null
          apberRelevant: number | null
          apberRelevantGrund: string | null
          eigentuemer: string | null
          kontakt: string | null
          nutzungszone: string | null
          bewirtschafter: string | null
          ekfrequenz: number | null
          ekfrequenzAbweichend: boolean | null
          anzahlMassnahmen: number | null
        }[]
      }
    }[]
  }
}

export const AnzMassnahmen = () => {
  const addNotification = useSetAtom(addNotificationAtom)
  const apolloClient = useApolloClient()

  const [queryState, setQueryState] = useState()

  return (
    <Button
      className={styles.button}
      color="inherit"
      disabled={!!queryState}
      onClick={async () => {
        setQueryState('lade Daten...')
        let result: { data: TPopAnzMassnsQueryResult }
        try {
          result = await apolloClient.query({
            query: gql`
              query tpopAnzMassnQuery {
                allTpops(filter: { vTpopAnzmassnsByIdExist: true }) {
                  totalCount
                  nodes {
                    id
                    vTpopAnzmassnsById {
                      nodes {
                        apId
                        familie
                        artname
                        apBearbeitung
                        apStartJahr
                        apUmsetzung
                        popId
                        popNr
                        popName
                        popStatus
                        popBekanntSeit
                        popStatusUnklar
                        popStatusUnklarBegruendung
                        popX
                        popY
                        id
                        nr
                        gemeinde
                        flurname
                        status
                        bekanntSeit
                        statusUnklar
                        statusUnklarGrund
                        x
                        y
                        radius
                        hoehe
                        exposition
                        klima
                        neigung
                        beschreibung
                        katasterNr
                        apberRelevant
                        apberRelevantGrund
                        eigentuemer
                        kontakt
                        nutzungszone
                        bewirtschafter
                        ekfrequenz
                        ekfrequenzAbweichend
                        anzahlMassnahmen
                      }
                    }
                  }
                }
              }
            `,
          })
        } catch (error) {
          addNotification({
            message: (error as Error).message,
            options: { variant: 'error' },
          })
        }
        setQueryState('verarbeite...')
        const rows = (result.data?.allTpops?.nodes ?? []).map((n) => ({
          ap_id: n?.vTpopAnzmassnsById?.nodes?.[0]?.apId ?? '',
          familie: n?.vTpopAnzmassnsById?.nodes?.[0]?.familie ?? '',
          artname: n?.vTpopAnzmassnsById?.nodes?.[0]?.artname ?? '',
          ap_bearbeitung:
            n?.vTpopAnzmassnsById?.nodes?.[0]?.apBearbeitung ?? '',
          ap_start_jahr: n?.vTpopAnzmassnsById?.nodes?.[0]?.apStartJahr ?? '',
          ap_umsetzung: n?.vTpopAnzmassnsById?.nodes?.[0]?.apUmsetzung ?? '',
          pop_id: n?.vTpopAnzmassnsById?.nodes?.[0]?.popId ?? '',
          pop_nr: n?.vTpopAnzmassnsById?.nodes?.[0]?.popNr ?? '',
          pop_name: n?.vTpopAnzmassnsById?.nodes?.[0]?.popName ?? '',
          pop_status: n?.vTpopAnzmassnsById?.nodes?.[0]?.popStatus ?? '',
          pop_bekannt_seit:
            n?.vTpopAnzmassnsById?.nodes?.[0]?.popBekanntSeit ?? '',
          pop_status_unklar:
            n?.vTpopAnzmassnsById?.nodes?.[0]?.popStatusUnklar ?? '',
          pop_status_unklar_begruendung:
            n?.vTpopAnzmassnsById?.nodes?.[0]?.popStatusUnklarBegruendung ?? '',
          pop_x: n?.vTpopAnzmassnsById?.nodes?.[0]?.popX ?? '',
          pop_y: n?.vTpopAnzmassnsById?.nodes?.[0]?.popY ?? '',
          id: n?.vTpopAnzmassnsById?.nodes?.[0]?.id ?? '',
          nr: n?.vTpopAnzmassnsById?.nodes?.[0]?.nr ?? '',
          gemeinde: n?.vTpopAnzmassnsById?.nodes?.[0]?.gemeinde ?? '',
          flurname: n?.vTpopAnzmassnsById?.nodes?.[0]?.flurname ?? '',
          status: n?.vTpopAnzmassnsById?.nodes?.[0]?.status ?? '',
          bekannt_seit: n?.vTpopAnzmassnsById?.nodes?.[0]?.bekanntSeit ?? '',
          status_unklar: n?.vTpopAnzmassnsById?.nodes?.[0]?.statusUnklar ?? '',
          status_unklar_grund:
            n?.vTpopAnzmassnsById?.nodes?.[0]?.statusUnklarGrund ?? '',
          lv95X: n?.vTpopAnzmassnsById?.nodes?.[0]?.x ?? '',
          lv95Y: n?.vTpopAnzmassnsById?.nodes?.[0]?.y ?? '',
          radius: n?.vTpopAnzmassnsById?.nodes?.[0]?.radius ?? '',
          hoehe: n?.vTpopAnzmassnsById?.nodes?.[0]?.hoehe ?? '',
          exposition: n?.vTpopAnzmassnsById?.nodes?.[0]?.exposition ?? '',
          klima: n?.vTpopAnzmassnsById?.nodes?.[0]?.klima ?? '',
          neigung: n?.vTpopAnzmassnsById?.nodes?.[0]?.neigung ?? '',
          beschreibung: n?.vTpopAnzmassnsById?.nodes?.[0]?.beschreibung ?? '',
          kataster_nr: n?.vTpopAnzmassnsById?.nodes?.[0]?.katasterNr ?? '',
          apber_relevant:
            n?.vTpopAnzmassnsById?.nodes?.[0]?.apberRelevant ?? '',
          apber_relevant_grund:
            n?.vTpopAnzmassnsById?.nodes?.[0]?.apberRelevantGrund ?? '',
          eigentuemer: n?.vTpopAnzmassnsById?.nodes?.[0]?.eigentuemer ?? '',
          kontakt: n?.vTpopAnzmassnsById?.nodes?.[0]?.kontakt ?? '',
          nutzungszone: n?.vTpopAnzmassnsById?.nodes?.[0]?.nutzungszone ?? '',
          bewirtschafter:
            n?.vTpopAnzmassnsById?.nodes?.[0]?.bewirtschafter ?? '',
          ekfrequenz: n?.vTpopAnzmassnsById?.nodes?.[0]?.ekfrequenz ?? '',
          ekfrequenz_abweichend:
            n?.vTpopAnzmassnsById?.nodes?.[0]?.ekfrequenzAbweichend ?? '',
          anzahlMassnahmen:
            n?.vTpopAnzmassnsById?.nodes?.[0]?.anzahlMassnahmen ?? '',
        }))
        if (rows.length === 0) {
          setQueryState(undefined)
          return addNotification({
            message: 'Die Abfrage retournierte 0 Datensätze',
            options: {
              variant: 'warning',
            },
          })
        }
        exportModule({
          data: sortBy(rows, ['artname', 'pop_nr', 'nr']),
          fileName: 'TeilpopulationenAnzahlMassnahmen',
        })
        setQueryState(undefined)
      }}
    >
      Anzahl Massnahmen pro Teilpopulation
      {queryState ?
        <span className={styles.progress}>{queryState}</span>
      : null}
    </Button>
  )
}
