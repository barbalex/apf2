import { useContext, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { gql } from '@apollo/client'
import Button from '@mui/material/Button'
import { useApolloClient } from '@apollo/client/react'

import { exportModule } from '../../../../modules/export.js'
import { MobxContext } from '../../../../mobxContext.js'

import { StyledProgressText } from '../index.jsx'
import { button } from '../index.module.css'

export const LetzteZaehlungenInklAnpflanzungen = observer(() => {
  const store = useContext(MobxContext)
  const { enqueNotification } = store

  const apolloClient = useApolloClient()

  const [queryState, setQueryState] = useState()

  return (
    <Button
      className={button}
      color="inherit"
      disabled={!!queryState}
      onClick={async () => {
        setQueryState('lade Daten...')
        let result
        try {
          result = await apolloClient.query({
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
                    deckungXFlache
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
          apolloClient,
        })
        setQueryState(undefined)
      }}
    >
      Aktuellste Zählung inklusive seither erfolgter Anpflanzungen
      {queryState ?
        <StyledProgressText>{queryState}</StyledProgressText>
      : null}
    </Button>
  )
})
