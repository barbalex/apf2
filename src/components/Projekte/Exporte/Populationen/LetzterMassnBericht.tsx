import { useContext, useState } from 'react'
import { useSetAtom } from 'jotai'
import { sortBy } from 'es-toolkit'
import { observer } from 'mobx-react-lite'
import { gql } from '@apollo/client'
import Button from '@mui/material/Button'
import { useApolloClient } from '@apollo/client/react'

import { exportModule } from '../../../../modules/export.ts'
import { MobxContext } from '../../../../mobxContext.ts'

import type { ApId } from '../../../../models/apflora/public/ApId.ts'
import type { PopId } from '../../../../models/apflora/public/PopId.ts'

import styles from '../index.module.css'

import { addNotificationAtom } from '../../../../JotaiStore/index.ts'

interface PopMitLetzterPopmassnberQueryResult {
  allPops: {
    nodes: {
      id: PopId
      vPopMitLetzterPopmassnbersByPopId: {
        nodes: {
          apId: ApId
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
          popCreatedAt: string | null
          popUpdatedAt: string | null
          popChangedBy: string | null
          popmassnberId: string | null
          popmassnberJahr: number | null
          popmassnberEntwicklung: number | null
          popmassnberBemerkungen: string | null
          popmassnberCreatedAt: string | null
          popmassnberUpdatedAt: string | null
          popmassnberChangedBy: string | null
        }[]
      }
    }[]
  }
}

export const LetzterMassnBericht = observer(() => {
  const addNotification = useSetAtom(addNotificationAtom)
  const store = useContext(MobxContext)
  const apolloClient = useApolloClient()

  const [queryState, setQueryState] = useState()

  return (
    <Button
      className={styles.button}
      color="inherit"
      disabled={!!queryState}
      onClick={async () => {
        setQueryState('lade Daten...')
        let result: { data: PopMitLetzterPopmassnberQueryResult }
        try {
          result = await apolloClient.query({
            query: gql`
              query popMitLetzterPopmassnbersQuery {
                allPops(
                  filter: { vPopMitLetzterPopmassnbersByPopIdExist: true }
                ) {
                  nodes {
                    id
                    vPopMitLetzterPopmassnbersByPopId {
                      nodes {
                        apId
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
                        popCreatedAt
                        popUpdatedAt
                        popChangedBy
                        popmassnberId
                        popmassnberJahr
                        popmassnberEntwicklung
                        popmassnberBemerkungen
                        popmassnberCreatedAt
                        popmassnberUpdatedAt
                        popmassnberChangedBy
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
            options: {
              variant: 'error',
            },
          })
        }
        setQueryState('verarbeite...')
        const rows = (result?.data?.allPops?.nodes ?? []).map((z) => ({
          ap_id: z?.vPopMitLetzterPopmassnbersByPopId?.nodes?.[0]?.apId ?? '',
          artname:
            z?.vPopMitLetzterPopmassnbersByPopId?.nodes?.[0]?.artname ?? '',
          ap_bearbeitung:
            z?.vPopMitLetzterPopmassnbersByPopId?.nodes?.[0]?.apBearbeitung ??
            '',
          ap_start_jahr:
            z?.vPopMitLetzterPopmassnbersByPopId?.nodes?.[0]?.apStartJahr ?? '',
          ap_umsetzung:
            z?.vPopMitLetzterPopmassnbersByPopId?.nodes?.[0]?.apUmsetzung ?? '',
          pop_id: z?.vPopMitLetzterPopmassnbersByPopId?.nodes?.[0]?.popId ?? '',
          pop_nr: z?.vPopMitLetzterPopmassnbersByPopId?.nodes?.[0]?.popNr ?? '',
          pop_name:
            z?.vPopMitLetzterPopmassnbersByPopId?.nodes?.[0]?.popName ?? '',
          pop_status:
            z?.vPopMitLetzterPopmassnbersByPopId?.nodes?.[0]?.popStatus ?? '',
          pop_bekannt_seit:
            z?.vPopMitLetzterPopmassnbersByPopId?.nodes?.[0]?.popBekanntSeit ??
            '',
          pop_status_unklar:
            z?.vPopMitLetzterPopmassnbersByPopId?.nodes?.[0]?.popStatusUnklar ??
            '',
          pop_status_unklar_begruendung:
            z?.vPopMitLetzterPopmassnbersByPopId?.nodes?.[0]
              ?.popStatusUnklarBegruendung ?? '',
          pop_x: z?.vPopMitLetzterPopmassnbersByPopId?.nodes?.[0]?.popX ?? '',
          pop_y: z?.vPopMitLetzterPopmassnbersByPopId?.nodes?.[0]?.popY ?? '',
          pop_changed:
            z?.vPopMitLetzterPopmassnbersByPopId?.nodes?.[0]?.popChanged ?? '',
          pop_changed_by:
            z?.vPopMitLetzterPopmassnbersByPopId?.nodes?.[0]?.popChangedBy ??
            '',
          popmassnber_id:
            z?.vPopMitLetzterPopmassnbersByPopId?.nodes?.[0]?.popmassnberId ??
            '',
          popmassnber_jahr:
            z?.vPopMitLetzterPopmassnbersByPopId?.nodes?.[0]?.popmassnberJahr ??
            '',
          popmassnber_entwicklung:
            z?.vPopMitLetzterPopmassnbersByPopId?.nodes?.[0]
              ?.popmassnberEntwicklung ?? '',
          popmassnber_bemerkungen:
            z?.vPopMitLetzterPopmassnbersByPopId?.nodes?.[0]
              ?.popmassnberBemerkungen ?? '',
          popmassnber_changed:
            z?.vPopMitLetzterPopmassnbersByPopId?.nodes?.[0]
              ?.popmassnberChanged ?? '',
          popmassnber_changed_by:
            z?.vPopMitLetzterPopmassnbersByPopId?.nodes?.[0]
              ?.popmassnberChangedBy ?? '',
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
          data: sortBy(rows, ['artname', 'pop_nr']),
          fileName: 'allVPopMitLetzterPopmassnbers',
        })
        setQueryState(undefined)
      }}
    >
      Populationen mit dem letzten Massnahmen-Bericht
      {queryState ?
        <span className={styles.progress}>{queryState}</span>
      : null}
    </Button>
  )
})
