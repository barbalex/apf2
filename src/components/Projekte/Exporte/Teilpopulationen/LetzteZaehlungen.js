import React, { useContext, useState } from 'react'
import sortBy from 'lodash/sortBy'
import { observer } from 'mobx-react-lite'
import { useApolloClient } from '@apollo/client'

import exportModule from '../../../../modules/export'
import storeContext from '../../../../storeContext'
import { DownloadCardButton, StyledProgressText } from '../index'

const Teilpopulationen = () => {
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
            query: await import('./queryTpopLastCount').then((m) => m.default),
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
        const rows = (result.data?.allTpops?.nodes ?? []).map((z) => ({
          artname: z?.vTpopLastCountsByTpopId?.nodes?.[0]?.artname ?? '',
          ap_id: z?.vTpopLastCountsByTpopId?.nodes?.[0]?.apId ?? '',
          pop_id: z?.vTpopLastCountsByTpopId?.nodes?.[0]?.popId ?? '',
          pop_nr: z?.vTpopLastCountsByTpopId?.nodes?.[0]?.popNr ?? '',
          pop_name: z?.vTpopLastCountsByTpopId?.nodes?.[0]?.popName ?? '',
          pop_status: z?.vTpopLastCountsByTpopId?.nodes?.[0]?.popStatus ?? '',
          tpop_id: z?.vTpopLastCountsByTpopId?.nodes?.[0]?.tpopId ?? '',
          tpop_nr: z?.vTpopLastCountsByTpopId?.nodes?.[0]?.tpopNr ?? '',
          tpop_gemeinde:
            z?.vTpopLastCountsByTpopId?.nodes?.[0]?.tpopGemeinde ?? '',
          tpop_flurname:
            z?.vTpopLastCountsByTpopId?.nodes?.[0]?.tpopFlurname ?? '',
          tpop_status: z?.vTpopLastCountsByTpopId?.nodes?.[0]?.tpopStatus ?? '',
          jahr: z?.vTpopLastCountsByTpopId?.nodes?.[0]?.jahr ?? '',
          pflanzenTotal:
            z?.vTpopLastCountsByTpopId?.nodes?.[0]?.pflanzenTotal ?? '',
          pflanzen_ohne_jungpflanzen:
            z?.vTpopLastCountsByTpopId?.nodes?.[0]?.pflanzenOhneJungpflanzen ??
            '',
          triebeTotal:
            z?.vTpopLastCountsByTpopId?.nodes?.[0]?.triebeTotal ?? '',
          triebe_beweidung:
            z?.vTpopLastCountsByTpopId?.nodes?.[0]?.triebeBeweidung ?? '',
          keimlinge: z?.vTpopLastCountsByTpopId?.nodes?.[0]?.keimlinge ?? '',
          davonRosetten:
            z?.vTpopLastCountsByTpopId?.nodes?.[0]?.davonRosetten ?? '',
          jungpflanzen:
            z?.vTpopLastCountsByTpopId?.nodes?.[0]?.jungpflanzen ?? '',
          blaetter: z?.vTpopLastCountsByTpopId?.nodes?.[0]?.blatter ?? '',
          davonBluehende_pflanzen:
            z?.vTpopLastCountsByTpopId?.nodes?.[0]?.davonBluhendePflanzen ?? '',
          davonBluehende_triebe:
            z?.vTpopLastCountsByTpopId?.nodes?.[0]?.davonBluhendeTriebe ?? '',
          blueten: z?.vTpopLastCountsByTpopId?.nodes?.[0]?.bluten ?? '',
          fertile_pflanzen:
            z?.vTpopLastCountsByTpopId?.nodes?.[0]?.fertilePflanzen ?? '',
          fruchtende_triebe:
            z?.vTpopLastCountsByTpopId?.nodes?.[0]?.fruchtendeTriebe ?? '',
          bluetenstaende:
            z?.vTpopLastCountsByTpopId?.nodes?.[0]?.blutenstande ?? '',
          fruchtstaende:
            z?.vTpopLastCountsByTpopId?.nodes?.[0]?.fruchtstande ?? '',
          gruppen: z?.vTpopLastCountsByTpopId?.nodes?.[0]?.gruppen ?? '',
          deckung: z?.vTpopLastCountsByTpopId?.nodes?.[0]?.deckung ?? '',
          pflanzen_5m2:
            z?.vTpopLastCountsByTpopId?.nodes?.[0]?.pflanzen5M2 ?? '',
          triebe_in_30m2:
            z?.vTpopLastCountsByTpopId?.nodes?.[0]?.triebeIn30M2 ?? '',
          triebe_50m2: z?.vTpopLastCountsByTpopId?.nodes?.[0]?.triebe50M2 ?? '',
          triebe_maehflaeche:
            z?.vTpopLastCountsByTpopId?.nodes?.[0]?.triebeMahflache ?? '',
          flaeche_m2: z?.vTpopLastCountsByTpopId?.nodes?.[0]?.flacheM2 ?? '',
          pflanzstellen:
            z?.vTpopLastCountsByTpopId?.nodes?.[0]?.pflanzstellen ?? '',
          stellen: z?.vTpopLastCountsByTpopId?.nodes?.[0]?.stellen ?? '',
          andere_zaehleinheit:
            z?.vTpopLastCountsByTpopId?.nodes?.[0]?.andereZaehleinheit ?? '',
          art_ist_vorhanden:
            z?.vTpopLastCountsByTpopId?.nodes?.[0]?.artIstVorhanden ?? '',
        }))
        if (rows.length === 0) {
          return enqueNotification({
            message: 'Die Abfrage retournierte 0 Datensätze',
            options: {
              variant: 'warning',
            },
          })
        }
        exportModule({
          data: sortBy(rows, ['artname', 'pop_nr', 'tpop_nr', 'jahr']),
          fileName: 'TPopLetzteZaehlungen',
          idKey: 'pop_id',
          store,
        })
        setQueryState(undefined)
      }}
    >
      Letzte Zählungen
      {queryState ? (
        <StyledProgressText>{queryState}</StyledProgressText>
      ) : null}
    </DownloadCardButton>
  )
}

export default observer(Teilpopulationen)
