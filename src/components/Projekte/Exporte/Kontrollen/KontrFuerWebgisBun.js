import React, { useContext, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useApolloClient, gql } from '@apollo/client'

import exportModule from '../../../../modules/export'
import storeContext from '../../../../storeContext'
import { DownloadCardButton, StyledProgressText } from '../index'

const Kontrollen = () => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { enqueNotification } = store

  const [queryState, setQueryState] = useState()

  return (
    <DownloadCardButton
      color="inherit"
      disabled={!!queryState}
      onClick={async () => {
        setQueryState('lade Daten...')
        let result
        try {
          result = await client.query({
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
          idKey: 'TPOPGUID',
          xKey: 'KONTR_WGS84LAT',
          yKey: 'KONTR_WGS84LONG',
          store,
        })
        setQueryState(undefined)
      }}
    >
      Kontrollen für WebGIS BUN
      {queryState ? (
        <StyledProgressText>{queryState}</StyledProgressText>
      ) : null}
    </DownloadCardButton>
  )
}

export default observer(Kontrollen)
