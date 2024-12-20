import { memo, useContext, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useApolloClient, gql } from '@apollo/client'

import { exportModule } from '../../../../modules/export.js'
import { MobxContext } from '../../../../mobxContext.js'
import { DownloadCardButton, StyledProgressText } from '../index.jsx'

export const TPopOhneApberRelevant = memo(
  observer(() => {
    const client = useApolloClient()
    const store = useContext(MobxContext)
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
          })
          setQueryState(undefined)
        }}
      >
        {'Teilpopulationen ohne Eintrag im Feld "Für AP-Bericht relevant"'}
        {queryState ?
          <StyledProgressText>{queryState}</StyledProgressText>
        : null}
      </DownloadCardButton>
    )
  }),
)
