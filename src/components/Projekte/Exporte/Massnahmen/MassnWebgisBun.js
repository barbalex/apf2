import React, { useContext, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useApolloClient, gql } from '@apollo/client'

import exportModule from '../../../../modules/export'
import storeContext from '../../../../storeContext'
import { DownloadCardButton, StyledProgressText } from '../index'

const MassnahmenExporte = () => {
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
        })
        setQueryState(undefined)
      }}
    >
      Massnahmen für WebGIS BUN
      {queryState ? (
        <StyledProgressText>{queryState}</StyledProgressText>
      ) : null}
    </DownloadCardButton>
  )
}

export default observer(MassnahmenExporte)
