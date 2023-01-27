import React, { useContext, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useApolloClient, gql } from '@apollo/client'

import exportModule from '../../../../modules/export'
import storeContext from '../../../../storeContext'
import { DownloadCardButton, StyledProgressText } from '../index'

const LetzteZaehlungenInklAnpflanzungen = () => {
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
            // view: v_tpop_last_count_with_massn
            query: gql`
              query viewTpopLastCountWithMassns {
                allVTpopLastCountWithMassns {
                  nodes {
                    artname
                    apId
                    popId
                    popNr
                    popName
                    popStatus
                    tpopId
                    tpopNr
                    tpopGemeinde
                    tpopFlurname
                    tpopStatus
                    jahr
                    pflanzenTotal
                    pflanzenOhneJungpflanzen
                    triebeTotal
                    triebeBeweidung
                    keimlinge
                    davonRosetten
                    jungpflanzen
                    blatter
                    davonBluhendePflanzen
                    davonBluhendeTriebe
                    bluten
                    fertilePflanzen
                    fruchtendeTriebe
                    blutenstande
                    fruchtstande
                    gruppen
                    deckung
                    pflanzen5M2
                    triebeIn30M2
                    triebe50M2
                    triebeMahflache
                    flacheM2
                    pflanzstellen
                    stellen
                    andereZaehleinheit
                    artIstVorhanden
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
        const rows = result.data?.allVTpopLastCountWithMassns?.nodes ?? []
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
          fileName: 'TPopLetzteZaehlungenInklMassn',
          idKey: 'pop_id',
          store,
        })
        setQueryState(undefined)
      }}
    >
      Aktuellste Zählung inklusive seither erfolgter Anpflanzungen
      {queryState ? (
        <StyledProgressText>{queryState}</StyledProgressText>
      ) : null}
    </DownloadCardButton>
  )
}

export default observer(LetzteZaehlungenInklAnpflanzungen)
