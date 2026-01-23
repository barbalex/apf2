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

interface PopPopberUndMassnberQueryResult {
  allPops: {
    nodes: {
      id: PopId
      vPopPopberundmassnbersByPopId: {
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
          jahr: number | null
          popberId: string | null
          popberJahr: number | null
          popberEntwicklung: number | null
          popberBemerkungen: string | null
          popberCreatedAt: string | null
          popberUpdatedAt: string | null
          popberChangedBy: string | null
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

export const Berichte = observer(() => {
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
        let result: { data: PopPopberUndMassnberQueryResult }
        try {
          result = await apolloClient.query({
            query: gql`
              query popPopberUndMassnberQuery {
                allPops(filter: { vPopPopberundmassnbersByPopIdExist: true }) {
                  nodes {
                    id
                    vPopPopberundmassnbersByPopId {
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
                        jahr
                        popberId
                        popberJahr
                        popberEntwicklung
                        popberBemerkungen
                        popberCreatedAt
                        popberUpdatedAt
                        popberChangedBy
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
        // need to flatmap because view delivers multiple rows per pop
        const rows = (result?.data?.allPops?.nodes ?? []).flatMap((z0) =>
          (z0?.vPopPopberundmassnbersByPopId?.nodes ?? []).map((z) => ({
            ap_id: z.apId,
            artname: z.artname,
            ap_bearbeitung: z.apBearbeitung,
            ap_start_jahr: z.apStartJahr,
            ap_umsetzung: z.apUmsetzung,
            pop_id: z.popId,
            pop_nr: z.popNr,
            pop_name: z.popName,
            pop_status: z.popStatus,
            pop_bekannt_seit: z.popBekanntSeit,
            pop_status_unklar: z.popStatusUnklar,
            pop_status_unklar_begruendung: z.popStatusUnklarBegruendung,
            pop_x: z.popX,
            pop_y: z.popY,
            pop_created_at: z.popCreatedAt,
            pop_updated_at: z.popUpdatedAt,
            pop_changed_by: z.popChangedBy,
            jahr: z.jahr,
            popber_id: z.popberId,
            popber_jahr: z.popberJahr,
            popber_entwicklung: z.popberEntwicklung,
            popber_bemerkungen: z.popberBemerkungen,
            popber_created_at: z.popberCreatedAt,
            popber_updated_at: z.popberUpdatedAt,
            popber_changed_by: z.popberChangedBy,
            popmassnber_id: z.popmassnberId,
            popmassnber_jahr: z.popmassnberJahr,
            popmassnber_entwicklung: z.popmassnberEntwicklung,
            popmassnber_bemerkungen: z.popmassnberBemerkungen,
            popmassnber_created_at: z.popmassnberCreatedAt,
            popmassnber_updated_at: z.popmassnberUpdatedAt,
            popmassnber_changed_by: z.popmassnberChangedBy,
          })),
        )
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
          data: sortBy(rows, ['artname', 'pop_nr', 'jahr']),
          fileName: 'PopulationenPopUndMassnBerichte',
        })
        setQueryState(undefined)
      }}
    >
      Populationen inkl. Populations- und Massnahmen-Berichte
      {queryState ?
        <span className={styles.progress}>{queryState}</span>
      : null}
    </Button>
  )
})
