import { memo, useContext, useState, useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import { useApolloClient, gql } from '@apollo/client'

import { exportModule } from '../../../../modules/export.js'
import { StoreContext } from '../../../../storeContext.js'
import { DownloadCardButton, StyledProgressText } from '../index.jsx'

export const ApOhnePop = memo(
  observer(() => {
    const client = useApolloClient()
    const store = useContext(StoreContext)
    const { enqueNotification } = store

    const [queryState, setQueryState] = useState()

    const onClickApOhnePop = useCallback(async () => {
      setQueryState('lade Daten...')
      let result
      try {
        result = await client.query({
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
      })
      setQueryState(undefined)
    }, [client, enqueNotification, store])

    return (
      <DownloadCardButton
        onClick={onClickApOhnePop}
        color="inherit"
        disabled={!!queryState}
      >
        Arten ohne Populationen
        {queryState ?
          <StyledProgressText>{queryState}</StyledProgressText>
        : null}
      </DownloadCardButton>
    )
  }),
)
