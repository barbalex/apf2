import { useContext, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { gql } from '@apollo/client'

import { useApolloClient } from '@apollo/client/react'

import { exportModule } from '../../../../modules/export.js'
import { MobxContext } from '../../../../mobxContext.js'
import { DownloadCardButton, StyledProgressText } from '../index.jsx'

export const MassnWebgisBun = observer(() => {
  const store = useContext(MobxContext)
  const { enqueNotification } = store

  const apolloClient = useApolloClient()

  const [queryState, setQueryState] = useState()

  return (
    <DownloadCardButton
      color="inherit"
      disabled={!!queryState}
      onClick={async () => {
        setQueryState('lade Daten...')
        let result
        try {
          result = await apolloClient.query({
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
          enqueNotification({
            message: error.message,
            options: {
              variant: 'error',
            },
          })
        }
        setQueryState('verarbeite...')
        const rows = result.data?.allVMassnWebgisbuns.nodes ?? []
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
          fileName: 'MassnahmenWebGisBun',
          store,
          apolloClient,
        })
        setQueryState(undefined)
      }}
    >
      Massnahmen für WebGIS BUN
      {queryState ?
        <StyledProgressText>{queryState}</StyledProgressText>
      : null}
    </DownloadCardButton>
  )
})
