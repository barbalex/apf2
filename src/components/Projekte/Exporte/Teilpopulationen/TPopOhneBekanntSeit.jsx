import { memo, useContext, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { gql } from '@apollo/client'

import { useApolloClient } from '@apollo/client/react'

import { exportModule } from '../../../../modules/export.js'
import { MobxContext } from '../../../../mobxContext.js'
import { DownloadCardButton, StyledProgressText } from '../index.jsx'

export const TPopOhneBekanntSeit = memo(
  observer(() => {
    const store = useContext(MobxContext)
    const { enqueNotification } = store

    const apolloClient = useApolloClient()

    const [queryState, setQueryState] = useState()

    return (
      <DownloadCardButton
        color="inherit"
        disabled={!!queryState}
        onClick={async () => {
          setQueryState('lade Daten...')
          let result
          try {
            result = await apolloClient.query({
              query: gql`
                query viewTpopOhnebekanntseits {
                  allVTpopOhnebekanntseits {
                    nodes {
                      artname
                      ap_bearbeitung: apBearbeitung
                      pop_nr: popNr
                      pop_name: popName
                      id
                      nr
                      gemeinde
                      flurname
                      bekannt_seit: bekanntSeit
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
          const rows = result.data?.allVTpopOhnebekanntseits?.nodes ?? []
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
            fileName: 'TeilpopulationenVonApArtenOhneBekanntSeit',
            store,
          })
          setQueryState(undefined)
        }}
      >
        {'Teilpopulationen von AP-Arten ohne "Bekannt seit"'}
        {queryState ?
          <StyledProgressText>{queryState}</StyledProgressText>
        : null}
      </DownloadCardButton>
    )
  }),
)
