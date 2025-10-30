import { useContext, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { gql } from '@apollo/client'
import Button from '@mui/material/Button'
import { useApolloClient } from '@apollo/client/react'

import { exportModule } from '../../../../modules/export.js'
import { MobxContext } from '../../../../mobxContext.js'

import { button, progress } from '../index.module.css'

export const TPopOhneApberRelevant = observer(() => {
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
            query: gql`
              query viewTpopOhneapberichtrelevants {
                allVTpopOhneapberichtrelevants {
                  nodes {
                    artname
                    pop_nr: popNr
                    pop_name: popName
                    id
                    nr
                    gemeinde
                    flurname
                    apber_relevant: apberRelevant
                    apber_relevant_grund: apberRelevantGrund
                    lv95X: x
                    lv95Y: y
                  }
                }
              }
            `,
          })
        } catch (error) {
          enqueNotification({
            message: error.message,
            options: { variant: 'error' },
          })
        }
        setQueryState('verarbeite...')
        const rows = result.data?.allVTpopOhneapberichtrelevants?.nodes ?? []
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
          fileName: 'TeilpopulationenOhneApBerichtRelevant',
          store,
          apolloClient,
        })
        setQueryState(undefined)
      }}
    >
      {'Teilpopulationen ohne Eintrag im Feld "Für AP-Bericht relevant"'}
      {queryState ?
        <span className={progress}>{queryState}</span>
      : null}
    </Button>
  )
})
