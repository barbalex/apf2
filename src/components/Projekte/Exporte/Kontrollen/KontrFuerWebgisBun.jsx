import { useContext, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { gql } from '@apollo/client'
import Button from '@mui/material/Button'
import { useApolloClient } from '@apollo/client/react'

import { exportModule } from '../../../../modules/export.js'
import { MobxContext } from '../../../../mobxContext.js'

import styles from '../index.module.css'

export const KontrFuerWebgisBun = observer(() => {
  const store = useContext(MobxContext)
  const { enqueNotification } = store

  const apolloClient = useApolloClient()

  const [queryState, setQueryState] = useState()

  return (
    <Button
      className={styles.button}
      color="inherit"
      disabled={!!queryState}
      onClick={async () => {
        setQueryState('lade Daten...')
        let result
        try {
          result = await apolloClient.query({
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
          enqueNotification({
            message: error.message,
            options: {
              variant: 'error',
            },
          })
        }
        setQueryState('verarbeite...')
        const rows = result.data?.allVTpopkontrWebgisbuns?.nodes ?? []
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
          fileName: 'KontrollenWebGisBun',
          store,
          apolloClient,
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
})
