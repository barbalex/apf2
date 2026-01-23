import { useState } from 'react'
import { useSetAtom } from 'jotai'
import { gql } from '@apollo/client'
import Button from '@mui/material/Button'
import { useApolloClient } from '@apollo/client/react'

import { exportModule } from '../../../../modules/export.ts'

import type { ApId } from '../../../../models/apflora/public/ApId.ts'
import type { PopId } from '../../../../models/apflora/public/PopId.ts'
import type { TpopId } from '../../../../models/apflora/public/TpopId.ts'

import styles from '../index.module.css'

import {
  addNotificationAtom,
} from '../../../../JotaiStore/index.ts'


interface TPopLastCountWithMassnQueryResult {
  allVTpopLastCountWithMassns: {
    nodes: {
      artname: string | null
      apId: ApId
      popId: PopId
      popNr: number | null
      popName: string | null
      popStatus: string | null
      tpopId: TpopId
      tpopNr: number | null
      tpopGemeinde: string | null
      tpopFlurname: string | null
      tpopStatus: string | null
      jahr: number | null
      deckungXFlache: number | null
      pflanzenTotal: number | null
      pflanzenOhneJungpflanzen: number | null
      triebeTotal: number | null
      triebeBeweidung: number | null
      keimlinge: number | null
      davonRosetten: number | null
      jungpflanzen: number | null
      blatter: number | null
      davonBluhendePflanzen: number | null
      davonBluhendeTriebe: number | null
      bluten: number | null
      fertilePflanzen: number | null
      fruchtendeTriebe: number | null
      blutenstande: number | null
      fruchtstande: number | null
      gruppen: number | null
      deckung: number | null
      pflanzen5M2: number | null
      triebeIn30M2: number | null
      triebe50M2: number | null
      triebeMahflache: number | null
      flacheM2: number | null
      pflanzstellen: number | null
      stellen: number | null
      andereZaehleinheit: string | null
      artIstVorhanden: boolean | null
    }[]
  }
}

export const LetzteZaehlungenInklAnpflanzungen = () => {
  const addNotification = useSetAtom(addNotificationAtom)
  const apolloClient = useApolloClient()

  const [queryState, setQueryState] = useState()

  return (
    <Button
      className={styles.button}
      color="inherit"
      disabled={!!queryState}
      onClick={async () => {
        setQueryState('lade Daten...')
        let result: { data: TPopLastCountWithMassnQueryResult }
        try {
          result = await apolloClient.query({
            // view: v_tpop_last_count_with_massn
            query: gql`
              query viewTpopLastCountWithMassns {
                allVTpopLastCountWithMassns {
                  nodes {
                    artname
                    apId
                    popId
                    popNr
                    popName
                    popStatus
                    tpopId
                    tpopNr
                    tpopGemeinde
                    tpopFlurname
                    tpopStatus
                    jahr
                    deckungXFlache
                    pflanzenTotal
                    pflanzenOhneJungpflanzen
                    triebeTotal
                    triebeBeweidung
                    keimlinge
                    davonRosetten
                    jungpflanzen
                    blatter
                    davonBluhendePflanzen
                    davonBluhendeTriebe
                    bluten
                    fertilePflanzen
                    fruchtendeTriebe
                    blutenstande
                    fruchtstande
                    gruppen
                    deckung
                    pflanzen5M2
                    triebeIn30M2
                    triebe50M2
                    triebeMahflache
                    flacheM2
                    pflanzstellen
                    stellen
                    andereZaehleinheit
                    artIstVorhanden
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
        const rows = result.data?.allVTpopLastCountWithMassns?.nodes ?? []
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
          data: rows,
          fileName: 'TPopLetzteZaehlungenInklMassn',
          idKey: 'pop_id',
        })
        setQueryState(undefined)
      }}
    >
      Aktuellste Zählung inklusive seither erfolgter Anpflanzungen
      {queryState ?
        <span className={styles.progress}>{queryState}</span>
      : null}
    </Button>
  )
}
