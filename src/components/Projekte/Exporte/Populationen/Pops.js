import React, { useContext, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useApolloClient, gql } from '@apollo/client'

import exportModule from '../../../../modules/export'
import storeContext from '../../../../storeContext'
import { DownloadCardButton, StyledProgressText } from '../index'

const Pops = ({ treeName, filtered = false }) => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { enqueNotification, tableIsFiltered } = store
  const { popGqlFilter } = store[treeName]

  const [queryState, setQueryState] = useState()

  const popIsFiltered = tableIsFiltered({
    treeName,
    table: 'pop',
  })

  return (
    <DownloadCardButton
      color="inherit"
      disabled={!!queryState || (filtered && !popIsFiltered)}
      onClick={async () => {
        setQueryState('lade Daten...')
        let result
        try {
          result = await client.query({
            query: gql`
              query popForExportQuery($filter: PopFilter) {
                allPops(
                  filter: $filter
                  orderBy: [AP_BY_AP_ID__LABEL_ASC, NR_ASC]
                ) {
                  nodes {
                    apId
                    apByApId {
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
                    }
                    id
                    nr
                    name
                    popStatusWerteByStatus {
                      id
                      text
                    }
                    bekanntSeit
                    statusUnklar
                    statusUnklarBegruendung
                    x: lv95X
                    y: lv95Y
                    createdAt
                    updatedAt
                    changedBy
                  }
                }
              }
            `,
            variables: {
              filter: filtered ? popGqlFilter.filtered : { or: [] },
            },
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
        const rows = (result?.data?.allPops?.nodes ?? []).map((n) => ({
          apId: n?.apByApId?.id ?? null,
          apArtname: n?.apByApId?.aeTaxonomyByArtId?.artname ?? null,
          apBearbeitung:
            n?.apByApId?.apBearbstandWerteByBearbeitung?.text ?? null,
          apStartJahr: n?.apByApId?.startJahr ?? null,
          apUmsetzung: n?.apByApId?.apUmsetzungWerteByUmsetzung?.text ?? null,
          id: n.id,
          nr: n.nr,
          name: n.name,
          status: n?.popStatusWerteByStatus?.text ?? null,
          bekanntSeit: n.bekanntSeit,
          statusUnklar: n.statusUnklar,
          statusUnklarBegruendung: n.statusUnklarBegruendung,
          x: n.x,
          y: n.y,
          createdAt: n.createdAt,
          updatedAt: n.updatedAt,
          changedBy: n.changedBy,
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
          fileName: `Populationen${filtered ? '_gefiltert' : ''}`,
          store,
        })
        setQueryState(undefined)
      }}
    >
      {filtered ? 'Populationen (gefiltert)' : 'Populationen'}
      {queryState ? (
        <StyledProgressText>{queryState}</StyledProgressText>
      ) : null}
    </DownloadCardButton>
  )
}

export default observer(Pops)
