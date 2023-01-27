import React, { useContext, useState, useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import { useApolloClient, gql } from '@apollo/client'

import exportModule from '../../../../modules/export'
import storeContext from '../../../../storeContext'
import { DownloadCardButton, StyledProgressText } from '../index'

const Assozart = () => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { enqueNotification } = store

  const [queryState, setQueryState] = useState()

  const onClickAssozarten = useCallback(async () => {
    setQueryState('lade Daten...')
    let result
    try {
      result = await client.query({
        query: gql`
          query assozartsForExportQuery {
            allAssozarts(
              orderBy: [
                AP_BY_AP_ID__LABEL_ASC
                AE_TAXONOMY_BY_AE_ID__ARTNAME_ASC
              ]
            ) {
              nodes {
                id
                apId
                aeTaxonomyByAeId {
                  id
                  artname
                }
                apByApId {
                  id
                  label
                  apBearbstandWerteByBearbeitung {
                    id
                    text
                  }
                  startJahr
                  apUmsetzungWerteByUmsetzung {
                    id
                    text
                  }
                  adresseByBearbeiter {
                    id
                    name
                  }
                }
                bemerkungen
                createdAt
                updatedAt
                changedBy
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
    const rows = (result.data?.allAssozarts?.nodes ?? []).map((z) => ({
      ap_id: z.apId,
      artname: z?.apByApId?.label ?? '',
      ap_bearbeitung: z?.apByApId?.apBearbstandWerteByBearbeitung?.text ?? '',
      ap_start_jahr: z?.apByApId?.startJahr ?? '',
      ap_umsetzung: z?.apByApId?.apUmsetzungWerteByUmsetzung?.text ?? '',
      ap_bearbeiter: z?.apByApId?.adresseByBearbeiter?.name ?? '',
      id: z.id,
      artname_assoziiert: z?.aeTaxonomyByAeId?.artname ?? '',
      bemerkungen: z.bemerkungen,
      created_at: z.createdAt,
      updated_at: z.updatedAt,
      changed_by: z.changedBy,
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
      data: rows,
      fileName: 'AssoziierteArten',
      store,
    })
    setQueryState(undefined)
  }, [enqueNotification, client, store])

  return (
    <DownloadCardButton
      onClick={onClickAssozarten}
      color="inherit"
      disabled={!!queryState}
    >
      Assoziierte Arten
      {queryState ? (
        <StyledProgressText>{queryState}</StyledProgressText>
      ) : null}
    </DownloadCardButton>
  )
}

export default observer(Assozart)
