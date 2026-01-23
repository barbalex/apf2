import { useState } from 'react'
import { useSetAtom } from 'jotai'
import { sortBy } from 'es-toolkit'
import { gql } from '@apollo/client'
import Button from '@mui/material/Button'
import { useApolloClient } from '@apollo/client/react'

import { exportModule } from '../../../../modules/export.ts'

import {
  ApId,
  ApberId,
  AdresseId,
  UserId,
} from '../../../../models/apflora/index.tsx'

import styles from '../index.module.css'

import { addNotificationAtom } from '../../../../JotaiStore/index.ts'

interface ApbersQueryResult {
  allApbers: {
    nodes: Array<{
      apByApId?: {
        id: ApId
        aeTaxonomyByArtId?: {
          id: string
          artname?: string
        }
      }
      id: ApberId
      apId?: ApId
      jahr?: number
      situation?: string
      vergleichVorjahrGesamtziel?: string
      beurteilung?: number
      apErfkritWerteByBeurteilung?: {
        id: number
        text?: string
      }
      veraenderungZumVorjahr?: string
      apberAnalyse?: string
      konsequenzenUmsetzung?: string
      konsequenzenErfolgskontrolle?: string
      biotopeNeue?: string
      biotopeOptimieren?: string
      massnahmenOptimieren?: string
      wirkungAufArt?: string
      createdAt?: string
      updatedAt?: string
      changedBy?: string
      massnahmenApBearb?: string
      massnahmenPlanungVsAusfuehrung?: string
      datum?: string
      bearbeiter?: UserId
      adresseByBearbeiter?: {
        id: AdresseId
        name?: string
      }
    }>
  }
}

export const Ber = () => {
  const addNotification = useSetAtom(addNotificationAtom)
  const apolloClient = useApolloClient()

  const [queryState, setQueryState] = useState()

  const onClickApBer = async () => {
    setQueryState('lade Daten...')
    let result: { data?: ApbersQueryResult }
    try {
      result = await apolloClient.query<ApbersQueryResult>({
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
      addNotification({
        message: (error as Error).message,
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
      return addNotification({
        message: 'Die Abfrage retournierte 0 Datensätze',
        options: {
          variant: 'warning',
        },
      })
    }
    exportModule({
      data: sortBy(rows, ['artname', 'jahr']),
      fileName: 'Jahresberichte',
    })
    setQueryState(undefined)
  }

  return (
    <Button
      className={styles.button}
      onClick={onClickApBer}
      color="inherit"
      disabled={!!queryState}
    >
      AP-Berichte (Jahresberichte)
      {queryState ?
        <span className={styles.progress}>{queryState}</span>
      : null}
    </Button>
  )
}
