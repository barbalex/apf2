import { useState } from 'react'
import { useSetAtom } from 'jotai'
import { graphql } from '../../../../gql/index.ts'
import Button from '@mui/material/Button'
import { useApolloClient } from '@apollo/client/react'

import { exportModule } from '../../../../modules/export.ts'

import type {
  ApId,
  PopId,
  TpopId,
} from '../../../../models/apflora/index.ts'

import styles from '../index.module.css'

import {
  addNotificationAtom,
} from '../../../../store/index.ts'


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

  const [queryState, setQueryState] = useState<string | undefined>()

  const onClickLetzteZaehlungenInklAnpflanzungen = async () => {
    setQueryState('lade Daten...')
    let result: { data?: TPopLastCountWithMassnQueryResult | undefined } | undefined
    try {
      result = await apolloClient.query<TPopLastCountWithMassnQueryResult>({
        // view: v_tpop_last_count_with_massn
        query: graphql(`
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
            `),
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
    const rows = result?.data?.allVTpopLastCountWithMassns?.nodes ?? []
    if (rows.length === 0) {
      setQueryState(undefined)
      return addNotification({
        message: 'Die Abfrage retournierte 0 Datensätze',
        options: {
          variant: 'warning',
        },
      })
    }
    void exportModule({
      data: rows,
      fileName: 'TPopLetzteZaehlungenInklMassn',
      idKey: 'pop_id',
    } as Parameters<typeof exportModule>[0])
    setQueryState(undefined)
  }

  return (
    <Button
      className={styles.button}
      color="inherit"
      disabled={!!queryState}
      onClick={() => void onClickLetzteZaehlungenInklAnpflanzungen()}
    >
      Aktuellste Zählung inklusive seither erfolgter Anpflanzungen
      {queryState ?
        <span className={styles.progress}>{queryState}</span>
      : null}
    </Button>
  )
}
