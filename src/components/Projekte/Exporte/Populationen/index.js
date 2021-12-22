import React, { useContext, useState } from 'react'
import Collapse from '@mui/material/Collapse'
import Icon from '@mui/material/Icon'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'
import sortBy from 'lodash/sortBy'
import { observer } from 'mobx-react-lite'
import { useApolloClient, gql } from '@apollo/client'
import { useSnackbar } from 'notistack'

import exportModule from '../../../../modules/export'
import storeContext from '../../../../storeContext'
import {
  StyledCardContent,
  CardActionTitle,
  StyledCard,
  StyledCardActions,
  CardActionIconButton,
  DownloadCardButton,
} from '../index'
import Pops from './Pops'
import PopsForGoogleEarth from './PopsForGoogleEarth'
import PopsForGEArtname from './PopsForGEArtname'
import ApOhneStatus from './ApOhneStatus'
import OhneKoord from './OhneKoord'
import AnzMassnBerichtsjahr from './AnzMassnBerichtsjahr'
import AnzMassnProPop from './AnzMassnProPop'
import AnzKontrProPop from './AnzKontrProPop'
import Berichte from './Berichte'
import LetzterPopBericht from './LetzterPopBericht'
import LetzterMassnBericht from './LetzterMassnBericht'

const PopulationenExports = () => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { enqueNotification, removeNotification } = store
  const [expanded, setExpanded] = useState(false)
  const { closeSnackbar } = useSnackbar()

  return (
    <StyledCard>
      <StyledCardActions disableSpacing onClick={() => setExpanded(!expanded)}>
        <CardActionTitle>Populationen</CardActionTitle>
        <CardActionIconButton
          data-expanded={expanded}
          aria-expanded={expanded}
          aria-label="öffnen"
          color="inherit"
        >
          <Icon title={expanded ? 'schliessen' : 'öffnen'}>
            <ExpandMoreIcon />
          </Icon>
        </CardActionIconButton>
      </StyledCardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        {expanded ? (
          <StyledCardContent>
            <Pops />
            <PopsForGoogleEarth />
            <PopsForGEArtname />
            <ApOhneStatus />
            <OhneKoord />
            <AnzMassnBerichtsjahr />
            <AnzMassnProPop />
            <AnzKontrProPop />
            <Berichte />
            <LetzterPopBericht />
            <LetzterMassnBericht />
            <DownloadCardButton
              color="inherit"
              onClick={async () => {
                const notif = enqueNotification({
                  message: `Export "PopulationenLetzteZaehlungen" wird vorbereitet...`,
                  options: {
                    variant: 'info',
                    persist: true,
                  },
                })
                let result
                try {
                  result = await client.query({
                    query: await import('./queryPopLastCounts').then(
                      (m) => m.default,
                    ),
                  })
                } catch (error) {
                  enqueNotification({
                    message: error.message,
                    options: {
                      variant: 'error',
                    },
                  })
                }
                const rows = (result?.data?.allPops?.nodes ?? []).map((z) => ({
                  artname: z?.vPopLastCountsByPopId?.nodes?.[0]?.artname ?? '',
                  ap_id: z?.vPopLastCountsByPopId?.nodes?.[0]?.apId ?? '',
                  pop_id: z?.vPopLastCountsByPopId?.nodes?.[0]?.popId ?? '',
                  pop_nr: z?.vPopLastCountsByPopId?.nodes?.[0]?.popNr ?? '',
                  pop_name: z?.vPopLastCountsByPopId?.nodes?.[0]?.popName ?? '',
                  pop_status:
                    z?.vPopLastCountsByPopId?.nodes?.[0]?.popStatus ?? '',
                  jahre: z?.vPopLastCountsByPopId?.nodes?.[0]?.jahre ?? '',
                  pflanzenTotal:
                    z?.vPopLastCountsByPopId?.nodes?.[0]?.pflanzenTotal ?? '',
                  pflanzen_ohne_jungpflanzen:
                    z?.vPopLastCountsByPopId?.nodes?.[0]
                      ?.pflanzenOhneJungpflanzen ?? '',
                  triebeTotal:
                    z?.vPopLastCountsByPopId?.nodes?.[0]?.triebeTotal ?? '',
                  triebe_beweidung:
                    z?.vPopLastCountsByPopId?.nodes?.[0]?.triebeBeweidung ?? '',
                  keimlinge:
                    z?.vPopLastCountsByPopId?.nodes?.[0]?.keimlinge ?? '',
                  davonRosetten:
                    z?.vPopLastCountsByPopId?.nodes?.[0]?.davonRosetten ?? '',
                  jungpflanzen:
                    z?.vPopLastCountsByPopId?.nodes?.[0]?.jungpflanzen ?? '',
                  blaetter: z?.vPopLastCountsByPopId?.nodes?.[0]?.blatter ?? '',
                  davonBluehende_pflanzen:
                    z?.vPopLastCountsByPopId?.nodes?.[0]
                      ?.davonBluhendePflanzen ?? '',
                  davonBluehende_triebe:
                    z?.vPopLastCountsByPopId?.nodes?.[0]?.davonBluhendeTriebe ??
                    '',
                  blueten: z?.vPopLastCountsByPopId?.nodes?.[0]?.bluten ?? '',
                  fertile_pflanzen:
                    z?.vPopLastCountsByPopId?.nodes?.[0]?.fertilePflanzen ?? '',
                  fruchtende_triebe:
                    z?.vPopLastCountsByPopId?.nodes?.[0]?.fruchtendeTriebe ??
                    '',
                  bluetenstaende:
                    z?.vPopLastCountsByPopId?.nodes?.[0]?.blutenstande ?? '',
                  fruchtstaende:
                    z?.vPopLastCountsByPopId?.nodes?.[0]?.fruchtstande ?? '',
                  gruppen: z?.vPopLastCountsByPopId?.nodes?.[0]?.gruppen ?? '',
                  deckung: z?.vPopLastCountsByPopId?.nodes?.[0]?.deckung ?? '',
                  pflanzen_5m2:
                    z?.vPopLastCountsByPopId?.nodes?.[0]?.pflanzen5M2 ?? '',
                  triebe_in_30m2:
                    z?.vPopLastCountsByPopId?.nodes?.[0]?.triebeIn30M2 ?? '',
                  triebe_50m2:
                    z?.vPopLastCountsByPopId?.nodes?.[0]?.triebe50M2 ?? '',
                  triebe_maehflaeche:
                    z?.vPopLastCountsByPopId?.nodes?.[0]?.triebeMahflache ?? '',
                  flaeche_m2:
                    z?.vPopLastCountsByPopId?.nodes?.[0]?.flacheM2 ?? '',
                  pflanzstellen:
                    z?.vPopLastCountsByPopId?.nodes?.[0]?.pflanzstellen ?? '',
                  stellen: z?.vPopLastCountsByPopId?.nodes?.[0]?.stellen ?? '',
                  andere_zaehleinheit:
                    z?.vPopLastCountsByPopId?.nodes?.[0]?.andereZaehleinheit ??
                    '',
                  art_ist_vorhanden:
                    z?.vPopLastCountsByPopId?.nodes?.[0]?.artIstVorhanden ?? '',
                }))
                removeNotification(notif)
                closeSnackbar(notif)
                if (rows.length === 0) {
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
              }}
            >
              Letzte Zählungen
            </DownloadCardButton>
            <DownloadCardButton
              color="inherit"
              onClick={async () => {
                const notif = enqueNotification({
                  message: `Export "PopLetzteZaehlungenInklMassn" wird vorbereitet...`,
                  options: {
                    variant: 'info',
                    persist: true,
                  },
                })
                let result
                try {
                  result = await client.query({
                    query: await import('./queryPopLastCountWithMassns').then(
                      (m) => m.default,
                    ),
                  })
                } catch (error) {
                  enqueNotification({
                    message: error.message,
                    options: {
                      variant: 'error',
                    },
                  })
                }
                const rows = (result?.data?.allPops?.nodes ?? []).map((z) => ({
                  artname:
                    z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]?.artname ??
                    '',
                  ap_id:
                    z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]?.apId ?? '',
                  pop_id:
                    z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]?.popId ?? '',
                  pop_nr:
                    z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]?.popNr ?? '',
                  pop_name:
                    z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]?.popName ??
                    '',
                  pop_status:
                    z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]?.popStatus ??
                    '',
                  jahre:
                    z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]?.jahre ?? '',
                  pflanzenTotal:
                    z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]
                      ?.pflanzenTotal ?? '',
                  pflanzen_ohne_jungpflanzen:
                    z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]
                      ?.pflanzenOhneJungpflanzen ?? '',
                  triebeTotal:
                    z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]
                      ?.triebeTotal ?? '',
                  triebe_beweidung:
                    z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]
                      ?.triebeBeweidung ?? '',
                  keimlinge:
                    z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]?.keimlinge ??
                    '',
                  davonRosetten:
                    z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]
                      ?.davonRosetten ?? '',
                  jungpflanzen:
                    z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]
                      ?.jungpflanzen ?? '',
                  blaetter:
                    z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]?.blatter ??
                    '',
                  davonBluehende_pflanzen:
                    z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]
                      ?.davonBluhendePflanzen ?? '',
                  davonBluehende_triebe:
                    z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]
                      ?.davonBluhendeTriebe ?? '',
                  blueten:
                    z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]?.bluten ?? '',
                  fertile_pflanzen:
                    z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]
                      ?.fertilePflanzen ?? '',
                  fruchtende_triebe:
                    z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]
                      ?.fruchtendeTriebe ?? '',
                  bluetenstaende:
                    z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]
                      ?.blutenstande ?? '',
                  fruchtstaende:
                    z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]
                      ?.fruchtstande ?? '',
                  gruppen:
                    z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]?.gruppen ??
                    '',
                  deckung:
                    z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]?.deckung ??
                    '',
                  pflanzen_5m2:
                    z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]
                      ?.pflanzen5M2 ?? '',
                  triebe_in_30m2:
                    z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]
                      ?.triebeIn30M2 ?? '',
                  triebe_50m2:
                    z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]?.triebe50M2 ??
                    '',
                  triebe_maehflaeche:
                    z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]
                      ?.triebeMahflache ?? '',
                  flaeche_m2:
                    z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]?.flacheM2 ??
                    '',
                  pflanzstellen:
                    z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]
                      ?.pflanzstellen ?? '',
                  stellen:
                    z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]?.stellen ??
                    '',
                  andere_zaehleinheit:
                    z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]
                      ?.andereZaehleinheit ?? '',
                  art_ist_vorhanden:
                    z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]
                      ?.artIstVorhanden ?? '',
                }))
                removeNotification(notif)
                closeSnackbar(notif)
                if (rows.length === 0) {
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
              }}
            >
              Letzte Zählungen inklusive noch nicht kontrollierter Anpflanzungen
            </DownloadCardButton>
          </StyledCardContent>
        ) : null}
      </Collapse>
    </StyledCard>
  )
}

export default observer(PopulationenExports)
