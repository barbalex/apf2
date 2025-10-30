import { useContext, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { gql } from '@apollo/client'
import Button from '@mui/material/Button'
import { useApolloClient } from '@apollo/client/react'

import { exportModule } from '../../../../modules/export.js'
import { MobxContext } from '../../../../mobxContext.js'

import { button, progress } from '../index.module.css'

export const ApOhnePop = observer(() => {
  const store = useContext(MobxContext)
  const { enqueNotification } = store

  const apolloClient = useApolloClient()

  const [queryState, setQueryState] = useState()

  const onClickApOhnePop = async () => {
    setQueryState('lade Daten...')
    let result
    try {
      result = await apolloClient.query({
        query: gql`
          query apOhnepopForExportQuery {
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
                popsByApId {
                  totalCount
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
    const rows = (result.data?.allAps?.nodes ?? [])
      .filter((z) => z?.popsByApId?.totalCount === 0)
      .map((z) => ({
        id: z.id,
        artname: z?.aeTaxonomyByArtId.artname ?? '',
        bearbeitung: z?.apBearbstandWerteByBearbeitung?.text ?? '',
        start_jahr: z.startJahr,
        umsetzung: z?.apUmsetzungWerteByUmsetzung?.text ?? '',
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
      fileName: 'ApOhnePopulationen',
      store,
      apolloClient,
    })
    setQueryState(undefined)
  }

  return (
    <Button
      className={button}
      onClick={onClickApOhnePop}
      color="inherit"
      disabled={!!queryState}
    >
      Arten ohne Populationen
      {queryState ?
        <span className={progress}>{queryState}</span>
      : null}
    </Button>
  )
})
