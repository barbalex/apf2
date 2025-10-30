import { useContext, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { gql } from '@apollo/client'
import Button from '@mui/material/Button'

import { useApolloClient } from '@apollo/client/react'

import { exportModule } from '../../../../modules/export.js'
import { MobxContext } from '../../../../mobxContext.js'

import { StyledProgressText } from '../index.jsx'
import { button } from '../index.module.css'

export const AnzMassn = observer(() => {
  const store = useContext(MobxContext)
  const { enqueNotification } = store

  const apolloClient = useApolloClient()

  const [queryState, setQueryState] = useState()

  const onClickAnzMassnProAp = async () => {
    setQueryState('lade Daten...')
    let result
    try {
      result = await apolloClient.query({
        query: gql`
          query apAnzmassnsForExportQuery {
            allAps(orderBy: AE_TAXONOMY_BY_ART_ID__ARTNAME_ASC) {
              nodes {
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
                vApAnzmassnsById {
                  nodes {
                    id
                    anzahlMassnahmen
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
    const rows = (result.data?.allAps?.nodes ?? []).map((z) => ({
      id: z.id,
      artname: z?.aeTaxonomyByArtId?.artname ?? '',
      bearbeitung: z?.apBearbstandWerteByBearbeitung?.text ?? '',
      start_jahr: z.startJahr,
      umsetzung: z?.apUmsetzungWerteByUmsetzung?.text ?? '',
      anzahl_kontrollen:
        z?.vApAnzmassnsById?.nodes?.[0]?.anzahlMassnahmen ?? '',
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
      data: rows,
      fileName: 'ApAnzahlMassnahmen',
      store,
      apolloClient,
    })
    setQueryState(undefined)
  }

  return (
    <Button
      className={button}
      onClick={onClickAnzMassnProAp}
      color="inherit"
      disabled={!!queryState}
    >
      Anzahl Massnahmen pro Art
      {queryState ?
        <StyledProgressText>{queryState}</StyledProgressText>
      : null}
    </Button>
  )
})
