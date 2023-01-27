import React, { useContext, useState } from 'react'
import sortBy from 'lodash/sortBy'
import { observer } from 'mobx-react-lite'
import { useApolloClient, gql } from '@apollo/client'

import exportModule from '../../../../modules/export'
import storeContext from '../../../../storeContext'
import { DownloadCardButton, StyledProgressText } from '../index'

const LetzterMassnBericht = () => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { enqueNotification } = store

  const [queryState, setQueryState] = useState()

  return (
    <DownloadCardButton
      color="inherit"
      disabled={!!queryState}
      onClick={async () => {
        setQueryState('lade Daten...')
        let result
        try {
          result = await client.query({
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
          enqueNotification({
            message: error.message,
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
          return enqueNotification({
            message: 'Die Abfrage retournierte 0 Datensätze',
            options: {
              variant: 'warning',
            },
          })
        }
        exportModule({
          data: sortBy(rows, ['artname', 'pop_nr']),
          fileName: 'allVPopMitLetzterPopmassnbers',
          store,
        })
        setQueryState(undefined)
      }}
    >
      Populationen mit dem letzten Massnahmen-Bericht
      {queryState ? (
        <StyledProgressText>{queryState}</StyledProgressText>
      ) : null}
    </DownloadCardButton>
  )
}

export default observer(LetzterMassnBericht)
