import { memo, useContext, useState } from 'react'
import { sortBy } from 'es-toolkit'
import { observer } from 'mobx-react-lite'
import { gql } from '@apollo/client'

import { useApolloClient } from '@apollo/client/react'

import { exportModule } from '../../../../modules/export.js'
import { MobxContext } from '../../../../mobxContext.js'
import { DownloadCardButton, StyledProgressText } from '../index.jsx'

export const LetzteZaehlungInklAnpflanz = memo(
  observer(() => {
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
                query popLastCountsWithMassnQuery {
                  allPops(
                    filter: { vPopLastCountWithMassnsByPopIdExist: true }
                  ) {
                    nodes {
                      id
                      # view: v_pop_last_count_with_massn
                      vPopLastCountWithMassnsByPopId {
                        nodes {
                          artname
                          apId
                          popId
                          popNr
                          popName
                          popStatus
                          jahre
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
            artname:
              z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]?.artname ?? '',
            ap_id: z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]?.apId ?? '',
            pop_id: z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]?.popId ?? '',
            pop_nr: z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]?.popNr ?? '',
            pop_name:
              z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]?.popName ?? '',
            pop_status:
              z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]?.popStatus ?? '',
            jahre: z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]?.jahre ?? '',
            deckungXFlache:
              z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]?.deckungXFlache ??
              '',
            pflanzenTotal:
              z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]?.pflanzenTotal ??
              '',
            pflanzen_ohne_jungpflanzen:
              z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]
                ?.pflanzenOhneJungpflanzen ?? '',
            triebeTotal:
              z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]?.triebeTotal ?? '',
            triebe_beweidung:
              z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]?.triebeBeweidung ??
              '',
            keimlinge:
              z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]?.keimlinge ?? '',
            davonRosetten:
              z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]?.davonRosetten ??
              '',
            jungpflanzen:
              z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]?.jungpflanzen ?? '',
            blaetter:
              z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]?.blatter ?? '',
            davonBluehende_pflanzen:
              z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]
                ?.davonBluhendePflanzen ?? '',
            davonBluehende_triebe:
              z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]
                ?.davonBluhendeTriebe ?? '',
            blueten:
              z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]?.bluten ?? '',
            fertile_pflanzen:
              z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]?.fertilePflanzen ??
              '',
            fruchtende_triebe:
              z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]?.fruchtendeTriebe ??
              '',
            bluetenstaende:
              z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]?.blutenstande ?? '',
            fruchtstaende:
              z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]?.fruchtstande ?? '',
            gruppen:
              z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]?.gruppen ?? '',
            deckung:
              z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]?.deckung ?? '',
            pflanzen_5m2:
              z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]?.pflanzen5M2 ?? '',
            triebe_in_30m2:
              z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]?.triebeIn30M2 ?? '',
            triebe_50m2:
              z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]?.triebe50M2 ?? '',
            triebe_maehflaeche:
              z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]?.triebeMahflache ??
              '',
            flaeche_m2:
              z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]?.flacheM2 ?? '',
            pflanzstellen:
              z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]?.pflanzstellen ??
              '',
            stellen:
              z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]?.stellen ?? '',
            andere_zaehleinheit:
              z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]
                ?.andereZaehleinheit ?? '',
            art_ist_vorhanden:
              z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]?.artIstVorhanden ??
              '',
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
            fileName: 'PopLetzteZaehlungenInklMassn',
            idKey: 'pop_id',
            store,
          })
          setQueryState(undefined)
        }}
      >
        Aktuellste Zählung inklusive seither erfolgter Anpflanzungen
        {queryState ?
          <StyledProgressText>{queryState}</StyledProgressText>
        : null}
      </DownloadCardButton>
    )
  }),
)
