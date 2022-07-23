import React, { useContext, useState } from 'react'
import sortBy from 'lodash/sortBy'
import { observer } from 'mobx-react-lite'
import { useApolloClient, gql } from '@apollo/client'

import exportModule from '../../../../modules/export'
import storeContext from '../../../../storeContext'
import { DownloadCardButton, StyledProgressText } from '../index'

const LetzterPopBericht = () => {
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
              query popMitLetzterPopbersQuery {
                allPops(filter: { vPopMitLetzterPopbersByPopIdExist: true }) {
                  nodes {
                    id
                    vPopMitLetzterPopbersByPopId {
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
                        popberId
                        popberJahr
                        popberEntwicklung
                        popberBemerkungen
                        popberCreatedAt
                        popberUpdatedAt
                        popberChangedBy
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
          ap_id: z?.vPopMitLetzterPopbersByPopId?.nodes?.[0]?.apId ?? '',
          artname: z?.vPopMitLetzterPopbersByPopId?.nodes?.[0]?.artname ?? '',
          ap_bearbeitung:
            z?.vPopMitLetzterPopbersByPopId?.nodes?.[0]?.apBearbeitung ?? '',
          ap_start_jahr:
            z?.vPopMitLetzterPopbersByPopId?.nodes?.[0]?.apStartJahr ?? '',
          ap_umsetzung:
            z?.vPopMitLetzterPopbersByPopId?.nodes?.[0]?.apUmsetzung ?? '',
          pop_id: z?.vPopMitLetzterPopbersByPopId?.nodes?.[0]?.popId ?? '',
          pop_nr: z?.vPopMitLetzterPopbersByPopId?.nodes?.[0]?.popNr ?? '',
          pop_name: z?.vPopMitLetzterPopbersByPopId?.nodes?.[0]?.popName ?? '',
          pop_status:
            z?.vPopMitLetzterPopbersByPopId?.nodes?.[0]?.popStatus ?? '',
          pop_bekannt_seit:
            z?.vPopMitLetzterPopbersByPopId?.nodes?.[0]?.popBekanntSeit ?? '',
          pop_status_unklar:
            z?.vPopMitLetzterPopbersByPopId?.nodes?.[0]?.popStatusUnklar ?? '',
          pop_status_unklar_begruendung:
            z?.vPopMitLetzterPopbersByPopId?.nodes?.[0]
              ?.popStatusUnklarBegruendung ?? '',
          pop_x: z?.vPopMitLetzterPopbersByPopId?.nodes?.[0]?.popX ?? '',
          pop_y: z?.vPopMitLetzterPopbersByPopId?.nodes?.[0]?.popY ?? '',
          pop_created_at:
            z?.vPopMitLetzterPopbersByPopId?.nodes?.[0]?.popCreatedAt ?? '',
          pop_updated_at:
            z?.vPopMitLetzterPopbersByPopId?.nodes?.[0]?.popUpdatedAt ?? '',
          pop_changed_by:
            z?.vPopMitLetzterPopbersByPopId?.nodes?.[0]?.popChangedBy ?? '',
          popber_id:
            z?.vPopMitLetzterPopbersByPopId?.nodes?.[0]?.popberId ?? '',
          popber_jahr:
            z?.vPopMitLetzterPopbersByPopId?.nodes?.[0]?.popberJahr ?? '',
          popber_entwicklung:
            z?.vPopMitLetzterPopbersByPopId?.nodes?.[0]?.popberEntwicklung ??
            '',
          popber_bemerkungen:
            z?.vPopMitLetzterPopbersByPopId?.nodes?.[0]?.popberBemerkungen ??
            '',
          popber_created_at:
            z?.vPopMitLetzterPopbersByPopId?.nodes?.[0]?.popberCreatedAt ?? '',
          popber_updated_at:
            z?.vPopMitLetzterPopbersByPopId?.nodes?.[0]?.popberUpdatedAt ?? '',
          popber_changed_by:
            z?.vPopMitLetzterPopbersByPopId?.nodes?.[0]?.popberChangedBy ?? '',
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
          fileName: 'PopulationenMitLetzemPopBericht',
          store,
        })
        setQueryState(undefined)
      }}
    >
      Populationen mit dem letzten Populations-Bericht
      {queryState ? (
        <StyledProgressText>{queryState}</StyledProgressText>
      ) : null}
    </DownloadCardButton>
  )
}

export default observer(LetzterPopBericht)
