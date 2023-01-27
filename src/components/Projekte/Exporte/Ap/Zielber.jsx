import React, { useContext, useState, useCallback } from 'react'
import sortBy from 'lodash/sortBy'
import { observer } from 'mobx-react-lite'
import { useApolloClient, gql } from '@apollo/client'

import exportModule from '../../../../modules/export'
import storeContext from '../../../../storeContext'
import { DownloadCardButton, StyledProgressText } from '../index'

const Zielber = () => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { enqueNotification } = store

  const [queryState, setQueryState] = useState()

  const onClickZielber = useCallback(async () => {
    setQueryState('lade Daten...')
    let result
    try {
      result = await client.query({
        query: gql`
          query zielbersForExportQuery {
            allZielbers(
              orderBy: [
                ZIEL_BY_ZIEL_ID__JAHR_ASC
                ZIEL_BY_ZIEL_ID__TYP_ASC
                JAHR_ASC
              ]
            ) {
              nodes {
                zielByZielId {
                  id
                  jahr
                  zielTypWerteByTyp {
                    id
                    text
                  }
                  bezeichnung
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
                    adresseByBearbeiter {
                      id
                      name
                    }
                  }
                }
                id
                jahr
                erreichung
                bemerkungen
                createdAt
                updatedAt
                changedBy
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
    const rows = (result.data?.allZielbers?.nodes ?? []).map((z) => ({
      ap_id: z?.zielByZielId?.apByApId?.id ?? '',
      artname: z?.zielByZielId?.apByApId?.aeTaxonomyByArtId?.artname ?? '',
      ap_bearbeitung:
        z?.zielByZielId?.apByApId?.apBearbstandWerteByBearbeitung?.text ?? '',
      ap_start_jahr: z?.zielByZielId?.apByApId?.startJahr ?? '',
      ap_umsetzung:
        z?.zielByZielId?.apByApId?.apUmsetzungWerteByUmsetzung?.text ?? '',
      ap_bearbeiter: z?.zielByZielId?.apByApId?.adresseByBearbeiter?.name ?? '',
      ziel_id: z?.zielByZielId?.id ?? '',
      ziel_jahr: z?.zielByZielId?.jahr ?? '',
      ziel_typ: z?.zielByZielId?.zielTypWerteByTyp?.text ?? '',
      ziel_bezeichnung: z?.zielByZielId?.bezeichnung ?? '',
      id: z.id,
      jahr: z.jahr,
      erreichung: z.erreichung,
      bemerkungen: z.bemerkungen,
      created_at: z.createdAt,
      updated_at: z.updatedAt,
      changed_by: z.changed_by,
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
      data: sortBy(rows, ['artname', 'ziel_jahr', 'ziel_typ', 'jahr']),
      fileName: 'Zielberichte',
      store,
    })
    setQueryState(undefined)
  }, [enqueNotification, client, store])

  return (
    <DownloadCardButton
      onClick={onClickZielber}
      color="inherit"
      disabled={!!queryState}
    >
      Ziel-Berichte
      {queryState ? (
        <StyledProgressText>{queryState}</StyledProgressText>
      ) : null}
    </DownloadCardButton>
  )
}

export default observer(Zielber)
