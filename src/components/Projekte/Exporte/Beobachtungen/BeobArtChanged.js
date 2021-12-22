import React, { useContext, useState, useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import { useApolloClient, gql } from '@apollo/client'

import exportModule from '../../../../modules/export'
import storeContext from '../../../../storeContext'
import { DownloadCardButton, StyledProgressText } from '../index'

const BeobachtungenExports = () => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { enqueNotification } = store

  const [queryState, setQueryState] = useState()

  const onClickButton = useCallback(async () => {
    setQueryState('lade Daten...')
    let result
    try {
      result = await client.query({
        query: gql`
          query allBeobsArtChanged {
            allVBeobArtChangeds {
              nodes {
                id
                quelle
                id_field: idField
                original_id: originalId
                art_id_original: artIdOriginal
                artname_original: artnameOriginal
                taxonomie_id_original: taxonomieIdOriginal
                art_id: artId
                artname
                taxonomie_id: taxonomieId
                pop_id: popId
                pop_nr: popNr
                tpop_id: tpopId
                tpop_nr: tpopNr
                tpop_status: tpopStatus
                tpop_gemeinde: tpopGemeinde
                tpop_flurname: tpopFlurname
                lv95X: x
                lv95Y: y
                distanz_zur_teilpopulation: distanzZurTeilpopulation
                datum
                autor
                nicht_zuordnen: nichtZuordnen
                bemerkungen
                created_at: createdAt
                updated_at: updatedAt
                changed_by: changedBy
              }
            }
          }
        `,
      })
    } catch (error) {
      setQueryState(undefined)
      return enqueNotification({
        message: error.message,
        options: {
          variant: 'error',
        },
      })
    }
    setQueryState('verarbeite...')
    const rows = result.data?.allVBeobArtChangeds?.nodes ?? []
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
      fileName: 'BeobachtungenArtVeraendert',
      store,
    })
    setQueryState(undefined)
  }, [client, enqueNotification, store])

  return (
    <DownloadCardButton
      onClick={onClickButton}
      color="inherit"
      disabled={!!queryState}
    >
      Alle Beobachtungen, bei denen die Art verändert wurde
      {queryState ? (
        <StyledProgressText>{queryState}</StyledProgressText>
      ) : null}
    </DownloadCardButton>
  )
}

export default observer(BeobachtungenExports)
