import { useState } from 'react'
import { useSetAtom } from 'jotai'
import { gql } from '@apollo/client'
import Button from '@mui/material/Button'
import { useApolloClient } from '@apollo/client/react'

import { exportModule } from '../../../../modules/export.ts'

import styles from '../index.module.css'

import { addNotificationAtom } from '../../../../store/index.ts'

interface MassnWebgisBunQueryResult {
  allVMassnWebgisbuns: {
    nodes: Array<{
      APARTID?: string
      APART?: string
      POPGUID?: string
      POPNR?: number
      TPOPGUID?: string
      TPOPNR?: number
      TPOP_X?: number
      TPOP_Y?: number
      TPOPSTATUS?: string
      tpopapberrelevant?: number
      tpopapberrelevantgrund?: string
      MASSNGUID?: string
      MASSNJAHR?: number
      MASSNDAT?: string
      MASSTYP?: string
      MASSNMASSNAHME?: string
      MASSNBEARBEITER?: string
      MASSNBEMERKUNG?: string
      MASSNPLAN?: boolean
      MASSPLANBEZ?: string
      MASSNFLAECHE?: number
      MASSNFORMANSIEDL?: string
      MASSNPFLANZANORDNUNG?: string
      MASSNMARKIERUNG?: string
      MASSNANZTRIEBE?: number
      MASSNANZPFLANZEN?: number
      MASSNANZPFLANZSTELLEN?: number
      MASSNZIELEINHEITEINHEIT?: string
      MASSNZIELEINHEITANZAHL?: number
      MASSNWIRTSPFLANZEN?: string
      MASSNHERKUNFTSPOP?: string
      MASSNSAMMELDAT?: string
      MASSNVONANZAHLINDIVIDUEN?: number
      MASSNCHANGEDAT?: string
      MASSNCHANGEBY?: string
    }>
  }
}

export const MassnWebgisBun = () => {
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
        let result: { data?: MassnWebgisBunQueryResult }
        try {
          result = await apolloClient.query<MassnWebgisBunQueryResult>({
            query: gql`
              query viewMassnWebgisbuns {
                allVMassnWebgisbuns {
                  nodes {
                    APARTID: apartid
                    APART: apart
                    POPGUID: popguid
                    POPNR: popnr
                    TPOPGUID: tpopguid
                    TPOPNR: tpopnr
                    TPOP_X: tpopX
                    TPOP_Y: tpopY
                    TPOPSTATUS: tpopstatus
                    tpopapberrelevant: tPopApberRelevant
                    tpopapberrelevantgrund: tPopApberRelevantGrund
                    MASSNGUID: massnguid
                    MASSNJAHR: massnjahr
                    MASSNDAT: massndat
                    MASSTYP: masstyp
                    MASSNMASSNAHME: massnmassnahme
                    MASSNBEARBEITER: massnbearbeiter
                    MASSNBEMERKUNG: massnbemerkung
                    MASSNPLAN: massnplan
                    MASSPLANBEZ: massplanbez
                    MASSNFLAECHE: massnflaeche
                    MASSNFORMANSIEDL: massnformansiedl
                    MASSNPFLANZANORDNUNG: massnpflanzanordnung
                    MASSNMARKIERUNG: massnmarkierung
                    MASSNANZTRIEBE: massnanztriebe
                    MASSNANZPFLANZEN: massnanzpflanzen
                    MASSNANZPFLANZSTELLEN: massnanzpflanzstellen
                    MASSNZIELEINHEITEINHEIT: massnzieleinheiteinheit
                    MASSNZIELEINHEITANZAHL: massnzieleinheitanzahl
                    MASSNWIRTSPFLANZEN: massnwirtspflanzen
                    MASSNHERKUNFTSPOP: massnherkunftspop
                    MASSNSAMMELDAT: massnsammeldat
                    MASSNVONANZAHLINDIVIDUEN: massnvonanzahlindividuen
                    MASSNCHANGEDAT: massnchangedat
                    MASSNCHANGEBY: massnchangeby
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
        const rows = result.data?.allVMassnWebgisbuns.nodes ?? []
        if (rows.length === 0) {
          setQueryState(undefined)
          return addNotification({
            message: 'Die Abfrage retournierte 0 Datensätze',
            options: {
              variant: 'warning',
            },
          })
        }
        exportModule({ data: rows, fileName: 'MassnahmenWebGisBun' })
        setQueryState(undefined)
      }}
    >
      Massnahmen für WebGIS BUN
      {queryState ?
        <span className={styles.progress}>{queryState}</span>
      : null}
    </Button>
  )
}
