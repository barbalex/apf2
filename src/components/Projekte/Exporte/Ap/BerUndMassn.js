import React, { useContext, useState, useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import { useApolloClient, gql } from '@apollo/client'

import exportModule from '../../../../modules/export'
import storeContext from '../../../../storeContext'
import { DownloadCardButton, StyledProgressText } from '../index'

const ApExports = () => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { enqueNotification } = store

  const [queryState, setQueryState] = useState()

  const onClickApBerUndMassn = useCallback(async () => {
    setQueryState('lade Daten...')
    let result
    try {
      result = await client.query({
        query: gql`
          query ApApberUndMassnsForExportQuery {
            allAps(orderBy: AE_TAXONOMY_BY_ART_ID__ARTNAME_ASC) {
              nodes {
                id
                aeTaxonomyByArtId {
                  id
                  artname
                  artwert
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
                vApApberundmassnsById {
                  nodes {
                    id
                    massnJahr
                    massnAnzahl
                    massnAnzahlBisher
                    berichtErstellt
                  }
                }
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
    const rows = (result.data?.allAps?.nodes ?? []).map((z) => ({
      ap_id: z.id,
      artname: z?.aeTaxonomyByArtId?.artname ?? '',
      ap_bearbeitung: z?.apBearbstandWerteByBearbeitung?.text ?? '',
      ap_start_jahr: z.startJahr,
      ap_umsetzung: z?.apUmsetzungWerteByUmsetzung?.text ?? '',
      ap_bearbeiter: z?.adresseByBearbeiter?.name ?? '',
      artwert: z?.aeTaxonomyByArtId?.artwert ?? '',
      massn_jahr: z?.vApApberundmassnsById?.nodes?.[0]?.massnJahr ?? '',
      massn_anzahl: z?.vApApberundmassnsById?.nodes?.[0]?.massnAnzahl ?? '',
      massn_anzahl_bisher:
        z?.vApApberundmassnsById?.nodes?.[0]?.massnAnzahlBisher ?? '',
      bericht_erstellt:
        z?.vApApberundmassnsById?.nodes?.[0]?.berichtErstellt ?? '',
      created_at: z.createdAt,
      updated_at: z.updatedAt,
      changed_by: z.changedBy,
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
      fileName: 'ApJahresberichteUndMassnahmen',
      store,
    })
    setQueryState(undefined)
  }, [enqueNotification, client, store])

  return (
    <DownloadCardButton
      onClick={onClickApBerUndMassn}
      color="inherit"
      disabled={!!queryState}
    >
      AP-Berichte und Massnahmen
      {queryState ? (
        <StyledProgressText>{queryState}</StyledProgressText>
      ) : null}
    </DownloadCardButton>
  )
}

export default observer(ApExports)
