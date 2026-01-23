import { useState } from 'react'
import { useSetAtom } from 'jotai'
import { gql } from '@apollo/client'
import Button from '@mui/material/Button'
import { useApolloClient } from '@apollo/client/react'

import { exportModule } from '../../../../modules/export.ts'

import styles from '../index.module.css'

import { addNotificationAtom } from '../../../../JotaiStore/index.ts'

interface TpopkontrWebgisBunQueryResult {
  allVTpopkontrWebgisbuns: {
    nodes: Array<{
      APARTID?: string
      APART?: string
      POPGUID?: string
      POPNR?: number
      TPOPGUID?: string
      TPOPNR?: number
      TPOPSTATUS?: string
      tpopapberrelevant?: number
      tpopapberrelevantgrund?: string
      KONTRGUID?: string
      KONTRJAHR?: number
      KONTRDAT?: string
      KONTRTYP?: string
      KONTRBEARBEITER?: string
      KONTRUEBERLEBENSRATE?: number
      KONTRVITALITAET?: string
      KONTRENTWICKLUNG?: string
      KONTRURSACHEN?: string
      KONTRERFOLGBEURTEIL?: string
      KONTRAENDUMSETZUNG?: string
      KONTRAENDKONTROLLE?: string
      KONTR_X?: number
      KONTR_Y?: number
      KONTRBEMERKUNGEN?: string
      KONTRLRMDELARZE?: string
      KONTRDELARZEANGRENZ?: string
      KONTRVEGTYP?: string
      KONTRKONKURRENZ?: string
      KONTRMOOSE?: string
      KONTRKRAUTSCHICHT?: string
      KONTRSTRAUCHSCHICHT?: string
      KONTRBAUMSCHICHT?: string
      KONTRUEBEREINSTIMMUNIDEAL?: string
      KONTRHANDLUNGSBEDARF?: string
      KONTRUEBERPRUFTFLAECHE?: number
      KONTRFLAECHETPOP?: number
      KONTRAUFPLAN?: boolean
      KONTRDECKUNGVEG?: number
      KONTRDECKUNGBODEN?: number
      KONTRDECKUNGART?: number
      KONTRJUNGEPLANZEN?: boolean
      KONTRMAXHOEHEVEG?: number
      KONTRMITTELHOEHEVEG?: number
      KONTRGEFAEHRDUNG?: string
      KONTRCHANGEDAT?: string
      KONTRCHANGEBY?: string
      ZAEHLEINHEITEN?: string
      ANZAHLEN?: string
      METHODEN?: string
    }>
  }
}

export const KontrFuerWebgisBun = () => {
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
        let result: { data?: TpopkontrWebgisBunQueryResult }
        try {
          result = await apolloClient.query<TpopkontrWebgisBunQueryResult>({
            query: gql`
              query viewTpopkontrWebgisbuns {
                allVTpopkontrWebgisbuns {
                  nodes {
                    APARTID: apartid
                    APART: apart
                    POPGUID: popguid
                    POPNR: popnr
                    TPOPGUID: tpopguid
                    TPOPNR: tpopnr
                    TPOPSTATUS: tpopstatus
                    tpopapberrelevant: tPopApberRelevant
                    tpopapberrelevantgrund: tPopApberRelevantGrund
                    KONTRGUID: kontrguid
                    KONTRJAHR: kontrjahr
                    KONTRDAT: kontrdat
                    KONTRTYP: kontrtyp
                    KONTRBEARBEITER: kontrbearbeiter
                    KONTRUEBERLEBENSRATE: kontrueberlebensrate
                    KONTRVITALITAET: kontrvitalitaet
                    KONTRENTWICKLUNG: kontrentwicklung
                    KONTRURSACHEN: kontrursachen
                    KONTRERFOLGBEURTEIL: kontrerfolgbeurteil
                    KONTRAENDUMSETZUNG: kontraendumsetzung
                    KONTRAENDKONTROLLE: kontraendkontrolle
                    KONTR_X: kontrX
                    KONTR_Y: kontrY
                    KONTRBEMERKUNGEN: kontrbemerkungen
                    KONTRLRMDELARZE: kontrlrmdelarze
                    KONTRDELARZEANGRENZ: kontrdelarzeangrenz
                    KONTRVEGTYP: kontrvegtyp
                    KONTRKONKURRENZ: kontrkonkurrenz
                    KONTRMOOSE: kontrmoose
                    KONTRKRAUTSCHICHT: kontrkrautschicht
                    KONTRSTRAUCHSCHICHT: kontrstrauchschicht
                    KONTRBAUMSCHICHT: kontrbaumschicht
                    KONTRUEBEREINSTIMMUNIDEAL: kontruebereinstimmunideal
                    KONTRHANDLUNGSBEDARF: kontrhandlungsbedarf
                    KONTRUEBERPRUFTFLAECHE: kontrueberpruftflaeche
                    KONTRFLAECHETPOP: kontrflaechetpop
                    KONTRAUFPLAN: kontraufplan
                    KONTRDECKUNGVEG: kontrdeckungveg
                    KONTRDECKUNGBODEN: kontrdeckungboden
                    KONTRDECKUNGART: kontrdeckungart
                    KONTRJUNGEPLANZEN: kontrjungeplanzen
                    KONTRMAXHOEHEVEG: kontrmaxhoeheveg
                    KONTRMITTELHOEHEVEG: kontrmittelhoeheveg
                    KONTRGEFAEHRDUNG: kontrgefaehrdung
                    KONTRCHANGEDAT: kontrchangedat
                    KONTRCHANGEBY: kontrchangeby
                    ZAEHLEINHEITEN: zaehleinheiten
                    ANZAHLEN: anzahlen
                    METHODEN: methoden
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
        const rows = result.data?.allVTpopkontrWebgisbuns?.nodes ?? []
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
          fileName: 'KontrollenWebGisBun',
        })
        setQueryState(undefined)
      }}
    >
      Kontrollen für WebGIS BUN
      {queryState ?
        <span className={styles.progress}>{queryState}</span>
      : null}
    </Button>
  )
}
