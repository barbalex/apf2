import React, { useContext, useState } from 'react'
import sortBy from 'lodash/sortBy'
import { observer } from 'mobx-react-lite'
import { useApolloClient, gql } from '@apollo/client'

import exportModule from '../../../../modules/export'
import storeContext from '../../../../storeContext'
import { DownloadCardButton, StyledProgressText } from '../index'

const LetzteZaehlung = () => {
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
              query popLastCountsQuery {
                allPops(filter: { vPopLastCountsByPopIdExist: true }) {
                  nodes {
                    id
                    vPopLastCountsByPopId {
                      nodes {
                        artname
                        apId
                        popId
                        popNr
                        popName
                        popStatus
                        jahre
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
        const rows = (result?.data?.allPops?.nodes ?? []).map((z) => ({
          artname: z?.vPopLastCountsByPopId?.nodes?.[0]?.artname ?? '',
          ap_id: z?.vPopLastCountsByPopId?.nodes?.[0]?.apId ?? '',
          pop_id: z?.vPopLastCountsByPopId?.nodes?.[0]?.popId ?? '',
          pop_nr: z?.vPopLastCountsByPopId?.nodes?.[0]?.popNr ?? '',
          pop_name: z?.vPopLastCountsByPopId?.nodes?.[0]?.popName ?? '',
          pop_status: z?.vPopLastCountsByPopId?.nodes?.[0]?.popStatus ?? '',
          jahre: z?.vPopLastCountsByPopId?.nodes?.[0]?.jahre ?? '',
          pflanzenTotal:
            z?.vPopLastCountsByPopId?.nodes?.[0]?.pflanzenTotal ?? '',
          pflanzen_ohne_jungpflanzen:
            z?.vPopLastCountsByPopId?.nodes?.[0]?.pflanzenOhneJungpflanzen ??
            '',
          triebeTotal: z?.vPopLastCountsByPopId?.nodes?.[0]?.triebeTotal ?? '',
          triebe_beweidung:
            z?.vPopLastCountsByPopId?.nodes?.[0]?.triebeBeweidung ?? '',
          keimlinge: z?.vPopLastCountsByPopId?.nodes?.[0]?.keimlinge ?? '',
          davonRosetten:
            z?.vPopLastCountsByPopId?.nodes?.[0]?.davonRosetten ?? '',
          jungpflanzen:
            z?.vPopLastCountsByPopId?.nodes?.[0]?.jungpflanzen ?? '',
          blaetter: z?.vPopLastCountsByPopId?.nodes?.[0]?.blatter ?? '',
          davonBluehende_pflanzen:
            z?.vPopLastCountsByPopId?.nodes?.[0]?.davonBluhendePflanzen ?? '',
          davonBluehende_triebe:
            z?.vPopLastCountsByPopId?.nodes?.[0]?.davonBluhendeTriebe ?? '',
          blueten: z?.vPopLastCountsByPopId?.nodes?.[0]?.bluten ?? '',
          fertile_pflanzen:
            z?.vPopLastCountsByPopId?.nodes?.[0]?.fertilePflanzen ?? '',
          fruchtende_triebe:
            z?.vPopLastCountsByPopId?.nodes?.[0]?.fruchtendeTriebe ?? '',
          bluetenstaende:
            z?.vPopLastCountsByPopId?.nodes?.[0]?.blutenstande ?? '',
          fruchtstaende:
            z?.vPopLastCountsByPopId?.nodes?.[0]?.fruchtstande ?? '',
          gruppen: z?.vPopLastCountsByPopId?.nodes?.[0]?.gruppen ?? '',
          deckung: z?.vPopLastCountsByPopId?.nodes?.[0]?.deckung ?? '',
          pflanzen_5m2: z?.vPopLastCountsByPopId?.nodes?.[0]?.pflanzen5M2 ?? '',
          triebe_in_30m2:
            z?.vPopLastCountsByPopId?.nodes?.[0]?.triebeIn30M2 ?? '',
          triebe_50m2: z?.vPopLastCountsByPopId?.nodes?.[0]?.triebe50M2 ?? '',
          triebe_maehflaeche:
            z?.vPopLastCountsByPopId?.nodes?.[0]?.triebeMahflache ?? '',
          flaeche_m2: z?.vPopLastCountsByPopId?.nodes?.[0]?.flacheM2 ?? '',
          pflanzstellen:
            z?.vPopLastCountsByPopId?.nodes?.[0]?.pflanzstellen ?? '',
          stellen: z?.vPopLastCountsByPopId?.nodes?.[0]?.stellen ?? '',
          andere_zaehleinheit:
            z?.vPopLastCountsByPopId?.nodes?.[0]?.andereZaehleinheit ?? '',
          art_ist_vorhanden:
            z?.vPopLastCountsByPopId?.nodes?.[0]?.artIstVorhanden ?? '',
        }))
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
          data: sortBy(rows, ['artname', 'pop_nr']),
          fileName: 'PopLetzteZaehlungen',
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

export default observer(LetzteZaehlung)
