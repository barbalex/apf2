import React, { useContext, useState, useCallback } from 'react'
import sortBy from 'lodash/sortBy'
import { observer } from 'mobx-react-lite'
import { useApolloClient, gql } from '@apollo/client'

import exportModule from '../../../../modules/export'
import storeContext from '../../../../storeContext'
import { DownloadCardButton, StyledProgressText } from '../index'

const Ber = () => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { enqueNotification } = store

  const [queryState, setQueryState] = useState()

  const onClickApBer = useCallback(async () => {
    setQueryState('lade Daten...')
    let result
    try {
      result = await client.query({
        query: gql`
          query apbersForExportQuery {
            allApbers {
              nodes {
                apByApId {
                  id
                  aeTaxonomyByArtId {
                    id
                    artname
                  }
                }
                id
                apId
                jahr
                situation
                vergleichVorjahrGesamtziel
                beurteilung
                apErfkritWerteByBeurteilung {
                  id
                  text
                }
                veraenderungZumVorjahr
                apberAnalyse
                konsequenzenUmsetzung
                konsequenzenErfolgskontrolle
                biotopeNeue
                biotopeOptimieren
                massnahmenOptimieren
                wirkungAufArt
                createdAt
                updatedAt
                changedBy
                massnahmenApBearb
                massnahmenPlanungVsAusfuehrung
                datum
                bearbeiter
                adresseByBearbeiter {
                  id
                  name
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
    const rows = (result.data?.allApbers?.nodes ?? []).map((z) => ({
      id: z.id,
      ap_id: z.apId,
      artname: z?.apByApId?.aeTaxonomyByArtId?.artname ?? '',
      jahr: z.jahr,
      situation: z.situation,
      vergleich_vorjahr_gesamtziel: z.vergleichVorjahrGesamtziel,
      beurteilung: z.beurteilung,
      beurteilung_decodiert: z?.apErfkritWerteByBeurteilung?.text ?? '',
      veraenderung_zum_vorjahr: z.veraenderungZumVorjahr,
      apber_analyse: z.apberAnalyse,
      konsequenzen_umsetzung: z.konsequenzenUmsetzung,
      konsequenzen_erfolgskontrolle: z.konsequenzenErfolgskontrolle,
      biotope_neue: z.biotopeNeue,
      biotope_optimieren: z.biotopeOptimieren,
      massnahmen_optimieren: z.massnahmenOptimieren,
      wirkung_auf_art: z.wirkungAufArt,
      created_at: z.createdAt,
      updated_at: z.updatedAt,
      changed_by: z.changedBy,
      massnahmen_ap_bearb: z.massnahmenApBearb,
      massnahmen_planung_vs_ausfuehrung: z.massnahmenPlanungVsAusfuehrung,
      datum: z.datum,
      bearbeiter: z.bearbeiter,
      bearbeiter_decodiert: z?.adresseByBearbeiter?.name ?? '',
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
      data: sortBy(rows, ['artname', 'jahr']),
      fileName: 'Jahresberichte',
      store,
    })
    setQueryState(undefined)
  }, [enqueNotification, client, store])

  return (
    <DownloadCardButton
      onClick={onClickApBer}
      color="inherit"
      disabled={!!queryState}
    >
      AP-Berichte (Jahresberichte)
      {queryState ? (
        <StyledProgressText>{queryState}</StyledProgressText>
      ) : null}
    </DownloadCardButton>
  )
}

export default observer(Ber)
