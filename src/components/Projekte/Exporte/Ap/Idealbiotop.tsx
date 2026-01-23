import { useState } from 'react'
import { useSetAtom } from 'jotai'
import { sortBy } from 'es-toolkit'
import { gql } from '@apollo/client'
import Button from '@mui/material/Button'
import { useApolloClient } from '@apollo/client/react'

import { exportModule } from '../../../../modules/export.ts'

import {
  ApId,
  IdealbiotopId,
  AdresseId,
} from '../../../../models/apflora/index.tsx'

import styles from '../index.module.css'

import { addNotificationAtom } from '../../../../store/index.ts'

interface IdealbiotopsQueryResult {
  allIdealbiotops: {
    nodes: Array<{
      id: IdealbiotopId
      apId?: ApId
      apByApId?: {
        id: ApId
        aeTaxonomyByArtId?: {
          id: string
          artname?: string
        }
        apBearbstandWerteByBearbeitung?: {
          id: number
          text?: string
        }
        startJahr?: number
        apUmsetzungWerteByUmsetzung?: {
          id: number
          text?: string
        }
        adresseByBearbeiter?: {
          id: AdresseId
          name?: string
        }
      }
      erstelldatum?: string
      hoehenlage?: string
      region?: string
      exposition?: string
      besonnung?: string
      hangneigung?: string
      bodenTyp?: string
      bodenKalkgehalt?: string
      bodenDurchlaessigkeit?: string
      bodenHumus?: string
      bodenNaehrstoffgehalt?: string
      wasserhaushalt?: string
      konkurrenz?: string
      moosschicht?: string
      krautschicht?: string
      strauchschicht?: string
      baumschicht?: string
      bemerkungen?: string
      createdAt?: string
      updatedAt?: string
      changedBy?: string
    }>
  }
}

export const Idealbiotop = () => {
  const addNotification = useSetAtom(addNotificationAtom)
  const apolloClient = useApolloClient()

  const [queryState, setQueryState] = useState()

  const onClickIdealbiotop = async () => {
    setQueryState('lade Daten...')
    let result: { data?: IdealbiotopsQueryResult }
    try {
      result = await apolloClient.query<IdealbiotopsQueryResult>({
        query: gql`
          query idealbiotopsForExportQuery {
            allIdealbiotops {
              nodes {
                id
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
                  adresseByBearbeiter {
                    id
                    name
                  }
                }
                erstelldatum
                hoehenlage
                region
                exposition
                besonnung
                hangneigung
                bodenTyp
                bodenKalkgehalt
                bodenDurchlaessigkeit
                bodenHumus
                bodenNaehrstoffgehalt
                wasserhaushalt
                konkurrenz
                moosschicht
                krautschicht
                strauchschicht
                baumschicht
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
      addNotification({
        message: (error as Error).message,
        options: {
          variant: 'error',
        },
      })
    }
    setQueryState('verarbeite...')
    const rows = (result.data?.allIdealbiotops?.nodes ?? []).map((z) => ({
      ap_id: z.apId,
      artname: z?.apByApId?.aeTaxonomyByArtId?.artname ?? '',
      ap_bearbeitung: z?.apByApId?.apBearbstandWerteByBearbeitung?.text ?? '',
      ap_start_jahr: z?.apByApId?.startJahr ?? '',
      ap_umsetzung: z?.apByApId?.apUmsetzungWerteByUmsetzung?.text ?? '',
      ap_bearbeiter: z?.apByApId?.adresseByBearbeiter?.name ?? '',
      id: z.id,
      erstelldatum: z.erstelldatum,
      hoehenlage: z.hoehenlage,
      region: z.region,
      exposition: z.exposition,
      besonnung: z.besonnung,
      hangneigung: z.hangneigung,
      boden_typ: z.bodenTyp,
      boden_kalkgehalt: z.bodenKalkgehalt,
      boden_durchlaessigkeit: z.bodenDurchlaessigkeit,
      boden_humus: z.bodenHumus,
      boden_naehrstoffgehalt: z.bodenNaehrstoffgehalt,
      wasserhaushalt: z.wasserhaushalt,
      konkurrenz: z.konkurrenz,
      moosschicht: z.moosschicht,
      krautschicht: z.krautschicht,
      strauchschicht: z.strauchschicht,
      baumschicht: z.baumschicht,
      bemerkungen: z.bemerkungen,
      created_at: z.createdAt,
      updated_at: z.updatedAt,
      changed_by: z.changedBy,
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
      data: sortBy(rows, ['artname']),
      fileName: 'Idealbiotope',
    })
    setQueryState(undefined)
  }

  return (
    <Button
      className={styles.button}
      onClick={onClickIdealbiotop}
      color="inherit"
      disabled={!!queryState}
    >
      Idealbiotope
      {queryState ?
        <span className={styles.progress}>{queryState}</span>
      : null}
    </Button>
  )
}
