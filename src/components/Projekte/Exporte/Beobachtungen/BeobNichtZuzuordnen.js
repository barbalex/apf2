import React, { useContext, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useApolloClient, gql } from '@apollo/client'

import exportModule from '../../../../modules/export'
import storeContext from '../../../../storeContext'
import { DownloadCardButton, StyledProgressText } from '../index'

const BeobNichtZuzuordnen = () => {
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
              query allBeobsNichtZuzuordnenForExport {
                allVBeobNichtZuzuordnens {
                  nodes {
                    id
                    quelle
                    id_field: idField
                    original_id: originalId
                    art_id: artId
                    art_id_original: artIdOriginal
                    artname
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
        exportModule({
          data: result?.data?.allVBeobNichtZuzuordnens?.nodes ?? [],
          fileName: 'Beobachtungen',
          store,
        })
        setQueryState(undefined)
      }}
    >
      Alle nicht zuzuordnenden Beobachtungen
      {queryState ? (
        <StyledProgressText>{queryState}</StyledProgressText>
      ) : null}
    </DownloadCardButton>
  )
}

export default observer(BeobNichtZuzuordnen)
