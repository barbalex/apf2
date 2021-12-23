import React, { useContext, useState, useCallback } from 'react'
import sortBy from 'lodash/sortBy'
import { observer } from 'mobx-react-lite'
import { useApolloClient, gql } from '@apollo/client'

import exportModule from '../../../../modules/export'
import storeContext from '../../../../storeContext'
import { DownloadCardButton, StyledProgressText } from '../index'

const Ziele = () => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { enqueNotification } = store

  const [queryState, setQueryState] = useState()

  const onClickZiele = useCallback(async () => {
    setQueryState('lade Daten...')
    let result
    try {
      result = await client.query({
        query: gql`
          query zielsForExportQuery {
            allZiels(
              orderBy: [
                AP_BY_AP_ID__ART_ID_ASC
                JAHR_ASC
                ZIEL_TYP_WERTE_BY_TYP__TEXT_ASC
                ZIEL_TYP_WERTE_BY_TYP__TEXT_ASC
              ]
            ) {
              nodes {
                id
                jahr
                typ
                zielTypWerteByTyp {
                  id
                  text
                }
                bezeichnung
                apByApId {
                  id
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
                  aeTaxonomyByArtId {
                    id
                    artname
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
    const rows = (result.data?.allZiels?.nodes ?? []).map((z) => ({
      ap_id: z.id,
      artname: z?.apByApId?.aeTaxonomyByArtId?.artname ?? '',
      ap_bearbeitung: z?.apByApId?.apBearbstandWerteByBearbeitung?.text ?? '',
      ap_start_jahr: z?.apByApId?.startJahr ?? '',
      ap_umsetzung: z?.apByApId?.apUmsetzungWerteByUmsetzung?.text ?? '',
      ap_bearbeiter: z?.apByApId?.adresseByBearbeiter?.name ?? '',
      id: z.id,
      jahr: z.jahr,
      typ: z?.zielTypWerteByTyp?.text ?? '',
      bezeichnung: z.bezeichnung,
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
      data: sortBy(rows, 'artname'),
      fileName: 'ApZiele',
      store,
    })
    setQueryState(undefined)
  }, [enqueNotification, client, store])

  return (
    <DownloadCardButton
      onClick={onClickZiele}
      color="inherit"
      disabled={!!queryState}
    >
      Ziele
      {queryState ? (
        <StyledProgressText>{queryState}</StyledProgressText>
      ) : null}
    </DownloadCardButton>
  )
}

export default observer(Ziele)
