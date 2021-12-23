import React, { useContext, useState, useCallback } from 'react'
import sortBy from 'lodash/sortBy'
import { observer } from 'mobx-react-lite'
import { useApolloClient, gql } from '@apollo/client'

import exportModule from '../../../../modules/export'
import storeContext from '../../../../storeContext'
import { DownloadCardButton, StyledProgressText } from '../index'

const Erfkrit = () => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { enqueNotification } = store

  const [queryState, setQueryState] = useState()

  const onClickErfkrit = useCallback(async () => {
    setQueryState('lade Daten...')
    let result
    try {
      result = await client.query({
        query: gql`
          query erfkritsForExportQuery {
            allErfkrits {
              nodes {
                id
                apId
                apByApId {
                  id
                  aeTaxonomyByArtId {
                    id
                    artname
                  }
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
                apErfkritWerteByErfolg {
                  id
                  text
                }
                kriterien
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
    const rows = (result.data?.allErfkrits?.nodes ?? []).map((z) => ({
      ap_id: z.apId,
      artname: z?.apByApId?.aeTaxonomyByArtId?.artname ?? '',
      ap_bearbeitung: z?.apByApId?.apBearbstandWerteByBearbeitung?.text ?? '',
      ap_start_jahr: z?.apByApId?.startJahr ?? '',
      ap_umsetzung: z?.apByApId?.apUmsetzungWerteByUmsetzung?.text ?? '',
      ap_bearbeiter: z?.apByApId?.adresseByBearbeiter?.name ?? '',
      id: z.id,
      beurteilung: z?.apErfkritWerteByErfolg?.text ?? '',
      kriterien: z.kriterien,
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
      data: sortBy(rows, ['artname', 'beurteilung']),
      fileName: 'Erfolgskriterien',
      store,
    })
    setQueryState(undefined)
  }, [enqueNotification, client, store])

  return (
    <DownloadCardButton
      onClick={onClickErfkrit}
      color="inherit"
      disabled={!!queryState}
    >
      Erfolgskriterien
      {queryState ? (
        <StyledProgressText>{queryState}</StyledProgressText>
      ) : null}
    </DownloadCardButton>
  )
}

export default observer(Erfkrit)
