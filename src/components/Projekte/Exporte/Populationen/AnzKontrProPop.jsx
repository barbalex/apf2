import { memo, useContext, useState } from 'react'
import { sortBy } from 'es-toolkit'
import { observer } from 'mobx-react-lite'
import { gql } from '@apollo/client'

import { useApolloClient } from '@apollo/client/react'

import { exportModule } from '../../../../modules/export.js'
import { MobxContext } from '../../../../mobxContext.js'
import { DownloadCardButton, StyledProgressText } from '../index.jsx'

export const AnzKontrProPop = memo(
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
                query popAnzKontrsQuery {
                  allPops {
                    nodes {
                      id
                      vPopAnzkontrsById {
                        nodes {
                          apId
                          artname
                          apBearbeitung
                          apStartJahr
                          apUmsetzung
                          id
                          nr
                          name
                          status
                          bekanntSeit
                          statusUnklar
                          statusUnklarBegruendung
                          x
                          y
                          anzahlKontrollen
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
          const rows = (result?.data?.allPops?.nodes ?? []).map((z) => ({
            ap_id: z?.vPopAnzkontrsById?.nodes?.[0]?.apId ?? '',
            artname: z?.vPopAnzkontrsById?.nodes?.[0]?.artname ?? '',
            ap_bearbeitung:
              z?.vPopAnzkontrsById?.nodes?.[0]?.apBearbeitung ?? '',
            ap_start_jahr: z?.vPopAnzkontrsById?.nodes?.[0]?.apStartJahr ?? '',
            ap_umsetzung: z?.vPopAnzkontrsById?.nodes?.[0]?.apUmsetzung ?? '',
            id: z?.vPopAnzkontrsById?.nodes?.[0]?.id ?? '',
            nr: z?.vPopAnzkontrsById?.nodes?.[0]?.nr ?? '',
            name: z?.vPopAnzkontrsById?.nodes?.[0]?.name ?? '',
            status: z?.vPopAnzkontrsById?.nodes?.[0]?.status ?? '',
            bekannt_seit: z?.vPopAnzkontrsById?.nodes?.[0]?.bekanntSeit ?? '',
            status_unklar: z?.vPopAnzkontrsById?.nodes?.[0]?.statusUnklar ?? '',
            status_unklar_begruendung:
              z?.vPopAnzkontrsById?.nodes?.[0]?.statusUnklarBegruendung ?? '',
            x: z?.vPopAnzkontrsById?.nodes?.[0]?.x ?? '',
            y: z?.vPopAnzkontrsById?.nodes?.[0]?.y ?? '',
            anzahl_kontrollen:
              z?.vPopAnzkontrsById?.nodes?.[0]?.anzahlKontrollen ?? '',
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
            data: sortBy(rows, ['artname', 'nr']),
            fileName: 'PopulationenAnzahlKontrollen',
            store,
          })
          setQueryState(undefined)
        }}
      >
        Anzahl Kontrollen pro Population
        {queryState ?
          <StyledProgressText>{queryState}</StyledProgressText>
        : null}
      </DownloadCardButton>
    )
  }),
)
